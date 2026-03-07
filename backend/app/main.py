from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.features.users.router import router as users_router
from app.features.projects.router import router as projects_router
from app.features.skills.router import router as skills_router
from app.features.profile.router import router as profile_router
from app.features.auth.router import router as auth_router
from app.features.experience.router import router as experience_router

app = FastAPI(title="Modern SaaS API", version="1.0.0", openapi_url=f"{settings.API_PREFIX}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(projects_router, prefix=f"{settings.API_PREFIX}/projects", tags=["projects"])
app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(experience_router, prefix=f"{settings.API_PREFIX}/experiences", tags=["experiences"])
app.include_router(skills_router, prefix=f"{settings.API_PREFIX}/skills", tags=["skills"])
app.include_router(profile_router, prefix=f"{settings.API_PREFIX}/profile", tags=["profile"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Modern SaaS API"}
