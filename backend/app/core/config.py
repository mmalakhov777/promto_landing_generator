from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Promto Landing Generator"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/promto_landings"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://types.promto.ai",
        "https://promto.ai",
        "https://app.promto.ai",
    ]

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    # Yandex SmartCaptcha
    SMARTCAPTCHA_SERVER_KEY: str = ""

    # ISR Revalidation
    REVALIDATE_SECRET: str = "change-me-in-production"

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
