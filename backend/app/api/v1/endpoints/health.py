from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import get_settings
from app.db.session import check_database
from app.schemas.health import HealthResponse, ReadinessResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Liveness. Needs no database and no credentials."""
    s = get_settings()
    return HealthResponse(
        status="ok",
        service=s.app_name,
        version=s.app_version,
        environment=s.environment,
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/health/ready", response_model=ReadinessResponse)
def readiness() -> ReadinessResponse:
    """Readiness. Reports database state without failing when none is configured."""
    db = check_database()
    return ReadinessResponse(
        status="degraded" if db == "unavailable" else "ok", database=db
    )
