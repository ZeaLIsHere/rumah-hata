"use client";

import { useState, useMemo } from "react";
import { simalungunLexicon } from "@/lib/data";
import { Search, BookOpen, Tag, CheckCircle2, AlertCircle } from "lucide-react";

export default function KamusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPos, setSelectedPos] = useState("all");

  const posOptions = [
    { value: "all", label: "Semua Kelas Kata" },
    { value: "noun", label: "Nomina (Kata Benda)" },
    { value: "verb", label: "Verba (Kata Kerja)" },
    { value: "adj", label: "Adjektiva (Kata Sifat)" },
    { value: "pron", label: "Pronomina (Kata Ganti)" },
    { value: "phrase", label: "Frasa / Ungkapan" },
    { value: "intj", label: "Interjeksi (Kata Seru)" }
  ];

  const filteredEntries = useMemo(() => {
    return simalungunLexicon.filter((entry) => {
      const matchSearch =
        entry.lemma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.glosses.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPos = selectedPos === "all" || entry.pos === selectedPos;

      return matchSearch && matchPos;
    });
  }, [searchTerm, selectedPos]);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1b]">
          <BookOpen className="w-4 h-4" />
          <span>Kamus Leksikon Baku</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Kamus Bahasa Simalungun: Indonesia
        </h1>
        <p className="text-stone-700 text-sm sm:text-base max-w-3xl">
          Koleksi kosakata terverifikasi bersumber dari Kamus Simalungun: Indonesia (Tarigan 1989).
          Setiap entri dilengkapi alih aksara Surat Sisimolungun, kelas kata, dan contoh penggunaan kontekstual.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari lema Simalungun atau arti dalam Bahasa Indonesia..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#8b1e1b] focus:ring-1 focus:ring-[#8b1e1b] transition"
          />
        </div>

        {/* POS Selector */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-stone-400 hidden sm:block" />
          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-[#8b1e1b]"
          >
            {posOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count and Status Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-700">
        <span>Menampilkan {filteredEntries.length} entri leksikon tervalidasi</span>
        <span className="flex items-center gap-1 text-emerald-800 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Status: Validasi Pakar (Expert Verified)</span>
        </span>
      </div>

      {/* Entry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs hover:border-[#8b1e1b]/40 hover:shadow-xs transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header: Lemma, Aksara, and POS */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 capitalize">{entry.lemma}</h3>
                  <div className="font-aksara text-2xl text-[#8b1e1b] tracking-wider pt-0.5">
                    {entry.aksara}
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                  {entry.pos}
                </span>
              </div>

              {/* Glosses */}
              <div>
                <span className="text-xs text-stone-700 font-medium block mb-1">Arti Indonesia:</span>
                <p className="text-sm font-semibold text-stone-800">
                  {entry.glosses.join(", ")}
                </p>
              </div>

              {/* Cultural Context if available */}
              {entry.culturalNote && (
                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-0.5">Konteks Adat:</span>
                  {entry.culturalNote}
                </div>
              )}

              {/* Examples */}
              {entry.examples && entry.examples.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <span className="text-xs text-stone-700 font-medium">Contoh Kalimat:</span>
                  <div className="text-xs space-y-0.5">
                    <p className="font-medium text-stone-900">{entry.examples[0].simalungun}</p>
                    <p className="font-aksara text-base text-stone-700">{entry.examples[0].aksara}</p>
                    <p className="text-stone-700 italic">&ldquo;{entry.examples[0].indonesian}&rdquo;</p>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer: Metadata and Source Reference */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-700">
              <span className="font-mono">Sumber: {entry.sourceIds.join(", ")}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                {entry.validation}
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="text-base font-bold text-stone-800">Tidak ada lema yang cocok</h4>
          <p className="text-xs text-stone-700 max-w-sm mx-auto">
            Kata yang Anda cari belum tersedia pada rujukan kamus dasar versi ini.
            Fitur usulan kontribusi komunitas akan dibuka pada fase berikutnya.
          </p>
        </div>
      )}
    </div>
  );
}
