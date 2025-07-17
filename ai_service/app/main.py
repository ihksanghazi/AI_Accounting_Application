# ai_service/app/main.py

import shutil
import uuid
from pathlib import Path
from fastapi import FastAPI, File, UploadFile

# Inisialisasi aplikasi FastAPI
app = FastAPI(title="Layanan AI Akuntansi")

# Definisikan path ke direktori uploads
UPLOAD_DIR = Path("uploads")

@app.on_event("startup")
async def startup_event():
    """Memastikan direktori uploads ada saat aplikasi dimulai."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/")
def read_root():
    """Endpoint utama untuk memeriksa status layanan."""
    return {"status": "ok", "message": "Layanan AI siap memproses dokumen!"}

@app.post("/scan/process")
async def process_scan(file: UploadFile = File(...)):
    """
    Menerima file gambar, menyimpannya secara lokal dengan nama unik,
    dan mengembalikan informasi file.
    """
    try:
        # Membuat nama file yang unik untuk mencegah tumpang tindih
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename

        # Menyimpan file yang diunggah secara efisien
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Di sini nanti kita akan menambahkan logika OCR dan AI
        # Untuk sekarang, kita hanya mengembalikan konfirmasi

        return {
            "message": "File berhasil diunggah",
            "filename": unique_filename,
            "content_type": file.content_type,
            "path": str(file_path)
        }
    except Exception as e:
        # Penanganan error dasar
        return {"error": f"Terjadi kesalahan: {e}"}