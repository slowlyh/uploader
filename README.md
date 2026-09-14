# ⚡ HyuuCdn

> **Neo-Brutalist High-Speed File CDN & Developer REST API**  
> Dibangun dengan Next.js App Router, Supabase Storage & Database, serta desain Neo-Brutalism berkarakter kuat.

![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)
![Tech Stack](https://img.shields.io/badge/tech-Next.js%2014-black?style=flat-square&logo=next.js)
![Database](https://img.shields.io/badge/storage-Supabase-black?style=flat-square&logo=supabase)
![Design](https://img.shields.io/badge/ui-Neo--Brutalism-FFD028?style=flat-square)

---

## 🎨 Fitur Utama

### 🖥️ Frontend (Neo-Brutalism Experience)
- **Desain Neo-Brutalism Asli**: Solid black borders (`3px`), hard offset shadows (`4px 4px 0px 0px #000`), typography kontras tinggi hitam murni, dan warna aksen punchy (`#FFD028`, `#A3E635`, `#38BDF8`, `#FB7185`).
- **Smooth Boot Loading Screen**: Animasi loading transisi mulus saat pengguna pertama kali membuka website (disimpan di session agar tidak mengganggu navigasi berikutnya).
- **100% Responsif**: Dioptimalkan penuh untuk smartphone (touch-friendly drawer menu, scrolling table aman) hingga layar desktop ultra-wide.
- **Halaman Lengkap**:
  - **Home (`/`)**: Hero section interaktif, metric counters, feature breakdown, dan preview live code snippet multi-bahasa.
  - **Upload File (`/upload`)**: Drag & drop zone modern, validasi client-side, selector retensi (7 Hari vs Permanen), upload progress bar, preview media (gambar/video/audio), serta Browser Upload History.
  - **Docs (`/docs`)**: Dokumentasi 3-kolom standar industri (Navigation, Specification & Tables, Live Interactive Playground & Code Snippets cURL/JS/Python).

### ⚙️ Backend & REST API
- **REST API V1 Ready**: Endpoint publik `/v1/upload` (dan `/api/v1/upload`) untuk integrasi skrip, terminal, bot, dan aplikasi eksternal.
- **Masa Berlaku File (`expired`)**:
  - `7d` / `7day` / `7`: File berlaku 7 hari (auto-cleanup).
  - `permanent` / `never` / `0`: File disimpan selamanya tanpa kadaluarsa.
- **Rate Limiting**: Sliding window rate limiter in-memory (maksimal **10 upload per menit per IP**) dengan header standar:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (HTTP 429 jika melebihi batas)
- **Batas Ukuran**: Enforced maksimal **10MB** per file di sisi server & client.
- **Supabase Edge Storage**: Terhubung langsung ke S3-compatible cloud bucket dengan link publik instan.

---

## 📁 Struktur Direktori

```text
├── app/
│   ├── api/v1/
│   │   ├── files/[id]/route.ts   # GET & DELETE file metadata
│   │   ├── health/route.ts       # GET health & limit specs
│   │   └── upload/route.ts       # POST file upload endpoint
│   ├── docs/
│   │   └── page.tsx              # Halaman API Docs 3-Kolom
│   ├── upload/
│   │   └── page.tsx              # Halaman Upload File & History
│   ├── globals.css               # Neo-brutalist custom utilities & animations
│   ├── layout.tsx                # Root layout, Preloader, Navbar, Footer
│   └── page.tsx                  # Landing page
├── components/
│   ├── DocsPlayground.tsx        # Live interactive API tester
│   ├── Footer.tsx                # Neo-brutalist footer
│   ├── Navbar.tsx                # Sticky navbar & mobile drawer
│   ├── Preloader.tsx             # Smooth boot loading animation
│   ├── RecentUploads.tsx         # Local browser upload history
│   ├── UploadResult.tsx          # Upload success modal & copy direct URL
│   └── UploadZone.tsx            # Drag & drop upload box
├── lib/
│   ├── rate-limiter.ts           # Sliding window IP rate limiter
│   ├── supabase.ts               # Client Supabase instance
│   ├── supabase-server.ts        # Admin Supabase instance
│   └── utils.ts                  # Formatter & helpers
├── supabase/
│   ├── migrations/               # Supabase SQL migrations
│   └── schema.sql                # Skrip lengkap SQL setup database & storage
└── next.config.mjs               # Next.js config & /v1/* URL rewrites
```

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Clone Repository
```bash
git clone https://github.com/slowlyh/uploader.git
cd uploader
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel environment:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database Supabase
Buka **SQL Editor** di Dashboard Supabase Anda, lalu jalankan isi file `supabase/schema.sql`:
- Membuat tabel `public.files_metadata` (dengan UUID, retention type, storage path, download counter, dan index).
- Mengaktifkan Row Level Security (RLS) dan Realtime.
- Membuat bucket `public-files` di Supabase Storage dengan limit 10MB.
- Membuat function `clean_expired_files()` untuk membersihkan file yang telah melewati batas `expires_at`.

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 📡 Dokumentasi REST API

### 1. Upload File
- **Method**: `POST`
- **Path**: `/v1/upload` (atau `/api/v1/upload`)
- **Content-Type**: `multipart/form-data`

#### Parameter Form:
| Parameter | Tipe | Wajib | Keterangan |
| :--- | :--- | :--- | :--- |
| `file` | Binary File | Ya | File yang diupload (maksimal **10MB**) |
| `expired` | String | Opsional | `7d` (default, expire dalam 7 hari) atau `permanent` (selamanya) |

#### Contoh Request cURL:
```bash
# Upload file dengan masa simpan 7 hari
curl -X POST "https://your-domain.com/v1/upload" \
  -F "file=@./gambar.png" \
  -F "expired=7d"

# Upload file dengan masa simpan permanen
curl -X POST "https://your-domain.com/v1/upload" \
  -F "file=@./dokumen.pdf" \
  -F "expired=permanent"
```

#### Contoh Request JavaScript:
```javascript
const form = new FormData();
form.append("file", fileInput.files[0]);
form.append("expired", "permanent");

const res = await fetch("https://your-domain.com/v1/upload", {
  method: "POST",
  body: form
});
const data = await res.json();
console.log("Direct CDN URL:", data.data.url);
```

#### Contoh Request Python:
```python
import requests

files = {'file': open('photo.jpg', 'rb')}
data = {'expired': '7d'}

res = requests.post('https://your-domain.com/v1/upload', files=files, data=data)
print(res.json()['data']['url'])
```

#### Response Sukses (`201 Created`):
```json
{
  "success": true,
  "message": "File uploaded successfully to HyuuCdn",
  "data": {
    "id": "c89f53e2-89b1-4f81-a9f2-51a8eb82f142",
    "name": "photo.jpg",
    "size": 1048576,
    "type": "image/jpeg",
    "url": "https://xyz.supabase.co/storage/v1/object/public/public-files/1726300000_abc123.jpg",
    "storage_path": "1726300000_abc123.jpg",
    "expired": "7d",
    "expires_at": "2026-09-21T08:00:00.000Z",
    "created_at": "2026-09-14T08:00:00.000Z"
  }
}
```

---

### 2. Dapatkan Metadata File
- **Method**: `GET`
- **Path**: `/v1/files/{id}`
- **Response**: Mengembalikan status file, direct URL, jumlah download, dan waktu expire.

---

### 3. Cek Health & Konfigurasi Sistem
- **Method**: `GET`
- **Path**: `/v1/health`
- **Response**:
```json
{
  "status": "ok",
  "service": "HyuuCdn",
  "version": "1.0.0",
  "storage": {
    "provider": "supabase",
    "bucket": "public-files",
    "configured": true
  },
  "limits": {
    "max_upload_size": "10MB",
    "max_upload_bytes": 10485760,
    "retention_options": ["7d", "permanent"],
    "rate_limit": "10 uploads per minute per IP"
  }
}
```

---

## 🔒 Kebijakan Rate Limit
Setiap client IP dibatasi maksimal **10 kali upload dalam 60 detik**.  
Jika melebihi limit, server mengembalikan status code `429 Too Many Requests`:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Maximum 10 uploads per minute.",
  "retry_after": 45
}
```

---

## 📄 Lisensi
Distributed under the MIT License.

Dibuat dengan ❤️ oleh **[Slowly / Hyuu](https://github.com/slowlyh)**.
