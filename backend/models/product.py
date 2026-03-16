from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class CountryPrice(BaseModel):
    price: float
    currency: str
    symbol: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    short_name: Optional[str] = None
    description: str
    category: str  # Category ID
    category_name: str
    images: List[str] = []
    prices: Dict[str, CountryPrice] = {}  # {"US": {price: 1299, currency: "USD", symbol: "$"}}
    featured: bool = False
    in_stock: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    description: str
    category: str
    category_name: str
    images: List[str] = []
    prices: Dict[str, CountryPrice] = {}
    featured: bool = False
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    category_name: Optional[str] = None
    images: Optional[List[str]] = None
    prices: Optional[Dict[str, CountryPrice]] = None
    featured: Optional[bool] = None
    in_stock: Optional[bool] = None

class ToggleFeatured(BaseModel):
    featured: bool
