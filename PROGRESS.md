# PROGRESS.md — Status Perkembangan Rumah Hata

Dokumen ini mencatat status implementasi fitur, kemajuan teknis, serta panduan bagian mana yang sudah selesai dan bagian mana yang perlu dilanjutkan.

> **Catatan untuk Agen Coding**: Periksa file ini sebelum memulai pekerjaan agar memahami konteks fitur yang sudah ada dan menghindari duplikasi kerja.

---

## 1. Ringkasan Status Proyek

- **Status Rilis**: MVP Siap Demo & Ter-deploy di Vercel (Produksi).
- **Arsitektur**: Monorepo pnpm (`apps/web` + `packages/linguistics`).
- **Desain**: Mengikuti `DESIGN.md` (Apple Design System: tipografi SF Pro/Inter, tombol kapsul, kartu utilitas 18px, kontras tinggi).
- **Dukungan Perangkat**: Responsif penuh dari 320px (ponsel kecil) hingga layar desktop lebar, tanpa overflow horizontal.
- **Tema**: Light Mode & Dark Mode adaptif (WCAG AA).
- **Pengujian**: 30/30 unit test Vitest lulus (Gold Set transliterasi aksara & dekomposisi morfologi).

---

## 2. Fitur yang Sudah Selesai (Completed)

| Fitur | Deskripsi | Berkas Terkait |
|---|---|---|
| **F1. Penerjemah Presisi** | Terjemahan 2 arah (Indonesia ⇄ Simalungun) dan alih aksara instan. Tampilan kartu terjemahan minimalis modern, pemilih bahasa dropdown terintegrasi di atas, input awal bersih tanpa placeholder mengganggu, dan passthrough angka/simbol (`123`, `!@#$%`). Arah default: Indonesia &rarr; Simalungun. | `apps/web/src/components/Translator.tsx` |
| **F2. Lensa Linguistik** | 4 tab bedah ilmiah terbuka: (1) Transliterasi Bertahap (2 kartu/baris di mobile), (2) Fonologi & Silabifikasi, (3) Morfologi & Leipzig Glossing, (4) Konteks Budaya & Rujukan. | `apps/web/src/components/Translator.tsx`, `packages/linguistics/src/dictionary.ts` |
| **F3. Kamus Leksikon Baku** | Pencarian 2 arah (Simalungun ⇄ Indonesia), filter kelas kata adaptif (dropdown di mobile, pil di desktop), 30+ lema kosakata umum harian dan adat bersumber dari Kamus Tarigan (1989). | `apps/web/src/app/kamus/page.tsx`, `data/simalungun/lexicon.json` |
| **F4. Belajar Aksara** | Bagan interaktif 19 huruf induk (*ina ni surat*) dan tanda diakritik (*anak ni surat*) dengan inspektur grafis Unicode, serta kurikulum pembelajaran bertahap 4 level. | `apps/web/src/app/belajar/page.tsx`, `data/simalungun/aksara-rules.json` |
| **F5. Latihan & Kuis Interaktif** | 10 soal evaluasi acak (membaca aksara, ejaan, budaya), opsi jawaban seimbang A-D dengan lencana huruf, algoritma acak Fisher-Yates saat ulangi kuis, dan umpan balik langsung. | `apps/web/src/app/latihan/page.tsx` |
| **F6. Kanvas Tracing Menulis Aksara** | Kanvas interaktif (mouse & touch) adaptif ukuran layar (320px+). Evaluasi berbasis piksel nyata (IoU & presisi 100x100 grid): menghitung kelengkapan goresan, kerapian garis, dan penalti coretan acak. | `apps/web/src/components/WritingCanvas.tsx` |
| **F9. Ekspor Kartu Aksara** | Modal ekspor kartu resolusi tinggi (1000x600 px) berbasis HTML5 Canvas 2D dengan bingkai motif Batak, teks aksara, terjemahan Latin, dan semboyan *Habonaron Do Bona*, siap unduh format PNG. | `apps/web/src/components/CardExportModal.tsx` |
| **Tingkat 3 AI Grounded Translation** | Endpoint server `/api/translate` dengan auto-deteksi penyedia (DeepSeek, OpenAI, OpenRouter) yang menyuntikkan leksikon baku sebagai acuan pagar halusinasi. Tombol aksi "AI" terpasang di kotak hasil terjemahan. | `apps/web/src/app/api/translate/route.ts` |
| **Branding & Navigasi Mobile** | Logo vektor atap rumah "RH" bernuansa gorga Batak di navbar, footer, dan tab browser (`public/icon.svg`). Navigasi mobile menggunakan Fullscreen Animated Hamburger Drawer (`animate-slideDown`). | `apps/web/src/components/Navbar.tsx`, `apps/web/src/components/Footer.tsx`, `apps/web/public/logo.svg` |
| **Kartu Fitur Berilustrasi** | Tiga kartu di beranda dilengkapi ilustrasi bergradien halus (`ilustrasi_alih_aksara.webp`, `ilustrasi_lensa_linguistik.webp`, `ilustrasi_latihan_mandiri.webp`) dengan animasi zoom saat kursor diarahkan (*hover*). | `apps/web/src/app/page.tsx`, `apps/web/public/*.webp` |

