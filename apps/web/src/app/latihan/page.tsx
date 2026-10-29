"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from "lucide-react";

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
    // Fisher-Yates shuffle
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
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1b] dark:text-red-400">
          <GraduationCap className="w-4 h-4" />
          <span>Kuis Interaktif</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Latihan Aksara & Bahasa Simalungun
        </h1>
        <p className="text-stone-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Uji pemahaman membaca aksara, kaidah ortografis, dan falsafah bahasa.
          Setiap jawaban dilengkapi penjelasan langsung.
        </p>
      </div>

      {!quizFinished ? (
        <div className="bg-white dark:bg-[#161a24] rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors duration-200">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-stone-600 dark:text-slate-400 font-medium">
              <span>Pertanyaan {currentIndex + 1} dari {questions.length}</span>
              <span>Skor: {score}</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#8b1e1b] dark:bg-[#a62521] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="space-y-3">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 inline-block">
              Kategori: {currentQ.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-snug">
              {currentQ.prompt}
            </h2>

            {/* Optional Glyph display */}
            {currentQ.glyphPrompt && (
              <div className="py-6 px-4 bg-[#faf9f6] dark:bg-[#12151c] border border-stone-200 dark:border-slate-800 rounded-xl text-center">
                <span className="font-aksara text-4xl sm:text-5xl text-[#8b1e1b] dark:text-red-400 tracking-wider select-all">
                  {currentQ.glyphPrompt}
                </span>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let optStyle = "bg-stone-50 dark:bg-slate-800/60 border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-800";

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold";
                } else if (idx === selectedOption) {
                  optStyle = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-200";
                } else {
                  optStyle = "bg-stone-50 dark:bg-slate-800/30 border-stone-200 dark:border-slate-800 text-stone-400 dark:text-slate-600 opacity-60";
                }
              }

              const optionLetter = ["A", "B", "C", "D"][idx] || String(idx + 1);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base transition flex items-center justify-between gap-3 ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-slate-700 text-stone-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
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
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 text-xs sm:text-sm text-stone-800 dark:text-slate-200 space-y-1 animate-fadeIn">
              <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                {selectedOption === currentQ.correctIndex ? (
                  <span className="text-emerald-700 dark:text-emerald-400">Tepat sekali!</span>
                ) : (
                  <span className="text-rose-700 dark:text-rose-400">Belum tepat.</span>
                )}
                <span>Penjelasan:</span>
              </div>
              <p className="leading-relaxed text-stone-700 dark:text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg bg-[#8b1e1b] dark:bg-[#a62521] hover:bg-[#6b1412] text-white text-sm font-semibold transition flex items-center gap-2"
              >
                <span>{currentIndex + 1 === questions.length ? "Lihat Skor Akhir" : "Soal Berikutnya"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="bg-white dark:bg-[#161a24] rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-8 text-center space-y-6 transition-colors duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Sesi Latihan Selesai!</h2>
            <p className="text-stone-700 dark:text-slate-400 text-sm">
              Anda telah menyelesaikan {questions.length} pertanyaan kuis.
            </p>
          </div>

          <div className="py-6 px-4 bg-stone-50 dark:bg-slate-800/60 rounded-xl border border-stone-200 dark:border-slate-700 max-w-sm mx-auto">
            <div className="text-xs text-stone-600 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Skor Akhir</div>
            <div className="text-4xl font-extrabold text-[#8b1e1b] dark:text-red-400">
              {score} / {questions.length}
            </div>
            <p className="text-xs text-stone-600 dark:text-slate-400 mt-2">
              {score >= 8
                ? "Luar biasa! Pemahaman kaidah aksara dan bahasa Anda sangat baik."
                : "Bagus! Terus berlatih untuk memperkuat penguasaan kaidah ortografi."}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={restartQuiz}
              className="px-5 py-2.5 rounded-lg bg-[#8b1e1b] dark:bg-[#a62521] hover:bg-[#6b1412] text-white text-sm font-semibold transition flex items-center gap-2"
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
