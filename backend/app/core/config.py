from typing import Optional
from urllib.parse import quote_plus
from pydantic import model_validator, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database configuration (required, no defaults)
    DB_HOST: str = "db"
    DB_PORT: str = "5432"
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
        env_file=("/app/.env", ".env"),  # Docker + local support
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator(
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_DB",
        "DB_HOST",
        "DB_PORT",
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
            user = quote_plus(self.POSTGRES_USER)
            password = quote_plus(self.POSTGRES_PASSWORD)

            self.DATABASE_URL = (
                f"postgresql+asyncpg://{user}:{password}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"
            )

        # Safe debug output
        masked_password = quote_plus(self.POSTGRES_PASSWORD)
        safe_url = self.DATABASE_URL.replace(masked_password, "****")

        print(f"Connecting to Database with: {safe_url}")

        return self


settings = Settings()