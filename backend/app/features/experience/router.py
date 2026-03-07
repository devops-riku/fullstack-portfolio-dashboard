from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.auth.service import get_current_user
from app.features.users.models import User
from .schemas import ExperienceCreate, ExperienceResponse
from .service import ExperienceService

router = APIRouter()

@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_new_experience(
    experience: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ExperienceService(db)
    return await service.create_experience(experience, current_user.id)

@router.get("", response_model=list[ExperienceResponse])
async def read_experiences(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    service = ExperienceService(db)
    return await service.get_experiences(skip, limit)

@router.delete("/{experience_id}")
async def delete_experience(
    experience_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ExperienceService(db)
    return await service.delete_experience(experience_id)

@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    experience_in: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ExperienceService(db)
    return await service.update_experience(experience_id, experience_in)
