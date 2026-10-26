# PRD — Rumah Hata (nama kerja)

> Rumah belajar terjemahan **Indonesia ⇄ Simalungun ⇄ Aksara Batak Simalungun** dengan sudut pandang linguistik.
> Sub tema: **Sosial dan Budaya** — ancaman hilangnya pemahaman dan ilmu kebahasaan/aksara daerah di Sumatera Utara.

Status: Draft v0.1 · Cakupan awal: **Simalungun** · Perluasan: Toba, Karo, Mandailing, Pakpak, Angkola (arsitektur harus siap)

---

## 1. Ringkasan

Rumah Hata adalah web app yang terasa seperti Google Translate (kotak input → hasil instan), tetapi setiap hasil disertai **Lensa Linguistik**: penjelasan *mengapa* sebuah kata ditulis/dibaca/dibentuk seperti itu (fonologi, silabifikasi, morfologi, glossing, kaidah aksara). Ada juga mode belajar bergaya aplikasi latihan (seperti Stimuler): latihan terstruktur, umpan balik, dan progres.

Pembeda utama:
1. **Penerjemah + penjelas**, bukan hanya penerjemah.
2. **Transliterasi aksara berbasis aturan (deterministik)**, bukan tebakan AI.
3. **Transparansi kepercayaan**: setiap hasil diberi label sumber dan tingkat validasi.
4. **Validasi komunitas**: penutur dan akademisi bisa mengoreksi data.

## 2. Latar Belakang dan Masalah

- Aksara dan bahasa daerah Sumatera Utara terancam karena transmisi antargenerasi melemah dan ruang pakainya menyempit.
- Materi belajar Aksara Simalungun tersebar, sebagian besar berupa dokumen statis, dan jarang menjelaskan kaidahnya secara sistematis.
- Alat terjemahan umum tidak mendukung Simalungun dan aksaranya dengan baik, dan model AI umum cenderung berhalusinasi pada bahasa sumber daya rendah.

> TODO tim: isi bagian ini dengan data dan rujukan terverifikasi (Balai Bahasa Provinsi Sumatera Utara, UNESCO, publikasi akademik, Universitas Simalungun, Museum Simalungun). **Jangan mencantumkan angka tanpa sumber.**

## 3. Tujuan dan Non-Tujuan

### Tujuan
- G1. Pengguna dapat menerjemahkan kata/frasa/kalimat pendek ID ⇄ Simalungun dan melihat hasilnya dalam Latin dan Aksara.
- G2. Setiap hasil dapat dijelaskan secara linguistik pada tingkat yang bisa dipahami pelajar.
- G3. Pengguna dapat belajar Aksara Simalungun secara bertahap (huruf → suku kata → kata → kalimat).
- G4. Data dan aturan terdokumentasi, bisa diuji, dan bisa diperluas ke bahasa Batak lain.

### Non-Tujuan (untuk fase awal)
- Bukan penerjemah dokumen panjang.
- Bukan pengganti ahli bahasa atau kamus resmi.
- Belum mencakup pengenalan suara/ucapan untuk Simalungun (butuh data audio penutur).
- Belum OCR aksara dari foto (masuk roadmap lanjutan).

## 4. Pengguna Sasaran

| Persona | Kebutuhan | Hal yang dihargai |
|---|---|---|
| **Pelajar/mahasiswa Simalungun diaspora** | Belajar kembali bahasa dan aksara leluhur | Mudah, tidak menghakimi, ada progres |
| **Guru muatan lokal** | Bahan ajar dan latihan siap pakai | Akurat, bisa dijelaskan di kelas |
| **Penutur/budayawan/peneliti** | Memvalidasi dan menambah data | Kontrol atas kebenaran, atribusi |
| **Masyarakat umum/wisatawan budaya** | Menulis nama/kalimat dalam aksara | Cepat, hasil bisa dibagikan |

## 5. Prinsip Produk

