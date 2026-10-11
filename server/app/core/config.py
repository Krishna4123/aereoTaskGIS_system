"""Application settings and environment configuration for GeoMeasure AI."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Core application settings loaded from environment variables or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application Metadata
    APP_NAME: str = "GeoMeasure AI API"
    APP_ENV: str = "development"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]

    # Database (MongoDB)
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "geomeasure_ai"

    # File Storage
    STORAGE_UPLOAD_DIR: str = "./storage/uploads"
    STORAGE_PROCESSED_DIR: str = "./storage/processed"
    MAX_UPLOAD_SIZE_MB: int = 150

    # LLM / AI Analyst Settings
    LLM_PROVIDER: str = "openai"
    LLM_MODEL_NAME: str = "gpt-4o"
    LLM_API_KEY: str = "placeholder-api-key"


settings = Settings()
