"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from "lucide-react";

interface Question {
  id: number;
  category: "Membaca" | "Ejaan" | "Budaya";
  prompt: string;
  glyphPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Membaca",
    prompt: "Aksara di bawah ini dibaca sebagai kata apa?",
    glyphPrompt: "\u1BC3\u1BEC\u1BD3\u1BD9\u1BF3",
    options: ["bamu", "horas", "duma", "hata"],
    correctIndex: 1, // B
    explanation:
      "Aksara terdiri dari: Ha+o (ᯃᯬ) 'ho' + Ra (ᯓ) + Sa dengan panongonan pemati (ᯙ᯳) 'ras', membentuk kata 'horas'."
  },
  {
    id: 2,
    category: "Ejaan",
    prompt: "Manakah penulisan aksara yang tepat untuk kata 'hata' (bahasa/kata)?",
    options: [
      "\u1BC5\u1BC8",
      "\u1BC3\u1BEC\u1BD3",
      "\u1BC3\u1BD6",
      "\u1BD9\u1BEA\u1BD5"
    ],
    correctIndex: 2, // C
    explanation:
      "Kata 'hata' dibentuk dari dua suku kata bervokal bawaan /a/: Ha Simalungun (ᯃ) + Ta Selatan (ᯖ) tanpa tanda vokal."
  },
  {
    id: 3,
    category: "Ejaan",
    prompt: "Apakah nama tanda pemati vokal khas yang digunakan dalam Aksara Batak Simalungun (U+1BF3)?",
    options: [
      "Pangolat",
      "Haminsaran",
      "Haboritan",
      "Panongonan"
    ],
    correctIndex: 3, // D
    explanation:
      "Aksara Batak Simalungun menggunakan tanda pemati vokal bernama 'Panongonan' (U+1BF3), berbeda dengan aksara Batak Toba dan Mandailing yang menggunakan 'Pangolat' (U+1BF2)."
  },
  {
    id: 4,
    category: "Ejaan",
    prompt: "Bagaimanakah penulisan suku kata 'su' pada Aksara Batak Simalungun?",
    glyphPrompt: "\u1BD9\u1BEF",
    options: [
      "Menggunakan aksara Sa (ᯙ) + diakritik khusus haboritan Sa (ᯯ, U+1BEF)",
      "Menggunakan aksara Sa (ᯙ) + haboritan umum (ᯮ, U+1BEE)",
      "Menggunakan vokal mandiri U (ᯥ)",
      "Menggunakan tanda sihorlu (ᯬ)"
    ],
    correctIndex: 0, // A
    explanation:
      "Pada ortografi Simalungun, suku kata 'su' wajib memakai diakritik /u/ khusus U+1BEF (ᯯ) yang berbeda bentuknya dari diakritik /u/ umum (U+1BEE) guna menjaga kejelasan anatomi aksara."
  },
  {
    id: 5,
    category: "Budaya",
    prompt: "Apakah arti falsafah luhur Simalungun 'Habonaron Do Bona'?",
    options: [
      "Kerja keras menghasilkan kemakmuran",
      "Satu hati dalam persaudaraan",
      "Kebenaran adalah pangkal atau dasar segalanya",
      "Menghormati orang tua dan leluhur"
    ],
    correctIndex: 2, // C
    explanation:
      "'Habonaron Do Bona' adalah semboyan kultural Simalungun: Habonaron (kebenaran/kejujuran) do (adalah) bona (pokok/pangkal/akar)."
  },
  {
    id: 6,
    category: "Membaca",
    prompt: "Kata yang berarti 'surat, tulisan, atau aksara' di bawah ini dibaca apa?",
    glyphPrompt: "\u1BD9\u1BEF\u1BD3\u1BD6\u1BF3",
    options: ["sirat", "surat", "sarit", "saut"],
    correctIndex: 1, // B
    explanation:
      "Aksara dibaca: Sa+u_khusus (ᯙᯯ) 'su' + Ra (ᯓ) + Ta+panongonan (ᯖ᯳) 'rat', merangkai kata 'surat'."
  },
  {
    id: 7,
    category: "Budaya",
    prompt: "Apakah nama naskah lipat kulit kayu gaharu tradisional Batak yang berisi kearifan kuno?",
    options: ["Ulos", "Laklak", "Tandok", "Pustaha"],
    correctIndex: 3, // D
    explanation:
      "Pustaha adalah kitab tradisional Batak berbahan kulit kayu alim (laklak) berisi catatan pengobatan, kalender ramalan, dan hukum adat."
  },
  {
    id: 8,
    category: "Ejaan",
    prompt: "Tanda diakritik manakah yang melambangkan diftong khas Simalungun /-ou/ seperti pada kata 'sopou'?",
    options: [
      "Hatulungan (ᯭ, U+1BED)",
      "Sihorlu (ᯬ, U+1BEC)",
      "Haluan (ᯪ, U+1BEA)",
      "Hajoringan (ᯱ, U+1BF1)"
    ],
    correctIndex: 0, // A
    explanation:
      "Diftong khas /-ou/ dalam bahasa Simalungun dilambangkan dengan diakritik 'hatulungan' (ᯭ, Unicode U+1BED)."
  },
  {
    id: 9,
    category: "Budaya",
    prompt: "Falsafah kekerabatan 'Tolu Sahundulan' dalam masyarakat Simalungun terdiri atas pilar apa saja?",
    options: [
      "Bapa, Inang, dan Anak",
      "Tondui, Sanina, dan Boru",
      "Raja, Datu, dan Parhata",
      "Huta, Ladang, dan Sopou"
    ],
    correctIndex: 1, // B
    explanation:
      "Tolu Sahundulan (Tiga Pilar Duduk Bersama) adalah struktur sosial kekerabatan Simalungun yang terdiri atas Tondui (pihak pemberi istri), Sanina (saudara semarga), dan Boru (pihak penerima istri)."
  },
  {
    id: 10,
    category: "Budaya",
    prompt: "Bagaimanakah ungkapan terima kasih baku yang santun dalam Bahasa Simalungun?",
    options: [
      "Mauliate",
      "Bujur melas",
      "Diatei tupa",
      "Njuah-njuah"
    ],
    correctIndex: 2, // C
    explanation:
      "'Diatei tupa' adalah ucapan terima kasih khas Simalungun, yang secara harfiah bermakna 'layak dan elok di hati'."
  }
];

