from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Profile
from .schemas import ProfileUpdate

class ProfileRepository:
    @staticmethod
    async def get_profile(db: AsyncSession):
        query = select(Profile)
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def update_profile(db: AsyncSession, update_data: ProfileUpdate):
        db_profile = await ProfileRepository.get_profile(db)
        if not db_profile:
            db_profile = Profile(**update_data.model_dump())
            db.add(db_profile)
        else:
            for key, value in update_data.model_dump().items():
                setattr(db_profile, key, value)
        
        await db.commit()
        await db.refresh(db_profile)
        return db_profile
