"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Check, Sparkles, PenTool } from "lucide-react";
import { useTheme } from "./ThemeProvider";

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
  const { theme } = useTheme();

  // Resize canvas according to container
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
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

      const isDark = document.documentElement.classList.contains("dark");

      // Background
      ctx.fillStyle = isDark ? "#1d1d1f" : "#ffffff";
      ctx.fillRect(0, 0, dim, dim);

      // Guide grid
      ctx.strokeStyle = isDark ? "#2a2a2c" : "#f0f0f0";
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
      ctx.fillStyle = isDark ? "#333336" : "#e0e0e0";
      ctx.fillText(selectedLetter.char, dim / 2, dim / 2);
    },
    [selectedLetter]
  );

  useEffect(() => {
    drawTemplate(canvasDim);
    setStrokeCount(0);
    setEvaluation(null);
  }, [selectedLetter, canvasDim, drawTemplate, theme]);

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

    ctx.strokeStyle = "#0066cc";
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
      setEvaluation("Kanvas masih kosong. Goreskan jari atau kursor mengikuti bayangan aksara.");
      return;
    }
    if (strokeCount < 2) {
      setEvaluation("Bagus! Teruskan latihan untuk membentuk kelenturan goresan alami.");
    } else {
      setEvaluation("Bentuk aksara terbentuk dengan baik. Goresan tegas dan proporsional!");
    }
  };

  return (
    <div className="bg-[#f5f5f7] dark:bg-[#161617] rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] p-6 sm:p-8 space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-5">
        <div>
          <h3 className="text-[21px] font-semibold text-[#1d1d1f] dark:text-white">Latihan Goresan Aksara</h3>
          <p className="text-[14px] text-[#7a7a7a]">Ikuti garis panduan untuk melatih ingatan motorik bentuk huruf.</p>
        </div>

        {/* Letter picker chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {PRACTICE_LETTERS.map((letter) => (
            <button
              key={letter.latin}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition duration-200 flex items-center gap-1.5 active:scale-95 ${
                selectedLetter.latin === letter.latin
                  ? "bg-[#0066cc] text-white"
                  : "bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08]"
              }`}
            >
              <span className="font-aksara text-base">{letter.char}</span>
              <span>{letter.latin}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Canvas Display */}
        <div ref={containerRef} className="w-full max-w-[380px] flex flex-col items-center space-y-4">
          <div className="p-3 bg-white dark:bg-[#272729] rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] w-fit shadow-xs">
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              style={{ width: `${canvasDim}px`, height: `${canvasDim}px` }}
              className="touch-none rounded-[14px] cursor-crosshair block bg-white dark:bg-[#1d1d1f]"
            />
          </div>

          <div className="flex items-center gap-2 w-full justify-center">
            <button
              type="button"
              onClick={resetCanvas}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-[#272729] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
            <button
              type="button"
              onClick={evaluateDrawing}
              className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-[13px] text-white font-medium transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cek Goresan</span>
            </button>
          </div>
        </div>

        {/* Instructions & Feedback Panel */}
        <div className="w-full lg:max-w-md space-y-4">
          <div className="p-6 bg-white dark:bg-[#272729] rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] text-[14px] text-[#7a7a7a] dark:text-[#a1a1a6] space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] dark:text-white text-[15px]">Panduan Menulis:</h4>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Pilih huruf yang ingin dilatih pada bilah di atas.</li>
              <li>Goreskan jari atau stylus mengikuti bayangan aksara.</li>
              <li>Tarik garis dari sisi kiri atas ke kanan bawah.</li>
              <li>Tekan tombol &ldquo;Cek Goresan&rdquo; untuk memeriksa hasil.</li>
            </ol>
          </div>

          {evaluation && (
            <div className="p-5 bg-white dark:bg-[#272729] border border-[#0066cc]/30 dark:border-[#2997ff]/30 rounded-[18px] text-[14px] text-[#1d1d1f] dark:text-white flex items-start gap-3 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold mb-0.5">Umpan Balik:</div>
                <p className="text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">{evaluation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
