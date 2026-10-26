import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-[#12151c] mt-16 text-stone-700 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-stone-900 dark:text-white">Rumah Hata</span>
              <span className="text-xs bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 px-2 py-0.5 rounded">
                Edisi Simalungun
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-700 dark:text-slate-400">
              Media belajar interaktif terjemahan dan transliterasi Surat Batak Simalungun.
              Setiap hasil dilengkapi penjelasan linguistik terbuka berbasis sumber rujukan terverifikasi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 dark:text-slate-200 text-sm mb-3">Landasan Rujukan</h4>
            <ul className="text-sm space-y-1.5 text-stone-700 dark:text-slate-400">
              <li>Uli Kozok (1999) Warisan Leluhur: Sastra Lama dan Aksara Batak</li>
              <li>H.G. Tarigan & J. Tarigan (1989) Kamus Simalungun: Indonesia</li>
              <li>A. Saragih dkk. (1989) Struktur Bahasa Simalungun</li>
              <li>Unicode Standard Blok Batak (U+1BC0:U+1BFF)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 dark:text-slate-200 text-sm mb-3">Prinsip Komitmen</h4>
            <p className="text-sm text-stone-700 dark:text-slate-400 leading-relaxed mb-3">
              Akurasi linguistik dan penghormatan budaya di atas kecepatan. Aturan aksara bersifat
              deterministik tanpa tebakan acak.
            </p>
            <div className="text-xs text-stone-700 dark:text-slate-400">
              <Link href="/tentang" className="text-[#8b1e1b] dark:text-red-400 hover:underline font-medium">
                Baca kaidah ejaan dan rujukan kepustakaan &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 dark:text-slate-400 gap-3">
          <p>
            Didedikasikan untuk pelestarian bahasa dan aksara daerah Sumatera Utara.
          </p>
          <p className="font-mono text-stone-800 dark:text-slate-300">Habonaron Do Bona (ᯃᯅᯬᯉᯓᯬᯉ᯳ ᯑᯬ ᯅᯬᯉ)</p>
        </div>
      </div>
    </footer>
  );
}