1. **Linguistic-first**: penjelasan adalah fitur inti, bukan tambahan.
2. **Deterministik dulu, AI kemudian**: transliterasi aksara dan analisis morfologi dasar dikerjakan mesin aturan. AI hanya untuk penjelasan natural-language dan terjemahan kalimat, dan selalu berlandaskan data kamus.
3. **Jujur soal ketidakpastian**: tampilkan label kepercayaan; lebih baik "belum tahu" daripada salah.
4. **Dapat diverifikasi**: setiap entri data punya sumber dan status validasi.
5. **Hormat budaya**: istilah adat/sakral diberi catatan konteks, bukan diterjemahkan sembarangan.

## 6. Fitur dan Prioritas (MoSCoW)

### Must Have (MVP)

**F1. Penerjemah Utama**
- Input teks, pilih arah: ID → SIM, SIM → ID, Latin SIM → Aksara.
- Output: terjemahan Latin, Aksara (font Unicode), tombol salin/bagikan sebagai gambar.
- Label sumber per kata: `kamus` / `frasa-baku` / `ai-berlandaskan-kamus` / `tidak-diketahui`.
- Acceptance: kata yang ada di kamus selalu diterjemahkan dari kamus, tidak dari AI.

**F2. Lensa Linguistik** (panel di bawah/samping hasil, tab)
- **Transliterasi**: langkah demi langkah Latin → aksara (pemisahan suku kata, pemetaan konsonan, tanda vokal/anak ni surat, penanda akhir suku kata).
- **Fonologi**: inventaris bunyi, silabifikasi, catatan pengucapan.
- **Morfologi**: segmentasi morfem (akar, afiks, reduplikasi) + fungsi.
- **Glossing**: format interlinear bergaya Leipzig (baris sumber · segmentasi · gloss · terjemahan bebas).
- **Catatan Budaya/Pragmatik**: tingkat tutur, istilah kekerabatan, konteks adat bila relevan.
- Acceptance: setiap tab menampilkan "belum tersedia untuk kata ini" bila data tidak ada, tidak mengarang.

**F3. Kamus**
- Pencarian dua arah, filter kelas kata, tampilkan lema, aksara, contoh kalimat, sumber, status validasi.

**F4. Belajar Aksara**
- Bagan interaktif huruf dasar (*ina ni surat*) dan tanda (*anak ni surat*): tekan untuk melihat bunyi, contoh kata, urutan goresan.
- Modul bertahap: huruf → suku kata → kata → kalimat.

**F5. Latihan dan Kuis**
- Jenis soal: baca aksara → pilih Latin; Latin → pilih aksara; susun suku kata; terjemahan pilihan ganda.
- Umpan balik **berpenjelasan linguistik** untuk jawaban salah.
- Progres lokal (tanpa login) pada MVP.

### Should Have
- F6. **Latihan menulis** di kanvas (tracing goresan, penilaian bentuk sederhana).
- F7. **Mode "Stimuler-like"**: sesi harian singkat, streak, ringkasan kesalahan umum.
- F8. **Kontribusi & validasi komunitas**: form usul kata/koreksi, antrean review oleh validator, riwayat perubahan.
- F9. Ekspor kartu/poster (nama dalam aksara) untuk dibagikan.

### Could Have
- F10. Dukungan audio penutur (rekaman terkurasi, bukan TTS).
- F11. Mode guru: buat set latihan, bagikan tautan.
- F12. Bahasa Batak lain (Toba/Karo/dst.) lewat paket data terpisah.

### Won't Have (sekarang)
- OCR aksara dari foto, pengenalan suara, akun sosial/feed.

## 7. Spesifikasi Lensa Linguistik

### 7.1 Skema keluaran analisis (kontrak antara engine dan UI)

```json
{
  "input": "string",
  "direction": "id-sim | sim-id | sim-aksara",
  "latin": "string",
  "aksara": "string",
  "translation": "string",
  "tokens": [
    {
      "surface": "string",
      "lemma": "string | null",
      "pos": "string | null",
      "gloss": "string | null",
      "syllables": ["string"],
      "morphemes": [{ "form": "string", "type": "root|prefix|suffix|infix|redup", "gloss": "string" }],
      "aksara": "string",
      "provenance": "dictionary | phrasebook | rule | ai-grounded | unknown",
      "validation": "unverified | community | expert",
      "sourceRefs": ["sourceId"]
    }
  ],
  "transliterationSteps": [
    { "step": 1, "rule": "ruleId", "input": "string", "output": "string", "explanation": "string" }
  ],
  "interlinear": { "source": "", "segmented": "", "gloss": "", "free": "" },
  "notes": [{ "kind": "culture|phonology|morphology|warning", "text": "string" }]
}
```

