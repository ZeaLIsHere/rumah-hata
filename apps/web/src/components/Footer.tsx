import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 mt-16 text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-stone-900">Rumah Hata</span>
              <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                Edisi Simalungun
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-700">
              Media belajar interaktif terjemahan dan transliterasi Surat Batak Simalungun.
              Setiap hasil dilengkapi penjelasan linguistik terbuka berbasis sumber rujukan terverifikasi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 text-sm mb-3">Landasan Rujukan</h4>
            <ul className="text-sm space-y-1.5 text-stone-700">
              <li>Uli Kozok (1999) Warisan Leluhur: Sastra Lama dan Aksara Batak</li>
              <li>H.G. Tarigan & J. Tarigan (1989) Kamus Simalungun: Indonesia</li>
              <li>A. Saragih dkk. (1989) Struktur Bahasa Simalungun</li>
              <li>Unicode Standard Blok Batak (U+1BC0:U+1BFF)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 text-sm mb-3">Prinsip Komitmen</h4>
            <p className="text-sm text-stone-700 leading-relaxed mb-3">
              Akurasi linguistik dan penghormatan budaya di atas kecepatan. Aturan aksara bersifat
              deterministik tanpa tebakan acak.
            </p>
            <div className="text-xs text-stone-700">
              <Link href="/tentang" className="text-[#8b1e1b] hover:underline font-medium">
                Baca metodologi dan rekam keputusan linguistik &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-3">
          <p>
            Didedikasikan untuk pelestarian bahasa dan aksara daerah Sumatera Utara.
          </p>
          <p className="font-mono">Habonaron Do Bona (ᯃᯅᯬᯉᯓᯬᯉ᯳ ᯑᯬ ᯅᯬᯉ)</p>
        </div>
      </div>
    </footer>
  );
}
