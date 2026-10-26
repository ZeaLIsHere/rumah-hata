"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, Image as ImageIcon, Check } from "lucide-react";

interface CardExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aksara: string;
  latin: string;
  translation: string;
}

export function CardExportModal({
  isOpen,
  onClose,
  aksara,
  latin,
  translation
}: CardExportModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !aksara) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1000;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#faf7ee";
    ctx.fillRect(0, 0, width, height);

    // Cultural border framing
    ctx.strokeStyle = "#8b1e1b";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, width - 68, height - 68);

    // Corner accents
    const corners = [
      [42, 42],
      [width - 66, 42],
      [42, height - 66],
      [width - 66, height - 66]
    ];
    ctx.fillStyle = "#8b1e1b";
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx, cy, 24, 24);
    }

    // Top Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#6b1412";
    ctx.font = "bold 18px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("RUMAH HATA \u2022 SURAT SISIMOLUNGUN", width / 2, 85);

    ctx.fillStyle = "#78716c";
    ctx.font = "14px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("Aksara Batak Simalungun \u2022 Sumatera Utara", width / 2, 110);

    // Divider line
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 130);
    ctx.lineTo(width / 2 + 140, 130);
    ctx.stroke();

    // Centerpiece Aksara
    ctx.fillStyle = "#18181b";
    ctx.font = "64px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(aksara, width / 2, 260);

    // Latin
    ctx.fillStyle = "#8b1e1b";
    ctx.font = "bold 26px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText(latin, width / 2, 340);

    // Indonesian Meaning
    if (translation && translation !== latin) {
      ctx.fillStyle = "#44403c";
      ctx.font = "italic 20px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillText(`\u201C${translation}\u201D`, width / 2, 385);
    }

    // Footer
    ctx.fillStyle = "#a8a29e";
    ctx.font = "13px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("Habonaron Do Bona \u2022 Kebenaran Adalah Pangkal Segala Sesuatu", width / 2, 530);
  }, [isOpen, aksara, latin, translation]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const cleanFileName = (latin || "aksara-simalungun")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    link.download = `rumah-hata-${cleanFileName}.png`;
    link.href = image;
    link.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#161a24] rounded-2xl max-w-2xl w-full border border-stone-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-4 p-5 sm:p-6 animate-fadeIn transition-colors duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#8b1e1b] dark:text-red-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base">Ekspor Kartu Aksara</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview Container */}
        <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-[#12151c] flex items-center justify-center p-2 shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[340px] object-contain rounded-lg shadow-xs"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2.5 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium rounded-xl transition flex items-center justify-center"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[44px] px-5 py-2.5 bg-[#8b1e1b] dark:bg-[#a62521] hover:bg-[#6b1412] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? "Tersimpan!" : "Unduh Gambar (PNG)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
