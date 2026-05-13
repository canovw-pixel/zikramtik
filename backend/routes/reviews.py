from fastapi import APIRouter, HTTPException, Depends, Query
from models.review import Review, ReviewCreate
from routes.auth import get_current_user
from database import db
from datetime import datetime, timezone
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reviews", tags=["Reviews"])

# Orders considered as "purchased" - reviews allowed
ELIGIBLE_STATUSES = {"paid", "processing", "shipped", "delivered"}


@router.post("", response_model=dict)
async def create_review(data: ReviewCreate):
    """Public: customer submits a product review. Verifies purchase via order_number + email."""
    order_number = data.order_number.strip().upper()
    email = data.user_email.strip().lower()

    order = await db.orders.find_one({"order_number": order_number}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")

    # email match
    order_email = (order.get("customer_email") or "").strip().lower()
    if order_email != email:
        raise HTTPException(status_code=403, detail="Bu sipariş için yorum yazma yetkiniz yok")

    # status check
    status = order.get("status", "")
    payment_status = order.get("payment_status", "")
    if status not in ELIGIBLE_STATUSES and payment_status != "success":
        raise HTTPException(
            status_code=400,
            detail="Yorum yapabilmek için siparişinizin ödenmiş veya teslim edilmiş olması gerekir"
        )

    # product must be in the order
    product_ids = [p.get("product_id") for p in order.get("products", [])]
    if data.product_id not in product_ids:
        raise HTTPException(status_code=400, detail="Bu ürün siparişinizde yok")

    # one review per (product, order) pair
    existing = await db.reviews.find_one({
        "product_id": data.product_id,
        "order_id": order["id"],
    })
    if existing:
        raise HTTPException(status_code=400, detail="Bu ürün için zaten yorum yapmışsınız")

    review = Review(
        product_id=data.product_id,
        order_id=order["id"],
        order_number=order_number,
        user_name=data.user_name.strip(),
        user_email=email,
        rating=data.rating,
        title=(data.title or "").strip() or None,
        comment=data.comment.strip(),
        verified_purchase=True,
        approved=True,
    )

    doc = review.dict()
    await db.reviews.insert_one(doc)

    return {
        "message": "Yorumunuz başarıyla kaydedildi. Teşekkür ederiz!",
        "review": {k: v for k, v in doc.items() if k != "_id" and k != "user_email"},
    }


def _public_review(r: dict) -> dict:
    """Strip private fields (email)"""
    return {
        "id": r.get("id"),
        "product_id": r.get("product_id"),
        "user_name": r.get("user_name"),
        "rating": r.get("rating"),
        "title": r.get("title"),
        "comment": r.get("comment"),
        "verified_purchase": r.get("verified_purchase", True),
        "created_at": r.get("created_at"),
    }


@router.get("/product/{product_id}")
async def get_product_reviews(product_id: str):
    """Public: list approved reviews for a product, with summary"""
    reviews = await db.reviews.find(
        {"product_id": product_id, "approved": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(500)

    public_list = [_public_review(r) for r in reviews]

    count = len(public_list)
    avg = round(sum(r["rating"] for r in public_list) / count, 1) if count else 0.0

    # rating distribution
    dist = {str(i): 0 for i in range(1, 6)}
    for r in public_list:
        dist[str(r["rating"])] = dist.get(str(r["rating"]), 0) + 1

    return {
        "product_id": product_id,
        "count": count,
        "average": avg,
        "distribution": dist,
        "reviews": public_list,
    }


@router.get("")
async def list_reviews_admin(
    approved: Optional[bool] = Query(None),
    product_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Admin: list all reviews (with email + approved flag)"""
    q = {}
    if approved is not None:
        q["approved"] = approved
    if product_id:
        q["product_id"] = product_id
    reviews = await db.reviews.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return reviews


@router.put("/{review_id}/approve")
async def set_review_approval(
    review_id: str,
    approved: bool = Query(...),
    current_user: dict = Depends(get_current_user)
):
    """Admin: approve / hide a review"""
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"approved": approved}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Yorum bulunamadı")
    return {"message": "Güncellendi", "approved": approved}


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Admin: delete a review"""
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Yorum bulunamadı")
    return {"message": "Yorum silindi"}
