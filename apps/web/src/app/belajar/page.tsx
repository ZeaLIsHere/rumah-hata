"use client";

import { useState } from "react";
import { simalungunAksaraRules } from "@/lib/data";
import { WritingCanvas } from "@/components/WritingCanvas";
import { Sparkles, Info, Volume2, BookOpen, Layers, PenTool, CheckCircle } from "lucide-react";

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
      description: "Mengenal 19 aksara dasar pembawa bunyi vokal bawaan /a/.",
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
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1b]">
          <Sparkles className="w-4 h-4" />
          <span>Surat Sisimolungun</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Pusat Pembelajaran Aksara Simalungun
        </h1>
        <p className="text-stone-700 text-sm sm:text-base max-w-3xl leading-relaxed">
          Kuasai sistem tulisan asli Batak Simalungun secara ilmiah dan terstruktur melalui bagan interaktif,
          kurikulum belajar bertahap, dan kanvas latihan motorik goresan pena.
        </p>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveView("bagan")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
            activeView === "bagan"
              ? "bg-[#8b1e1b] text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bagan Huruf & Diakritik</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("modul")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
            activeView === "modul"
              ? "bg-[#8b1e1b] text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Modul Bertahap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("kanvas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
            activeView === "kanvas"
              ? "bg-[#8b1e1b] text-white shadow-xs"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Latihan Menulis</span>
        </button>
      </div>

      {/* VIEW 1: Interactive Chart */}
      {activeView === "bagan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Ina ni Surat */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Ina ni Surat (Huruf Induk)</h2>
                  <p className="text-xs text-stone-700">19 aksara dasar pembawa vokal inheren /a/</p>
                </div>
                <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-mono">
                  {simalungunAksaraRules.inaNiSurat.length} Huruf
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
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
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 min-h-[90px] ${
                        isSelected
                          ? "bg-[#8b1e1b] text-white border-[#8b1e1b] shadow-sm"
                          : "bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100"
                      }`}
                    >
                      <span className="font-aksara text-3xl leading-none">{letter.char}</span>
                      <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-stone-700"}`}>
                        {letter.latin}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anak ni Surat */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Anak ni Surat (Diakritik Vokal & Konsonan)</h2>
                  <p className="text-xs text-stone-700">Diakritik pengubah bunyi vokal dan penutup suku kata</p>
                </div>
                <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-mono">
                  Diakritik
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[100px] ${
                        isSelected
                          ? "bg-[#8b1e1b] text-white border-[#8b1e1b] shadow-sm"
                          : "bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-aksara text-3xl leading-none">
                          {sampleChar}{diac.char}
                        </span>
                        <span className={`text-[11px] font-mono ${isSelected ? "text-red-100" : "text-stone-700"}`}>
                          {diac.unicode}
                        </span>
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-stone-900"}`}>
                          {diac.name}
                        </div>
                        <div className={`text-[11px] ${isSelected ? "text-red-100" : "text-stone-700"}`}>
                          Bunyi: {diac.vowel || diac.consonant}
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
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[100px] ${
                    selectedLetter.char === simalungunAksaraRules.virama.char
                      ? "bg-[#8b1e1b] text-white border-[#8b1e1b] shadow-sm"
                      : "bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-aksara text-3xl leading-none">
                      ᯖ{simalungunAksaraRules.virama.char}
                    </span>
                    <span className="text-[11px] font-mono opacity-80">
                      {simalungunAksaraRules.virama.unicode}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {simalungunAksaraRules.virama.name}
                    </div>
                    <div className="text-[11px] opacity-80">
                      Pemati vokal /a/
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Letter Inspector */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs sticky top-24 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Detail Huruf Terpilih
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{selectedLetter.name}</h3>
              </div>

              <div className="h-36 bg-[#faf9f6] rounded-xl border border-stone-200 flex items-center justify-center font-aksara text-7xl text-[#8b1e1b] select-all shadow-inner">
                {selectedLetter.char}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-700">Padanan Latin:</span>
                  <span className="font-bold text-stone-900">{selectedLetter.latin}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-700">Kode Unicode:</span>
                  <span className="font-mono text-stone-900 font-semibold">{selectedLetter.unicode}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-700">Blok Karakter:</span>
                  <span className="text-stone-800 text-xs">Batak (U+1BC0:U+1BFF)</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                  <Info className="w-3.5 h-3.5 text-[#8b1e1b]" />
                  <span>Kaidah Ortografi:</span>
                </div>
                {selectedLetter.description}
              </div>

              <div className="text-xs text-stone-700 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-stone-400" />
                <span>Bunyi fonemik diajarkan sesuai dialek standar Simalungun.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modul Pembelajaran Bertahap */}
      {activeView === "modul" && (
        <div className="space-y-6">
          {/* Level selector buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {modules.map((m) => (
              <button
                key={m.level}
                type="button"
                onClick={() => setSelectedModuleLevel(m.level)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedModuleLevel === m.level
                    ? "bg-[#8b1e1b] text-white border-[#8b1e1b] shadow-sm"
                    : "bg-white border-stone-200 text-stone-900 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${selectedModuleLevel === m.level ? "bg-white/20 text-white" : "bg-stone-100 text-stone-700"}`}>
                    Level {m.level}
                  </span>
                  {selectedModuleLevel === m.level && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-snug">{m.title}</h3>
                  <p className={`text-xs mt-1 line-clamp-2 ${selectedModuleLevel === m.level ? "text-red-100" : "text-stone-700"}`}>
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
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 sm:p-8 space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-xs font-mono text-[#8b1e1b] font-bold">Modul Pembelajaran</span>
                  <h2 className="text-2xl font-bold text-stone-900 mt-0.5">{currentMod.title}</h2>
                  <p className="text-sm text-stone-700 mt-1">{currentMod.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMod.lessons.map((lesson, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#8b1e1b] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-stone-900 text-base">{lesson.title}</h4>
                      </div>
                      <p className="text-sm text-stone-700 leading-relaxed pt-1">
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

      {/* Kanvas Latihan Menulis */}
      {activeView === "kanvas" && <WritingCanvas />}
    </div>
  );
}
