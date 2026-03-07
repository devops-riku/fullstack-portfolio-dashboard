from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.features.projects.repository import ProjectRepository
from app.features.projects.schemas import ProjectCreate, ProjectResponse

class ProjectService:
    def __init__(self, session: AsyncSession):
        self.repo = ProjectRepository(session)

    async def create_project(self, project_in: ProjectCreate, owner_id: int) -> ProjectResponse:
        project = await self.repo.create(project_in, owner_id)
        return ProjectResponse.from_orm(project)

    async def get_projects(self, skip: int = 0, limit: int = 100) -> list[ProjectResponse]:
        projects = await self.repo.get_all(skip, limit)
        return [ProjectResponse.from_orm(p) for p in projects]

    async def delete_project(self, project_id: int):
        success = await self.repo.delete(project_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return {"message": "Project deleted successfully"}

    async def update_project(self, project_id: int, project_in: ProjectCreate) -> ProjectResponse:
        project = await self.repo.update(project_id, project_in)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return ProjectResponse.from_orm(project)
