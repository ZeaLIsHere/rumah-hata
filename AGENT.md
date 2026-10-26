# AGENT.md — Panduan Kerja untuk Agen Coding

Proyek: **Rumah Hata** — rumah belajar terjemahan Indonesia ⇄ Simalungun ⇄ Aksara Batak Simalungun, dengan Lensa Linguistik.
Sumber kebenaran produk: [`PRD.md`](./PRD.md). Jika instruksi pengguna bertentangan dengan PRD, tanyakan dulu atau catat sebagai keputusan baru di `docs/decisions.md`.

---

## 0. Aturan Skills (WAJIB, baca dulu)

Proyek ini memiliki skills di **`.agents/skills/`** (di root proyek). Setiap skill adalah folder berisi `SKILL.md`.

1. **Sebelum memulai tugas apa pun** (menulis kode, membuat file, mengubah desain, menulis tes), lihat isi `.agents/skills/` dan baca `SKILL.md` dari **setiap skill yang relevan** dengan tugas. Beberapa skill bisa berlaku sekaligus.
2. Skill yang relevan harus dibaca **sebelum** menulis kode, bukan setelahnya.
3. Jika skill bertentangan dengan pengetahuan umum Anda, **ikuti skill**. Jika skill bertentangan dengan `PRD.md` atau aturan di file ini, hentikan dan tanyakan.
4. Jangan mengubah, menghapus, atau menimpa isi `.agents/skills/` kecuali diminta secara eksplisit.
5. Jika tidak ada skill yang cocok, sebutkan itu singkat di awal pekerjaan ("tidak ada skill relevan") lalu lanjut dengan aturan di file ini.
6. Di awal setiap tugas besar, sebutkan skill mana yang dibaca (satu baris).
7. Jika skill menyebut file/skrip pendukung (`scripts/`, `references/`, `assets/`), gunakan sesuai petunjuknya, jangan menulis ulang dari nol.

Panduan pemetaan cepat (sesuaikan dengan skill yang benar-benar ada):

| Jenis tugas | Cari skill tentang |
|---|---|
| Membuat/merombak UI, komponen, halaman | desain frontend, UI, Tailwind, komponen |
| Menulis tes | testing, Vitest, Playwright |
| Bekerja dengan API Claude/Anthropic | SDK, prompt, tool use |
| Git, commit, PR | git, commit convention |
| Dokumen/ekspor (PDF, DOCX, dll.) | format file yang bersangkutan |

---

## 1. Prinsip Utama

1. **Akurasi linguistik di atas fitur.** Lebih baik menampilkan "belum tersedia" daripada data/aturan yang dikarang.
2. **Deterministik dulu, AI kemudian.** Transliterasi aksara dan segmentasi dasar dikerjakan rule engine. LLM hanya untuk penjelasan natural-language dan terjemahan kalimat, selalu berlandaskan data kamus.
3. **Transparansi.** Setiap hasil membawa `provenance` dan `validation` (lihat PRD §7).
4. **Mulai kecil, tuntas, bisa didemokan.** Utamakan alur: terjemah → Lensa Linguistik → latihan.
5. **Hormat budaya.** Jangan menyederhanakan istilah adat/sakral tanpa catatan konteks.

## 2. Aturan Data dan Linguistik (kritis)

- **Dilarang mengarang** kosakata, kaidah aksara, afiks, atau contoh kalimat Simalungun. Jika tidak ada di `data/simalungun/*` atau sumber di `sources.json`, tandai `unknown` / `TODO-VALIDASI`.
- Jangan menyamakan aturan Simalungun dengan Toba/Karo/Mandailing/Pakpak/Angkola tanpa sumber. Perbedaan antarvarian adalah fakta linguistik, bukan bug.
- Aturan transliterasi disimpan sebagai **data** (`data/simalungun/aksara-rules.json`), bukan hard-code di komponen UI.
- Setiap perubahan aturan atau data **wajib** lolos `gold-set.json` (tes otomatis). Jangan mengubah gold set untuk membuat tes lulus; gold set hanya diubah oleh validator manusia.
- Setiap entri baru wajib punya `sourceIds` dan `validation` (`unverified | community | expert`). Entri buatan AI selalu `unverified`.
- Keputusan linguistik yang ambigu dicatat di `docs/linguistic-decisions.md` (apa, alasan, sumber, siapa yang perlu memvalidasi).
- Output AI yang berisi bahasa Simalungun harus: berlandaskan entri kamus yang dilampirkan, berformat JSON sesuai skema PRD §7.1, dan menandai kata tak dikenal sebagai `unknown`.
- Gunakan Unicode blok Batak (U+1BC0–U+1BFF) untuk aksara. Jangan memakai gambar sebagai pengganti teks aksara kecuali untuk fitur ekspor.

