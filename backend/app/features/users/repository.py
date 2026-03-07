from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.features.users.models import User
from app.features.users.schemas import UserCreate
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def create(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=get_password_hash(user_in.password),
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def update(self, db_user: User, user_in: dict) -> User:
        for field, value in user_in.items():
            if field == "password":
                db_user.hashed_password = get_password_hash(value)
            else:
                setattr(db_user, field, value)
        
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.session.execute(select(User).offset(skip).limit(limit))
        return list(result.scalars().all())
