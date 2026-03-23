from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import uuid
from pathlib import Path
import shutil

router = APIRouter(prefix="/upload", tags=["Upload"])

# Create uploads directory if not exists
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/images")
async def upload_images(files: List[UploadFile] = File(...)):
    """Upload multiple product images"""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    uploaded_urls = []
    
    for file in files:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not an image")
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return URL that frontend can use
        file_url = f"/api/uploads/{unique_filename}"
        uploaded_urls.append(file_url)
    
    return {"urls": uploaded_urls, "count": len(uploaded_urls)}

@router.get("/images")
async def list_uploaded_images():
    """List all uploaded images"""
    images = []
    if UPLOAD_DIR.exists():
        for file_path in UPLOAD_DIR.iterdir():
            if file_path.is_file():
                images.append(f"/api/uploads/{file_path.name}")
    return {"images": images}
