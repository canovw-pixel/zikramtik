from fastapi import APIRouter, HTTPException, Request
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
    basket_items = []
    for item in order.get("products", []):
        name = item.get("name", "Urun")
        price_kurus = int(float(item.get("price", 0)) * 100)
        qty = item.get("quantity", 1)
        basket_items.append([name, str(price_kurus), str(qty)])
    user_basket = base64.b64encode(json.dumps(basket_items).encode()).decode()

    # Payment amount in kuruş (TL * 100)
    payment_amount = int(float(order.get("total_amount", 0)) * 100)
    merchant_oid = order.get("order_number", req.order_id)
    email = order.get("customer_email") or "musteri@zikramatik.com"
    user_ip = req.user_ip
    currency = "TL"
    no_installment = "1"
    max_installment = "0"

    # Generate token hash
    hash_str = (
        f"{MERCHANT_ID}{user_ip}{merchant_oid}{email}{payment_amount}"
        f"{user_basket}{no_installment}{max_installment}{currency}{TEST_MODE}"
    )
    paytr_token = base64.b64encode(
        hmac.HMAC(
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

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://www.paytr.com/odeme/api/get-token",
                data=payload,
            )
            result = resp.json()

        if result.get("status") == "success":
            token = result.get("token")
            logger.info(f"PayTR token created for order {merchant_oid}")
            return {
                "status": "success",
                "token": token,
                "iframe_url": f"https://www.paytr.com/odeme/guvenli/{token}",
            }
        else:
            reason = result.get("reason", "Bilinmeyen hata")
            logger.error(f"PayTR token error: {reason}")
            raise HTTPException(status_code=400, detail=f"PayTR hatas\u0131: {reason}")

    except httpx.HTTPError as e:
        logger.error(f"PayTR connection error: {e}")
        raise HTTPException(status_code=500, detail="PayTR ba\u011flant\u0131 hatas\u0131")


@router.post("/callback")
async def paytr_callback(request: Request):
    """PayTR callback - called by PayTR servers after payment"""
    form_data = await request.form()

    merchant_oid = form_data.get("merchant_oid", "")
    status = form_data.get("status", "")
    total_amount = form_data.get("total_amount", "")
    received_hash = form_data.get("hash", "")
    payment_type = form_data.get("payment_type", "")

    # Verify hash
    hash_str = f"{merchant_oid}{MERCHANT_SALT}{status}{total_amount}"
    calculated_hash = base64.b64encode(
        hmac.HMAC(
            MERCHANT_KEY.encode(),
            hash_str.encode(),
            hashlib.sha256
        ).digest()
    ).decode()

    if calculated_hash != received_hash:
        logger.error(f"PayTR callback hash mismatch for {merchant_oid}")
        return "HASH_MISMATCH"

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
            await send_order_confirmation(order)
    else:
        await db.orders.update_one(
            {"order_number": merchant_oid},
            {"$set": {
                "payment_status": "failed",
                "status": "payment_failed",
                "updated_at": now,
            }}
        )
        logger.info(f"Payment FAILED for order {merchant_oid}")

    return "OK"


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
