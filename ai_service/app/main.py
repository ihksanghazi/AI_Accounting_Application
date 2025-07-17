# ai_service/app/main.py

import shutil
import uuid
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
import extractor # Impor modul extractor kita

app = FastAPI(title="Layanan AI Akuntansi")
UPLOAD_DIR = Path("uploads")

@app.on_event("startup")
async def startup_event():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Layanan AI siap memproses dokumen!"}

@app.post("/scan/process")
async def process_scan(file: UploadFile = File(...)):
    """
    Menerima file gambar, menyimpannya, lalu memprosesnya dengan Gemini
    untuk mengekstrak info penting.
    """
    try:
        # Menyimpan file yang diunggah
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ---- Memanggil Gemini untuk Ekstraksi ----
        extracted_data = extractor.extract_data_with_gemini(file_path)

        return {
            "message": "File berhasil diproses dengan Gemini",
            "filename": unique_filename,
            "extracted_data": extracted_data
        }
    except Exception as e:
        return {"error": f"Terjadi kesalahan pada server: {e}"}