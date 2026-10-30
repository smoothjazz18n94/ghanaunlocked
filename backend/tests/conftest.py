import pytest
from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.db.session import get_engine


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    """Tests must pass with NO database and NO credentials."""
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("TELEGRAM_BOT_TOKEN", raising=False)
    monkeypatch.setenv("CORS_ORIGINS", "http://localhost:5173,https://example.vercel.app")
    get_settings.cache_clear()
    get_engine.cache_clear()
    yield
    get_settings.cache_clear()
    get_engine.cache_clear()


@pytest.fixture
def client():
    from app.main import create_app

    return TestClient(create_app(), raise_server_exceptions=False)
