from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.features.users.models import User

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(nullable=True)
    github_link: Mapped[str | None] = mapped_column(nullable=True)
    highlights: Mapped[list[str] | None] = mapped_column(JSON, nullable=True) 
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True) 
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship()
