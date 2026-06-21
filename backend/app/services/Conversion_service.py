from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional,List, Dict

from app.core.config import get_settings
from app.core.exceptions import ConversionError, UnsupportedFormatError
from app.core.logging import get_logger
from app.schemas.conversion import ConversionItem, ConversionJobResponse
from app.services.format import SUPPORTED_CONVERSIONS, convert_file
from app.utils.file_handler import build_file_paths, make_job_id


logger = get_logger(__name__)


class ConversionService:

    def get_formats(self) -> Dict[str, object]:
        conversions: List[ConversionItem] = []
        by_source: Dict[str, List[ConversionItem]] = {}

        for key, label in SUPPORTED_CONVERSIONS.items():
            src, tgt = key.split("→")

            item: ConversionItem = {
                "key": key,
                "label": label,
                "source": src,
                "target": tgt
            }

            conversions.append(item)
            by_source.setdefault(src, []).append(item)

        return {
            "total": len(conversions),
            "conversions": conversions,
            "by_source": by_source,
        }

    def run(
        self,
        content: bytes,
        original_filename: str,
        src_ext: str,
        tgt_ext: str,
    ) -> ConversionJobResponse:
        settings = get_settings()
        key = f"{src_ext}→{tgt_ext}"

        if key not in SUPPORTED_CONVERSIONS:
            raise UnsupportedFormatError(src_ext, tgt_ext)

        job_id = make_job_id()
        input_path, output_path = build_file_paths(job_id, original_filename, tgt_ext)

        input_path.write_bytes(content)
        logger.info(f"[{job_id}] Konvèsyon kòmanse: {key} ({original_filename})")

        try:
            convert_file(str(input_path), str(output_path), src_ext, tgt_ext)
        except Exception as exc:
            logger.error(f"[{job_id}] Echèk: {exc}")
            raise ConversionError(str(exc))
        finally:
            input_path.unlink(missing_ok=True)

        if not output_path.exists():
            raise ConversionError("Fichye output la pa kreye")

        size = output_path.stat().st_size
        output_name = output_path.name.removeprefix(f"{job_id}_")
        expires_at = datetime.utcnow() + timedelta(minutes=settings.FILE_TTL_MINUTES)

        logger.info(f"[{job_id}] Reyisi → {output_name} ({size} bytes)")

        return ConversionJobResponse(
            job_id=job_id,
            original_name=original_filename,
            output_name=output_name,
            conversion=f"{src_ext.upper()} → {tgt_ext.upper()}",
            size_bytes=size,
            download_url=f"/api/v1/convert/download/{job_id}/{output_name}",
            expires_at=expires_at,
        )

    def get_output_path(self, job_id: str, filename: str) -> Path:
        settings = get_settings()
        return settings.OUTPUT_DIR / f"{job_id}_{filename}"

    def delete_job_file(self, job_id: str, filename: str) -> bool:
        path = self.get_output_path(job_id, filename)
        if path.exists():
            path.unlink()
            logger.info(f"[{job_id}] Fichye efase: {filename}")
            return True
        return False


conversion_service = ConversionService()