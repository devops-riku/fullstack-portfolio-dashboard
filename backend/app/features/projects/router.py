from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.projects.schemas import ProjectCreate, ProjectResponse
from app.features.projects.service import ProjectService
from app.features.auth.service import get_current_user
from app.features.users.models import User

router = APIRouter()

@router.post("", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ProjectService(db)
    return await service.create_project(project_in, owner_id=current_user.id)

@router.get("", response_model=list[ProjectResponse])
async def read_projects(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.get_projects(skip, limit)

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ProjectService(db)
    return await service.delete_project(project_id)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ProjectService(db)
    return await service.update_project(project_id, project_in)
