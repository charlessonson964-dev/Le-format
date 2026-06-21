from fastapi import HTTPException
from fastapi import status


class ConversionError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erè pandan konvèsyon: {detail}",
        )


class UnsupportedFormatError(HTTPException):
    def __init__(self, src: str, tgt: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Konvèsyon '{src.upper()} → {tgt.upper()}' pa sipòte.",
        )
        
class FileNotFoundException(HTTPException):
    def __init__(self, detail: str = "Fichye a pa jwenn"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )


class FileTooLargeException(HTTPException):
    def __init__(self, detail: str = "Fichye a twò gwo"):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=detail,
        )
