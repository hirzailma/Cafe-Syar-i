# Maintenance Log - Cafe Syar'i

Dokumen ini mencatat backlog pengembangan, bug yang diketahui, serta riwayat perubahan sistem Cafe Syar'i.

---

## 📌 Informasi Sistem
- **Aplikasi:** Website Profil & Pemesanan Cafe Syar'i
- **Framework:** Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Database:** Google Apps Script (Google Spreadsheet) + Fallback JSON Lokal
- **Hosting Target:** Vercel

---

## 📋 Backlog Fitur (Pengembangan Mendatang)
- [ ] Pemasangan gambar barcode QRIS resmi (OVO / DANA Bisnis) menggantikan placeholder di `/pesan`.
- [ ] Integrasi Payment Gateway resmi (Midtrans / Xendit) untuk verifikasi otomatis pembayaran QRIS & VA.
- [ ] Migrasi penyimpanan upload media ke Cloud Storage (Vercel Blob / Cloudinary / Supabase Storage).
- [ ] Notifikasi WhatsApp otomatis via WhatsApp Cloud API resmi atau webhook gateway.
- [ ] Sistem cetak struk pesanan otomatis untuk printer thermal kasir kafe.
- [ ] Fitur promo diskon / voucher untuk pesanan komunitas dan event kajian.

---

## 🐛 Bug Diketahui
*(Belum ada bug kritis yang dilaporkan)*

---

## 📝 Riwayat Perubahan (Changelog)

### [18 November 2026] - Pembaruan Nomor WhatsApp Resmi Kafe
- **Kontak & Pemesanan:** Mengubah nomor WhatsApp tujuan notifikasi pesanan (`/pesan`) dan kontak website menjadi `081992373219` (`6281992373219`).

### [18 November 2026] - Rilis Fitur Step 3 (Pemesanan & Menu) & Persiapan Deploy Vercel (Step 4)
- **Fitur Baru:** Halaman pemesanan interaktif 3 tahap (`/pesan`) mencakup pemilihan menu, reservasi meja, dan konfirmasi WhatsApp.
- **Admin Dashboard:** Menambahkan modul Manajemen Menu Kafe (`/dashboard/menu`) dan Riwayat Pesanan (`/dashboard/orders`).
- **Desain & Branding:** Memperbaiki rendering logo kafe menjadi `w-14 h-14` dengan radius sudut yang proporsional di Navbar dan Footer.
- **Database:** Menambahkan skema tabel `Menu` dan `Orders` pada `setup.gs` serta fallback lokal.
- **Keamanan:** Memperbarui aturan `.gitignore` agar file kredensial dan database lokal tidak terunggah ke repository publik.

### [16 November 2026] - Rilis Fitur Step 2 (User Management & Dashboard)
- **Fitur Baru:** Sistem autentikasi berbasis sesi JWT Edge-compatible dengan cookie httpOnly.
- **Admin Dashboard:** Manajemen Pengguna, Manajemen Peran/Role, CRUD Berita dengan upload gambar lokal, serta form Ubah Password.
- **Backend Database:** Integrasi Google Apps Script Web App API (`code.gs`, `setup.gs`) dengan fallback file lokal JSON.

### [16 November 2026] - Rilis Step 1 (Landing Page)
- **Fitur Baru:** Landing page responsif bertema *Serene Halal Artisan* (Hero, Stats, About, Services, News, Contact, Footer).
- **Konfigurasi:** Konfigurasi dasar Next.js 14 App Router, Tailwind CSS, dan struktur konfigurasi terpusat di `src/config/site.ts`.
