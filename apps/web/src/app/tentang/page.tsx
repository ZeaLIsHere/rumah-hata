import { simalungunSources } from "@/lib/data";
import { BookOpen, Scale } from "lucide-react";

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
    <div className="py-8 sm:py-16 px-3.5 sm:px-6 max-w-5xl mx-auto space-y-10 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <h1 className="text-[28px] sm:text-[40px] lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
          Kaidah & Metodologi
        </h1>
        <p className="text-[14px] sm:text-[17px] text-[#7a7a7a] dark:text-[#a1a1a6]">
          Setiap transliterasi dan leksikon berlandaskan sumber kepustakaan resmi.
        </p>
      </div>

      {/* Rujukan Pustaka Grid */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-2.5">
          <BookOpen className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
          <h2 className="text-[18px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white">Rujukan Kepustakaan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {simalungunSources.map((src: any) => (
            <div
              key={src.id}
              className="p-4 sm:p-6 bg-[#f5f5f7] dark:bg-[#161617] rounded-[16px] sm:rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] space-y-2.5 flex flex-col justify-between transition-colors duration-200"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-[#272729] text-[#7a7a7a] border border-black/[0.04] dark:border-white/[0.06]">
                  {src.type} &middot; {src.year}
                </span>
                <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#1d1d1f] dark:text-white leading-snug">{src.title}</h3>
                <p className="text-[12px] sm:text-[13px] text-[#7a7a7a]">Penulis: {src.author}</p>
                {src.publisher && <p className="text-[12px] sm:text-[13px] text-[#7a7a7a]">Penerbit: {src.publisher}</p>}
                <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] pt-1 leading-relaxed">{src.notes}</p>
              </div>
              <div className="pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] text-[11px] sm:text-[12px] text-[#7a7a7a] flex justify-between items-center">
                <span>Lisensi: {src.license}</span>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0066cc] dark:text-[#2997ff] hover:underline font-normal inline-flex items-center gap-1"
                  >
                    <span>Dokumen</span>
                    <span>&rarr;</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rekam Keputusan Ortografi */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-2.5">
          <Scale className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
          <h2 className="text-[18px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white">Keputusan Ortografi</h2>
        </div>

        <div className="space-y-3.5">
          {decisions.map((dec) => (
            <div key={dec.id} className="p-4 sm:p-6 bg-[#f5f5f7] dark:bg-[#161617] rounded-[16px] sm:rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] space-y-2 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-white rounded-full border border-black/[0.04] dark:border-white/[0.06]">
                  {dec.id}
                </span>
                <span className="text-[11px] sm:text-[12px] text-[#0066cc] dark:text-[#2997ff] font-medium">Baku</span>
              </div>
              <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#1d1d1f] dark:text-white">{dec.topic}</h3>
              <div className="text-[13px] sm:text-[14px] text-[#1d1d1f] dark:text-white bg-white dark:bg-[#272729] p-2.5 sm:p-3 rounded-[12px] border border-black/[0.04] dark:border-white/[0.06]">
                Keputusan: {dec.decision}
              </div>
              <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                {dec.rationale}
              </p>
              <div className="text-[11px] sm:text-[12px] text-[#7a7a7a] font-mono pt-0.5">
                Rujukan: {dec.source}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
