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
    ctx.strokeStyle = "#1d1d1f";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = "#0066cc";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, width - 68, height - 68);

    // Corner accents
    const corners = [
      [42, 42],
      [width - 66, 42],
      [42, height - 66],
      [width - 66, height - 66]
    ];
    ctx.fillStyle = "#0066cc";
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx, cy, 24, 24);
    }

    // Top Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#1d1d1f";
    ctx.font = "bold 18px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillText("RUMAH HATA \u2022 SURAT SISIMOLUNGUN", width / 2, 85);

    ctx.fillStyle = "#7a7a7a";
    ctx.font = "14px 'SF Pro Text', 'Inter', system-ui, sans-serif";
    ctx.fillText("Aksara Batak Simalungun \u2022 Sumatera Utara", width / 2, 110);

    // Divider line
    ctx.strokeStyle = "#d6d3d1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 130);
    ctx.lineTo(width / 2 + 140, 130);
    ctx.stroke();

    // Centerpiece Aksara
    ctx.fillStyle = "#1d1d1f";
    ctx.font = "64px 'Noto Sans Batak', 'SF Pro Display', sans-serif";
    ctx.fillText(aksara, width / 2, 260);

    // Latin
    ctx.fillStyle = "#0066cc";
    ctx.font = "bold 26px 'SF Pro Display', 'Inter', system-ui, sans-serif";
    ctx.fillText(latin, width / 2, 340);

    // Indonesian Meaning
    if (translation && translation !== latin) {
      ctx.fillStyle = "#44403c";
      ctx.font = "italic 20px 'SF Pro Text', 'Inter', system-ui, sans-serif";
      ctx.fillText(`\u201C${translation}\u201D`, width / 2, 385);
    }

    // Footer
    ctx.fillStyle = "#a8a29e";
    ctx.font = "13px 'SF Pro Text', 'Inter', system-ui, sans-serif";
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
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#161617] rounded-[24px] max-w-2xl w-full border border-black/[0.08] dark:border-white/[0.1] shadow-2xl overflow-hidden space-y-4 p-6 sm:p-8 animate-fadeIn transition-colors duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white text-[17px]">Ekspor Kartu Aksara</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Preview Container */}
        <div className="rounded-[18px] overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-black p-3 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[340px] object-contain rounded-[14px]"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[13px] font-medium transition active:scale-95"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? "Tersimpan" : "Unduh Gambar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
