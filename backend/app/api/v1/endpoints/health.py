import time
from fastapi import APIRouter
from app.core.config import get_settings
from app.schemas.conversion import HealthResponse

router = APIRouter(tags=["Sante"])
_start_time = time.time()


@router.get("/health", 
    response_model=HealthResponse, 
    summary="Sante API a")
def health_check() -> HealthResponse:
    settings = get_settings()
    storage_ok = all([
        settings.UPLOAD_DIR.exists(),
        settings.OUTPUT_DIR.exists(),
        settings.TEMP_DIR.exists(),
    ])
    return HealthResponse(
        status="ok" if storage_ok else "degraded",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        storage_ok=storage_ok,
        uptime_seconds=round(time.time() - _start_time, 1),
    )