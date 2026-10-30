"""Application settings, loaded from environment variables / .env."""
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "Ghana Unlocked API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    log_level: str = "INFO"
    api_v1_prefix: str = "/api/v1"

    # Comma-separated string (kept as str so .env stays simple).
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Optional: the health check must work without it.
    database_url: str | None = Field(default=None)

    # Server-side only. Needed later to validate Telegram initData.
    telegram_bot_token: str | None = Field(default=None, repr=False)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