### 7.2 Aturan penting
- `transliterationSteps` wajib berasal dari **rule engine**, bukan LLM.
- `provenance = ai-grounded` hanya boleh bila ada rujukan kamus/frasa yang dilampirkan (`sourceRefs` tidak kosong).
- UI wajib menampilkan badge `provenance` dan `validation`.

## 8. Mesin Aksara (Aksara Engine)

- Berbasis **tabel aturan sebagai data** (JSON/YAML), bukan hard-code, agar bisa dikoreksi ahli tanpa mengubah kode dan bisa dipakai ulang untuk Toba/Karo/dst.
- Tahapan: normalisasi Latin → silabifikasi → pemetaan konsonan dasar → penerapan tanda vokal → penanganan konsonan akhir/penghilang vokal bawaan → normalisasi Unicode.
- Target Unicode: blok **Batak (U+1BC0–U+1BFF)**. Font harus mendukung blok ini; sediakan font bawaan di aplikasi (cek lisensi) agar tampil konsisten.
- **Gold set**: minimal 100 pasangan (Latin ⇄ aksara) yang divalidasi narasumber/ahli. Semua perubahan aturan wajib lolos tes gold set.
- Dua arah: Latin → Aksara (MVP), Aksara → Latin (Should Have).

> ⚠️ Kaidah spesifik Simalungun (inventaris huruf, tanda, penulisan konsonan akhir, varian ejaan) **harus bersumber dari referensi/ahli**, bukan diasumsikan dari aksara Batak lain. Catat semua keputusan di `docs/linguistic-decisions.md`.

## 9. Strategi Terjemahan

1. **Tingkat 1 — Kamus/frasa baku**: pencocokan tepat dan lematisasi sederhana.
2. **Tingkat 2 — Aturan morfologi**: analisis afiks untuk menemukan lema.
3. **Tingkat 3 — LLM berlandaskan kamus (RAG)**: untuk kalimat pendek, prompt memuat entri kamus relevan + contoh; keluaran dipaksa JSON; kata yang tidak dikenal ditandai `unknown`.
4. Setiap hasil Tingkat 3 diberi peringatan "perlu verifikasi" dan dapat dikirim ke antrean validasi.

## 10. Arsitektur dan Stack (usulan)

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind | Cepat, cocok vibecoding, mudah deploy |
| UI | shadcn/ui + font aksara Unicode | Konsisten dan mudah dikustom |
| Engine linguistik | Paket TypeScript murni di `packages/linguistics` (tanpa dependensi UI) | Bisa diuji dan dipakai ulang |
| Data | JSON/SQLite untuk MVP → Supabase/Postgres bila perlu kontribusi | Mulai sederhana |
| AI | Anthropic API via route server (key tidak pernah di klien) | Penjelasan dan terjemahan berlandaskan kamus |
| Tes | Vitest (engine + gold set), Playwright (alur utama) | Kualitas data adalah kunci |
| Deploy | Vercel | Cepat untuk demo |

Struktur direktori yang disarankan:

```
/apps/web                # Next.js
/packages/linguistics    # rule engine, tokenizer, morfologi, glossing
/data
  /simalungun
    lexicon.json         # lema, kelas kata, gloss, contoh, sumber
    phrasebook.json
    aksara-rules.json    # aturan transliterasi (data)
    gold-set.json        # pasangan uji tervalidasi
    sources.json         # daftar referensi
/docs
  PRD.md
  linguistic-decisions.md
/.agents/skills
```

## 11. Model Data Inti

