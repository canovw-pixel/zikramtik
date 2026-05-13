from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, timezone
import uuid


class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    order_id: str
    order_number: str
    user_name: str
    user_email: str
    rating: int  # 1-5
    title: Optional[str] = None
    comment: str
    verified_purchase: bool = True
    approved: bool = True  # auto-approved; admin can hide
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReviewCreate(BaseModel):
    product_id: str
    order_number: str
    user_email: str
    user_name: str
    rating: int
    title: Optional[str] = None
    comment: str

    @field_validator("rating")
    @classmethod
    def rating_range(cls, v):
        if v < 1 or v > 5:
            raise ValueError("rating must be 1-5")
        return v

    @field_validator("comment")
    @classmethod
    def comment_len(cls, v):
        v = (v or "").strip()
        if len(v) < 5:
            raise ValueError("Yorum en az 5 karakter olmalı")
        if len(v) > 2000:
            raise ValueError("Yorum çok uzun (max 2000 karakter)")
        return v

    @field_validator("user_name")
    @classmethod
    def name_required(cls, v):
        v = (v or "").strip()
        if not v:
            raise ValueError("İsim gerekli")
        return v
