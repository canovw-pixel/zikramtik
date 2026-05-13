from fastapi import APIRouter, HTTPException, Depends
from models.coupon import Coupon, CouponCreate, CouponUpdate, CouponValidateRequest
from routes.auth import get_current_user
from database import db
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/coupons", tags=["Coupons"])


def _calculate_discount(coupon: dict, subtotal: float) -> float:
    """Calculate discount amount for given subtotal"""
    if coupon["discount_type"] == "percent":
        discount = subtotal * (coupon["discount_value"] / 100.0)
        max_d = coupon.get("max_discount")
        if max_d is not None and discount > max_d:
            discount = max_d
    else:  # fixed
        discount = float(coupon["discount_value"])
    # don't exceed subtotal
    if discount > subtotal:
        discount = subtotal
    return round(discount, 2)


async def _validate_coupon_doc(code: str, subtotal: float) -> dict:
    """Fetch coupon by code and validate. Returns coupon dict or raises HTTPException"""
    code = (code or "").strip().upper()
    if not code:
        raise HTTPException(status_code=400, detail="Kupon kodu bos olamaz")

    coupon = await db.coupons.find_one({"code": code}, {"_id": 0})
    if not coupon:
        raise HTTPException(status_code=404, detail="Kupon kodu gecersiz")

    if not coupon.get("active", True):
        raise HTTPException(status_code=400, detail="Bu kupon aktif degil")

    now = datetime.now(timezone.utc)
    valid_from = coupon.get("valid_from")
    valid_until = coupon.get("valid_until")

    if valid_from:
        vf = valid_from if isinstance(valid_from, datetime) else datetime.fromisoformat(str(valid_from))
        if vf.tzinfo is None:
            vf = vf.replace(tzinfo=timezone.utc)
        if now < vf:
            raise HTTPException(status_code=400, detail="Kupon henuz gecerli degil")

    if valid_until:
        vu = valid_until if isinstance(valid_until, datetime) else datetime.fromisoformat(str(valid_until))
        if vu.tzinfo is None:
            vu = vu.replace(tzinfo=timezone.utc)
        if now > vu:
            raise HTTPException(status_code=400, detail="Kuponun suresi dolmus")

    usage_limit = coupon.get("usage_limit")
    used_count = coupon.get("used_count", 0)
    if usage_limit is not None and used_count >= usage_limit:
        raise HTTPException(status_code=400, detail="Kupon kullanim limiti dolmus")

    min_amount = coupon.get("min_order_amount", 0.0) or 0.0
    if subtotal < min_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Bu kupon icin minimum sepet tutari: {min_amount:.2f}"
        )

    return coupon


@router.post("/validate")
async def validate_coupon(req: CouponValidateRequest):
    """Public: Validate a coupon and return discount info"""
    coupon = await _validate_coupon_doc(req.code, req.subtotal)
    discount = _calculate_discount(coupon, req.subtotal)
    return {
        "valid": True,
        "code": coupon["code"],
        "discount_type": coupon["discount_type"],
        "discount_value": coupon["discount_value"],
        "discount_amount": discount,
        "final_amount": round(req.subtotal - discount, 2),
        "description": coupon.get("description"),
    }


@router.post("", response_model=dict)
async def create_coupon(
    data: CouponCreate,
    current_user: dict = Depends(get_current_user)
):
    """Admin: Create a new coupon"""
    existing = await db.coupons.find_one({"code": data.code})
    if existing:
        raise HTTPException(status_code=400, detail="Bu kupon kodu zaten kullaniliyor")

    coupon = Coupon(**data.dict())
    doc = coupon.dict()
    await db.coupons.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@router.get("")
async def list_coupons(current_user: dict = Depends(get_current_user)):
    """Admin: List all coupons"""
    coupons = await db.coupons.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return coupons


@router.put("/{coupon_id}")
async def update_coupon(
    coupon_id: str,
    data: CouponUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Admin: Update coupon"""
    coupon = await db.coupons.find_one({"id": coupon_id})
    if not coupon:
        raise HTTPException(status_code=404, detail="Kupon bulunamadi")

    update_data = data.dict(exclude_unset=True)
    if "discount_type" in update_data and update_data["discount_type"] not in ("percent", "fixed"):
        raise HTTPException(status_code=400, detail="discount_type 'percent' veya 'fixed' olmali")

    update_data["updated_at"] = datetime.now(timezone.utc)
    await db.coupons.update_one({"id": coupon_id}, {"$set": update_data})

    updated = await db.coupons.find_one({"id": coupon_id}, {"_id": 0})
    return updated


@router.delete("/{coupon_id}")
async def delete_coupon(
    coupon_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Admin: Delete coupon"""
    result = await db.coupons.delete_one({"id": coupon_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kupon bulunamadi")
    return {"message": "Kupon silindi"}
