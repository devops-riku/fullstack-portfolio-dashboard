from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.features.projects.models import Project
from app.features.projects.schemas import ProjectCreate

class ProjectRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, project_in: ProjectCreate, owner_id: int) -> Project:
        db_project = Project(
            title=project_in.title,
            description=project_in.description,
            image_url=project_in.image_url,
            github_link=project_in.github_link,
            highlights=project_in.highlights,
            tags=project_in.tags,
            owner_id=owner_id
        )
        self.session.add(db_project)
        await self.session.commit()
        await self.session.refresh(db_project)
        return db_project

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Project]:
        result = await self.session.execute(select(Project).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def get_by_id(self, project_id: int) -> Project | None:
        result = await self.session.execute(select(Project).where(Project.id == project_id))
        return result.scalars().first()

    async def delete(self, project_id: int) -> bool:
        project = await self.get_by_id(project_id)
        if project:
            await self.session.delete(project)
            await self.session.commit()
            return True
        return False

    async def update(self, project_id: int, project_in: ProjectCreate) -> Project | None:
        db_project = await self.get_by_id(project_id)
        if not db_project:
            return None
        
        update_data = project_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_project, key, value)
            
        await self.session.commit()
        await self.session.refresh(db_project)
        return db_project
