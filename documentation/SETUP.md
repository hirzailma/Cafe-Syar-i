# Panduan Setup Proyek & Database - Cafe Syar'i

Dokumen ini menjelaskan langkah-langkah untuk menjalankan website Cafe Syar'i secara lokal, menyiapkan database Google Spreadsheet via Google Apps Script, serta panduan pengelolaan akun administrator dan penyimpanan media.

---

## 1. Menjalankan Proyek Secara Lokal

1. **Jalankan server aplikasi:**
   ```bash
   npm run dev
   ```
2. Buka browser dan arahkan ke:
   ```
   http://localhost:3000
   ```
3. Buka halaman masuk di:
   ```
   http://localhost:3000/login
   ```

---

## 2. Akun Administrator Bawaan

Saat inisiasi awal, sistem menyiapkan akun admin bawaan:
- **Email:** `admin@gmail.com`
- **Kata Sandi:** `123456`

> **PERINGATAN KEAMANAN:**  
> Kredensial di atas bersifat publik untuk kemudahan pengujian awal. Segera masuk ke dashboard dan buka menu **Ganti Password** (`/dashboard/profile`) untuk mengubah kata sandi sebelum website dipublikasikan ke production! Kata sandi disimpan dalam bentuk enkripsi hash satu arah (Bcrypt) dan tidak pernah disimpan secara teks polos.

---

## 3. Menghubungkan Google Spreadsheet sebagai Database

Aplikasi menggunakan arsitektur aman:
```
Browser -> Next.js Server (API / Middleware) -> Google Apps Script (Web App) -> Google Spreadsheet
```
*Browser tidak pernah mengakses Apps Script secara langsung; komunikasi antar server dilindungi secret token bersama.*

### Langkah Demi Langkah:

1. **Buat Google Spreadsheet Baru:**
   - Buka [Google Sheets](https://sheets.new) di akun Google Anda.
   - Beri nama spreadsheet, misalnya: `Database Cafe Syari`.
2. **Buka Editor Apps Script:**
   - Di menu atas Google Sheets, klik **Extensions (Ekstensi)** > **Apps Script**.
3. **Salin Kode:**
   - Buat file script baru di editor dengan nama `setup.gs` dan salin seluruh isi dari file lokal [setup.gs](file:///c:/Users/Hirza%20ilma/Downloads/Belajar%20HTML/IT/Cafe%20Syar'i/setup.gs).
   - Di file `Code.gs` bawaan, hapus isinya dan ganti dengan seluruh isi dari file lokal [code.gs](file:///c:/Users/Hirza%20ilma/Downloads/Belajar%20HTML/IT/Cafe%20Syar'i/code.gs).
4. **Jalankan Inisiasi Tabel (`initTables`):**
   - Di toolbar Apps Script, pilih fungsi `initTables` pada dropdown fungsi.
   - Klik tombol **Run (Jalankan)**.
   - Setujui perizinan Google (Review Permissions > pilih akun > Advanced > Go to Untitled project).
   - Fungsi ini **idempoten** (aman dijalankan berulang tanpa menduplikasi data). Periksa tab Google Sheets Anda: sheet `Roles`, `Users`, dan `News` akan otomatis terbentuk beserta header dan data awal.
5. **Atur Secret Token di Script Properties:**
   - Di bilah kiri Apps Script, klik ikon roda gigi **Project Settings (Setelan Proyek)**.
   - Scroll ke bagian **Script Properties (Properti Skrip)** > klik **Add script property**.
   - Masukkan Property: `APPS_SCRIPT_SECRET`
   - Masukkan Value: buat token rahasia acak (misal: `kunci_rahasia_cafe_syari_2026`).
   - Klik **Save script properties**.
6. **Deploy Sebagai Web App:**
   - Klik tombol biru **Deploy** di pojok kanan atas > **New deployment**.
   - Pilih jenis: **Web app**.
   - Isi deskripsi: `Versi 1 Database Cafe Syari`.
   - **Execute as:** `Me (email Anda)`.
   - **Who has access:** `Anyone (Siapa saja)`.
   - Klik **Deploy** dan salin **Web App URL** yang dihasilkan.
7. **Pasang di `.env.local`:**
   - Buat file `.env.local` di folder root proyek Cafe Syar'i (file ini otomatis diabaikan git demi keamanan).
   - Masukkan:
     ```env
     APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
     APPS_SCRIPT_SECRET=kunci_rahasia_cafe_syari_2026
     AUTH_SECRET=cafe_syari_secret_jwt_key_secure_2026_kediri
     ```
   - Restart server Next.js Anda (`npm run dev`). Aplikasi kini terhubung langsung ke spreadsheet Google Anda!

---

## 4. Catatan Penting Penyimpanan Media Lokal & Vercel

- Saat ini foto thumbnail berita disimpan sebagai file lokal di folder `public/uploads/` dan hanya path string-nya yang dicatat ke database.
- **Penting untuk diketahui:** Di komputer lokal (development), penyimpanan lokal berfungsi sempurna. Namun, platform cloud seperti **Vercel** bersifat *ephemeral / read-only* saat runtime (file yang diupload tidak akan bertahan permanen).
- Modul penyimpanan telah kami bungkus rapi di `src/lib/storage.ts`. Pada **Step 4 (Deploy & Maintenance)**, kami akan mendampingi migrasi penyimpanan ke layanan cloud permanen (seperti Vercel Blob atau Cloudinary) dengan mudah tanpa membongkar kode UI.
