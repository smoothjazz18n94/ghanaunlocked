def test_allowed_origin_gets_cors_header(client):
    r = client.get("/api/v1/health", headers={"Origin": "https://example.vercel.app"})
    assert r.headers["access-control-allow-origin"] == "https://example.vercel.app"


def test_unknown_origin_gets_no_cors_header(client):
    r = client.get("/api/v1/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in r.headers
