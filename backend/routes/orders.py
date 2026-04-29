from fastapi import APIRouter, HTTPException, Depends, Query
from models.order import Order, OrderCreate, OrderStatusUpdate, ShippingUpdate
from routes.auth import get_current_user
from database import db
from typing import List, Optional
from datetime import datetime, timezone
from utils.email import send_shipping_notification, send_order_confirmation, send_email_raw
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=dict)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    total_amount = sum(item.price * item.quantity for item in order_data.products)

    order = Order(
        products=order_data.products,
        country=order_data.country,
        shipping_address=order_data.shipping_address,
        billing_address=order_data.billing_address,
        customer_email=order_data.customer_email,
        total_amount=total_amount,
        currency=order_data.country.currency,
        status="pending",
        payment_status="pending"
    )

    order_dict = order.dict()
    await db.orders.insert_one(order_dict)

    return {
        "order": {k: v for k, v in order_dict.items() if k != "_id"},
        "message": "Siparisiniz olusturuldu. Odeme bekleniyor.",
    }

@router.get("/track/{order_number}")
async def track_order(order_number: str):
    """Public endpoint - track order by order number"""
    order = await db.orders.find_one({"order_number": order_number}, {"_id": 0})

    if not order:
        raise HTTPException(status_code=404, detail="Siparis bulunamadi")

    return {
        "order_number": order.get("order_number"),
        "status": order.get("status"),
        "tracking_number": order.get("tracking_number"),
        "cargo_company": order.get("cargo_company"),
        "shipped_at": order.get("shipped_at"),
        "total_amount": order.get("total_amount"),
        "currency": order.get("currency"),
        "products": order.get("products", []),
        "shipping_address": order.get("shipping_address"),
        "created_at": order.get("created_at"),
    }

@router.get("/stats/summary")
async def get_order_stats(current_user: dict = Depends(get_current_user)):
    """Get order statistics for admin dashboard"""
    total = await db.orders.count_documents({})
    pending = await db.orders.count_documents({"status": "pending"})
    shipped = await db.orders.count_documents({"status": "shipped"})
    delivered = await db.orders.count_documents({"status": "delivered"})
    cancelled = await db.orders.count_documents({"status": "cancelled"})

    return {
        "total": total,
        "pending": pending,
        "shipped": shipped,
        "delivered": delivered,
        "cancelled": cancelled,
    }

@router.get("/{order_id}")
async def get_order(order_id: str):
    """Get order by ID"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

@router.get("")
async def get_orders(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all orders (Admin only)"""
    query = {}
    if status:
        query["status"] = status

    skip = (page - 1) * limit

    orders = await db.orders.find(query, {"_id": 0}).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    total = await db.orders.count_documents(query)

    return {"orders": orders, "total": total, "page": page, "limit": limit}

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_data: OrderStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update order status (Admin only)"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    now = datetime.now(timezone.utc)
    update_data = {"status": status_data.status, "updated_at": now}

    # If cancelling, process refund and send cancellation email
    if status_data.status == "cancelled" and order.get("status") != "cancelled":
        update_data["cancelled_at"] = now.isoformat()

        # PayTR Refund
        if order.get("payment_status") == "success":
            refund_result = await _process_paytr_refund(order)
            update_data["refund_status"] = refund_result.get("status")
            update_data["refund_message"] = refund_result.get("message")

        # Send cancellation email
        await _send_cancellation_email(order)

    await db.orders.update_one({"id": order_id}, {"$set": update_data})

    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return updated_order


