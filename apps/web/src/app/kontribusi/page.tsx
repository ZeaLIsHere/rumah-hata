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
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-[48px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.025em] leading-tight">
          Kontribusi Komunitas
        </h1>
        <p className="text-[17px] text-[#7a7a7a] dark:text-[#a1a1a6]">
          Bantu perkaya kosakata bahasa Batak Simalungun melalui usulan terverifikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-[#f5f5f7] dark:bg-[#161617] p-8 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] space-y-5 transition-colors duration-200"
          >
            <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white">Usul Kata Baru</h2>
              <p className="text-[13px] text-[#7a7a7a]">Cantumkan sumber buku atau penutur yang dapat dikonfirmasi.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                  Kata Simalungun (Latin) *
                </label>
                <input
                  type="text"
                  required
                  value={lemma}
                  onChange={(e) => setLemma(e.target.value)}
                  placeholder="Contoh: torang, sinabul..."
                  className="w-full px-4 h-11 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] placeholder:text-[#7a7a7a]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                  Pratinjau Aksara
                </label>
                <div className="w-full h-11 px-4 flex items-center bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] rounded-[12px] font-aksara text-2xl text-[#0066cc] dark:text-[#2997ff]">
                  {previewAksara || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                  Arti Bahasa Indonesia *
                </label>
                <input
                  type="text"
                  required
                  value={gloss}
                  onChange={(e) => setGloss(e.target.value)}
                  placeholder="Contoh: terang, juru bicara..."
                  className="w-full px-4 h-11 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] placeholder:text-[#7a7a7a]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                  Kelas Kata
                </label>
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full px-4 h-11 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff]"
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
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Contoh Kalimat
              </label>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Contoh: Torang do ari..."
                className="w-full px-4 h-11 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] placeholder:text-[#7a7a7a]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Sumber Rujukan *
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Judul kamus, artikel, atau nama penutur..."
                className="w-full px-4 h-11 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] placeholder:text-[#7a7a7a]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Catatan Konteks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Konteks adat atau perbedaan tingkat tutur..."
                className="w-full px-4 py-3 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] placeholder:text-[#7a7a7a]"
              />
            </div>

            {justSubmitted && (
              <div className="p-4 bg-white dark:bg-[#272729] border border-emerald-500/30 rounded-[14px] text-emerald-700 dark:text-emerald-400 text-[13px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Usulan tersimpan di antrean kurasi.</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-normal transition duration-200 flex items-center gap-2 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Usulan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#f5f5f7] dark:bg-[#161617] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] space-y-3 transition-colors duration-200">
            <h3 className="font-semibold text-[#1d1d1f] dark:text-white text-[15px]">Prinsip Validasi</h3>
            <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
              Setiap kata akan diverifikasi oleh validator pakar bahasa sebelum dimasukkan ke dalam leksikon baku.
            </p>
          </div>

          {/* Local Queue List */}
          <div className="bg-[#f5f5f7] dark:bg-[#161617] p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white text-[15px]">Antrean Usulan</h3>
                <span className="text-[12px] text-[#7a7a7a]">{submittedList.length} tersimpan</span>
              </div>
              {submittedList.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-3 py-1 text-[12px] text-[#0066cc] dark:text-[#2997ff] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#272729] rounded-full hover:border-black/20 transition flex items-center gap-1 font-normal"
                >
                  <Download className="w-3 h-3" />
                  <span>Ekspor</span>
                </button>
              )}
            </div>

            {submittedList.length > 0 ? (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {submittedList.map((item) => (
                  <div key={item.id} className="p-4 bg-white dark:bg-[#272729] border border-black/[0.06] dark:border-white/[0.08] rounded-[14px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1d1d1f] dark:text-white text-[14px] capitalize">{item.lemma}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-black/30 text-[#7a7a7a]">
                        {item.validation}
                      </span>
                    </div>
                    <div className="font-aksara text-base text-[#0066cc] dark:text-[#2997ff]">{item.aksara}</div>
                    <div className="text-[12px] text-[#7a7a7a]">Arti: {item.gloss}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[13px] text-[#7a7a7a] italic border border-dashed border-black/[0.08] dark:border-white/[0.1] rounded-[16px]">
                Belum ada usulan kata pada sesi ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
