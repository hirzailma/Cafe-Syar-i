# Progres Proyek - Cafe Syar'i

Terakhir diperbarui: 18 November 2026  
Posisi saat ini: **Step 4 - Deploy ke Vercel & Panduan Maintenance**

## Data Usaha
- **Nama Usaha:** Cafe Syar'i
- **Bidang:** Food & Beverage (UMKM Kedai Kopi & Kuliner Lokal)
- **Lokasi:** Gg. I No.28, Banjaran, Kec. Kota, Kota Kediri, Jawa Timur 64129
- **Google Maps:** [Tautan Google Maps](https://maps.app.goo.gl/H8m6RnZkn4hpnxU79)
- **Konsep:** Kafe bernuansa Islami yang ramah keluarga, mendukung kegiatan edukasi dan kajian ringan, menyajikan kopi artisan halal nusantara.
- **Sistem Desain:** Serene Halal Artisan (Plus Jakarta Sans, warna espresso `#352f2b`, muted sage `#aeac78`, amber honey `#f2c46a`, warm cream canvas `#fff8f1`/`#fcf0da`).

---

## Checklist Proyek

- [x] Inisiasi (data usaha & referensi desain `cafe_syari_design` terkumpul)
- [x] STEP 1 - Landing page
  - [x] Konfigurasi proyek Next.js + Tailwind CSS + Google Fonts (Plus Jakarta Sans)
  - [x] Data terpusat (`src/config/site.ts`)
  - [x] Navbar (Logo, Link Navigasi, Tombol Masuk, Mobile Drawer yang aksesibel)
  - [x] Hero Section (Headline, Subtitle, CTA Reservasi/Menu & Cerita, Visual Card Halal Certified)
  - [x] Stats / Trust Banner (100% Sertifikasi Halal MUI, Single Origin Nusantara, Musholla Nyaman)
  - [x] About Section (Nilai Keberkahan, Kopi Halal & Thayyib, Ruang Tenang, Barista Bersertifikasi)
  - [x] Service Section (Artisan Coffee Bar, Halal Roastery & B2B Beans, Ruang Pertemuan/Kajian, Workshop Seduh)
  - [x] Berita/Post Section (Artikel dummy edukasi & catatan rasa)
  - [x] Contact Section (Detail kontak Kediri, jam operasional, form pesan, dan Google Maps Embed)
  - [x] Footer (Brand info, tautan navigasi, sosial media, sertifikasi halal)
  - [x] Responsif & aksesibilitas dicek (375px, 768px, 1280px)
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) + inisiasi tabel Google Spreadsheet
  - [x] Login & register dengan hashing password (Bcrypt) & sesi cookie aman (httpOnly)
  - [x] Role admin & user dengan proteksi server & middleware
  - [x] Dashboard: manajemen user, manajemen role, CRUD berita
  - [x] Upload media lokal (`public/uploads/`) & modul storage terisolasi
  - [x] Fitur ganti password administrator di dashboard
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan (Pemesanan menu & reservasi meja)
  - [x] Form pemesanan bertahap 3-step (`/pesan`)
  - [x] Integrasi ringkasan pesanan & kirim instan ke WhatsApp pemilik kafe
  - [x] Placeholder pembayaran QRIS
  - [x] Manajemen menu kafe di dashboard admin (`/dashboard/menu`)
  - [x] Manajemen riwayat pesanan di dashboard admin (`/dashboard/orders`)
  - [x] Dikonfirmasi pengguna
- [x] STEP 4 - Deploy & maintenance
  - [x] Persiapan build bersih (26 rute terkompilasi bebas error)
  - [x] Audit `.gitignore` (file sensitif dan local data terlindungi)
  - [x] Pembuatan log pemeliharaan (`documentation/MAINTENANCE.md`)
  - [x] Push ke repositori GitHub (`hirzailma/Cafe-Syar-i`)
  - [x] Konfigurasi Environment Variables & Deploy di Vercel
  - [x] Produksi live di URL: https://cafe-syar-i.vercel.app/
  - [x] Dikonfirmasi pengguna

---

## Catatan & Keputusan
- Menggunakan basis desain dari folder `cafe_syari_design` (tema *Serene Halal Artisan*).
- Gambar dummy dan logo disalin ke `public/images/`.
- Alamat Google Maps diarahkan ke lokasi aktual di Banjaran, Kota Kediri.

## Cara Menjalankan
1. `npm run dev`
2. Buka `http://localhost:3000` di browser.
