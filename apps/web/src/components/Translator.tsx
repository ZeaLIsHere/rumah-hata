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
  Share2,
  Sparkles,
  Loader2
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

  // AI translation state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    translation: string;
    aksara: string;
    explanation?: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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

  // Reset AI result when input text changes
  useEffect(() => {
    setAiResult(null);
    setAiError(null);
  }, [inputText, sourceLang, targetLang]);

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

  // Active translation outputs (takes AI result if active)
  const currentTranslation = aiResult ? aiResult.translation : analysis.translation;
  const currentAksara = aiResult ? aiResult.aksara : analysis.aksara;

  // Copy handler aligned with active target selection
  const handleCopy = () => {
    const textToCopy = targetLang === "aksara" ? currentAksara : currentTranslation;
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

      if (currentTranslation && !currentTranslation.startsWith("[")) {
        setInputText(currentTranslation);
      }
    }
  };

  // Call AI Endpoint
  const handleTranslateWithAi = async () => {
    if (!inputText.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          direction: sourceLang === "indonesia" ? "id-sim" : "sim-id"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        const detailMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(detailMsg || "Gagal menghubungi server terjemahan AI.");
      }

      if (data.available === false) {
        setAiError(data.message || "Kunci OPENCODE_API_KEY belum dikonfigurasi di server.");
        return;
      }

      setAiResult({
        translation: data.translation,
        aksara: data.aksara,
        explanation: data.explanation
      });
    } catch (err: any) {
      setAiError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Labels for dropdown triggers
  const sourceLabel = sourceLang === "indonesia" ? "Indonesia" : "Simalungun";
  const targetLabel =
    targetLang === "aksara"
      ? "Aksara Simalungun"
      : targetLang === "simalungun"
      ? "Simalungun"
      : "Indonesia";

  const hasOutput = targetLang === "aksara" ? Boolean(currentAksara) : Boolean(currentTranslation);

  return (
    <div className="w-full space-y-6">
      {/* Apple Configurator Container */}
      <div className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] p-4 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
        {/* Top Centered Language Selector Bar */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 pb-4 max-w-full">
          {/* Source Language Dropdown */}
          <div className="relative shrink min-w-0" ref={sourceRef}>
            <button
              type="button"
              onClick={() => {
                setIsSourceOpen(!isSourceOpen);
                setIsTargetOpen(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition duration-200"
            >
              <span className="truncate max-w-[100px] sm:max-w-none">{sourceLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7a7a7a] shrink-0" />
            </button>

            {isSourceOpen && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-[#272729] rounded-2xl shadow-xl border border-black/[0.08] dark:border-white/[0.1] py-1.5 z-30 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setSourceLang("simalungun");
                    if (targetLang === "simalungun") setTargetLang("indonesia");
                    setIsSourceOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] transition flex items-center justify-between ${
                    sourceLang === "simalungun" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                  }`}
                >
                  <span>Simalungun</span>
                  {sourceLang === "simalungun" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceLang("indonesia");
                    if (targetLang === "indonesia") setTargetLang("simalungun");
                    setIsSourceOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] transition flex items-center justify-between ${
                    sourceLang === "indonesia" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                  }`}
                >
                  <span>Indonesia</span>
                  {sourceLang === "indonesia" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                </button>
              </div>
            )}
          </div>

          {/* Central Swap Button */}
          <button
            type="button"
            onClick={swapDirection}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 active:scale-95 transition duration-200"
            title="Tukar Bahasa"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          {/* Target Language Dropdown */}
          <div className="relative shrink min-w-0" ref={targetRef}>
            <button
              type="button"
              onClick={() => {
                setIsTargetOpen(!isTargetOpen);
                setIsSourceOpen(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition duration-200"
            >
              <span className="truncate max-w-[110px] sm:max-w-none">{targetLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7a7a7a] shrink-0" />
            </button>

            {isTargetOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#272729] rounded-2xl shadow-xl border border-black/[0.08] dark:border-white/[0.1] py-1.5 z-30 animate-fadeIn">
                {sourceLang === "indonesia" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("simalungun");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] flex items-center justify-between ${
                        targetLang === "simalungun" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                      }`}
                    >
                      <span>Simalungun</span>
                      {targetLang === "simalungun" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("aksara");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] flex items-center justify-between ${
                        targetLang === "aksara" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                      }`}
                    >
                      <span>Aksara Simalungun</span>
                      {targetLang === "aksara" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
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
                      className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] flex items-center justify-between ${
                        targetLang === "indonesia" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                      }`}
                    >
                      <span>Indonesia</span>
                      {targetLang === "indonesia" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLang("aksara");
                        setIsTargetOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[14px] hover:bg-[#f5f5f7] dark:hover:bg-white/[0.06] flex items-center justify-between ${
                        targetLang === "aksara" ? "font-semibold text-[#0066cc] dark:text-[#2997ff]" : "text-[#1d1d1f] dark:text-[#f5f5f7]"
                      }`}
                    >
                      <span>Aksara Simalungun</span>
                      {targetLang === "aksara" && <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two Separate White Cards Grid (Apple Store Utility Card: rounded 18px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
          {/* Left Card: Input Box */}
          <div className="bg-white dark:bg-[#272729] rounded-[18px] p-4 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between min-h-[220px] sm:min-h-[260px] h-auto transition-colors duration-200">
            <div className="flex-1 flex flex-col overflow-y-auto pr-1">
              <textarea
                value={inputText}
                maxLength={500}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik atau tempelkan teks yang akan diterjemahkan"
                className="w-full flex-1 text-[16px] sm:text-[17px] text-[#1d1d1f] dark:text-white bg-transparent resize-none border-none focus:outline-none placeholder:text-[#7a7a7a] leading-relaxed tracking-[-0.015em]"
              />
            </div>

            {/* Bottom Input Action Row */}
            <div className="min-h-8 flex items-center justify-between text-[12px] text-[#7a7a7a] pt-2">
              {inputText ? (
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  className="hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 text-[#7a7a7a] font-normal transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
              ) : (
                <span />
              )}
              <span className="font-mono text-[#7a7a7a]">{inputText.length} / 500</span>
            </div>
          </div>

          {/* Right Card: Output Box */}
          <div className="bg-white dark:bg-[#272729] rounded-[18px] p-4 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between min-h-[220px] sm:min-h-[260px] h-auto transition-colors duration-200">
            {hasOutput ? (
              <>
                <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
                  {/* Aksara Output */}
                  {targetLang === "aksara" ? (
                    <div className="font-aksara text-2xl sm:text-4xl text-[#1d1d1f] dark:text-white tracking-wider leading-relaxed select-all break-words">
                      {currentAksara}
                    </div>
                  ) : (
                    /* Clean Latin Text Output */
                    <div className="text-[16px] sm:text-[19px] font-normal text-[#1d1d1f] dark:text-white leading-relaxed select-all tracking-[-0.015em] break-words">
                      {currentTranslation}
                    </div>
                  )}

                  {/* AI Explanation if active */}
                  {aiResult?.explanation && (
                    <p className="text-[12px] text-[#7a7a7a] italic break-words">
                      {aiResult.explanation}
                    </p>
                  )}
                </div>

                {/* Bottom Output Action Row */}
                <div className="min-h-8 flex flex-wrap items-center justify-between text-[12px] text-[#7a7a7a] pt-2 gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#7a7a7a]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff] shrink-0" />
                    <span className="font-normal text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {aiResult
                        ? "Terjemahan AI"
                        : analysis.tokens.some((t) => t.provenance === "dictionary")
                        ? "Kamus Baku"
                        : analysis.tokens.some((t) => t.provenance === "phrasebook")
                        ? "Frasa Terverifikasi"
                        : "Kaidah Baku"}
                    </span>
                    <a
                      href="#lensa-linguistik"
                      className="text-[#0066cc] dark:text-[#2997ff] hover:underline font-normal ml-1 inline-flex items-center gap-0.5"
                    >
                      <span>Bedah</span>
                      <span>&darr;</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* AI Translation Pill Button */}
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={handleTranslateWithAi}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#1d1d1f] hover:bg-[#e8e8ed] dark:hover:bg-[#333336] text-[#0066cc] dark:text-[#2997ff] text-[12px] font-medium transition active:scale-95"
                      title="Sempurnakan kalimat bebas dengan model AI berlandaskan kamus"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>AI</span>
                    </button>

                    {/* Share Card Modal button only relevant if aksara exists */}
                    {currentAksara && (
                      <button
                        type="button"
                        onClick={() => setIsExportOpen(true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                        title="Unduh Kartu Gambar PNG"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
                      title={targetLang === "aksara" ? "Salin Aksara" : "Salin Teks"}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-[#7a7a7a] text-[14px] select-none" />
            )}
          </div>
        </div>

        {/* AI Notice / Config Helper if error occurs */}
        {aiError && (
          <div className="mt-3 p-3.5 bg-white dark:bg-[#272729] rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] text-[12px] text-[#7a7a7a] flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] shrink-0" />
              <span>{aiError}</span>
            </div>
            <span className="text-[11px] text-[#7a7a7a]">Atur DEEPSEEK_API_KEY di Vercel</span>
          </div>
        )}
      </div>

      {/* Lensa Linguistik Container */}
      {currentAksara && (
        <section id="lensa-linguistik" className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] p-4 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
          {/* Lens Tabs: Pill Navigation with smooth mobile swiping */}
          <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("translit")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
                activeTab === "translit"
                  ? "bg-[#0066cc] text-white"
                  : "bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Transliterasi Bertahap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("phonology")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
                activeTab === "phonology"
                  ? "bg-[#0066cc] text-white"
                  : "bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span>Fonologi & Silabifikasi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("morphology")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
                activeTab === "morphology"
                  ? "bg-[#0066cc] text-white"
                  : "bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Morfologi & Leipzig Glossing</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("culture")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 ${
                activeTab === "culture"
                  ? "bg-[#0066cc] text-white"
                  : "bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <span>Konteks Budaya & Rujukan</span>
            </button>
          </div>

          {/* Tab Content inside Apple white utility card */}
          <div className="bg-white dark:bg-[#272729] rounded-[18px] p-6 border border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]">
            {/* Tab 1: Transliteration steps */}
            {activeTab === "translit" && (
              <div className="space-y-4">
                {/* Mobile stacked card view */}
                <div className="space-y-3 sm:hidden">
                  {analysis.transliterationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-4 bg-[#f5f5f7] dark:bg-black/30 rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono text-[#7a7a7a]">#{step.step}</span>
                          <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">{step.input}</span>
                        </div>
                        <span className="font-aksara text-2xl text-[#0066cc] dark:text-[#2997ff]">
                          {step.output || "(inheren)"}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">{step.explanation}</p>
                      <div className="text-[11px] font-mono text-[#7a7a7a] bg-white dark:bg-[#272729] px-2 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] w-fit">
                        {step.rule}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-[14px] border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-[#7a7a7a]">
                        <th className="py-3 px-3 font-medium">Langkah</th>
                        <th className="py-3 px-3 font-medium">Input</th>
                        <th className="py-3 px-3 font-medium">Kaidah</th>
                        <th className="py-3 px-3 font-medium">Aksara</th>
                        <th className="py-3 px-3 font-medium">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                      {analysis.transliterationSteps.map((step) => (
                        <tr key={step.step} className="hover:bg-[#f5f5f7]/50 dark:hover:bg-white/[0.02] transition">
                          <td className="py-2.5 px-3 font-mono text-[#7a7a7a] text-[12px]">#{step.step}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#1d1d1f] dark:text-white">{step.input}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-[11px] bg-[#f5f5f7] dark:bg-black/40 px-2 py-0.5 rounded-full text-[#7a7a7a] border border-black/[0.06] dark:border-white/[0.08]">
                              {step.rule}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-aksara text-2xl text-[#0066cc] dark:text-[#2997ff]">
                            {step.output || "(inheren)"}
                          </td>
                          <td className="py-2.5 px-3 text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
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
                  <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-3">
                    Segmentasi Suku Kata
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-[#f5f5f7] dark:bg-black/30 rounded-[14px] border border-black/[0.06] dark:border-white/[0.08]">
                        <span className="font-medium text-[#1d1d1f] dark:text-white text-[14px]">{tok.surface}:</span>
                        <div className="flex gap-1">
                          {tok.syllables.map((syl, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] rounded-full text-[12px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]"
                            >
                              {syl}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-2">
                    Kaidah Fonotaktik Simalungun
                  </h4>
                  <ul className="text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] space-y-1.5 list-disc list-inside">
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
                  <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-3">
                    Format Interlinear Leipzig
                  </h4>
                  <div className="p-5 bg-[#1d1d1f] dark:bg-black text-[#f5f5f7] rounded-[18px] font-mono text-[13px] space-y-2 overflow-x-auto border border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex gap-4">
                      <span className="text-[#7a7a7a] select-none w-24">Sumber:</span>
                      <span className="text-white">{analysis.interlinear.source}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#7a7a7a] select-none w-24">Segmentasi:</span>
                      <span className="text-[#2997ff]">{analysis.interlinear.segmented}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#7a7a7a] select-none w-24">Gloss:</span>
                      <span className="text-emerald-400">{analysis.interlinear.gloss}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#7a7a7a] select-none w-24">Bebas:</span>
                      <span className="text-[#f5f5f7]">&ldquo;{analysis.interlinear.free}&rdquo;</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a7a7a] mb-3">
                    Daftar Morfem
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.tokens.map((tok, i) => (
                      <div key={i} className="p-4 border border-black/[0.06] dark:border-white/[0.08] rounded-[14px] bg-[#f5f5f7] dark:bg-black/30">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-semibold text-[#1d1d1f] dark:text-white text-[15px]">{tok.surface}</span>
                          <span className="text-[11px] bg-white dark:bg-[#272729] text-[#7a7a7a] px-2 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] font-mono">
                            {tok.pos || "kata"}
                          </span>
                        </div>
                        <div className="text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] space-y-0.5">
                          <div>Lema dasar: <span className="text-[#1d1d1f] dark:text-white">{tok.lemma || tok.surface}</span></div>
                          <div>Morfem: <span className="text-[#1d1d1f] dark:text-white">{tok.morphemes.map((m) => `${m.form} (${m.gloss})`).join(" + ")}</span></div>
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
                        className="p-4 rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-black/30 text-[14px] flex items-start gap-3"
                      >
                        {note.kind === "warning" ? (
                          <AlertCircle className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] mt-0.5 shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] mt-0.5 shrink-0" />
                        )}
                        <div className="space-y-0.5">
                          <div className="font-medium text-[#1d1d1f] dark:text-white text-[14px]">
                            {note.kind === "culture"
                              ? "Catatan Budaya"
                              : note.kind === "morphology"
                              ? "Analisis Morfologi"
                              : "Pemberitahuan"}
                          </div>
                          <p className="text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-[#7a7a7a] italic">
                    Belum ada catatan budaya khusus untuk entri ini.
                  </p>
                )}

                <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-[12px] text-[#7a7a7a]">
                  <span>Rujukan: Kamus Simalungun: Indonesia (Tarigan 1989), Warisan Leluhur (Kozok 1999).</span>
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
        aksara={currentAksara}
        latin={analysis.latin}
        translation={currentTranslation}
      />
    </div>
  );
}
