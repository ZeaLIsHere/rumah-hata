import { simalungunSources } from "@/lib/data";
import { BookOpen, ShieldCheck, Scale, FileText } from "lucide-react";

export default function TentangPage() {
  const decisions = [
    {
      id: "LD-001",
      topic: "Pemilihan Karakter Virama (Panongonan vs Pangolat)",
      decision: "Menggunakan U+1BF3 (BATAK PANONGONAN / ᯳), bukan U+1BF2 (PANGOLAT).",
      rationale:
        "Standar Unicode dan penelitian Kozok (1999) menegaskan bahwa Surat Sisimolungun memiliki tanda pemati vokal tersendiri bernama panongonan, berbeda dari pangolat Toba.",
      source: "Unicode Standard v15.0; Kozok (1999)"
    },
    {
      id: "LD-002",
      topic: "Vokal U Khusus pada Aksara Sa (ᯙ)",
      decision: "Suku kata 'su' wajib menggunakan U+1BEF (BATAK VOWEL SIGN U FOR SIMALUNGUN SA / ᯯ).",
      rationale:
        "Bentuk anatomis diakritik /u/ pada aksara Sa memiliki varian khusus dalam ortografi naskah Simalungun agar tidak membingungkan pembacaan grafis.",
      source: "Unicode Batak Proposal N3320"
    },
    {
      id: "LD-003",
      topic: "Representasi Fonem /k/ dan /h/",
      decision: "Konsonan /h/ dan /k/ dipetakan ke aksara U+1BC3 (ᯃ).",
      rationale:
        "Dalam ortografi tradisional Surat Sisimolungun, huruf ᯃ merepresentasikan bunyi velar frikatif/plosif yang mencakup bunyi /ha/ dan /ka/.",
      source: "Kozok (1999); Unicode Standard NamesList"
    },
    {
      id: "LD-004",
      topic: "Tanda Diftong Khas Simalungun /-ou/",
      decision: "Menggunakan U+1BED (BATAK VOWEL SIGN KARO O / ᯭ) untuk diftong -ou (hatulungan).",
      rationale:
        "Diftong /-ou/ adalah ciri fonologis distingtif Simalungun (mis. pulou, sopou). Diakritik hatulungan dienkode pada kode U+1BED.",
      source: "Kozok (1999); Tarigan (1989)"
    },
    {
      id: "LD-005",
      topic: "Aksara Ta Simalungun",
      decision: "Menggunakan U+1BD6 (BATAK LETTER SOUTHERN TA / ᯖ).",
      rationale:
        "Bentuk grafem Ta di Simalungun mengikuti rumpun selatan, berbeda dari Northern Ta (U+1BD7) pada Karo/Pakpak.",
      source: "Kozok (1999); Unicode Batak Table"
    }
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1b]">
          <ShieldCheck className="w-4 h-4" />
          <span>Transparansi & Metodologi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Sumber Rujukan & Kaidah Bahasa
        </h1>
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl">
          Rumah Hata dibangun atas prinsip kejujuran ilmiah: akurasi kebahasaan diutamakan,
          dan setiap kata terhubung dengan kamus dan sumber rujukan yang jelas.
        </p>
      </div>

      {/* Rujukan Pustaka */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <BookOpen className="w-5 h-5 text-[#8b1e1b]" />
          <h2 className="text-xl font-bold text-stone-900">Landasan Rujukan Pustaka</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simalungunSources.map((src: any) => (
            <div
              key={src.id}
              className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                  {src.type} &middot; {src.year}
                </span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">{src.title}</h3>
                <p className="text-xs text-stone-700">Penulis / Institusi: {src.author}</p>
                {src.publisher && <p className="text-xs text-stone-700">Penerbit: {src.publisher}</p>}
                <p className="text-xs text-stone-700 pt-1 leading-relaxed">{src.notes}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-700 flex justify-between items-center">
                <span>Lisensi: {src.license}</span>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8b1e1b] hover:underline font-medium"
                  >
                    Dokumen &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rekam Keputusan Linguistik (Linguistic Decisions Log) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <Scale className="w-5 h-5 text-[#8b1e1b]" />
          <h2 className="text-xl font-bold text-stone-900">Catatan Kaidah Ejaan & Aksara</h2>
        </div>
        <p className="text-sm text-stone-700">
          Setiap pilihan karakter dan kaidah ortografi Batak Simalungun dicatat secara terbuka
          bersama sumber rujukannya untuk memastikan keaslian tulisan.
        </p>

        <div className="space-y-3">
          {decisions.map((dec) => (
            <div key={dec.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-100 text-stone-800 rounded border border-stone-200">
                  {dec.id}
                </span>
                <span className="text-xs text-emerald-800 font-medium">Status: Terverifikasi Baku</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{dec.topic}</h3>
              <div className="text-xs sm:text-sm text-stone-800 font-semibold bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                Keputusan: {dec.decision}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="font-semibold text-stone-800">Alasan: </span>
                {dec.rationale}
              </p>
              <div className="text-[11px] text-stone-700 font-mono pt-1">
                Rujukan: {dec.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Komitmen Budaya & Pernyataan Sikap */}
      <section className="p-6 bg-stone-900 text-stone-100 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <FileText className="w-4 h-4" />
          <span>Pernyataan Etika & Penghormatan Budaya</span>
        </div>
        <p className="text-sm text-stone-300 leading-relaxed">
          Bahasa dan Aksara Batak Simalungun adalah warisan peradaban leluhur yang sarat nilai spiritual dan adat.
          Platform ini tidak mengarang kaidah, tidak menyamakan varian antar-etnis Batak tanpa bukti,
          dan selalu mencantumkan penanda ketidakpastian apabila sebuah kata belum divalidasi oleh pakar atau penutur asli.
        </p>
        <p className="text-xs text-stone-400 italic">
          Bila menemukan kekeliruan ortografi atau leksikon, pembaca dipersilakan melaporkan catatan perbaikan
          melalui repositori proyek atau forum pengkaji budaya Batak.
        </p>
      </section>
    </div>
  );
}
