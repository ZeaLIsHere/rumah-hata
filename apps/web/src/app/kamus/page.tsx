"use client";

import { useState, useMemo } from "react";
import { simalungunLexicon } from "@/lib/data";
import { Search, BookOpen, AlertCircle } from "lucide-react";

export default function KamusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPos, setSelectedPos] = useState("all");

  const posOptions = [
    { value: "all", label: "Semua Kata" },
    { value: "noun", label: "Nomina" },
    { value: "verb", label: "Verba" },
    { value: "adj", label: "Adjektiva" },
    { value: "pron", label: "Pronomina" },
    { value: "phrase", label: "Frasa" },
    { value: "num", label: "Angka" },
    { value: "intj", label: "Interjeksi" }
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
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-[48px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
          Kamus Simalungun
        </h1>
        <p className="text-[17px] text-[#7a7a7a] dark:text-[#a1a1a6]">
          Leksikon resmi bersumber dari Kamus Simalungun: Indonesia (Tarigan 1989).
        </p>
      </div>

      {/* Apple Search Input & Filter Pills */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Pill Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7a7a7a] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kata Simalungun atau arti bahasa Indonesia..."
            className="w-full pl-11 pr-5 h-11 bg-[#f5f5f7] dark:bg-[#272729] rounded-full text-[15px] text-[#1d1d1f] dark:text-white border border-transparent focus:border-[#0066cc] dark:focus:border-[#2997ff] focus:bg-white dark:focus:bg-[#1d1d1f] focus:outline-none transition duration-200 placeholder:text-[#7a7a7a]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 justify-start sm:justify-center">
          {posOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedPos(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 ${
                selectedPos === opt.value
                  ? "bg-[#0066cc] text-white"
                  : "bg-[#f5f5f7] dark:bg-[#272729] text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-[13px] text-[#7a7a7a] pt-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
        <span>{filteredEntries.length} entri ditemukan</span>
        <span>Validasi Pakar (Tarigan 1989)</span>
      </div>

      {/* Apple Store Utility Card Grid (18px radius) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="bg-white dark:bg-[#272729] p-6 rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between space-y-4 hover:border-black/20 dark:hover:border-white/20 transition duration-200"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight capitalize">
                    {entry.lemma}
                  </h3>
                  <div className="font-aksara text-2xl text-[#0066cc] dark:text-[#2997ff] tracking-wider pt-0.5">
                    {entry.aksara}
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-black/40 text-[#7a7a7a] border border-black/[0.06] dark:border-white/[0.08]">
                  {entry.pos}
                </span>
              </div>

              {/* Gloss */}
              <div>
                <p className="text-[15px] text-[#1d1d1f] dark:text-white font-normal leading-relaxed">
                  {entry.glosses.join(", ")}
                </p>
              </div>

              {/* Cultural Context */}
              {entry.culturalNote && (
                <div className="p-3 rounded-[12px] bg-[#f5f5f7] dark:bg-black/30 border border-black/[0.04] dark:border-white/[0.06] text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                  {entry.culturalNote}
                </div>
              )}

              {/* Example */}
              {entry.examples && entry.examples.length > 0 && (
                <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] space-y-1 text-[13px]">
                  <p className="font-medium text-[#1d1d1f] dark:text-white">{entry.examples[0].simalungun}</p>
                  <p className="font-aksara text-[15px] text-[#7a7a7a]">{entry.examples[0].aksara}</p>
                  <p className="text-[#7a7a7a] italic">&ldquo;{entry.examples[0].indonesian}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-[#7a7a7a]">
              <span>Kamus Tarigan 1989</span>
              <span className="text-[#0066cc] dark:text-[#2997ff] font-medium">Baku</span>
            </div>
          </article>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-16 bg-[#f5f5f7] dark:bg-[#161617] rounded-[18px] space-y-2 border border-black/[0.06] dark:border-white/[0.08]">
          <AlertCircle className="w-6 h-6 text-[#7a7a7a] mx-auto" />
          <h4 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white">Tidak ada kata yang cocok</h4>
          <p className="text-[14px] text-[#7a7a7a]">
            Coba gunakan kata kunci lain atau usulkan di menu Kontribusi.
          </p>
        </div>
      )}
    </div>
  );
}
