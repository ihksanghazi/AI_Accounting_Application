# Gunakan base image Python yang ringan
FROM python:3.10-slim

# Set working directory di dalam container
WORKDIR /app

# Salin file requirements terlebih dahulu untuk caching
COPY requirements.txt .

# Install semua library yang dibutuhkan
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua kode aplikasi Anda ke dalam container
COPY ./app /app

# Expose port yang digunakan oleh FastAPI
EXPOSE 8000

# Perintah untuk menjalankan aplikasi saat container dimulai
# uvicorn akan menjadi server untuk aplikasi FastAPI kita
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]