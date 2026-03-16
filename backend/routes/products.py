from fastapi import APIRouter, HTTPException, Depends, Query
from models.product import Product, ProductCreate, ProductUpdate, ToggleFeatured
from routes.auth import get_current_user
from database import db
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None)
):
    """Get all products with optional filters"""
    query = {}
    
    if category:
        query["category"] = category
    
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query).to_list(1000)
    return [Product(**product) for product in products]

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product)

@router.post("", response_model=Product)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(get_current_user)):
    """Create a new product (Admin only)"""
    product = Product(**product_data.dict())
    await db.products.insert_one(product.dict())
    
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a product (Admin only)"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if update_data:
        await db.products.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@router.delete("/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a product (Admin only)"""
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

@router.put("/{product_id}/toggle-featured", response_model=Product)
async def toggle_featured(
    product_id: str,
    toggle_data: ToggleFeatured,
    current_user: dict = Depends(get_current_user)
):
    """Toggle product featured status (Admin only) - Max 2 featured products"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # If setting to featured, check if we already have 2 featured products
    if toggle_data.featured:
        featured_count = await db.products.count_documents({"featured": True})
        
        if featured_count >= 2 and not product.get("featured", False):
            raise HTTPException(
                status_code=400,
                detail="Maximum 2 products can be featured. Please unfeature another product first."
            )
    
    # Update the product
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"featured": toggle_data.featured, "updated_at": datetime.utcnow()}}
    )
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@router.put("/{product_id}/pricing")
async def update_product_pricing(
    product_id: str,
    pricing_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update product pricing for specific countries (Admin only)"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update prices
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"prices": pricing_data, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Pricing updated successfully"}
