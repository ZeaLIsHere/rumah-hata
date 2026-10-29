"use client";

import { useState } from "react";
import { simalungunAksaraRules } from "@/lib/data";
import { WritingCanvas } from "@/components/WritingCanvas";
import { Info, Volume2, BookOpen, Layers, PenTool, CheckCircle } from "lucide-react";

export default function BelajarPage() {
  const [activeView, setActiveView] = useState<"bagan" | "modul" | "kanvas">("bagan");
  const [selectedModuleLevel, setSelectedModuleLevel] = useState<number>(1);

  const [selectedLetter, setSelectedLetter] = useState<{
    char: string;
    latin: string;
    name: string;
    unicode: string;
    description?: string;
  }>({
    char: "\u1BC3",
    latin: "ha / ka",
    name: "Ha / Ka Simalungun",
    unicode: "U+1BC3",
    description: "Aksara dasar untuk konsonan velar frikatif /h/ dan plosif /k/."
  });

  const modules = [
    {
      level: 1,
      title: "Tingkat 1: Huruf Induk (Ina ni Surat)",
      description: "19 aksara dasar pembawa bunyi vokal bawaan /a/.",
      lessons: [
        { title: "Konsonan Utama", content: "Aksara Batak adalah sistem abugida. Setiap konsonan seperti Ha (ᯃ), Ba (ᯅ), Pa (ᯈ) secara alami dibaca dengan vokal /a/ tanpa tambahan tanda." },
        { title: "Vokal Mandiri", content: "Vokal yang berdiri sendiri di awal suku kata ditulis dengan aksara vokal tersendiri: A (ᯁ), I (ᯤ), U (ᯥ)." }
      ]
    },
    {
      level: 2,
      title: "Tingkat 2: Tanda Vokal (Anak ni Surat)",
      description: "Mengubah vokal bawaan /a/ menjadi /i/, /u/, /e/, /o/, atau /-ou/.",
      lessons: [
        { title: "Haluan & Hatalingan", content: "Diakritik haluan (ᯪ) mengubah vokal menjadi /i/ (contoh: Ba ᯅ -> Bi ᯅᯪ). Hatalingan (ᯩ) mengubah menjadi /e/ (contoh: Be ᯅᯩ)." },
        { title: "Kaidah Khusus Sa + U", content: "Konsonan Sa (ᯙ) yang dipasangi vokal /u/ memakai tanda khusus haboritan Sa (ᯯ, U+1BEF) sehingga ditulis ᯙᯯ." },
        { title: "Diftong Khas Simalungun", content: "Tanda hatulungan (ᯭ) melambangkan diftong khas /-ou/ seperti dalam kata sopou atau pulou." }
      ]
    },
    {
      level: 3,
      title: "Tingkat 3: Konsonan Akhir & Tanda Pemati",
      description: "Menutup suku kata dengan sengau, hembus, atau mematikan konsonan dengan panongonan.",
      lessons: [
        { title: "Haminsaran & Hajoringan", content: "Suku kata berakhiran -ng memakai haminsaran (ᯰ), sedangkan akhiran -h memakai hajoringan (ᯱ). Contoh: bang (ᯅᯰ), bah (ᯅᯱ)." },
        { title: "Panongonan (Virama)", content: "Konsonan penutup lainnya seperti t, s, r, l, k dimatikan menggunakan panongonan (᯳). Contoh: bat (ᯅᯖ᯳), ras (ᯓᯙ᯳)." }
      ]
    },
    {
      level: 4,
      title: "Tingkat 4: Membaca Kata & Kalimat Utuh",
      description: "Merangkai suku kata menjadi kosakata adat dan ujaran bermakna.",
      lessons: [
        { title: "Kata Salam 'Horas'", content: "Dibaca dari ho (ᯃᯬ) + ras (ᯓᯙ᯳) menjadi ᯃᯬᯓᯙ᯳." },
        { title: "Kata 'Simalungun'", content: "Dibaca dari si (ᯙᯪ) + ma (ᯕ) + lu (ᯟᯮ) + ngun (ᯝᯮᯉ᯳) menjadi ᯙᯪᯕᯟᯮᯝᯮᯉ᯳." },
        { title: "Falsafah 'Habonaron Do Bona'", content: "Kebenaran adalah pangkal/dasar: ᯃᯅᯬᯉᯓᯬᯉ᯳ ᯑᯬ ᯅᯬᯉ." }
      ]
    }
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-[48px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
          Surat Sisimolungun
        </h1>
        <p className="text-[17px] text-[#7a7a7a] dark:text-[#a1a1a6]">
          Pelajari sistem abugida aksara Batak Simalungun melalui kurikulum terstruktur.
        </p>
      </div>

      {/* Mode Navigation Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveView("bagan")}
          className={`px-5 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
            activeView === "bagan"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#333336]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bagan Huruf</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("modul")}
          className={`px-5 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
            activeView === "modul"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#333336]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modul Bertahap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("kanvas")}
          className={`px-5 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
            activeView === "kanvas"
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#333336]"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Latihan Menulis</span>
        </button>
      </div>

      {/* VIEW 1: Interactive Chart */}
      {activeView === "bagan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Ina ni Surat */}
            <div className="bg-[#f5f5f7] dark:bg-[#161617] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <div>
                  <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white">Ina ni Surat (19 Huruf Induk)</h2>
                  <p className="text-[13px] text-[#7a7a7a]">Vokal inheren /a/</p>
                </div>
                <span className="text-[12px] bg-white dark:bg-[#272729] px-2.5 py-0.5 rounded-full text-[#7a7a7a] border border-black/[0.06] dark:border-white/[0.08]">
                  19 Huruf
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                {simalungunAksaraRules.inaNiSurat.map((letter: any) => {
                  const isSelected = selectedLetter.char === letter.char;
                  return (
                    <button
                      key={letter.unicode}
                      type="button"
                      onClick={() =>
                        setSelectedLetter({
                          char: letter.char,
                          latin: letter.latin,
                          name: letter.name,
                          unicode: letter.unicode,
                          description: `Aksara dasar '${letter.latin}' pembawa vokal inheren /a/. Posisi grafis: ${letter.pos}.`
                        })
                      }
                      className={`p-3 rounded-[14px] border text-center transition flex flex-col items-center justify-center gap-1 min-h-[85px] active:scale-95 duration-200 ${
                        isSelected
                          ? "bg-[#0066cc] text-white border-transparent"
                          : "bg-white dark:bg-[#272729] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <span className="font-aksara text-3xl leading-none">{letter.char}</span>
                      <span className={`text-[12px] font-medium ${isSelected ? "text-white" : "text-[#7a7a7a]"}`}>
                        {letter.latin}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anak ni Surat */}
            <div className="bg-[#f5f5f7] dark:bg-[#161617] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                <div>
                  <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white">Anak ni Surat (Diakritik)</h2>
                  <p className="text-[13px] text-[#7a7a7a]">Tanda vokal & konsonan akhir</p>
                </div>
                <span className="text-[12px] bg-white dark:bg-[#272729] px-2.5 py-0.5 rounded-full text-[#7a7a7a] border border-black/[0.06] dark:border-white/[0.08]">
                  Diakritik
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {simalungunAksaraRules.anakNiSurat.map((diac: any) => {
                  const isSelected = selectedLetter.char === diac.char;
                  const sampleChar = diac.vowel === "u_sa" ? "\u1BD9" : "\u1BC5";
                  return (
                    <button
                      key={diac.unicode}
                      type="button"
                      onClick={() =>
                        setSelectedLetter({
                          char: diac.char,
                          latin: diac.vowel || diac.consonant,
                          name: diac.name,
                          unicode: diac.unicode,
                          description: diac.description
                        })
                      }
                      className={`p-3.5 rounded-[14px] border text-left transition flex flex-col justify-between min-h-[96px] active:scale-95 duration-200 ${
                        isSelected
                          ? "bg-[#0066cc] text-white border-transparent"
                          : "bg-white dark:bg-[#272729] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-aksara text-2xl leading-none">
                          {sampleChar}{diac.char}
                        </span>
                        <span className={`text-[10px] font-mono ${isSelected ? "text-white/80" : "text-[#7a7a7a]"}`}>
                          {diac.unicode}
                        </span>
                      </div>
                      <div>
                        <div className={`text-[13px] font-medium ${isSelected ? "text-white" : "text-[#1d1d1f] dark:text-white"}`}>
                          {diac.name}
                        </div>
                        <div className={`text-[11px] ${isSelected ? "text-white/80" : "text-[#7a7a7a]"}`}>
                          {diac.vowel || diac.consonant}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Panongonan */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLetter({
                      char: simalungunAksaraRules.virama.char,
                      latin: "virama",
                      name: simalungunAksaraRules.virama.name,
                      unicode: simalungunAksaraRules.virama.unicode,
                      description: simalungunAksaraRules.virama.description
                    })
                  }
                  className={`p-3.5 rounded-[14px] border text-left transition flex flex-col justify-between min-h-[96px] active:scale-95 duration-200 ${
                    selectedLetter.char === simalungunAksaraRules.virama.char
                      ? "bg-[#0066cc] text-white border-transparent"
                      : "bg-white dark:bg-[#272729] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-aksara text-2xl leading-none">
                      ᯖ{simalungunAksaraRules.virama.char}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">
                      {simalungunAksaraRules.virama.unicode}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">
                      {simalungunAksaraRules.virama.name}
                    </div>
                    <div className="text-[11px] opacity-80">
                      Pemati vokal
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Letter Inspector (Apple Spec Card) */}
          <div className="space-y-4">
            <div className="bg-[#f5f5f7] dark:bg-[#161617] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] sticky top-20 space-y-6 transition-colors duration-200">
              <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-1">
                  Huruf Terpilih
                </div>
                <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">{selectedLetter.name}</h3>
              </div>

              {/* Big Glyph Display */}
              <div className="h-32 bg-white dark:bg-[#272729] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-aksara text-6xl text-[#0066cc] dark:text-[#2997ff] select-all">
                {selectedLetter.char}
              </div>

              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[#7a7a7a]">Padanan Latin:</span>
                  <span className="font-medium text-[#1d1d1f] dark:text-white">{selectedLetter.latin}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[#7a7a7a]">Unicode:</span>
                  <span className="font-mono text-[#1d1d1f] dark:text-white">{selectedLetter.unicode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[#7a7a7a]">Blok:</span>
                  <span className="text-[#1d1d1f] dark:text-white text-xs">Batak (U+1BC0:U+1BFF)</span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#272729] rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                <div className="flex items-center gap-1.5 font-medium text-[#1d1d1f] dark:text-white mb-1">
                  <Info className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Kaidah:</span>
                </div>
                {selectedLetter.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Progressive Stepped Learning Modules */}
      {activeView === "modul" && (
        <div className="space-y-6">
          {/* Level selector pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {modules.map((m) => (
              <button
                key={m.level}
                type="button"
                onClick={() => setSelectedModuleLevel(m.level)}
                className={`p-5 rounded-[18px] border text-left transition duration-200 flex flex-col justify-between ${
                  selectedModuleLevel === m.level
                    ? "bg-[#0066cc] text-white border-transparent"
                    : "bg-[#f5f5f7] dark:bg-[#161617] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${selectedModuleLevel === m.level ? "bg-white/20 text-white" : "bg-white dark:bg-[#272729] text-[#7a7a7a]"}`}>
                    Level {m.level}
                  </span>
                  {selectedModuleLevel === m.level && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-snug">{m.title}</h3>
                  <p className={`text-[13px] mt-1 line-clamp-2 ${selectedModuleLevel === m.level ? "text-white/80" : "text-[#7a7a7a]"}`}>
                    {m.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Level Lesson Cards */}
          {(() => {
            const currentMod = modules.find((m) => m.level === selectedModuleLevel) || modules[0];
            return (
              <div className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] p-8 space-y-6 transition-colors duration-200">
                <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                  <span className="text-[12px] text-[#0066cc] dark:text-[#2997ff] font-medium">Modul Pembelajaran</span>
                  <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mt-0.5">{currentMod.title}</h2>
                  <p className="text-[15px] text-[#7a7a7a] mt-1">{currentMod.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMod.lessons.map((lesson, idx) => (
                    <div key={idx} className="p-6 rounded-[18px] bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-[12px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-[#1d1d1f] dark:text-white text-[17px]">{lesson.title}</h4>
                      </div>
                      <p className="text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed pt-1">
                        {lesson.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW 3: Writing Canvas */}
      {activeView === "kanvas" && <WritingCanvas />}
    </div>
  );
}
