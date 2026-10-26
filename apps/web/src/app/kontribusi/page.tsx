"use client";

import { useState, useEffect } from "react";
import { transliterateLatinToAksara } from "@rumah-hata/linguistics";
import { Users, Send, Download, CheckCircle2, ShieldCheck } from "lucide-react";

interface ContributionItem {
  id: string;
  type: "add" | "edit";
  lemma: string;
  gloss: string;
  pos: string;
  example: string;
  source: string;
  aksara: string;
  notes: string;
  validation: "unverified";
  timestamp: string;
}

export default function KontribusiPage() {
  const [lemma, setLemma] = useState("");
  const [gloss, setGloss] = useState("");
  const [pos, setPos] = useState("noun");
  const [example, setExample] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [submittedList, setSubmittedList] = useState<ContributionItem[]>([]);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rumah_hata_contributions");
      if (stored) {
        setSubmittedList(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const previewAksara = lemma.trim() ? transliterateLatinToAksara(lemma).aksara : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lemma.trim() || !gloss.trim() || !source.trim()) return;

    const newItem: ContributionItem = {
      id: `contrib-${Date.now()}`,
      type: "add",
      lemma: lemma.trim().toLowerCase(),
      gloss: gloss.trim(),
      pos,
      example: example.trim(),
      source: source.trim(),
      aksara: previewAksara,
      notes: notes.trim(),
      validation: "unverified",
      timestamp: new Date().toISOString()
    };

    const updated = [newItem, ...submittedList];
    setSubmittedList(updated);
    try {
      localStorage.setItem("rumah_hata_contributions", JSON.stringify(updated));
    } catch (e) {}

    // Reset inputs
    setLemma("");
    setGloss("");
    setExample("");
    setSource("");
    setNotes("");
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(submittedList, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usulan-data-simalungun-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b1e1b] dark:text-red-400">
          <Users className="w-4 h-4" />
          <span>Partisipasi Komunitas</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Usulan & Validasi Komunitas
        </h1>
        <p className="text-stone-700 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Bantu memperkaya leksikon bahasa Batak Simalungun. Setiap usulan kata baru dicatat dengan status
          <span className="font-semibold text-amber-800 dark:text-amber-400"> unverified</span> hingga diverifikasi oleh penutur asli atau pakar bahasa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#161a24] p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors duration-200"
          >
            <div className="border-b border-stone-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">Form Usulan Kata Baru</h2>
              <p className="text-xs text-stone-600 dark:text-slate-400">Wajib mencantumkan sumber rujukan atau penutur yang dapat dihubungi.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Kata Simalungun (Latin) *
                </label>
                <input
                  type="text"
                  required
                  value={lemma}
                  onChange={(e) => setLemma(e.target.value)}
                  placeholder="Contoh: torang, boru, sinabul..."
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500 placeholder:text-stone-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Pratinjau Aksara Otomatis
                </label>
                <div className="w-full h-10 px-3.5 flex items-center bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg font-aksara text-2xl text-[#8b1e1b] dark:text-red-400">
                  {previewAksara || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Arti Bahasa Indonesia *
                </label>
                <input
                  type="text"
                  required
                  value={gloss}
                  onChange={(e) => setGloss(e.target.value)}
                  placeholder="Contoh: terang, jelas, perempuan..."
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500 placeholder:text-stone-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                  Kelas Kata
                </label>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500"
                >
                  <option value="noun">Nomina (Kata Benda)</option>
                  <option value="verb">Verba (Kata Kerja)</option>
                  <option value="adj">Adjektiva (Kata Sifat)</option>
                  <option value="pron">Pronomina (Kata Ganti)</option>
                  <option value="phrase">Frasa / Ungkapan</option>
                  <option value="num">Numeralia (Bilangan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Contoh Kalimat Penggunaan
              </label>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Contoh: Torang do ari (Harinya cerah)..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500 placeholder:text-stone-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Sumber / Narasumber Rujukan *
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Judul buku, artikel, nama narasumber penutur, atau kampung asal..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500 placeholder:text-stone-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1">
                Catatan Budaya / Konteks Tambahan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Konteks adat, tingkat tutur, atau perbedaannya dengan dialek lain..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#8b1e1b] dark:focus:border-red-500 placeholder:text-stone-400 dark:placeholder:text-slate-500"
              />
            </div>

            {justSubmitted && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Usulan berhasil disimpan ke antrean lokal berstatus unverified.</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#8b1e1b] dark:bg-[#a62521] hover:bg-[#6b1412] text-white text-sm font-semibold transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Usulan Kata</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info & Queue Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#161a24] p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors duration-200">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white text-sm">
              <ShieldCheck className="w-4 h-4 text-[#8b1e1b] dark:text-red-400" />
              <span>Bagaimana Usulan Diverifikasi?</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed">
              Setiap kata yang diusulkan tidak langsung masuk ke kamus baku.
              Validator linguistik akan memeriksa kecocokan fonologi dan etimologi sebelum dinaikkan ke status
              <span className="font-semibold text-emerald-800 dark:text-emerald-400"> community</span> atau <span className="font-semibold text-emerald-800 dark:text-emerald-400">expert</span>.
            </p>
          </div>

          {/* Local Queue List */}
          <div className="bg-white dark:bg-[#161a24] p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white text-sm">Antrean Usulan Anda</h3>
                <span className="text-[11px] text-stone-600 dark:text-slate-400">{submittedList.length} usulan tersimpan</span>
              </div>
              {submittedList.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-2.5 py-1 text-xs text-[#8b1e1b] dark:text-red-400 border border-stone-200 dark:border-slate-700 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-800 transition flex items-center gap-1 font-medium"
                  title="Unduh file JSON untuk review tim pengembang"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor JSON</span>
                </button>
              )}
            </div>

            {submittedList.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {submittedList.map((item) => (
                  <div key={item.id} className="p-3 bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-white text-sm capitalize">{item.lemma}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {item.validation}
                      </span>
                    </div>
                    <div className="font-aksara text-base text-[#8b1e1b] dark:text-red-400">{item.aksara}</div>
                    <div className="text-xs text-stone-700 dark:text-slate-300">Arti: {item.gloss}</div>
                    <div className="text-[10px] text-stone-600 dark:text-slate-400 font-mono">Sumber: {item.source}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-stone-600 dark:text-slate-400 italic border border-dashed border-stone-200 dark:border-slate-800 rounded-xl">
                Belum ada usulan kata yang dikirim pada sesi ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
