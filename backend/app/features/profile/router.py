from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.auth.service import get_current_user
from .schemas import ProfileResponse, ProfileUpdate
from .repository import ProfileRepository

router = APIRouter()

@router.get("", response_model=ProfileResponse)
async def get_profile(db: AsyncSession = Depends(get_db)):
    profile = await ProfileRepository.get_profile(db)
    if not profile:
        return {
            "id": 0,
            "full_name": "Riku",
            "title": "Design. Code. Scale.",
            "bio": "I'm a Full-Stack Engineer focused on building minimal, high-performance digital products.",
            "email": "hello@riku.dev",
            "github_url": "#",
            "linkedin_url": "#",
            "avatar_url": ""
        }
    return profile

@router.put("", response_model=ProfileResponse)
async def update_profile(
    update_data: ProfileUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await ProfileRepository.update_profile(db, update_data)

@router.post("/ai-bio")
async def generate_ai_bio(
    current_bio: dict,
    current_user = Depends(get_current_user)
):
    from .ai_service import AIService
    improved_bio = await AIService.generate_bio(current_bio.get("bio", ""))
    return {"bio": improved_bio}
