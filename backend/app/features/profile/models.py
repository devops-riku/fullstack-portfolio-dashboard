from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profile"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str | None] = mapped_column(nullable=True)
    title: Mapped[str | None] = mapped_column(nullable=True)  # Hero Title
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(nullable=True)
    github_url: Mapped[str | None] = mapped_column(nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(nullable=True)
