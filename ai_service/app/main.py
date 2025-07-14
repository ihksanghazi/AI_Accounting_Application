from fastapi import FastAPI

# Inisialisasi aplikasi FastAPI
app = FastAPI(title="Layanan AI Akuntansi")

@app.get("/")
def read_root():
    """Endpoint utama untuk memeriksa status layanan."""
    return {"status": "ok", "message": "Layanan AI siap memproses dokumen!"}

@app.post("/scan/process")
def process_scan():
    """
    TODO: Endpoint untuk menerima gambar, memproses dengan OCR dan AI,
    lalu mengembalikan hasil dalam format JSON.
    """
    # Di sini nanti logika utama AI Anda berada
    return {"message": "Endpoint untuk proses scan belum diimplementasikan."}