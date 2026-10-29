import { Translator } from "@/components/Translator";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Sparkles, GraduationCap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-20">
      {/* Museum Gallery Hero */}
      <section className="pt-8 sm:pt-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-3.5">
        <h1 className="text-[28px] sm:text-4xl lg:text-[56px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-[1.12]">
          Penerjemah & Lensa Linguistik{" "}
          <span className="text-[#0066cc] dark:text-[#2997ff] block sm:inline">
            Batak Simalungun
          </span>
        </h1>
        <p className="text-[14px] sm:text-[17px] lg:text-[20px] text-[#7a7a7a] dark:text-[#a1a1a6] font-normal max-w-2xl mx-auto leading-relaxed">
          Terjemahan presisi kata dan kalimat, alih aksara Surat Sisimolungun, dan bedah linguistik terbuka.
        </p>

        {/* Primary Action Pills with smooth active micro-interaction */}
        <div className="pt-2 flex items-center justify-center gap-2.5">
          <Link
            href="/belajar"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 text-white text-[13px] sm:text-[15px] font-normal transition duration-200 shadow-2xs"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/kamus"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] hover:bg-[#e8e8ed] dark:hover:bg-[#333336] active:scale-95 text-[#0066cc] dark:text-[#2997ff] text-[13px] sm:text-[15px] font-normal transition duration-200"
          >
            <span>Buka Kamus</span>
          </Link>
        </div>
      </section>

      {/* Main Translator Section */}
      <section className="px-3 sm:px-6 max-w-5xl mx-auto">
        <Translator />
      </section>

      {/* Alternating Feature Tiles */}
      <section className="border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#161617] py-12 sm:py-20 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-[36px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
              Kecermatan Berbahasa
            </h2>
            <p className="text-[14px] sm:text-[16px] text-[#7a7a7a] dark:text-[#a1a1a6]">
              Setiap hasil terjemahan dibangun dengan standar tata bahasa yang dapat diuji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Tile 1: Alih Aksara */}
            <div className="relative overflow-hidden p-6 sm:p-7 bg-white dark:bg-[#272729] rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between min-h-[340px] sm:min-h-[380px] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 group">
              {/* Background Illustration */}
              <div className="absolute inset-x-0 top-0 h-44 z-0 overflow-hidden">
                <Image
                  src="/ilustrasi_alih_aksara.webp"
                  alt="Ilustrasi Alih Aksara Berkaidah"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white dark:via-[#272729]/70 dark:to-[#272729]" />
              </div>

              {/* Content */}
              <div className="relative z-10 pt-28 space-y-2.5">
                <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-sm shadow-xs flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                  Alih Aksara Berkaidah
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                  Alih aksara Surat Sisimolungun berjalan secara deterministik mengikuti blok Unicode resmi U+1BC0–U+1BFF.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <Link
                  href="/belajar"
                  className="text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline inline-flex items-center gap-1 font-normal"
                >
                  <span>Lihat bagan huruf</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Tile 2: Lensa Linguistik */}
            <div className="relative overflow-hidden p-6 sm:p-7 bg-white dark:bg-[#272729] rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between min-h-[340px] sm:min-h-[380px] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 group">
              {/* Background Illustration */}
              <div className="absolute inset-x-0 top-0 h-44 z-0 overflow-hidden">
                <Image
                  src="/ilustrasi_lensa_linguistik.webp"
                  alt="Ilustrasi Lensa Linguistik"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white dark:via-[#272729]/70 dark:to-[#272729]" />
              </div>

              {/* Content */}
              <div className="relative z-10 pt-28 space-y-2.5">
                <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-sm shadow-xs flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                  Lensa Linguistik
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                  Pahami pembagian suku kata, analisis morfem, serta makna budaya dari leksikon baku Simalungun.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <Link
                  href="/kamus"
                  className="text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline inline-flex items-center gap-1 font-normal"
                >
                  <span>Jelajahi leksikon</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Tile 3: Latihan Mandiri */}
            <div className="relative overflow-hidden p-6 sm:p-7 bg-white dark:bg-[#272729] rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between min-h-[340px] sm:min-h-[380px] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 group">
              {/* Background Illustration */}
              <div className="absolute inset-x-0 top-0 h-44 z-0 overflow-hidden">
                <Image
                  src="/ilustrasi_latihan_mandiri.webp"
                  alt="Ilustrasi Latihan Mandiri"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white dark:via-[#272729]/70 dark:to-[#272729]" />
              </div>

              {/* Content */}
              <div className="relative z-10 pt-28 space-y-2.5">
                <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-sm shadow-xs flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                  Latihan Mandiri
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                  Kuis membaca aksara dan kanvas interaktif untuk melatih goresan pena aksara secara bertahap.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <Link
                  href="/latihan"
                  className="text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline inline-flex items-center gap-1 font-normal"
                >
                  <span>Mulai kuis</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
