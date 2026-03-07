from sqlalchemy.ext.asyncio import AsyncSession
from .repository import SkillRepository
from .schemas import SkillCreate

class SkillService:
    @staticmethod
    async def get_skills(db: AsyncSession):
        return await SkillRepository.get_all(db)

    @staticmethod
    async def create_skill(db: AsyncSession, skill: SkillCreate):
        return await SkillRepository.create(db, skill)

    @staticmethod
    async def delete_skill(db: AsyncSession, skill_id: int):
        return await SkillRepository.delete(db, skill_id)

    @staticmethod
    async def update_skill(db: AsyncSession, skill_id: int, skill: SkillCreate):
        return await SkillRepository.update(db, skill_id, skill)
