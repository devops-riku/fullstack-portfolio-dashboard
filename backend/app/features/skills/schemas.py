from pydantic import BaseModel, ConfigDict
from typing import Optional

class SkillBase(BaseModel):
    name: str
    icon_name: Optional[str] = None
    category: Optional[str] = ""

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