## 3. Stack dan Struktur

- Next.js (App Router) + TypeScript (strict) + Tailwind + shadcn/ui.
- Logika linguistik di `packages/linguistics` (murni TypeScript, **tanpa** impor React/Next).
- Data di `data/<bahasa>/`.
- Tes: Vitest (engine) dan Playwright (alur utama).
- Kunci API hanya di server (`.env.local`, route handler). **Jangan pernah** memanggil API LLM langsung dari komponen klien dan jangan commit rahasia.

```
apps/web              # UI
packages/linguistics  # engine: normalisasi, silabifikasi, transliterasi, morfologi, glossing
data/simalungun       # lexicon, phrasebook, aksara-rules, gold-set, sources
docs/                 # PRD, keputusan, catatan linguistik
.agents/skills/       # skills (lihat bagian 0)
```

## 4. Konvensi Kode

- TypeScript strict; hindari `any`. Tipe skema (PRD §7.1) didefinisikan sekali di `packages/linguistics/src/types.ts` dan dipakai ulang.
- Fungsi engine harus **murni** dan bisa diuji tanpa jaringan.
- Komponen kecil dan terfokus; logika bisnis tidak ditaruh di komponen.
- Penamaan: kode dalam bahasa Inggris; teks UI dalam Bahasa Indonesia (siapkan struktur i18n sederhana); istilah linguistik memakai istilah baku Indonesia dengan padanan Inggris di komentar bila perlu.
- Semua teks aksara dirender dengan font yang disertakan proyek; sediakan fallback dan uji tampilan.
- Aksesibilitas: kontras cukup, ukuran aksara besar, semua kontrol bisa diakses keyboard, `lang` yang benar pada elemen.
- Mobile-first: uji pada lebar ~375px sebelum menyatakan UI selesai.

## 5. Alur Kerja Tugas

1. Baca `PRD.md` bagian terkait dan skill yang relevan (§0).
2. Nyatakan rencana singkat (3–6 poin) sebelum mengubah banyak file.
3. Kerjakan dalam langkah kecil; satu perubahan = satu tujuan.
4. Tulis/ubah tes bersamaan dengan kode, terutama untuk engine linguistik.
5. Jalankan `lint`, `typecheck`, dan tes sebelum menyatakan selesai.
6. Laporkan: apa yang berubah, apa yang diuji, apa yang **belum** divalidasi, dan pertanyaan terbuka.

Jika permintaan ambigu secara linguistik (bukan teknis), **tanya**, jangan menebak.

## 6. Definition of Done

- [ ] Sesuai PRD dan acceptance criteria fitur terkait.
- [ ] Skill relevan sudah dibaca dan diikuti.
- [ ] Lint, typecheck, dan tes lulus (termasuk gold set bila menyentuh engine/data).
- [ ] Tidak ada data linguistik tanpa sumber/status validasi.
- [ ] Badge `provenance`/`validation` tampil di UI yang menampilkan hasil.
- [ ] Tampilan mobile dan aksara sudah dicek.
- [ ] Tidak ada rahasia/API key di kode atau commit.
- [ ] Perubahan penting dicatat (`docs/decisions.md` atau `docs/linguistic-decisions.md`).

## 7. Git dan Commit

- Commit kecil dan bermakna, format `type(scope): ringkasan` (mis. `feat(engine): tambah silabifikasi`, `data(lexicon): tambah 20 lema dasar`).
- Perubahan data linguistik dipisah dari perubahan kode.
- Jangan force-push atau menghapus riwayat tanpa diminta.

## 8. Yang Tidak Boleh Dilakukan

- Mengarang data/kaidah bahasa atau menyatakan sesuatu "benar" tanpa sumber.
- Mengganti rule engine dengan panggilan LLM untuk transliterasi.
- Menambah dependensi besar tanpa alasan; jelaskan bila perlu.
- Menyalin teks kamus/buku berhak cipta ke repo tanpa izin dan lisensi yang jelas.
- Mengubah `.agents/skills/` atau gold set tanpa instruksi eksplisit.
- Menyimpan atau meminta data pribadi pengguna di MVP (progres cukup lokal).

## 9. Saat Ragu

Prioritaskan: **(1) kebenaran linguistik → (2) kejelasan bagi pembelajar → (3) kesederhanaan teknis → (4) kecepatan.** Jika masih ragu, berhenti dan tanyakan.
