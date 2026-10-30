from fastapi import APIRouter

from app.core.errors import NotFoundError


def test_unknown_route_uses_error_envelope(client):
    r = client.get("/api/v1/nope")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "http_error"


def test_app_error_and_unexpected_error_handlers():
    from fastapi.testclient import TestClient

    from app.main import create_app

    app = create_app()
    router = APIRouter()

    @router.get("/_missing")
    def missing():
        raise NotFoundError("Thing not found")

    @router.get("/_boom")
    def boom():
        raise RuntimeError("secret internals")

    app.include_router(router)
    c = TestClient(app, raise_server_exceptions=False)

    r = c.get("/_missing")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "not_found"

    r = c.get("/_boom")
    assert r.status_code == 500
    assert r.json()["error"]["code"] == "internal_error"
    assert "secret internals" not in r.text  # internals never leak
