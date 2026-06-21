import os
import re
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile

from app.core.config import get_settings
from app.core.exceptions import UnsupportedFormatError, FileTooLargeException

_UNSAFE = re.compile(r"[^\w\-.]")


def sanitize_filename(name: str) -> str:
    safe = _UNSAFE.sub("_", name)
    return safe[:200]


def get_extension(filename: str) -> str:
    return Path(filename).suffix.lstrip(".").lower()


def make_job_id() -> str:
    return str(uuid.uuid4())


def validate_upload(file: UploadFile, content: bytes) -> str:
    settings = get_settings()
    if len(content) > settings.max_file_size_bytes:
        raise FileTooLargeException(detail=f"Fichye a twò gwo: {format_bytes(len(content))}")

    ext = get_extension(file.filename or "")
    if not ext or ext not in settings.ALLOWED_EXTENSIONS:
        raise UnsupportedFormatError(ext or "inconnu", "any")

    return ext


def build_file_paths(job_id: str, original_name: str, target_ext: str) -> tuple[Path, Path]:
    settings = get_settings()
    safe_name = sanitize_filename(original_name)
    stem = Path(safe_name).stem

    input_path = settings.UPLOAD_DIR / f"{job_id}_{safe_name}"
    output_name = f"{stem}_converted.{target_ext}"
    output_path = settings.OUTPUT_DIR / f"{job_id}_{output_name}"

    return input_path, output_path


def get_file_path(filename: str, directory: str) -> str:
    safe_name = sanitize_filename(Path(filename).name)  # bloke ../
    path = Path(directory).resolve() / safe_name
    return str(path)


def cleanup_file(file_path: str) -> None:
    Path(file_path).unlink(missing_ok=True)


def cleanup_directory(directory: str) -> None:
    root = Path(directory)
    if not root.exists():
        return

    for item in root.iterdir():
        try:
            if item.is_file() or item.is_symlink():
                item.unlink()
            elif item.is_dir():
                shutil.rmtree(item)
        except Exception as e:
            print(f"Erè pandan efasman {item}: {e}")


def format_bytes(size: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"
