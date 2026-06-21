import os
import secrets
from fastapi import HTTPException, UploadFile

# Konfigirasyon sekirite
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB limit

def validate_file(file: UploadFile):
    """
    Verifye si fichye a gen bon ekstansyon epi si li pa twò gwo.
    """
    # 1. Tcheke ekstansyon
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Ekstansyon '{file_ext}' pa pèmèt. Sèlman {ALLOWED_EXTENSIONS} yo aksepte."
        )

    # 2. Tcheke gwosè (li nesesè pou evite DoS attacks)
    # N ap jwenn gwosè a atravè header oswa enko
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)  # Reset pointer a apre n fin li gwosè a

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail="Fichye a twò gwo. Limit la se 20MB."
        )
    
    return True

def generate_secure_filename(filename: str) -> str:
    """
    Jenere yon nouvo non pou fichye a pou evite 'path traversal' 
    ak konfli non fichye.
    """
    ext = os.path.splitext(filename)[1].lower()
    random_name = secrets.token_hex(8)  # Kreye yon non inik
    return f"{random_name}{ext}"