import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="font-aksara text-6xl text-stone-300">ᯃ</div>
      <h2 className="text-2xl font-bold text-stone-900">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-stone-700">Halaman yang Anda cari belum tersedia.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-[#8b1e1b] text-white text-sm font-semibold hover:bg-[#6b1412] transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
