from fastapi import APIRouter, HTTPException, Depends, Header
from models.user import User, UserCreate, UserLogin, UserResponse
from utils.auth import get_password_hash, verify_password, create_access_token, decode_access_token
from database import db
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return payload

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new admin user (protected - only for initial setup)"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name,
        role="admin"
    )
    
    await db.users.insert_one(user.dict())
    
    return {"message": "Admin user created successfully"}

@router.post("/login")
async def login(credentials: UserLogin):
    """Login and get access token"""
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Create access token
    access_token = create_access_token(data={
        "user_id": user["id"],
        "email": user["email"],
        "role": user["role"]
    })
    
    return {
        "token": access_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    user = await db.users.find_one({"id": current_user["user_id"]})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"]
    )
