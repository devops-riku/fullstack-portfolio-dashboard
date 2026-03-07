from sqlalchemy import String, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Skill(Base):
    __tablename__ = "skills"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(index=True)
    icon_name: Mapped[str | None] = mapped_column(nullable=True)
    category: Mapped[str] = mapped_column(default="", index=True)