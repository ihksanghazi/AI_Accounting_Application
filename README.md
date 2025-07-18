# Aplikasi Akuntansi AI

Project ini berisi fondasi untuk aplikasi akuntansi berbasis AI, dengan arsitektur microservices yang dijalankan menggunakan Docker.

Arsitektur terdiri dari:
* **Web App**: Frontend dan API utama dengan Next.js.
* **AI Service**: Layanan khusus untuk pemrosesan AI dengan Python (FastAPI).
* **Database**: PostgreSQL.

---

## Prasyarat

Pastikan Anda sudah menginstall perangkat lunak berikut:
* [Docker](https://www.docker.com/products/docker-desktop/)
* Docker Compose V2 (biasanya sudah termasuk dalam instalasi Docker terbaru)

---

## Persiapan Awal

1.  **Clone Repositori** (jika sudah ada di Git):
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd [NAMA_FOLDER_PROYEK]
    ```

2.  **Buat File Environment (`.env`)**
    Buat sebuah file bernama `.env` di direktori utama proyek. Isi file tersebut dengan konfigurasi berikut:
    ```env
    # Konfigurasi Database PostgreSQL
    POSTGRES_DB=**********
    POSTGRES_USER=**********
    POSTGRES_PASSWORD=**********

    # Port Aplikasi (opsional, untuk referensi)
    WEB_APP_PORT=3000
    AI_SERVICE_PORT=8000
    DB_PORT=5433

    # Port untuk adminer
    ADMINER_PORT=8080

    # URL Koneksi Database untuk Prisma
    DATABASE_URL="postgresql://username:password@db:5432/akuntansi_db"

    # Kunci rahasia untuk menandatangani JSON Web Tokens
    JWT_SECRET=**********

    # URL untuk AI Service yang bisa diakses dari Browser
    NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

    # dll
    GOOGLE_API_KEY=**********
    ```

---

## Menjalankan Aplikasi

Ada dua mode untuk menjalankan aplikasi ini: **Development** dan **Production**.

### 👨‍💻 Mode Development

Gunakan mode ini saat Anda sedang aktif melakukan coding. Mode ini mendukung **live-reloading**, di mana setiap perubahan pada kode akan langsung terlihat di browser tanpa perlu me-restart container.

Untuk menjalankan mode development, gunakan perintah:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- Perintah ini menggabungkan `docker-compose.yml` dengan `docker-compose.dev.yml`.
- Container `web_app` akan menggunakan `Dockerfile.dev`, `volumes` akan aktif, dan server yang berjalan adalah server development Next.js (`npm run dev`).

---

## 🚀 Mode Produksi
Gunakan mode ini untuk mensimulasikan bagaimana aplikasi akan berjalan di server sesungguhnya. Mode ini menggunakan build yang sudah teroptimasi, ramping, dan aman.

Untuk menjalankan mode produksi, gunakan perintah:
```bash
docker compose up --build
```

- Perintah ini hanya menggunakan file `docker-compose.yml`.
- Container `web_app` akan menggunakan `Dockerfile` produksi yang sudah dioptimalkan dan menjalankan aplikasi dari build `standalone`.

---

## Mengakses Layanan
Setelah container berjalan, Anda bisa mengakses layanan melalui URL berikut:
- Aplikasi Web (Next.js): `http://localhost:3000`
- Layanan AI (Python): `http://localhost:8000`
- Database (PostgreSQL): Dapat diakses dari `localhost:5433` menggunakan DBeaver, TablePlus, atau sejenisnya.

---

## Menghentikan Aplikasi
Untuk menghentikan dan menghapus semua container yang berjalan:

- Jika Anda menjalankan mode Development:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
    ```
- Jika Anda menjalankan mode Produksi:
    ```bash
    docker compose down -v
    ```