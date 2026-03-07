from pydantic import BaseModel, ConfigDict

class ExperienceBase(BaseModel):
    role: str
    company: str
    period: str
    description: str | None = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int
    owner_id: int

    model_config = ConfigDict(from_attributes=True)