---

## 3. Fitur yang Sedang Berjalan (In Progress)

### A. Fitur F7: Mode Sesi Harian ("Stimuler-like")
- **Bagian yang sudah selesai**:
  - Modul kuis 10 soal dengan penilaian persentase skor akhir.
  - Penjelasan ilmiah instan untuk tiap jawaban salah.
  - Kanvas latihan motorik goresan aksara dengan skor akurasi.
- **Bagian yang harus dilanjutkan**:
  - Penyimpanan progres harian lokal (*streak* hari berturut-turut di `localStorage`).
  - Rekam jejak bank kesalahan: mengumpulkan soal-soal atau huruf yang salah digoreskan pengguna agar bisa diulang khusus di sesi berikutnya.
  - Pengingat target latihan harian singkat (mis. target 5 menit per hari).

### B. Fitur F8: Kontribusi & Validasi Komunitas
- **Bagian yang sudah selesai**:
  - Halaman `/kontribusi` dengan formulir pengusulan kata baru lengkap (lema Latin, pratinjau aksara otomatis, arti Indonesia, kelas kata, contoh kalimat, dan sumber rujukan).
  - Antrean lokal penyimpanan usulan berstatus `unverified`.
  - Fitur ekspor berkas JSON usulan kata untuk dikirim ke tim pengembang.
- **Bagian yang harus dilanjutkan**:
  - Antarmuka peninjau (*reviewer dashboard*) khusus bagi validator ahli/penutur asli untuk mengubah status `unverified` menjadi `community` atau `expert`.
  - Integrasi backend penyimpanan cloud (mis. Supabase / PostgreSQL) agar usulan dari berbagai pengguna dapat terkumpul di satu database terpusat (saat ini masih tersimpan lokal di browser masing-masing).
  - Fitur voting/dukungan komunitas terhadap usulan kata yang masuk.

---

## 4. Rencana Kerja Selanjutnya (Next Roadmap)

1. **F10. Audio Penutur Asli**:
   - Perekaman dan kurasi berkas audio pelafalan fonem aksara dan lema dasar dari penutur asli Simalungun (bukan Text-to-Speech sintetis).
   - Tombol putar audio di bagan huruf dan detail leksikon kamus.
2. **Perluasan Basis Data Leksikon**:
   - Menambah jumlah lema tervalidasi dari Kamus Tarigan 1989 hingga mencapai target &ge; 100 lema dasar pada kamus lokal.
   - Menambah cakupan pengujian otomatis `gold-set.json` dari 25 kasus ke target 100 pasangan uji.
3. **F11. Mode Guru & Set Bahan Ajar**:
   - Fitur bagi guru muatan lokal untuk membuat set kuis atau daftar kata khusus dan membagikan tautannya ke murid.
4. **F12. Arsitektur Multi-Bahasa Batak**:
   - Memisahkan paket aturan aksara agar siap menerima modul dialek Batak lain (Toba, Karo, Mandailing, Pakpak, Angkola) melalui paket data terpisah di `data/<bahasa>/`.

---

## 5. Panduan untuk Pengembang & Agen AI

1. **Sebelum Menulis Kode**:
   - Baca `PROGRESS.md` untuk mengetahui fitur mana yang sudah selesai agar tidak menimpa kode yang sudah berjalan baik.
   - Baca `PRD.md` dan `AGENT.md` untuk aturan kepatuhan linguistik dan konvensi proyek.
2. **Setelah Menyelesaikan Pekerjaan**:
   - Jalankan `pnpm typecheck` dan `pnpm test`.
   - Perbarui catatan di `PROGRESS.md` sesuai perubahan yang telah dikerjakan.
   - Lakukan commit dengan format konvensional `feat(...)`, `fix(...)`, `docs(...)`, atau `style(...)`.
