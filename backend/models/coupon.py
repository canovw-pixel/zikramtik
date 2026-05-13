from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, timezone
import uuid


class Coupon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    discount_type: str  # "percent" or "fixed"
    discount_value: float
    min_order_amount: float = 0.0
    max_discount: Optional[float] = None  # cap for percent discounts (in order currency)
    usage_limit: Optional[int] = None  # None = unlimited
    used_count: int = 0
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    active: bool = True
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CouponCreate(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    min_order_amount: float = 0.0
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    active: bool = True
    description: Optional[str] = None

    @field_validator("discount_type")
    @classmethod
    def validate_type(cls, v):
        if v not in ("percent", "fixed"):
            raise ValueError("discount_type must be 'percent' or 'fixed'")
        return v

    @field_validator("code")
    @classmethod
    def upper_code(cls, v):
        return v.strip().upper()


class CouponUpdate(BaseModel):
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    min_order_amount: Optional[float] = None
    max_discount: Optional[float] = None
    usage_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    active: Optional[bool] = None
    description: Optional[str] = None


class CouponValidateRequest(BaseModel):
    code: str
    subtotal: float
    currency: str = "TRY"
