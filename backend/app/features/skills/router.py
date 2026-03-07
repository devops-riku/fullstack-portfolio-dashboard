from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.auth.service import get_current_user
from .schemas import SkillCreate, SkillResponse
from .service import SkillService
from typing import List

router = APIRouter()

@router.get("/", response_model=List[SkillResponse])
async def get_skills(db: AsyncSession = Depends(get_db)):
    return await SkillService.get_skills(db)

@router.post("/", response_model=SkillResponse)
async def create_skill(
    skill: SkillCreate, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await SkillService.create_skill(db, skill)

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not await SkillService.delete_skill(db, skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted"}

@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill: SkillCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    updated = await SkillService.update_skill(db, skill_id, skill)
    if not updated:
        raise HTTPException(status_code=404, detail="Skill not found")
    return updated
