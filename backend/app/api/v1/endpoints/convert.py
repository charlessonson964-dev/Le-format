from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import FileResponse

from app.core.exceptions import FileNotFoundException
from app.schemas.conversion import ConversionJobResponse, FormatsResponse
from app.services.Conversion_service import conversion_service
from app.utils.file_handler import validate_upload, get_extension

router = APIRouter(prefix="/convert", tags=["Konvèsyon"])


@router.get(
    "/formats",
    response_model=FormatsResponse,
    summary="Fòma ki sipòte yo")
def list_formats() -> FormatsResponse:
    data = conversion_service.get_formats()
    return FormatsResponse(**data)


@router.post(
    "/",
    response_model=ConversionJobResponse,
    status_code=201,
    summary="Konvèti yon dokiman")
async def convert_document(
    file: UploadFile = File(..., description="Fichye pou konvèti"),
    target_format: str = Form(..., description="Fòma output (ex: pdf, docx, csv)"),
) -> ConversionJobResponse:
    content = await file.read()
    src_ext = validate_upload(file, content)
    tgt_ext = target_format.lower().lstrip(".")

    return conversion_service.run(
        content=content,
        original_filename=file.filename or "document",
        src_ext=src_ext,
        tgt_ext=tgt_ext,
    )


@router.get(
    "/download/{job_id}/{filename}",
    summary="Telechaje fichye konvèti",)
def download_file(job_id: str, filename: str) -> FileResponse:
    path = conversion_service.get_output_path(job_id, filename)
    if not path.exists():
        raise FileNotFoundException(detail=f"Fichye a pa jwenn: {filename}")
    return FileResponse(
        path=str(path),
        filename=filename,
        media_type="application/octet-stream",
    )


@router.delete(
    "/jobs/{job_id}/{filename}",
    summary="Efase yon fichye konvèti",
    status_code=204,)
def delete_job(job_id: str, filename: str) -> None:
    conversion_service.delete_job_file(job_id, filename)