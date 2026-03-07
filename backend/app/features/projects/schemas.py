from pydantic import BaseModel, ConfigDict

class ProjectBase(BaseModel):
    title: str
    description: str | None = None
    image_url: str | None = None
    github_link: str | None = None
    highlights: list[str] | None = []
    tags: list[str] | None = []

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int

    model_config = ConfigDict(from_attributes=True)
