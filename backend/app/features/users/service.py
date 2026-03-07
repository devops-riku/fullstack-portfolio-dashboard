from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.features.users.repository import UserRepository
from app.features.users.schemas import UserCreate, UserResponse
from app.features.users.models import User

class UserService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def create_user(self, user_in: UserCreate) -> UserResponse:
        existing_user = await self.repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user = await self.repo.create(user_in)
        return UserResponse.from_orm(user)

    async def update_user(self, db_user: User, user_in: dict) -> UserResponse:
        updated_user = await self.repo.update(db_user, user_in)
        return UserResponse.from_orm(updated_user)

    async def get_users(self, skip: int = 0, limit: int = 100) -> list[UserResponse]:
        users = await self.repo.get_all(skip, limit)
        return [UserResponse.from_orm(u) for u in users]
