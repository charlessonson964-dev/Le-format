from pydantic import BaseModel, Field, computed_field
from typing import Optional,List, Dict, TypedDict
from datetime import datetime


class ConversionItem(TypedDict):
    key: str
    label: str
    source: str
    target: str


class ConvertRequest(BaseModel):
    target_format: str = Field(
        ...,
        description="Fòma output la (ex: pdf, docx, csv, png...)",
        examples=["pdf", "docx", "xlsx", "png"],
    )


class ConversionJobResponse(BaseModel):
    job_id: str = Field(..., description="Idantifyan inik pou travay la")
    original_name: str = Field(..., description="Non fichye original la")
    output_name: str = Field(..., description="Non fichye konvèti a")
    conversion: str = Field(..., description="Konvèsyon ki fèt (ex: PDF → DOCX)")
    size_bytes: int = Field(..., description="Gwosè fichye output la")
    download_url: str = Field(..., description="URL pou telechaje fichye a")
    expires_at: Optional[datetime] = Field(None, description="Dat ekspire pou fichye a")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @computed_field
    @property
    def size_human(self) -> str:
        b = self.size_bytes
        for unit in ("B", "KB", "MB", "GB"):
            if b < 1024:
                return f"{b:.1f} {unit}"
            b /= 1024
        return f"{b:.1f} TB"


class FormatInfo(BaseModel):
    key: str = Field(..., description="Kle konvèsyon (ex: pdf→docx)")
    label: str = Field(..., description="Deskripsyon lisib (ex: PDF → Word)")
    source: str
    target: str


class FormatsResponse(BaseModel):
    total: int
    conversions: List[FormatInfo]
    by_source: Dict[str, List[FormatInfo]]


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    storage_ok: bool
    uptime_seconds: Optional[float] = None


class ErrorResponse(BaseModel):
    error: str
    detail: str
    status_code: int