async def _process_paytr_refund(order: dict) -> dict:
    """Process PayTR refund for cancelled order"""
    import hashlib
    import hmac
    import base64
    import httpx

    merchant_id = os.environ.get("PAYTR_MERCHANT_ID")
    merchant_key = os.environ.get("PAYTR_MERCHANT_KEY")
    merchant_salt = os.environ.get("PAYTR_MERCHANT_SALT")

    if not all([merchant_id, merchant_key, merchant_salt]):
        return {"status": "error", "message": "PayTR credentials not configured"}

    merchant_oid = order.get("order_number", "")
    return_amount = f"{float(order.get('total_amount', 0)):.2f}"

    # Generate token: base64(hmac_sha256(merchant_key, merchant_id + merchant_oid + return_amount + merchant_salt))
    hash_str = f"{merchant_id}{merchant_oid}{return_amount}{merchant_salt}"
    paytr_token = base64.b64encode(
        hmac.new(
            merchant_key.encode(),
            hash_str.encode(),
            hashlib.sha256
        ).digest()
    ).decode()

    payload = {
        "merchant_id": merchant_id,
        "merchant_oid": merchant_oid,
        "return_amount": return_amount,
        "paytr_token": paytr_token,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post("https://www.paytr.com/odeme/iade", data=payload)
            result = resp.json()

        if result.get("status") == "success":
            logger.info(f"PayTR refund SUCCESS for {merchant_oid}: {return_amount} TL")
            return {"status": "success", "message": f"Iade basarili: {return_amount} TL"}
        else:
            err_msg = result.get("err_msg", "Bilinmeyen hata")
            logger.error(f"PayTR refund FAILED for {merchant_oid}: {err_msg}")
            return {"status": "error", "message": f"Iade hatasi: {err_msg}"}
    except Exception as e:
        logger.error(f"PayTR refund error: {e}")
        return {"status": "error", "message": str(e)}


async def _send_cancellation_email(order: dict):
    """Send cancellation email to customer"""
    from utils.email import send_email_raw

    customer_email = order.get("customer_email")
    if not customer_email:
        return

    order_number = order.get("order_number", "")
    full_name = order.get("shipping_address", {}).get("full_name", "Degerli Musterimiz")
    total = order.get("total_amount", 0)
    currency = order.get("currency", "TRY")

    subject = f"Siparisiniz Iptal Edildi - #{order_number} | Craponia Atelier"
    html_body = f"""
    <html>
    <body style="font-family: 'Source Serif 4', Georgia, serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5a0a1a, #7a1a2e); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">Zikra</h1>
                <p style="color: #e8b4b8; margin: 5px 0 0; font-size: 12px;">Craponia Atelier</p>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="color: #c0392b;">Siparisiniz Iptal Edildi</h2>
                <p>Sayin {full_name},</p>
                <p><strong>#{order_number}</strong> numarali siparisiniz iptal edilmistir.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Siparis No:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">{order_number}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Tutar:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">{total} {currency}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Iade Durumu:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #27ae60;">Iade isleminiz baslatilmistir</td></tr>
                </table>
                <p>Odemeniz 3-5 is gunu icerisinde kartiniza/hesabiniza iade edilecektir.</p>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">Sorulariniz icin: info@zikramatik.com</p>
                <p style="color: #666; font-size: 12px;">Craponia Atelier | zikramatik.com</p>
            </div>
        </div>
    </body>
    </html>
    """

    try:
        await send_email_raw(customer_email, subject, html_body)
        logger.info(f"Cancellation email sent to {customer_email} for order {order_number}")
    except Exception as e:
        logger.error(f"Cancellation email error: {e}")

@router.put("/{order_id}/shipping")
async def update_shipping(
    order_id: str,
    shipping_data: ShippingUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Add tracking number and auto-set status to shipped (Admin only)"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    now = datetime.now(timezone.utc)
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "tracking_number": shipping_data.tracking_number,
            "cargo_company": shipping_data.cargo_company,
            "status": "shipped",
            "shipped_at": now.isoformat(),
            "updated_at": now,
        }}
    )

    # Send shipping notification email
    email_result = await send_shipping_notification(
        order, shipping_data.tracking_number, shipping_data.cargo_company
    )

    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return {
        "order": updated_order,
        "email_notification": email_result,
    }

@router.post("/mock-payment/{order_id}")
async def mock_payment_success(order_id: str):
    """Mock payment success endpoint (for testing only)"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "payment_status": "success",
            "status": "paid",
            "payment_id": f"MOCK-{order_id[:8]}"
        }}
    )

    return {"message": "Payment successful (MOCK)", "order_id": order_id}