function shuffleQuestionOptions(questions: Question[]): Question[] {
  return questions.map((q) => {
    const correctOptionText = q.options[q.correctIndex];
    const shuffled = [...q.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      ...q,
      options: shuffled,
      correctIndex: shuffled.indexOf(correctOptionText)
    };
  });
}

export default function LatihanPage() {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(shuffleQuestionOptions(INITIAL_QUESTIONS));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-[48px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
          Latihan Interaktif
        </h1>
        <p className="text-[17px] text-[#7a7a7a] dark:text-[#a1a1a6]">
          Uji pemahaman membaca aksara, kaidah ortografis, dan falsafah bahasa Simalungun.
        </p>
      </div>

      {!quizFinished ? (
        <div className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 space-y-6 transition-colors duration-200">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] text-[#7a7a7a] font-normal">
              <span>Pertanyaan {currentIndex + 1} dari {questions.length}</span>
              <span>Skor: {score}</span>
            </div>
            <div className="w-full bg-white dark:bg-[#272729] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0066cc] dark:bg-[#2997ff] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box inside white card */}
          <div className="bg-white dark:bg-[#272729] p-6 rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-black/30 text-[#7a7a7a] inline-block border border-black/[0.04] dark:border-white/[0.06]">
              {currentQ.category}
            </span>
            <h2 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white leading-snug">
              {currentQ.prompt}
            </h2>

            {/* Optional Glyph display */}
            {currentQ.glyphPrompt && (
              <div className="py-6 px-4 bg-[#f5f5f7] dark:bg-[#161617] rounded-[14px] text-center border border-black/[0.04] dark:border-white/[0.06]">
                <span className="font-aksara text-4xl sm:text-5xl text-[#0066cc] dark:text-[#2997ff] tracking-wider select-all">
                  {currentQ.glyphPrompt}
                </span>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let optStyle = "bg-white dark:bg-[#272729] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white hover:border-black/20 dark:hover:border-white/20";

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium";
                } else if (idx === selectedOption) {
                  optStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200";
                } else {
                  optStyle = "bg-white/40 dark:bg-[#272729]/40 border-black/[0.04] dark:border-white/[0.06] text-[#7a7a7a] opacity-50";
                }
              }

              const optionLetter = ["A", "B", "C", "D"][idx] || String(idx + 1);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-[14px] border text-left text-[15px] sm:text-[16px] transition flex items-center justify-between gap-3 active:scale-[0.99] duration-150 ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-black/30 text-[#7a7a7a] text-[12px] font-semibold flex items-center justify-center shrink-0 border border-black/[0.04] dark:border-white/[0.06]">
                      {optionLetter}
                    </span>
                    <span className={opt.startsWith("\u1BC0") || (opt.length <= 4 && /[\u1BC0-\u1BFF]/.test(opt)) ? "font-aksara text-2xl" : ""}>
                      {opt}
                    </span>
                  </div>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="p-5 rounded-[16px] bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] space-y-1 animate-fadeIn">
              <div className="font-semibold text-[15px] flex items-center gap-1.5">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Tepat sekali</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400">Belum tepat</span>
                )}
                <span>&middot; Penjelasan:</span>
              </div>
              <p className="leading-relaxed text-[#7a7a7a] dark:text-[#a1a1a6] text-[13px]">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-normal transition duration-200 flex items-center gap-2 active:scale-95"
              >
                <span>{currentIndex + 1 === questions.length ? "Lihat Skor" : "Lanjut"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] p-8 text-center space-y-6 transition-colors duration-200">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center mx-auto border border-black/[0.06] dark:border-white/[0.08]">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">Latihan Selesai</h2>
            <p className="text-[#7a7a7a] text-[15px]">
              Anda telah menyelesaikan {questions.length} pertanyaan.
            </p>
          </div>

          <div className="py-6 px-6 bg-white dark:bg-[#272729] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] max-w-xs mx-auto">
            <div className="text-[12px] text-[#7a7a7a] uppercase font-semibold tracking-wider mb-1">Skor Akhir</div>
            <div className="text-4xl font-semibold text-[#0066cc] dark:text-[#2997ff]">
              {score} / {questions.length}
            </div>
            <p className="text-[13px] text-[#7a7a7a] mt-2">
              {score >= 8
                ? "Luar biasa! Pemahaman Anda sangat baik."
                : "Bagus! Terus berlatih untuk mengasah penguasaan kaidah ortografi."}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={restartQuiz}
              className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-normal transition duration-200 flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
