from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Experience
from .schemas import ExperienceCreate

class ExperienceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, experience_in: ExperienceCreate, owner_id: int) -> Experience:
        db_experience = Experience(
            role=experience_in.role,
            company=experience_in.company,
            period=experience_in.period,
            description=experience_in.description,
            owner_id=owner_id
        )
        self.session.add(db_experience)
        await self.session.commit()
        await self.session.refresh(db_experience)
        return db_experience

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Experience]:
        result = await self.session.execute(
            select(Experience).offset(skip).limit(limit).order_by(Experience.id.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, experience_id: int) -> Experience | None:
        result = await self.session.execute(select(Experience).where(Experience.id == experience_id))
        return result.scalars().first()

    async def delete(self, experience_id: int) -> bool:
        experience = await self.get_by_id(experience_id)
        if experience:
            await self.session.delete(experience)
            await self.session.commit()
            return True
        return False

    async def update(self, experience_id: int, exp_in: ExperienceCreate) -> Experience | None:
        db_exp = await self.get_by_id(experience_id)
        if not db_exp:
            return None
        
        update_data = exp_in.model_dump()
        for key, value in update_data.items():
            setattr(db_exp, key, value)
            
        await self.session.commit()
        await self.session.refresh(db_exp)
        return db_exp
