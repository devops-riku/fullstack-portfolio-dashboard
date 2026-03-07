from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.features.users.repository import UserRepository
from app.features.users.models import User
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")

class AuthService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def authenticate_user(self, email: str, password: str) -> User | None:
        user = await self.repo.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def create_token(self, user: User) -> str:
        access_token = create_access_token(data={"sub": user.email})
        return access_token

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    repo = UserRepository(db)
    user = await repo.get_by_email(email=email)
    if user is None:
        raise credentials_exception
    return user
