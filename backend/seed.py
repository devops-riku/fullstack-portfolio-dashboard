import asyncio
from sqlalchemy import select
from app.core.database import async_session_maker
from app.features.users.models import User
from app.core.security import get_password_hash

async def seed():
    async with async_session_maker() as db:
        result = await db.execute(select(User).where(User.email == "user@admin.com"))
        user = result.scalar_one_or_none()
        
        if not user:
            print("Seeding admin user...")
            new_user = User(
                email="user@admin.com",
                hashed_password=get_password_hash("admin"),
                full_name="Admin"
            )
            db.add(new_user)
            await db.commit()
            print("Successfully seeded admin user: user@admin.com")
        else:
            print("Admin user naturally exists. Skipping seed.")

if __name__ == "__main__":
    asyncio.run(seed())
