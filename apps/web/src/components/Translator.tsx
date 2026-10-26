"use client";

import { useState, useMemo } from "react";
import {
  analyzeText,
  type Direction,
  type AnalysisResult
} from "@rumah-hata/linguistics";
import { simalungunLexicon, simalungunPhrasebook } from "@/lib/data";
import { CardExportModal } from "./CardExportModal";
import {
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Layers,
  ShieldCheck,
  AlertCircle,
  Share2
} from "lucide-react";

export function Translator() {
  const [direction, setDirection] = useState<Direction>("sim-id");
  const [inputText, setInputText] = useState("Horas bamu");
  const [copied, setCopied] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"translit" | "phonology" | "morphology" | "culture">("translit");

  // Sample phrases for quick learning
  const samples = [
    { label: "Horas bamu", dir: "sim-id" as Direction, text: "Horas bamu" },
    { label: "Diatei tupa", dir: "sim-id" as Direction, text: "Diatei tupa" },
    { label: "Habonaron do bona", dir: "sim-id" as Direction, text: "Habonaron do bona" },
    { label: "Surat Sisimolungun", dir: "sim-id" as Direction, text: "Surat Sisimolungun" },
    { label: "marsimalungun", dir: "sim-id" as Direction, text: "marsimalungun" },
    { label: "manurat", dir: "sim-id" as Direction, text: "manurat" },
    { label: "Terima kasih", dir: "id-sim" as Direction, text: "Terima kasih" },
    { label: "Kebenaran", dir: "id-sim" as Direction, text: "Kebenaran" }
  ];

  // Perform deterministic analysis
  const analysis: AnalysisResult = useMemo(() => {
    if (!inputText.trim()) {
      return {
        input: "",
        direction,
        latin: "",
        aksara: "",
        translation: "",
        tokens: [],
        transliterationSteps: [],
        interlinear: { source: "", segmented: "", gloss: "", free: "" },
        notes: []
      };
    }
    return analyzeText(inputText, direction, simalungunLexicon, simalungunPhrasebook);
  }, [inputText, direction]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapDirection = () => {
    if (direction === "sim-id") {
      setDirection("id-sim");
      if (analysis.translation && !analysis.translation.startsWith("[")) {
        setInputText(analysis.translation);
      }
    } else if (direction === "id-sim") {
      setDirection("sim-id");
      if (analysis.latin) {
        setInputText(analysis.latin);
      }
    } else {
      setDirection("sim-id");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Direction Toolbar */}
      <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="grid grid-cols-1 sm:flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setDirection("sim-id")}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              direction === "sim-id"
                ? "bg-[#8b1e1b] text-white shadow-xs"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            Simalungun &rarr; Indonesia
          </button>
          <button
            type="button"
            onClick={() => setDirection("id-sim")}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              direction === "id-sim"
                ? "bg-[#8b1e1b] text-white shadow-xs"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            Indonesia &rarr; Simalungun
          </button>
          <button
            type="button"
            onClick={() => setDirection("sim-aksara")}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              direction === "sim-aksara"
                ? "bg-[#8b1e1b] text-white shadow-xs"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            Latin Simalungun &rarr; Aksara
          </button>
        </div>

        {direction !== "sim-aksara" && (
          <button
            type="button"
            onClick={swapDirection}
            className="min-h-[44px] flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition"
            title="Tukar Arah Terjemahan"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Tukar Arah</span>
          </button>
        )}
      </div>

      {/* Quick Samples Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-700">
        <span className="font-medium whitespace-nowrap text-stone-700">Coba contoh:</span>
        {samples.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setDirection(s.dir);
              setInputText(s.text);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-md whitespace-nowrap transition"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Two-Panel Translation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col p-4 focus-within:border-[#8b1e1b] focus-within:ring-1 focus-within:ring-[#8b1e1b] transition">
          <div className="flex items-center justify-between text-xs text-stone-700 pb-2 border-b border-stone-100 mb-2">
            <span className="font-semibold text-stone-700">
              {direction === "id-sim" ? "Teks Bahasa Indonesia" : "Teks Bahasa Simalungun (Latin)"}
            </span>
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="hover:text-stone-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Bersihkan</span>
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              direction === "id-sim"
                ? "Ketik kata atau kalimat Indonesia (contoh: selamat, terima kasih, air)..."
                : "Ketik kata atau kalimat Simalungun (contoh: horas, diatei tupa, hata)..."
            }
            className="w-full flex-1 min-h-[140px] text-base sm:text-lg text-stone-900 bg-transparent resize-none border-none focus:outline-none placeholder:text-stone-400"
          />
          <div className="pt-2 text-right text-[11px] text-stone-700">
            {inputText.length} karakter
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-[#faf9f6] rounded-xl border border-stone-300 shadow-sm flex flex-col p-4 relative">
          <div className="flex items-center justify-between text-xs text-stone-700 pb-2 border-b border-stone-200 mb-2">
            <span className="font-semibold text-stone-700">
              {direction === "sim-aksara" ? "Hasil Transliterasi Aksara" : "Hasil Terjemahan & Aksara"}
            </span>
            {analysis.aksara && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="min-h-[44px] flex items-center gap-1.5 text-xs text-stone-700 hover:text-[#8b1e1b] font-medium px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition"
                  title="Unduh Kartu Aksara PNG"
                >
                  <Share2 className="w-4 h-4 text-[#8b1e1b]" />
                  <span>Unduh Kartu</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(analysis.aksara)}
                  className="min-h-[44px] flex items-center gap-1.5 text-xs text-stone-700 hover:text-[#8b1e1b] font-medium px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Tersalin" : "Salin"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Main output text */}
          <div className="flex-1 space-y-4">
            {analysis.aksara ? (
              <>
                {/* Large Aksara Rendering */}
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="text-xs text-stone-700 mb-1 font-medium">Surat Sisimolungun (Aksara):</div>
                  <div className="font-aksara text-3xl sm:text-4xl text-[#18181b] tracking-wider leading-relaxed select-all">
                    {analysis.aksara}
                  </div>
                </div>

                {/* Latin translation */}
                {direction !== "sim-aksara" && (
                  <div>
                    <div className="text-xs text-stone-700 mb-1 font-medium">
                      {direction === "id-sim" ? "Simalungun (Latin):" : "Indonesia (Terjemahan):"}
                    </div>
                    <div className="text-lg font-semibold text-stone-900">
                      {analysis.translation}
                    </div>
                  </div>
                )}

                {/* Provenance & Validation Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-2.5 border-t border-stone-200 gap-1.5">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-medium text-stone-800">
                      {analysis.tokens.some((t) => t.provenance === "dictionary")
                        ? "Terjemahan berlandaskan Kamus Baku Simalungun"
                        : analysis.tokens.some((t) => t.provenance === "phrasebook")
                        ? "Frasa baku adat terverifikasi"
                        : "Alih aksara berlandaskan kaidah ortografi baku"}
                    </span>
                  </div>
                  <a
                    href="#lensa-linguistik"
                    className="text-[11px] text-[#8b1e1b] hover:underline font-semibold"
                  >
                    Lihat Penjelasan Linguistik &darr;
                  </a>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-sm italic py-8">
                Teks terjemahan dan aksara akan tampil di sini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lensa Linguistik Container */}
      {analysis.aksara && (
        <section id="lensa-linguistik" className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mt-8">
          {/* Lens Tabs */}
          <div className="border-b border-stone-200 px-4 bg-white flex space-x-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("translit")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "translit"
                  ? "border-[#8b1e1b] text-[#8b1e1b]"
                  : "border-transparent text-stone-700 hover:text-stone-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Transliterasi Bertahap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("phonology")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "phonology"
                  ? "border-[#8b1e1b] text-[#8b1e1b]"
                  : "border-transparent text-stone-700 hover:text-stone-900"
              }`}
            >
              <span>Fonologi & Silabifikasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("morphology")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "morphology"
                  ? "border-[#8b1e1b] text-[#8b1e1b]"
                  : "border-transparent text-stone-700 hover:text-stone-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Morfologi & Leipzig Glossing</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("culture")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "culture"
                  ? "border-[#8b1e1b] text-[#8b1e1b]"
                  : "border-transparent text-stone-700 hover:text-stone-900"
              }`}
            >
              <span>Konteks Budaya & Rujukan</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Tab 1: Transliteration steps */}
            {activeTab === "translit" && (
              <div className="space-y-4">
                {/* Mobile stacked card view */}
                <div className="space-y-3 sm:hidden">
                  {analysis.transliterationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-500">#{step.step}</span>
                          <span className="text-sm font-bold text-stone-900">{step.input}</span>
                        </div>
                        <span className="font-aksara text-2xl text-[#8b1e1b]">
                          {step.output || "(inheren)"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">{step.explanation}</p>
                      <div className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 w-fit">
                        {step.rule}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-y border-stone-200 text-stone-700">
                        <th className="py-2.5 px-3 font-semibold">Langkah</th>
                        <th className="py-2.5 px-3 font-semibold">Input Latin</th>
                        <th className="py-2.5 px-3 font-semibold">Kaidah / Rule ID</th>
                        <th className="py-2.5 px-3 font-semibold">Grafem Aksara</th>
                        <th className="py-2.5 px-3 font-semibold">Penjelasan Linguistik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {analysis.transliterationSteps.map((step) => (
                        <tr key={step.step} className="hover:bg-stone-50/70 transition">
                          <td className="py-2 px-3 font-mono text-stone-700 text-xs">#{step.step}</td>
                          <td className="py-2 px-3 font-semibold text-stone-900">{step.input}</td>
                          <td className="py-2 px-3">
                            <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-700 border border-stone-200">
                              {step.rule}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-aksara text-2xl text-[#8b1e1b]">
                            {step.output || "(inheren)"}
                          </td>
                          <td className="py-2 px-3 text-stone-700 leading-relaxed">
                            {step.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Phonology & Syllabification */}
            {activeTab === "phonology" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Segmentasi Suku Kata
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg border border-stone-200">
                        <span className="font-semibold text-stone-900 text-sm">{tok.surface}:</span>
                        <div className="flex gap-1">
                          {tok.syllables.map((syl, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 bg-white border border-stone-300 rounded text-xs font-mono font-medium text-stone-800 shadow-2xs"
                            >
                              {syl}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Kaidah Fonotaktik Simalungun
                  </h4>
                  <ul className="text-xs sm:text-sm text-stone-700 space-y-1.5 list-disc list-inside">
                    <li>Pola suku kata baku Simalungun meliputi V, CV, CVC, dan diftong khas /-ou/.</li>
                    <li>
                      Konsonan akhir tertutup dibedakan: tanda hembus /-h/ memakai hajoringan (ᯱ),
                      nasal /-ng/ memakai haminsaran (ᯰ), sedangkan konsonan penutup lainnya dimatikan
                      dengan panongonan (᯳).
                    </li>
                    <li>
                      Pada suku kata `su`, berlaku kaidah khusus Unicode U+1BEF (haboritan khusus Sa).
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Morphology & Leipzig Glossing */}
            {activeTab === "morphology" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Format Interlinear Leipzig
                  </h4>
                  <div className="p-4 bg-stone-900 text-stone-100 rounded-lg font-mono text-xs sm:text-sm space-y-2 overflow-x-auto shadow-inner">
                    <div className="flex gap-4">
                      <span className="text-stone-400 select-none w-24">Sumber:</span>
                      <span className="font-semibold">{analysis.interlinear.source}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-stone-400 select-none w-24">Segmentasi:</span>
                      <span className="text-amber-300">{analysis.interlinear.segmented}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-stone-400 select-none w-24">Gloss:</span>
                      <span className="text-emerald-400">{analysis.interlinear.gloss}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-stone-400 select-none w-24">Bebas:</span>
                      <span className="text-sky-300">&ldquo;{analysis.interlinear.free}&rdquo;</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Daftar Morfem Per Kata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="p-3 border border-stone-200 rounded-lg bg-stone-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900 text-sm">{tok.surface}</span>
                          <span className="text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                            {tok.pos || "kata"}
                          </span>
                        </div>
                        <div className="text-xs text-stone-700 space-y-0.5">
                          <div>Lema dasar: <span className="font-medium text-stone-800">{tok.lemma || tok.surface}</span></div>
                          <div>Morfem: <span className="font-medium text-stone-800">{tok.morphemes.map((m) => `${m.form} (${m.gloss})`).join(" + ")}</span></div>
                          <div>Status: <span className="font-medium text-stone-800">{tok.provenance} ({tok.validation})</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Cultural Context & Sources */}
            {activeTab === "culture" && (
              <div className="space-y-4">
                {analysis.notes.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.notes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        className={`p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${
                          note.kind === "culture"
                            ? "bg-amber-50/70 border-amber-200 text-amber-950"
                            : note.kind === "warning"
                            ? "bg-orange-50/70 border-orange-200 text-orange-950"
                            : "bg-stone-50 border-stone-200 text-stone-900"
                        }`}
                      >
                        {note.kind === "warning" ? (
                          <AlertCircle className="w-4 h-4 text-orange-700 mt-0.5 shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold mb-0.5 capitalize">
                            {note.kind === "culture"
                              ? "Catatan Budaya & Pragmatik"
                              : note.kind === "morphology"
                              ? "Analisis Morfologi"
                              : "Pemberitahuan Sistem"}
                          </div>
                          <p className="leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-700 italic">
                    Belum ada catatan budaya khusus untuk entri ini. Kosakata diambil langsung dari kamus baku.
                  </p>
                )}

                <div className="pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <span className="font-semibold text-stone-800">Rujukan sumber data: </span>
                  Kamus Simalungun: Indonesia (Tarigan 1989), Warisan Leluhur (Kozok 1999), dan Unicode Batak Standard (ISO 10646).
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Card Export Modal */}
      <CardExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        aksara={analysis.aksara}
        latin={analysis.latin}
        translation={analysis.translation}
      />
    </div>
  );
}
