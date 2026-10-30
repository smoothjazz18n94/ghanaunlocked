import pytest

from ghana_bot.config import get_settings


@pytest.fixture(autouse=True)
def fake_env(monkeypatch):
    monkeypatch.setenv("BOT_TOKEN", "123456:FAKE-TEST-TOKEN")
    monkeypatch.setenv("MINI_APP_URL", "")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
