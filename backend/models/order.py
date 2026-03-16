from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid
import random
import string

def generate_order_number():
    return 'ORD-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class OrderProduct(BaseModel):
    product_id: str
    name: str
    price: float
    currency: str
    quantity: int = 1

class Address(BaseModel):
    full_name: str
    address: str
    city: str
    state: Optional[str] = None
    zip_code: str
    country: str
    phone: str

class CountryInfo(BaseModel):
    code: str
    name: str
    currency: str

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=generate_order_number)
    products: List[OrderProduct]
    country: CountryInfo
    shipping_address: Address
    billing_address: Address
    total_amount: float
    currency: str
    status: str = "pending"  # pending, paid, processing, shipped, delivered, cancelled
    payment_status: str = "pending"  # pending, success, failed
    payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    products: List[OrderProduct]
    country: CountryInfo
    shipping_address: Address
    billing_address: Address

class OrderStatusUpdate(BaseModel):
    status: str
