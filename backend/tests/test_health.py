def test_health_ok_without_database(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["version"]
    assert "timestamp" in body


def test_readiness_reports_database_not_configured(client):
    r = client.get("/api/v1/health/ready")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "database": "not_configured"}


def test_readiness_degraded_when_database_unreachable(monkeypatch, client):
    from app.core.config import get_settings
    from app.db.session import get_engine

    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://x:y@127.0.0.1:1/none")
    get_settings.cache_clear()
    get_engine.cache_clear()
    r = client.get("/api/v1/health/ready")
    assert r.status_code == 200
    assert r.json() == {"status": "degraded", "database": "unavailable"}


def test_root(client):
    assert client.get("/").status_code == 200
