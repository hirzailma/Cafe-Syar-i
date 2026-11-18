# Catatan Keputusan Teknis & Desain (DECISIONS) - Cafe Syar'i

Dokumen ini mencatat keputusan arsitektur dan penyesuaian desain yang diterapkan selama pengembangan proyek.

---

## 1. Stack Teknologi & Target Deployment
- **Framework:** Next.js (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS + PostCSS
- **Icon Library:** Lucide React (ringan, ramah aksesibilitas, konsisten)
- **Target Deploy:** Vercel (sejalan dengan Aturan Wajib 1)
- **Alasan Pemilihan:** Mendukung Server-Side Rendering (SSR) & Static Site Generation (SSG), performa SEO optimal, waktu muat cepat, dan integrasi mudah ke Vercel.

---

## 2. Penerapan Sistem Desain
- Mengadopsi sistem desain **Serene Halal Artisan** dari rancangan UI pengguna di folder `cafe_syari_design`:
  - **Tipografi:** Plus Jakarta Sans
  - **Warna Utama:** Roasted Espresso (`#352f2b` / `#4c4541`), Muted Sage Olive (`#aeac78` / `#626034`), Warm Honey Gold (`#f2c46a`), Warm Cream Canvas (`#fff8f1` / `#fcf0da`), Canvas White (`#ffffff`).
  - **Mood:** Ketenangan islami yang ramah keluarga, bersih, dan berwawasan estetika artisan.

---

## 3. Penyesuaian Data Lokal Banjaran, Kota Kediri
- Pada prototipe awal terdapat teks dummy alamat Jakarta Selatan. Sesuai data inisiasi pengguna, alamat diperbarui secara akurat ke **Gg. I No.28, Banjaran, Kota Kediri, Jawa Timur**.
- Google Maps embed dikonfigurasi untuk menampilkan koordinat wilayah Banjaran Kediri dengan tombol langsung menuju tautan Maps pengguna (`https://maps.app.goo.gl/H8m6RnZkn4hpnxU79`).

---

## 4. Arsitektur Data Terpusat
- Seluruh teks yang dinamis atau berpotensi diganti pengelola (nama kafe, tagline, deskripsi, alamat, kontak, daftar layanan, kartu nilai, artikel) dipusatkan di `src/config/site.ts`.
- Memudahkan perawatan oleh tim tanpa perlu menyentuh komponen layout JSX.

---

## 5. Keamanan & Konvensi Rahasia
- Seluruh environment variable dipersiapkan di `.env.example` dan `.env.local` dijaga tetap berada dalam `.gitignore`.
- Berkas skrip database Apps Script (`code.gs` dan `setup.gs`) untuk Step 2 telah dimasukkan ke dalam `.gitignore` sejak dini.
