# Aplikasi Akuntansi AI

Project ini berisi fondasi untuk aplikasi akuntansi berbasis AI, dengan arsitektur microservices yang dijalankan menggunakan Docker.

---

## Arsitektur

Arsitektur aplikasi ini terdiri dari beberapa layanan yang bekerja sama:

* **Frontend**: Antarmuka pengguna (UI) yang interaktif, dibuat dengan **Next.js**.
* **Backend API**: Logika bisnis utama, otentikasi, dan CRUD ke database, dibuat dengan **Go (Gin & GORM)**.
* **AI Service**: Layanan khusus untuk pemrosesan AI (scan struk & generate akun), dibuat dengan **Python (FastAPI)** dan memanggil **Google Gemini API**.
* **Database**: Sistem manajemen database relasional menggunakan **PostgreSQL**.
* **DB Management**: Antarmuka web untuk manajemen database menggunakan **Adminer**.

---

## Prasyarat

* [Docker](https://www.docker.com/products/docker-desktop/)
* Docker Compose V2 (sudah termasuk dalam instalasi Docker terbaru)

---

## Persiapan Awal

1.  **Clone Repositori:**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd [NAMA_FOLDER_PROYEK]
    ```

2.  **Buat File Environment (`.env`)**
    Salin file `.env.example` (jika ada) atau buat file baru bernama `.env` di direktori utama. Isi file tersebut dengan konfigurasi berikut, sesuaikan nilainya jika perlu.

    ```env
    # Konfigurasi Database PostgreSQL
    POSTGRES_DB=akuntansi_db
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=********

    # Port Aplikasi
    FRONTEND_PORT=3000
    BACKEND_PORT=8081
    AI_SERVICE_PORT=8000
    DB_PORT=5433
    ADMINER_PORT=8080

    # Kunci Rahasia untuk JWT (digunakan oleh Go Backend)
    JWT_SECRET=********

    # URL untuk Frontend agar tahu alamat API
    NEXT_PUBLIC_API_URL=http://localhost:8081/api
    NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

    # API Key untuk Layanan AI
    GOOGLE_API_KEY=MASUKKAN_GOOGLE_AI_API_KEY_ANDA
    ```

---

## Menjalankan Aplikasi

### 👨‍💻 Mode Development
Mode ini mendukung **hot-reloading** untuk `frontend` dan `go_api`, ideal untuk coding.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 🚀 Mode Produksi
Mode ini menjalankan image yang sudah teroptimasi dan siap untuk deployment.

```bash
docker compose up --build
```

---

## Mengakses Layanan

Setelah container berjalan, Anda bisa mengakses layanan melalui URL berikut:
- Aplikasi Frontend (Next.js): `http://localhost:3000`
- Backend API (Go): `http://localhost:8081`
- AI Service (Python/FastAPI Docs): `http://localhost:8000/docs`
- Database Manager (Adminer): `http://localhost:8080`

---

## Menghentikan Aplikasi

- Jika menjalankan mode Development:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.dev.yml down
    ```
- Jika menjalankan mode Produksi:
    ```bash
    docker compose down
    ```