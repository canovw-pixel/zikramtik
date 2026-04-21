from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from database import db
from datetime import datetime, timezone
from utils.email import send_order_confirmation
import hashlib
import hmac
import base64
import json
import os
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payment", tags=["Payment"])

MERCHANT_ID = os.environ.get("PAYTR_MERCHANT_ID")
MERCHANT_KEY = os.environ.get("PAYTR_MERCHANT_KEY")
MERCHANT_SALT = os.environ.get("PAYTR_MERCHANT_SALT")
OK_URL = os.environ.get("PAYTR_OK_URL", "https://zikramatik.com/odeme-basarili")
FAIL_URL = os.environ.get("PAYTR_FAIL_URL", "https://zikramatik.com/odeme-basarisiz")
TEST_MODE = os.environ.get("PAYTR_TEST_MODE", "1")


class PaymentTokenRequest(BaseModel):
    order_id: str
    user_ip: str


@router.post("/get-token")
async def get_paytr_token(req: PaymentTokenRequest):
    """Generate PayTR iFrame token for an order"""
    order = await db.orders.find_one({"id": req.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Siparis bulunamadi")

    if order.get("payment_status") == "success":
        raise HTTPException(status_code=400, detail="Bu siparis icin odeme zaten yapildi")

    # Build user_basket JSON array
    # Format: [[name, unit_price_TL, quantity], ...]
    # Price must be in TL (NOT kuruş), as a string
    basket_items = []
    for item in order.get("products", []):
        name = item.get("name", "Urun")
        # Price in TL as string (e.g. "18.00"), NOT multiplied by 100
        price_tl = f"{float(item.get('price', 0)):.2f}"
        qty = int(item.get("quantity", 1))
        basket_items.append([name, price_tl, qty])
    user_basket = base64.b64encode(json.dumps(basket_items).encode()).decode()

    # Payment amount in kuruş (TL * 100)
    payment_amount = int(round(float(order.get("total_amount", 0)) * 100))
    merchant_oid = order.get("order_number", req.order_id)
    email = order.get("customer_email") or "musteri@zikramatik.com"
    user_ip = req.user_ip
    currency = "TL"
    no_installment = "0"  # 0 = show installments, 1 = no installments
    max_installment = "4"  # Max 4 taksit for kuyum

    # Generate token hash per PayTR docs:
    # hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    # paytr_token = base64(hmac_sha256(merchant_key, hash_str + merchant_salt))
    hash_str = f"{MERCHANT_ID}{user_ip}{merchant_oid}{email}{payment_amount}{user_basket}{no_installment}{max_installment}{currency}{TEST_MODE}"
    paytr_token = base64.b64encode(
        hmac.new(
            MERCHANT_KEY.encode(),
            (hash_str + MERCHANT_SALT).encode(),
            hashlib.sha256
        ).digest()
    ).decode()

    # Build POST data
    payload = {
        "merchant_id": MERCHANT_ID,
        "user_ip": user_ip,
        "merchant_oid": merchant_oid,
        "email": email,
        "payment_amount": str(payment_amount),
        "paytr_token": paytr_token,
        "user_basket": user_basket,
        "debug_on": "1",
        "no_installment": no_installment,
        "max_installment": max_installment,
        "currency": currency,
        "test_mode": TEST_MODE,
        "user_name": order.get("shipping_address", {}).get("full_name", ""),
        "user_address": order.get("shipping_address", {}).get("address", ""),
        "user_phone": order.get("shipping_address", {}).get("phone", ""),
        "merchant_ok_url": OK_URL,
        "merchant_fail_url": FAIL_URL,
        "timeout_limit": "30",
        "lang": "tr",
    }

    logger.info(f"PayTR token request for order {merchant_oid}, amount: {payment_amount} kurus, ip: {user_ip}")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://www.paytr.com/odeme/api/get-token",
                data=payload,
            )
            result = resp.json()

        if result.get("status") == "success":
            token = result.get("token")
            logger.info(f"PayTR token created for order {merchant_oid}: {token[:20]}...")
            return {
                "status": "success",
                "token": token,
                "iframe_url": f"https://www.paytr.com/odeme/guvenli/{token}",
            }
        else:
            reason = result.get("reason", "Bilinmeyen hata")
            logger.error(f"PayTR token error for {merchant_oid}: {reason}")
            raise HTTPException(status_code=400, detail=f"PayTR hatasi: {reason}")

    except httpx.HTTPError as e:
        logger.error(f"PayTR connection error: {e}")
        raise HTTPException(status_code=500, detail="PayTR baglanti hatasi")


@router.post("/callback", response_class=PlainTextResponse)
async def paytr_callback(request: Request):
    """
    PayTR callback (Bildirim URL) - called by PayTR servers after payment.
    Must return plain text "OK" to acknowledge receipt.
    """
    form_data = await request.form()

    merchant_oid = form_data.get("merchant_oid", "")
    status = form_data.get("status", "")
    total_amount = form_data.get("total_amount", "")
    received_hash = form_data.get("hash", "")
    payment_type = form_data.get("payment_type", "")
    failed_reason_code = form_data.get("failed_reason_code", "")
    failed_reason_msg = form_data.get("failed_reason_msg", "")

    logger.info(f"PayTR callback received: order={merchant_oid}, status={status}, amount={total_amount}")

    # Verify hash: hash = base64(hmac_sha256(merchant_key, merchant_oid + merchant_salt + status + total_amount))
    hash_str = f"{merchant_oid}{MERCHANT_SALT}{status}{total_amount}"
    calculated_hash = base64.b64encode(
        hmac.new(
            MERCHANT_KEY.encode(),
            hash_str.encode(),
            hashlib.sha256
        ).digest()
    ).decode()

    if calculated_hash != received_hash:
        logger.error(f"PayTR callback hash mismatch for {merchant_oid}")
        return PlainTextResponse("HASH_MISMATCH")

    # Check if order already processed (prevent duplicate processing)
    existing_order = await db.orders.find_one({"order_number": merchant_oid}, {"_id": 0})
    if existing_order and existing_order.get("payment_status") in ["success", "failed"]:
        logger.info(f"Order {merchant_oid} already processed, returning OK")
        return PlainTextResponse("OK")

    now = datetime.now(timezone.utc)

    if status == "success":
        await db.orders.update_one(
            {"order_number": merchant_oid},
            {"$set": {
                "payment_status": "success",
                "status": "paid",
                "payment_type": payment_type,
                "paid_at": now.isoformat(),
                "updated_at": now,
            }}
        )
        logger.info(f"Payment SUCCESS for order {merchant_oid}")

        # Send confirmation email
        order = await db.orders.find_one({"order_number": merchant_oid}, {"_id": 0})
        if order:
            try:
                await send_order_confirmation(order)
            except Exception as e:
                logger.error(f"Email send error for {merchant_oid}: {e}")
    else:
        await db.orders.update_one(
            {"order_number": merchant_oid},
            {"$set": {
                "payment_status": "failed",
                "status": "payment_failed",
                "failed_reason_code": failed_reason_code,
                "failed_reason_msg": failed_reason_msg,
                "updated_at": now,
            }}
        )
        logger.info(f"Payment FAILED for order {merchant_oid}: {failed_reason_code} - {failed_reason_msg}")

    # Return plain text "OK" to acknowledge receipt
    return PlainTextResponse("OK")


@router.get("/status/{order_id}")
async def check_payment_status(order_id: str):
    """Check payment status of an order"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Siparis bulunamadi")

    return {
        "order_id": order.get("id"),
        "order_number": order.get("order_number"),
        "payment_status": order.get("payment_status"),
        "status": order.get("status"),
    }
