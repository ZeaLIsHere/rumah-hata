"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  analyzeText,
  type Direction,
  type AnalysisResult
} from "@rumah-hata/linguistics";
import { simalungunLexicon, simalungunPhrasebook } from "@/lib/data";
import { CardExportModal } from "./CardExportModal";
import {
  ArrowRightLeft,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Layers,
  ShieldCheck,
  AlertCircle,
  Share2
} from "lucide-react";

type SourceLang = "simalungun" | "indonesia";
type TargetLang = "indonesia" | "simalungun" | "aksara";

export function Translator() {
  const [sourceLang, setSourceLang] = useState<SourceLang>("simalungun");
  const [targetLang, setTargetLang] = useState<TargetLang>("indonesia");
  const [inputText, setInputText] = useState("Horas bamu");
  const [copied, setCopied] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"translit" | "phonology" | "morphology" | "culture">("translit");

  // Dropdown visibility states
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const sourceRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setIsSourceOpen(false);
      }
      if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
        setIsTargetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map source & target to engine Direction
  const direction: Direction = useMemo(() => {
    if (targetLang === "aksara") {
      return sourceLang === "simalungun" ? "sim-aksara" : "id-sim";
    }
    if (sourceLang === "indonesia") return "id-sim";
    return "sim-id";
  }, [sourceLang, targetLang]);

  // Deterministic linguistic analysis
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

  // Copy handler aligned with active target selection
  const handleCopy = () => {
    const textToCopy = targetLang === "aksara" ? analysis.aksara : analysis.translation;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Swap handler
  const swapDirection = () => {
    if (targetLang === "aksara") {
      if (sourceLang === "simalungun") {
        setSourceLang("indonesia");
        setTargetLang("simalungun");
      } else {
        setSourceLang("simalungun");
        setTargetLang("indonesia");
      }
    } else {
      const nextSource: SourceLang = targetLang === "indonesia" ? "indonesia" : "simalungun";
      const nextTarget: TargetLang = sourceLang === "indonesia" ? "indonesia" : "simalungun";
      setSourceLang(nextSource);
      setTargetLang(nextTarget);

      if (analysis.translation && !analysis.translation.startsWith("[")) {
        setInputText(analysis.translation);
      }
    }
  };

  // Quick samples
  const samples = [
    { label: "Horas bamu", src: "simalungun" as SourceLang, tgt: "indonesia" as TargetLang, text: "Horas bamu" },
    { label: "Diatei tupa", src: "simalungun" as SourceLang, tgt: "indonesia" as TargetLang, text: "Diatei tupa" },
    { label: "Habonaron do bona", src: "simalungun" as SourceLang, tgt: "indonesia" as TargetLang, text: "Habonaron do bona" },
    { label: "Surat Sisimolungun (Aksara)", src: "simalungun" as SourceLang, tgt: "aksara" as TargetLang, text: "Surat Sisimolungun" },
    { label: "marsimalungun", src: "simalungun" as SourceLang, tgt: "indonesia" as TargetLang, text: "marsimalungun" },
    { label: "Terima kasih", src: "indonesia" as SourceLang, tgt: "simalungun" as TargetLang, text: "Terima kasih" },
    { label: "Kebenaran (Aksara)", src: "indonesia" as SourceLang, tgt: "aksara" as TargetLang, text: "Kebenaran" }
  ];

  // Labels for dropdown triggers
  const sourceLabel = sourceLang === "indonesia" ? "Indonesia" : "Simalungun";
  const targetLabel =
    targetLang === "aksara"
      ? "Aksara Simalungun"
      : targetLang === "simalungun"
      ? "Simalungun"
      : "Indonesia";

  const hasOutput = targetLang === "aksara" ? Boolean(analysis.aksara) : Boolean(analysis.translation);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Quick Samples Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-700 dark:text-slate-300">
        <span className="font-medium whitespace-nowrap text-stone-700 dark:text-slate-300">Coba contoh:</span>
        {samples.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSourceLang(s.src);
              setTargetLang(s.tgt);
              setInputText(s.text);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 rounded-md whitespace-nowrap transition"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Modern Translator Container (Bing / Edge Translator Style) */}
      <div className="bg-[#edf2f7] dark:bg-[#161a24] rounded-3xl p-3 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
        {/* Top Centered Language Selector Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-1">
          {/* Source Language Dropdown */}
          <div className="relative" ref={sourceRef}>
            <button
              type="button"
              onClick={() => {
                setIsSourceOpen(!isSourceOpen);
                setIsTargetOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <span>{sourceLabel}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            {isSourceOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-[#1c2230] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-30 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setSourceLang("simalungun");
                    if (targetLang === "simalungun") setTargetLang("indonesia");
                    setIsSourceOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between ${
                    sourceLang === "simalungun" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>Simalungun</span>
                  {sourceLang === "simalungun" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceLang("indonesia");
                    if (targetLang === "indonesia") setTargetLang("simalungun");
                    setIsSourceOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between ${
                    sourceLang === "indonesia" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>Indonesia</span>
                  {sourceLang === "indonesia" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Central Swap Button */}
          <button
            type="button"
            onClick={swapDirection}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            title="Tukar Bahasa"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Language Dropdown */}
          <div className="relative" ref={targetRef}>
            <button
              type="button"
              onClick={() => {
                setIsTargetOpen(!isTargetOpen);
                setIsSourceOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <span>{targetLabel}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            {isTargetOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#1c2230] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-30 animate-fadeIn">
                {sourceLang === "indonesia" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("simalungun");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                        targetLang === "simalungun" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>Simalungun (Latin)</span>
                      {targetLang === "simalungun" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("aksara");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                        targetLang === "aksara" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>Aksara Simalungun</span>
                      {targetLang === "aksara" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("indonesia");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                        targetLang === "indonesia" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>Indonesia</span>
                      {targetLang === "indonesia" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("aksara");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                        targetLang === "aksara" ? "font-semibold text-[#8b1e1b] dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>Aksara Simalungun</span>
                      {targetLang === "aksara" && <Check className="w-3.5 h-3.5 text-[#8b1e1b] dark:text-red-400" />}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two Separate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
          {/* Left Card: Input Box */}
          <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between h-[250px] sm:h-[270px] transition-colors duration-200">
            <div className="flex-1 flex flex-col overflow-y-auto pr-1">
              <textarea
                value={inputText}
                maxLength={500}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik atau tempelkan teks yang akan diterjemahkan"
                className="w-full flex-1 text-base sm:text-lg text-slate-800 dark:text-slate-100 bg-transparent resize-none border-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
              />
            </div>

            {/* Bottom Input Action Row - clean borderless footer */}
            <div className="h-8 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
              {inputText ? (
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
              ) : (
                <span />
              )}
              <span className="font-mono text-slate-400 dark:text-slate-500">{inputText.length} / 500</span>
            </div>
          </div>

          {/* Right Card: Output Box */}
          <div className="bg-white dark:bg-[#1a1f2c] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between h-[250px] sm:h-[270px] transition-colors duration-200">
            {hasOutput ? (
              <>
                <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
                  {/* Aksara Output ONLY when user explicitly chose Aksara */}
                  {targetLang === "aksara" ? (
                    <div className="font-aksara text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-wider leading-relaxed select-all">
                      {analysis.aksara}
                    </div>
                  ) : (
                    /* Clean Latin Text Output (Indonesia or Simalungun) */
                    <div className="text-base sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed select-all">
                      {analysis.translation}
                    </div>
                  )}
                </div>

                {/* Bottom Output Action Row */}
                <div className="h-8 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {analysis.tokens.some((t) => t.provenance === "dictionary")
                        ? "Kamus Baku"
                        : analysis.tokens.some((t) => t.provenance === "phrasebook")
                        ? "Frasa Terverifikasi"
                        : "Kaidah Baku"}
                    </span>
                    <a
                      href="#lensa-linguistik"
                      className="text-[#8b1e1b] dark:text-red-400 hover:underline font-semibold ml-1 inline-flex items-center gap-0.5"
                    >
                      <span>Bedah</span>
                      <span>&darr;</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Share Card Modal button only relevant if aksara exists */}
                    {analysis.aksara && (
                      <button
                        type="button"
                        onClick={() => setIsExportOpen(true)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#8b1e1b] dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title="Unduh Kartu Gambar PNG"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#8b1e1b] dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      title={targetLang === "aksara" ? "Salin Aksara" : "Salin Teks Terjemahan"}
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty white card matching the screenshot */
              <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm select-none" />
            )}
          </div>
        </div>
      </div>

      {/* Lensa Linguistik Container */}
      {analysis.aksara && (
        <section id="lensa-linguistik" className="bg-white dark:bg-[#161a24] rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xs overflow-hidden mt-8 transition-colors duration-200">
          {/* Lens Tabs */}
          <div className="border-b border-stone-200 dark:border-slate-800 px-4 bg-white dark:bg-[#161a24] flex space-x-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("translit")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "translit"
                  ? "border-[#8b1e1b] dark:border-red-500 text-[#8b1e1b] dark:text-red-400"
                  : "border-transparent text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200"
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
                  ? "border-[#8b1e1b] dark:border-red-500 text-[#8b1e1b] dark:text-red-400"
                  : "border-transparent text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200"
              }`}
            >
              <span>Fonologi & Silabifikasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("morphology")}
              className={`py-3 px-3 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === "morphology"
                  ? "border-[#8b1e1b] dark:border-red-500 text-[#8b1e1b] dark:text-red-400"
                  : "border-transparent text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200"
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
                  ? "border-[#8b1e1b] dark:border-red-500 text-[#8b1e1b] dark:text-red-400"
                  : "border-transparent text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200"
              }`}
            >
              <span>Konteks Budaya & Rujukan</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 text-slate-800 dark:text-slate-200">
            {/* Tab 1: Transliteration steps */}
            {activeTab === "translit" && (
              <div className="space-y-4">
                {/* Mobile stacked card view */}
                <div className="space-y-3 sm:hidden">
                  {analysis.transliterationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-500 dark:text-slate-400">#{step.step}</span>
                          <span className="text-sm font-bold text-stone-900 dark:text-white">{step.input}</span>
                        </div>
                        <span className="font-aksara text-2xl text-[#8b1e1b] dark:text-red-400">
                          {step.output || "(inheren)"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed">{step.explanation}</p>
                      <div className="text-[10px] font-mono text-stone-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-stone-200 dark:border-slate-700 w-fit">
                        {step.rule}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-slate-800/60 border-y border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300">
                        <th className="py-2.5 px-3 font-semibold">Langkah</th>
                        <th className="py-2.5 px-3 font-semibold">Input Latin</th>
                        <th className="py-2.5 px-3 font-semibold">Kaidah / Rule ID</th>
                        <th className="py-2.5 px-3 font-semibold">Grafem Aksara</th>
                        <th className="py-2.5 px-3 font-semibold">Penjelasan Linguistik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                      {analysis.transliterationSteps.map((step) => (
                        <tr key={step.step} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="py-2 px-3 font-mono text-stone-700 dark:text-slate-400 text-xs">#{step.step}</td>
                          <td className="py-2 px-3 font-semibold text-stone-900 dark:text-slate-100">{step.input}</td>
                          <td className="py-2 px-3">
                            <span className="font-mono text-xs bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                              {step.rule}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-aksara text-2xl text-[#8b1e1b] dark:text-red-400">
                            {step.output || "(inheren)"}
                          </td>
                          <td className="py-2 px-3 text-stone-700 dark:text-slate-300 leading-relaxed">
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-2">
                    Segmentasi Suku Kata
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-2 bg-stone-50 dark:bg-slate-800/60 rounded-lg border border-stone-200 dark:border-slate-700">
                        <span className="font-semibold text-stone-900 dark:text-white text-sm">{tok.surface}:</span>
                        <div className="flex gap-1">
                          {tok.syllables.map((syl, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded text-xs font-mono font-medium text-stone-800 dark:text-slate-200 shadow-2xs"
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-2">
                    Kaidah Fonotaktik Simalungun
                  </h4>
                  <ul className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-2">
                    Format Interlinear Leipzig
                  </h4>
                  <div className="p-4 bg-stone-900 dark:bg-slate-950 text-stone-100 rounded-lg font-mono text-xs sm:text-sm space-y-2 overflow-x-auto shadow-inner border border-stone-800 dark:border-slate-800">
                    <div className="flex gap-4">
                      <span className="text-stone-400 select-none w-24">Sumber:</span>
                      <span className="font-semibold text-white">{analysis.interlinear.source}</span>
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-2">
                    Daftar Morfem Per Kata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="p-3 border border-stone-200 dark:border-slate-800 rounded-lg bg-stone-50/50 dark:bg-slate-800/40">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900 dark:text-white text-sm">{tok.surface}</span>
                          <span className="text-[11px] bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                            {tok.pos || "kata"}
                          </span>
                        </div>
                        <div className="text-xs text-stone-700 dark:text-slate-300 space-y-0.5">
                          <div>Lema dasar: <span className="font-medium text-stone-900 dark:text-slate-100">{tok.lemma || tok.surface}</span></div>
                          <div>Morfem: <span className="font-medium text-stone-900 dark:text-slate-100">{tok.morphemes.map((m) => `${m.form} (${m.gloss})`).join(" + ")}</span></div>
                          <div>Status: <span className="font-medium text-stone-900 dark:text-slate-100">{tok.provenance} ({tok.validation})</span></div>
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
                            ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200"
                            : note.kind === "warning"
                            ? "bg-orange-50/70 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200"
                            : "bg-stone-50 dark:bg-slate-800/50 border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100"
                        }`}
                      >
                        {note.kind === "warning" ? (
                          <AlertCircle className="w-4 h-4 text-orange-700 dark:text-orange-400 mt-0.5 shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400 mt-0.5 shrink-0" />
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
                  <p className="text-sm text-stone-700 dark:text-slate-400 italic">
                    Belum ada catatan budaya khusus untuk entri ini. Kosakata diambil langsung dari kamus baku.
                  </p>
                )}

                <div className="pt-3 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-700 dark:text-slate-400">
                  <span className="font-semibold text-stone-800 dark:text-slate-200">Rujukan sumber data: </span>
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
