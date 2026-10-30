"""Lazy database access: nothing connects at import time, so the app (and the
health check) runs without any database credentials."""
from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.core.errors import AppError


@lru_cache
def get_engine() -> Engine | None:
    url = get_settings().database_url
    if not url:
        return None
    return create_engine(url, pool_pre_ping=True, connect_args={"connect_timeout": 3})


def get_db() -> Iterator[Session]:
    """FastAPI dependency. Raises a clear error if no database is configured."""
    engine = get_engine()
    if engine is None:
        raise AppError("Database is not configured.", code="database_not_configured")
    factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with factory() as session:
        yield session


def check_database() -> str:
    """Returns 'not_configured', 'ok' or 'unavailable'. Never raises."""
    try:
        engine = get_engine()
        if engine is None:
            return "not_configured"
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return "ok"
    except Exception:
        return "unavailable"
