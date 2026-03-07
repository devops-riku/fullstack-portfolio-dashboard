from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .repository import ExperienceRepository
from .schemas import ExperienceCreate, ExperienceResponse

class ExperienceService:
    def __init__(self, db: AsyncSession):
        self.repo = ExperienceRepository(db)

    async def create_experience(self, experience_in: ExperienceCreate, owner_id: int) -> ExperienceResponse:
        experience = await self.repo.create(experience_in, owner_id)
        return ExperienceResponse.model_validate(experience)

    async def get_experiences(self, skip: int = 0, limit: int = 100) -> list[ExperienceResponse]:
        experiences = await self.repo.get_all(skip, limit)
        return [ExperienceResponse.model_validate(e) for e in experiences]

    async def delete_experience(self, experience_id: int):
        success = await self.repo.delete(experience_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Experience not found"
            )
        return {"message": "Experience deleted successfully"}

    async def update_experience(self, experience_id: int, exp_in: ExperienceCreate) -> ExperienceResponse:
        experience = await self.repo.update(experience_id, exp_in)
        if not experience:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Experience not found"
            )
        return ExperienceResponse.model_validate(experience)
