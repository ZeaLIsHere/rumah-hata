# Rumah Hata

**Rumah Hata** adalah platform pembelajaran terjemahan interaktif bahasa Indonesia &harr; Simalungun &harr; Aksara Batak Simalungun (*Surat Sisimolungun*) yang dilengkapi dengan **Lensa Linguistik** (fonologi, silabifikasi, morfologi, format interlinear Leipzig, dan catatan budaya).

Proyek ini hadir untuk menjawab tantangan sosial-budaya terkait melemahnya transmisi bahasa dan aksara daerah di Sumatera Utara. Melalui pendekatan mesin transliterasi berbasis aturan baku (*rule engine* deterministik) yang berpedoman pada standar Unicode Batak (U+1BC0–U+1BFF) dan Kamus Simalungun (Tarigan 1989), Rumah Hata menjamin keaslian dan akurasi linguistik tanpa bergantung pada tebakan acak kecerdasan buatan semata.

---

## Fitur Utama

- **Penerjemah Presisi & Alih Aksara**: Terjemahan dua arah (Indonesia &harr; Simalungun) dan alih aksara instan ke Surat Sisimolungun.
- **Lensa Linguistik Ilmiah**: Pemecahan suku kata (*syllabification*), penguraian morfem (akar kata dan afiks), format interlinear Leipzig, serta catatan ejaan fonotaktik.
- **Kamus Leksikon Baku**: Pencarian kosakata resmi, filter kelas kata, dan contoh kalimat berlandaskan kamus otoritatif.
- **Bagan Aksara Interaktif**: Pengenalan 19 huruf induk (*ina ni surat*) dan tanda diakritik (*anak ni surat*) dengan inspektur grafis Unicode.
- **Modul Belajar Bertahap & Kanvas Menulis**: Kurikulum 4 level dan kanvas latihan motorik goresan aksara interaktif (*touch* dan *mouse*).
- **Latihan & Kuis**: Evaluasi pemahaman dengan 10 soal acak berpenjelasan langsung.
- **Ekspor Kartu Aksara**: Cetak kartu aksara resolusi tinggi format PNG untuk dibagikan.
- **Dukungan Dark Mode**: Tampilan adaptif terang dan gelap dengan kontras tinggi standar WCAG AA.

---

## Panduan Instalasi

### Prasyarat Sistem
- **Node.js**: versi 18.18.0 atau lebih baru (direkomendasikan v20+)
- **pnpm**: versi 8 atau lebih baru (direkomendasikan pnpm v9/v12)
- **Git**

### Langkah Pemasangan

1. **Kloning Repositori**:
   ```bash
   git clone https://github.com/ZeaLIsHere/rumah-hata.git
   cd rumah-hata
   ```

2. **Pasang Dependensi**:
   ```bash
   pnpm install
   ```

3. **Kompilasi Paket Linguistik**:
   ```bash
   pnpm --filter @rumah-hata/linguistics build
   ```

---

## Cara Penggunaan (Usage)

### 1. Menjalankan Server Pengembangan Lokal
Jalankan perintah berikut untuk menyalakan web app di komputer lokal:

```bash
pnpm --filter @rumah-hata/web dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

### 2. Menguji Mesin Linguistik & Gold Set
Proyek ini dilengkapi 30 unit test otomatis untuk menjamin akurasi transliterasi aksara dan analisis morfologi:

```bash
pnpm test
```

*Contoh keluaran:*
```text
 ✓ test/gold-set.test.ts (30 tests) 13ms
   ✓ [gold-14-word-horas] horas -> Salam khas: ho (Ha+o) + ras (Ra+Sa+virama)
   ✓ [gold-15-word-hata] hata -> Kata hata (bahasa/kata): Ha + Ta
   ✓ Simalungun Morphology Suite > decomposes prefix mar- + simalungun
   ✓ Simalungun Morphology Suite > preserves numbers and special symbols

 Test Files  1 passed (1)
      Tests  30 passed (30)
```

### 3. Membangun untuk Produksi (Build)
Untuk mengompilasi seluruh rute statis dan fungsi produksi:

```bash
pnpm build
```

### 4. Konfigurasi Terjemahan AI Kalimat Bebas (Opsional)
Untuk mengaktifkan fitur penerjemah kalimat bebas dengan model AI berlandaskan kamus, buat berkas `.env.local` di folder `apps/web/`:

```env
# Gunakan kunci DeepSeek resmi atau OpenAI/OpenRouter
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
```

Pada deployment Vercel, masukkan variabel `DEEPSEEK_API_KEY` di menu **Project Settings &rarr; Environment Variables**.

---

## Struktur Proyek

```text
rumah-hata/
├── apps/
│   └── web/                   # Aplikasi antarmuka Next.js 15 (App Router, Tailwind CSS)
├── packages/
│   └── linguistics/           # Mesin aturan linguistik murni TypeScript (silabifikasi, transliterasi, morfologi)
├── data/
│   └── simalungun/            # Basis data kamus (lexicon.json, aksara-rules.json, gold-set.json, sources.json)
├── docs/                      # PRD, Architecture Decision Record (ADR), & Log Keputusan Linguistik
├── DESIGN.md                  # Panduan spesifikasi desain visual sistem
└── LICENSE                    # Lisensi perangkat lunak
```

---

## Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT License**. Lihat berkas [LICENSE](./LICENSE) untuk informasi hak cipta dan ketentuan penggunaan kode secara lengkap.
