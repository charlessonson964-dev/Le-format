import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from api.v1.router import api_router
from core.config import get_settings
from core.logging import get_logger, setup_logging
from utils.cleanup import start_cleanup_scheduler

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Setup inisyal
    settings = get_settings()
    settings.create_directories()
    logger.info(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} ({settings.ENVIRONMENT})")
    
    # 2. Start Scheduler
    scheduler = start_cleanup_scheduler()
    if not scheduler.running:
        scheduler.start()
    
    yield
    
    # 3. Shutdown
    scheduler.shutdown()
    logger.info("API fèmen pwòpman.")

def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=settings.APP_DESCRIPTION,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=settings.ALLOWED_METHODS,
        allow_headers=settings.ALLOWED_HEADERS,
    )

    app.include_router(api_router)

    # Global Exception Handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Erè enkoni: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "internal_server_error", "detail": "Erè entèn sèvè a."},
        )

    @app.get("/", include_in_schema=False)
    def root():
        return {
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "health": "/api/v1/health",
        }

    return app

app = create_app()

# 1. Defini kote dosye frontend yo ye
    # (Sipoze "frontend/dist" se kote React ou a ye)
frontend_dir = Path(__file__).parent.parent / "frontend" / "dist"
    
if frontend_dir.exists():
        # Sèvi dosye estatik yo (js, css, etc.)
    app.mount("/assets", StaticFiles(directory=frontend_dir / "assets"), name="assets")
        
        # Sèvi index.html pou tout lòt wout (pou React Router mache)
    @app.get("/{rest_of_path:path}")
    async def serve_spa(rest_of_path: str):
            # Si w pa mande API a (pa kòmanse ak /api), voye index.html
        if not rest_of_path.startswith("api"):
            return FileResponse(frontend_dir / "index.html")
        return {"error": "Not found"}, 404
else:
    logger.warning("Frontend dist directory not found. Skipping static file mounting.")