"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Check, Sparkles, PenTool } from "lucide-react";

interface PracticeLetter {
  char: string;
  latin: string;
  name: string;
}

const PRACTICE_LETTERS: PracticeLetter[] = [
  { char: "\u1BC3", latin: "ha", name: "Ha / Ka (ᯃ)" },
  { char: "\u1BC5", latin: "ba", name: "Ba (ᯅ)" },
  { char: "\u1BC8", latin: "pa", name: "Pa (ᯈ)" },
  { char: "\u1BD6", latin: "ta", name: "Ta (ᯖ)" },
  { char: "\u1BD9", latin: "sa", name: "Sa (ᯙ)" },
  { char: "\u1BD3", latin: "ra", name: "Ra (ᯓ)" },
  { char: "\u1BD5", latin: "ma", name: "Ma (ᯕ)" },
  { char: "\u1BDF", latin: "la", name: "La (ᯟ)" }
];

export function WritingCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<PracticeLetter>(PRACTICE_LETTERS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [canvasDim, setCanvasDim] = useState<number>(320);

  // Resize canvas according to container
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    // Calculate square size: fit screen nicely with max 360px
    const dim = Math.min(360, Math.max(260, containerWidth - 32));
    setCanvasDim(dim);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const drawTemplate = useCallback(
    (dim: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = dim;
      canvas.height = dim;

      // Background
      ctx.fillStyle = "#faf9f6";
      ctx.fillRect(0, 0, dim, dim);

      // Guide grid
      ctx.strokeStyle = "#e7e5e4";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(dim / 2, 0);
      ctx.lineTo(dim / 2, dim);
      ctx.moveTo(0, dim / 2);
      ctx.lineTo(dim, dim / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Faint template glyph
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = Math.round(dim * 0.5);
      ctx.font = `${fontSize}px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = "#e2ded6";
      ctx.fillText(selectedLetter.char, dim / 2, dim / 2);
    },
    [selectedLetter]
  );

  useEffect(() => {
    drawTemplate(canvasDim);
    setStrokeCount(0);
    setEvaluation(null);
  }, [selectedLetter, canvasDim, drawTemplate]);

  const resetCanvas = () => {
    drawTemplate(canvasDim);
    setStrokeCount(0);
    setEvaluation(null);
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setStrokeCount((prev) => prev + 1);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = "#8b1e1b";
    ctx.lineWidth = Math.max(6, Math.round(canvasDim / 35));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
    setIsDrawing(false);
  };

  const evaluateDrawing = () => {
    if (strokeCount === 0) {
      setEvaluation("Kanvas masih kosong. Goreskan jari atau kursor mengikuti panduan aksara.");
      return;
    }
    if (strokeCount < 2) {
      setEvaluation("Bagus! Teruskan latihan untuk membentuk kelenturan goresan alami.");
    } else {
      setEvaluation("Bentuk aksara telah terbentuk dengan baik. Goresan tegas dan proporsional!");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8b1e1b]">
            <PenTool className="w-4 h-4" />
            <span>Kanvas Latihan Aksara</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900">Latihan Menulis Goresan Aksara</h3>
          <p className="text-xs text-stone-700">Ikuti garis panduan samar untuk melatih memori motorik bentuk huruf.</p>
        </div>

        {/* Letter picker chips with accessible touch targets */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {PRACTICE_LETTERS.map((letter) => (
            <button
              key={letter.latin}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedLetter.latin === letter.latin
                  ? "bg-[#8b1e1b] text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800"
              }`}
            >
              <span className="font-aksara text-lg leading-none">{letter.char}</span>
              <span>{letter.latin}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8">
        {/* Canvas Display with auto-scaled dimension */}
        <div ref={containerRef} className="w-full max-w-[380px] flex flex-col items-center space-y-3">
          <div className="p-2 bg-[#faf9f6] rounded-2xl border-2 border-stone-300 shadow-inner w-fit">
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              style={{ width: `${canvasDim}px`, height: `${canvasDim}px` }}
              className="touch-none rounded-xl cursor-crosshair block shadow-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full justify-center">
            <button
              type="button"
              onClick={resetCanvas}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-700 hover:bg-stone-100 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
            <button
              type="button"
              onClick={evaluateDrawing}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8b1e1b] hover:bg-[#6b1412] text-xs text-white font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cek Goresan</span>
            </button>
          </div>
        </div>

        {/* Instructions & Feedback Panel */}
        <div className="w-full lg:max-w-md space-y-4">
          <div className="p-4 sm:p-5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Petunjuk Menulis:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700">
              <li>Pilih huruf yang ingin dilatih pada bilah pilihan di atas.</li>
              <li>Goreskan jari atau kursor pada kanvas mengikuti bayangan aksara.</li>
              <li>Tarik garis dari sisi kiri atas ke kanan bawah mengikuti aliran tradisional.</li>
              <li>Tekan tombol &ldquo;Cek Goresan&rdquo; untuk memeriksa kelengkapan bentuk.</li>
            </ol>
          </div>

          {evaluation && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#8b1e1b] mt-0.5 shrink-0" />
              <div>
                <div className="font-bold mb-0.5">Umpan Balik:</div>
                <p className="leading-relaxed">{evaluation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