- `LexiconEntry`: id, lemma, pos, glosses[id], examples[], morphology, aksara?, sourceIds[], validation, updatedAt.
- `Rule`: id, stage, pattern, output, explanation, sourceIds[], examples[].
- `Source`: id, title, author, year, type, url?, license.
- `Contribution`: id, type (add|edit|report), payload, status, reviewerId?, createdAt.
- `LearnerProgress` (lokal di MVP): itemId, attempts, lastResult, nextReviewAt.

## 12. Alur dan Halaman

1. **Beranda/Penerjemah** — kotak input dua panel + hasil + Lensa Linguistik.
2. **Belajar** — peta modul, bagan aksara interaktif.
3. **Latihan** — sesi singkat + ringkasan hasil.
4. **Kamus** — cari dan detail entri.
5. **Kontribusi** — usul/koreksi data (Should Have).
6. **Tentang & Sumber** — referensi, metodologi, kredit narasumber, disclaimer.

Panduan UX: mobile-first (mayoritas pengguna di ponsel), aksara ditampilkan besar dan jelas, kontras tinggi, tidak ada paywall untuk fitur inti.

## 13. Metrik Keberhasilan

- Akurasi transliterasi pada gold set: **100%** untuk kasus yang tercakup aturan.
- Cakupan kamus: jumlah lema tervalidasi (target ditetapkan setelah audit sumber).
- % hasil dengan `provenance` jelas: 100%.
- Penyelesaian modul belajar pertama, retensi hari ke-7 pada uji pengguna.
- Skor pemahaman pra/pasca uji kecil dengan pelajar (kualitatif + kuantitatif).

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data kamus terbatas | Terjemahan sering "unknown" | Mulai dari kosakata dasar + frasa umum; fitur kontribusi |
| Kaidah aksara salah | Merusak kepercayaan dan menyesatkan | Aturan sebagai data, gold set, validasi ahli, catatan keputusan |
| Halusinasi AI | Terjemahan keliru | AI hanya berlandaskan kamus, label kepercayaan, bisa dilaporkan |
| Hak cipta sumber kamus | Masalah hukum | Catat lisensi, minta izin penerbit/penulis, gunakan sumber terbuka |
| Font aksara tidak tampil | Pengalaman rusak | Sertakan font sendiri, uji lintas perangkat |
| Sensitivitas budaya | Salah konteks | Catatan budaya, libatkan budayawan/penutur sebagai reviewer |

## 15. Roadmap

- **Fase 0 — Fondasi**: kumpulkan sumber, tetapkan kaidah aksara, buat gold set awal, setup repo dan skills.
- **Fase 1 — MVP**: F1–F5 untuk kosakata dasar + frasa umum.
- **Fase 2**: F6–F9 (menulis, sesi harian, kontribusi, ekspor).
- **Fase 3**: audio penutur, mode guru, bahasa Batak lain.

## 16. Pemetaan ke Penilaian

> TODO: sesuaikan dengan rubrik resmi lomba. Pemetaan awal:

| Kriteria umum | Dijawab oleh |
|---|---|
| Relevansi tema Sosial-Budaya | Fokus pelestarian bahasa dan aksara Sumut (Simalungun) |
| Dampak sosial | Pelajar, guru, diaspora; kontribusi komunitas |
| Inovasi | Penerjemah + Lensa Linguistik + transliterasi deterministik + label kepercayaan |
| Kelayakan teknis | Arsitektur modular, gold set, tes otomatis |
| Keberlanjutan | Data berbasis aturan, perluasan ke bahasa Batak lain, validasi komunitas |
| Kualitas demo | Alur penerjemah → penjelasan → latihan dalam satu sesi |

## 17. Pertanyaan Terbuka

1. Siapa narasumber/validator (dosen, budayawan, penutur) yang bisa dilibatkan?
2. Sumber kamus dan ejaan Simalungun mana yang dijadikan rujukan utama, dan bagaimana lisensinya?
3. Varian ejaan/dialek mana yang dijadikan standar awal?
4. Rubrik resmi penilaian dan format deliverable (demo, video, dokumen)?
5. Nama produk final dan identitas visual?
