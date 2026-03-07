from typing import Optional
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database settings
    DB_HOST: str = "db"
    DB_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    DATABASE_URL: Optional[str] = None

    # API settings
    SECRET_KEY: str
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=("/app/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator(
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_DB",
        "DB_HOST",
        mode="before"
    )
    @classmethod
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"
            )

        # Safe debug print
        safe_url = self.DATABASE_URL.replace(self.POSTGRES_PASSWORD, "****")
        print(f"Connecting to Database with: {safe_url}")

        return self


settings = Settings()