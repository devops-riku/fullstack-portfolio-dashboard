from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Skill
from .schemas import SkillCreate

class SkillRepository:
    @staticmethod
    async def get_all(db: AsyncSession):
        query = select(Skill)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, skill: SkillCreate):
        db_skill = Skill(**skill.model_dump())
        db.add(db_skill)
        await db.commit()
        await db.refresh(db_skill)
        return db_skill

    @staticmethod
    async def delete(db: AsyncSession, skill_id: int):
        query = select(Skill).where(Skill.id == skill_id)
        result = await db.execute(query)
        db_skill = result.scalars().first()
        if db_skill:
            await db.delete(db_skill)
            await db.commit()
            return True
        return False

    @staticmethod
    async def update(db: AsyncSession, skill_id: int, skill_in: SkillCreate):
        query = select(Skill).where(Skill.id == skill_id)
        result = await db.execute(query)
        db_skill = result.scalars().first()
        if not db_skill:
            return None
        
        for key, value in skill_in.model_dump().items():
            setattr(db_skill, key, value)
            
        await db.commit()
        await db.refresh(db_skill)
        return db_skill
