from typing import Optional
from urllib.parse import quote_plus
from pydantic import model_validator, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_HOST: str = "db"
    DB_PORT: str = "5432"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "riku"
    POSTGRES_DB: str = "portfolio"

    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "DB_HOST", "DB_PORT", mode="before")
    @classmethod
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        if not self.DATABASE_URL:
            # We must quote the user and password to handle special characters like '@' or '!'
            user = quote_plus(self.POSTGRES_USER)
            password = quote_plus(self.POSTGRES_PASSWORD)
            self.DATABASE_URL = f"postgresql+asyncpg://{user}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"
        
        # Safe debug print for startup
        safe_url = self.DATABASE_URL.replace(quote_plus(self.POSTGRES_PASSWORD), "****")
        print(f"Connecting to Database with: {safe_url}")
        
        return self

settings = Settings()
