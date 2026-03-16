from fastapi import APIRouter, HTTPException, Depends, Query
from models.order import Order, OrderCreate, OrderStatusUpdate
from routes.auth import get_current_user
from database import db
from typing import List, Optional

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=dict)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    # Calculate total
    total_amount = sum(item.price * item.quantity for item in order_data.products)
    
    # Create order
    order = Order(
        products=order_data.products,
        country=order_data.country,
        shipping_address=order_data.shipping_address,
        billing_address=order_data.billing_address,
        total_amount=total_amount,
        currency=order_data.country.currency,
        status="pending",
        payment_status="pending"
    )
    
    await db.orders.insert_one(order.dict())
    
    # MOCK PAYMENT - In real scenario, this would redirect to iyzico
    # For now, we'll simulate a successful payment
    mock_payment_url = f"/payment/mock/{order.id}"
    
    return {
        "order": order.dict(),
        "payment_url": mock_payment_url,
        "message": "Order created successfully. (MOCK: Payment system not yet configured)"
    }

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get order by ID"""
    order = await db.orders.find_one({"id": order_id})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return Order(**order)

@router.get("", response_model=List[Order])
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
    
    orders = await db.orders.find(query).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    
    return [Order(**order) for order in orders]

@router.put("/{order_id}/status", response_model=Order)
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
        {"$set": {"status": status_data.status}}
    )
    
    updated_order = await db.orders.find_one({"id": order_id})
    return Order(**updated_order)

@router.post("/mock-payment/{order_id}")
async def mock_payment_success(order_id: str):
    """Mock payment success endpoint (for testing only)"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update order to paid
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "payment_status": "success",
            "status": "paid",
            "payment_id": f"MOCK-{order_id[:8]}"
        }}
    )
    
    return {"message": "Payment successful (MOCK)", "order_id": order_id}
