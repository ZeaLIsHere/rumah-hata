# Keputusan Linguistik (Linguistic Decisions Log)

Dokumen ini mencatat keputusan linguistik, pemilihan karakter Unicode, serta aturan ejaan dan transliterasi Surat Batak Simalungun.

---

## LD-001: Pemilihan Karakter Virama (Panongonan vs Pangolat)
- **Status**: Diterima (Expert-aligned).
- **Keputusan**: Menggunakan `U+1BF3` (`BATAK PANONGONAN` / ᯳), bukan `U+1BF2` (`BATAK PANGOLAT`).
- **Alasan**: Standar Unicode dan penelitian Kozok (1999) menegaskan bahwa aksara Batak Simalungun menggunakan tanda pemati vokal khas yang disebut *panongonan* (`U+1BF3`), sedangkan *pangolat* (`U+1BF2`) digunakan untuk Toba dan Mandailing.
- **Sumber**: Unicode Standard v15.0 U+1BC0; Kozok (1999) *Warisan Leluhur*.
- **Validator**: Uli Kozok / Validator Pakar Bahasa Simalungun.

## LD-002: Karakter Vokal U pada Aksara Sa Simalungun
- **Status**: Diterima (Expert-aligned).
- **Keputusan**: Untuk suku kata `su` (aksara Sa `U+1BD9` + vokal `u`), wajib menggunakan tanda khusus `U+1BEF` (`BATAK VOWEL SIGN U FOR SIMALUNGUN SA` / ᯯ), bukan `U+1BEE`.
- **Alasan**: Bentuk ligatur dan diakritik /u/ pada aksara Sa memiliki anatomi tersendiri pada Surat Sisimolungun agar tidak membingungkan pembacaan.
- **Sumber**: Unicode Batak proposal N3320; Unicode Standard Batak block.
- **Validator**: Validator Pakar Bahasa Simalungun.

## LD-003: Representasi Fonem /k/ dan /h/
- **Status**: Diterima (Kamus & Ejaan Historis).
- **Keputusan**: Konsonan /h/ dan /k/ dipetakan ke aksara `U+1BC3` (`BATAK LETTER SIMALUNGUN HA` / ᯃ).
- **Alasan**: Dalam ortografi tradisional Surat Sisimolungun, huruf `ᯃ` merepresentasikan bunyi velar frikatif/plosif yang mencakup padanan /ha/ dan /ka/.
- **Sumber**: Kozok (1999); Unicode Standard NamesList U+1BC3.
- **Validator**: Validator Pakar Bahasa Simalungun.

## LD-004: Tanda Vokal Diftong /-ou/
- **Status**: Diterima (Pembeda Simalungun).
- **Keputusan**: Menggunakan `U+1BED` (`BATAK VOWEL SIGN KARO O` / ᯭ) untuk menandai vokal/diftong `-ou` (*hatulungan*).
- **Alasan**: Dalam dialektologi Batak, diftong /-ou/ adalah ciri fonologis distingtif Simalungun (mis. *pulou*, *sopou*). Diakritik *hatulungan* dienkode pada U+1BED.
- **Sumber**: Kozok (1999) Tabel Diakritik Surat Batak; Tarigan (1989).
- **Validator**: Validator Pakar Bahasa Simalungun.

## LD-005: Aksara Ta (Southern Ta U+1BD6)
- **Status**: Diterima.
- **Keputusan**: Menggunakan `U+1BD6` (`BATAK LETTER SOUTHERN TA` / ᯖ) untuk huruf Ta.
- **Alasan**: Bentuk grafem Ta di Simalungun mengikuti rumpun selatan (berbeda dari Northern Ta `U+1BD7` pada Karo/Pakpak).
- **Sumber**: Kozok (1999); Unicode Batak Table.
- **Validator**: Validator Pakar Bahasa Simalungun.
