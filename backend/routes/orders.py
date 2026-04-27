from fastapi import APIRouter, HTTPException, Depends, Query
from models.order import Order, OrderCreate, OrderStatusUpdate, ShippingUpdate
from routes.auth import get_current_user
from database import db
from typing import List, Optional
from datetime import datetime, timezone
from utils.email import send_shipping_notification, send_order_confirmation
from utils.invoice import create_invoice_for_order, send_invoice_email

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

    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_data.status, "updated_at": datetime.now(timezone.utc)}}
    )

    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return updated_order

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

    # Create e-Arsiv invoice and send to customer
    invoice_result = await create_invoice_for_order(order_id)
    if invoice_result.get("success"):
        await send_invoice_email(order_id)

    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return {
        "order": updated_order,
        "email_notification": email_result,
        "invoice": invoice_result,
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
