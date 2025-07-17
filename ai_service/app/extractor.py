# ai_service/app/extractor.py

import os
import google.generativeai as genai
import json
import re
from pathlib import Path

# Konfigurasi API Key dari environment variable
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"Error configuring Google AI: {e}")


def extract_data_with_gemini(image_path: Path) -> dict:
    """
    Menggunakan Gemini Pro Vision untuk menganalisis gambar struk dan mengekstrak data.
    """
    if not os.getenv("GOOGLE_API_KEY"):
        return {"error": "Google API Key tidak ditemukan."}

    model = genai.GenerativeModel('gemini-1.5-flash-latest')

    # Mempersiapkan gambar untuk dikirim ke API
    image_part = {
        "mime_type": "image/jpeg", # Asumsi format jpeg, bisa diganti
        "data": image_path.read_bytes()
    }

    # Prompt engineering: Memberi instruksi yang sangat jelas kepada AI
    prompt = """
        Anda adalah asisten AI yang ahli dalam menganalisis struk belanja dan faktur.
        Tugas Anda adalah menganalisis gambar yang diberikan dan mengekstrak informasi kunci secara akurat.
        Berikan jawaban HANYA dalam format JSON yang valid, tanpa teks pembuka, penutup, atau penjelasan apapun.

        Format JSON yang wajib diikuti:
        {
        "vendor_name": "NAMA_TOKO_ATAU_PERUSAHAAN",
        "transaction_date": "TANGGAL_TRANSAKSI_DALAM_FORMAT_YYYY-MM-DD",
        "total_amount": TOTAL_HARGA_SEBAGAI_ANGKA_FLOAT
        }

        Aturan dan Petunjuk Detail:
        1.  Untuk "vendor_name":
            - Identifikasi nama utama dari toko, restoran, atau perusahaan. Ini biasanya adalah teks dengan font terbesar dan terletak di bagian paling atas struk.
            - Abaikan teks generik seperti "Struk Penjualan", "Selamat Datang", "Terima Kasih", "Asli", "Copy".
            - Jika ada beberapa kandidat nama, pilih nama komersial yang paling umum dikenal (Contoh: pilih "Alfamart" bukan "PT. Sumber Alfaria Trijaya, Tbk").
            - Jika benar-benar tidak ada nama yang bisa diidentifikasi, baru berikan nilai null.

        2.  Untuk "transaction_date":
            - Cari tanggal dalam format apapun (misal: 17/07/2025, 17-07-25, 17 Jul 2025).
            - Normalisasikan dan kembalikan SELALU dalam format YYYY-MM-DD.
            - Jika tidak ada tanggal, berikan nilai null.

        3.  Untuk "total_amount":
            - Cari kata kunci seperti 'TOTAL', 'Total Bayar', 'GRAND TOTAL', 'Tunai', atau 'Total Tagihan'.
            - Ambil angka final yang paling besar yang ada di struk. Pastikan ini adalah total akhir setelah pajak atau diskon, bukan subtotal.
            - Hilangkan semua simbol mata uang (Rp) dan pemisah ribuan (titik atau koma). Jadikan sebagai angka float.
            - Jika tidak ada angka total yang bisa ditemukan, berikan nilai null.
        """

    try:
        # Mengirim prompt dan gambar ke model
        response = model.generate_content([prompt, image_part])
        
        # Membersihkan output AI untuk mendapatkan blok JSON
        json_text = re.search(r'```json\n({.*?})\n```', response.text, re.DOTALL)
        if json_text:
            return json.loads(json_text.group(1))
        else:
            # Fallback jika AI tidak memberikan format yang benar
            return json.loads(response.text)

    except Exception as e:
        return {"error": f"Error saat memanggil Gemini API: {e}", "details": response.text if 'response' in locals() else 'No response'}