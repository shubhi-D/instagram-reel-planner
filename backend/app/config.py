from functools import lru_cache
from typing import Optional
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    """Application settings using Pydantic BaseSettings."""
    APP_NAME: str = "FastAPI Backend"
    DEBUG: bool = Field(False, env="DEBUG")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    DATABASE_URL: Optional[str] = Field(None, env="DATABASE_URL")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get application settings with caching."""
    return Settings()
