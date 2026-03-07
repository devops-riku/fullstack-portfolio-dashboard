from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.users.schemas import UserCreate, UserResponse, UserUpdate
from app.features.users.service import UserService
from app.features.auth.service import get_current_user
from app.features.users.models import User

router = APIRouter()

@router.post("", response_model=UserResponse)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.create_user(user_in)

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = UserService(db)
    return await service.update_user(current_user, user_in.dict(exclude_unset=True))

@router.get("", response_model=list[UserResponse])
async def read_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.get_users(skip, limit)
