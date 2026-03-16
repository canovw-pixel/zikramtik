from fastapi import APIRouter, HTTPException, Depends
from models.category import Category, CategoryCreate, CategoryUpdate
from routes.auth import get_current_user
from database import db
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    categories = await db.categories.find().sort("order", 1).to_list(100)
    return [Category(**cat) for cat in categories]

@router.post("", response_model=Category)
async def create_category(category_data: CategoryCreate, current_user: dict = Depends(get_current_user)):
    """Create a new category (Admin only)"""
    # Check if category with same ID exists
    existing = await db.categories.find_one({"id": category_data.id})
    if existing:
        raise HTTPException(status_code=400, detail="Category with this ID already exists")
    
    category = Category(**category_data.dict())
    await db.categories.insert_one(category.dict())
    
    return category

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryUpdate, current_user: dict = Depends(get_current_user)):
    """Update a category (Admin only)"""
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {k: v for k, v in category_data.dict().items() if v is not None}
    
    if update_data:
        await db.categories.update_one(
            {"id": category_id},
            {"$set": update_data}
        )
    
    updated_category = await db.categories.find_one({"id": category_id})
    return Category(**updated_category)

@router.delete("/{category_id}")
async def delete_category(category_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a category (Admin only)"""
    result = await db.categories.delete_one({"id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}
