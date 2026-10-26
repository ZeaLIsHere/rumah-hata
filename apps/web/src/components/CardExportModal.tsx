"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, Image as ImageIcon, Sparkles, Check } from "lucide-react";

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

    // Canvas dimensions: 1000 x 600 px (crisp landscape card)
    const width = 1000;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 1. Background: Warm parchment / laklak bark tone
    ctx.fillStyle = "#faf7ee";
    ctx.fillRect(0, 0, width, height);

    // 2. Cultural border framing
    ctx.strokeStyle = "#8b1e1b";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, width - 68, height - 68);

    // Corner decorative corner accents
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

    // 3. Top Header: Brand & Identity
    ctx.textAlign = "center";
    ctx.fillStyle = "#6b1412";
    ctx.font = "bold 18px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("RUMAH HATA \u2022 SURAT SISIMOLUNGUN", width / 2, 85);

    ctx.fillStyle = "#78716c";
    ctx.font = "14px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("Aksara Batak Simalungun \u2022 Sumatera Utara", width / 2, 110);

    // Decorative divider line
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 130);
    ctx.lineTo(width / 2 + 140, 130);
    ctx.stroke();

    // 4. Centerpiece: Surat Sisimolungun (Aksara)
    ctx.fillStyle = "#18181b";
    ctx.font = "64px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(aksara, width / 2, 260);

    // 5. Latin Transcription
    ctx.fillStyle = "#8b1e1b";
    ctx.font = "bold 26px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText(latin, width / 2, 340);

    // 6. Indonesian Meaning / Gloss
    if (translation && translation !== latin) {
      ctx.fillStyle = "#44403c";
      ctx.font = "italic 20px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillText(`\u201C${translation}\u201D`, width / 2, 385);
    }

    // 7. Footer: Motto Simalungun
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden space-y-4 p-5 sm:p-6 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#8b1e1b] flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Ekspor Kartu Aksara</h3>
              <p className="text-xs text-stone-700">Format gambar PNG beresolusi tinggi siap bagikan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview Container */}
        <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center p-2 shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[340px] object-contain rounded-lg shadow-xs"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-stone-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Desain ornamen bingkai terinspirasi laklak pustaha Simalungun</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium rounded-lg transition"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#8b1e1b] hover:bg-[#6b1412] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? "Tersimpan!" : "Unduh Gambar (PNG)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
