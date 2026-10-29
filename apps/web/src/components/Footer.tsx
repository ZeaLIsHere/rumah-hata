import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#161617] mt-24 text-[#7a7a7a] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="Logo Rumah Hata"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="font-semibold text-[#1d1d1f] dark:text-white text-base">Rumah Hata</span>
              <span className="text-[11px] bg-white dark:bg-black/40 text-[#7a7a7a] px-2 py-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
                Simalungun
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#7a7a7a]">
              Media pelestarian terjemahan dan alih aksara Batak Simalungun.
              Setiap hasil dilengkapi penjelasan morfologi dan fonologi berbasis pustaka terverifikasi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] mb-3">Landasan Rujukan</h4>
            <ul className="text-[14px] space-y-2 text-[#7a7a7a]">
              <li>Uli Kozok (1999) Warisan Leluhur</li>
              <li>H.G. Tarigan (1989) Kamus Simalungun: Indonesia</li>
              <li>A. Saragih (1989) Struktur Bahasa Simalungun</li>
              <li>Unicode Standard Blok Batak (U+1BC0:U+1BFF)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] mb-3">Prinsip Desain & Ejaan</h4>
            <p className="text-[14px] text-[#7a7a7a] leading-relaxed mb-3">
              Kejujuran linguistik diutamakan. Aksara dialihkan secara deterministik mengikuti kaidah ortografi baku.
            </p>
            <div className="text-[14px]">
              <Link href="/tentang" className="text-[#0066cc] dark:text-[#2997ff] hover:underline font-normal inline-flex items-center gap-1">
                <span>Pelajari kaidah dan metodologi</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#7a7a7a] gap-3">
          <p>
            Copyright &copy; 2026 Rumah Hata. Didedikasikan untuk pelestarian aksara Nusantara.
          </p>
          <p className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
            Habonaron Do Bona (ᯃᯅᯬᯉᯓᯬᯉ᯳ ᯑᯬ ᯅᯬᯉ)
          </p>
        </div>
      </div>
    </footer>
  );
}
