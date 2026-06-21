from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,)

    # ── App ──────────────────────────────────────────────────────────────────
    APP_NAME: str = "Konvètisè Dokiman API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API pwofesyonèl pou konvèsyon dokiman"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"   # development | staging | production

    # ── Server ───────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    RELOAD: bool = False

    # ── CORS ─────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    ALLOWED_METHODS: list[str] = ["GET", "POST", "DELETE", "OPTIONS"]
    ALLOWED_HEADERS: list[str] = ["*"]

    # ── Storage ──────────────────────────────────────────────────────────────
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR / "storage"
    UPLOAD_DIR: Path = STORAGE_DIR / "uploads"
    OUTPUT_DIR: Path = STORAGE_DIR / "outputs"
    TEMP_DIR: Path = STORAGE_DIR / "temp"

    # ── File limits ──────────────────────────────────────────────────────────
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: list[str] = [
        "pdf", "docx", "xlsx", "csv", "json",
        "png", "jpg", "jpeg", "svg",
    ]

    # ── Cleanup ──────────────────────────────────────────────────────────────
    FILE_TTL_MINUTES: int = 60       # Efase fichye apre N minit
    CLEANUP_INTERVAL_MINUTES: int = 15

    # ── Rate limiting ────────────────────────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 30    # Pa minit pa IP
    RATE_LIMIT_WINDOW: int = 60      # segonn

    # ── API Keys (opsyonèl) ──────────────────────────────────────────────────
    API_KEY_ENABLED: bool = False
    API_KEY_HEADER: str = "X-API-Key"
    API_KEYS: list[str] = []

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "prod", "production"}:
                return False
            if normalized in {"debug", "dev", "development"}:
                return True
        return value

    @property
    def max_file_size_bytes(self) -> int:
        return self.MAX_FILE_SIZE_MB * 1024 * 1024

    def create_directories(self) -> None:
        for d in [self.UPLOAD_DIR, self.OUTPUT_DIR, self.TEMP_DIR]:
            d.mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()
