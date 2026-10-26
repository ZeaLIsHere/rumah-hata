import { Translator } from "@/components/Translator";
import Link from "next/link";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Penerjemah & Lensa Linguistik{" "}
          <span className="text-[#8b1e1b] dark:text-red-400">Batak Simalungun</span>
        </h1>
        <p className="text-base sm:text-lg text-stone-700 dark:text-slate-300 leading-relaxed">
          Terjemahkan kata atau kalimat antara Bahasa Indonesia dan Bahasa Simalungun,
          lengkap dengan alih aksara Surat Sisimolungun dan penjelasan linguistik mendalam.
        </p>
      </div>

      {/* Main Translator Core Component */}
      <Translator />

      {/* Feature Pillar Highlights */}
      <section className="pt-8 border-t border-stone-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Mengapa Rumah Hata Berbeda?
          </h2>
          <p className="text-sm text-stone-700 dark:text-slate-400 mt-1">
            Menghubungkan teknologi komputasi bahasa dengan keaslian budaya lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-[#161a24] rounded-xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors duration-200">
            <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#8b1e1b] dark:text-red-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base">
              Alih Aksara Akurat
            </h3>
            <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
              Setiap huruf dan suku kata dialihkan ke Surat Sisimolungun berdasarkan
              aturan ejaan asli dan standar resmi tulisan Batak.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#161a24] rounded-xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors duration-200">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base">
              Bedah Bahasa & Aksara
            </h3>
            <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
              Pahami alasan di balik setiap kata: pemisahan suku kata, akar kata,
              hingga makna adat dan filosofi luhur yang menyertai kata.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#161a24] rounded-xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors duration-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base">
              Pembelajaran Bertahap
            </h3>
            <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
              Dilengkapi modul belajar aksara mandiri, bagan interaktif huruf dasar (ina ni surat),
              dan kuis latihan dengan umpan balik ilmiah langsung.
            </p>
          </div>
        </div>

        {/* Quick link banner to learning modules */}
        <div className="mt-8 p-6 bg-stone-900 dark:bg-[#161a24] text-stone-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-transparent dark:border-slate-800 transition-colors duration-200">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-lg text-white">Ingin menguasai Surat Sisimolungun dari dasar?</h4>
            <p className="text-sm text-stone-300 dark:text-slate-400">
              Mulai dari pengenalan huruf induk, tanda vokal, hingga latihan membaca kalimat.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/belajar"
              className="px-4 py-2.5 rounded-lg bg-[#8b1e1b] dark:bg-[#a62521] hover:bg-[#6b1412] text-white text-sm font-semibold transition"
            >
              Belajar Aksara
            </Link>
            <Link
              href="/latihan"
              className="px-4 py-2.5 rounded-lg bg-stone-800 dark:bg-slate-800 hover:bg-stone-700 text-stone-200 text-sm font-medium border border-stone-700 dark:border-slate-700 transition"
            >
              Mulai Kuis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
