"use client";

import { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<PracticeLetter>(PRACTICE_LETTERS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [evaluation, setEvaluation] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    resetCanvas();
  }, [selectedLetter]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 360;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#faf9f6";
    ctx.fillRect(0, 0, width, height);

    // Guide grid
    ctx.strokeStyle = "#e7e5e4";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Faint tracing template glyph
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "180px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#e2ded6";
    ctx.fillText(selectedLetter.char, width / 2, height / 2);

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
    ctx.lineWidth = 10;
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
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8b1e1b]">
            <PenTool className="w-4 h-4" />
            <span>Kanvas Latihan Aksara</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900">Latihan Menulis Goresan Aksara</h3>
          <p className="text-xs text-stone-700">Ikuti garis panduan samar untuk melatih memori motorik bentuk huruf.</p>
        </div>

        {/* Letter picker chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {PRACTICE_LETTERS.map((letter) => (
            <button
              key={letter.latin}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                selectedLetter.latin === letter.latin
                  ? "bg-[#8b1e1b] text-white"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700"
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
        <div className="flex flex-col items-center space-y-3">
          <div className="p-2 bg-[#faf9f6] rounded-2xl border-2 border-stone-300 shadow-inner inline-block">
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              className="touch-none rounded-xl cursor-crosshair block shadow-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetCanvas}
              className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 hover:bg-stone-100 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan Kanvas</span>
            </button>
            <button
              type="button"
              onClick={evaluateDrawing}
              className="px-4 py-1.5 rounded-lg bg-[#8b1e1b] hover:bg-[#6b1412] text-xs text-white font-semibold transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cek Goresan</span>
            </button>
          </div>
        </div>

        {/* Instructions & Feedback Panel */}
        <div className="max-w-md space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Petunjuk Menulis:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700">
              <li>Pilih huruf yang ingin dilatih pada bilah pilihan di atas.</li>
              <li>Goreskan jari atau pen stylus pada bidang kanvas mengikuti bayangan aksara.</li>
              <li>Tarik garis dari sisi kiri atas ke kanan bawah mengikuti aliran tradisional pena lidi (suligi).</li>
              <li>Tekan tombol &ldquo;Cek Goresan&rdquo; untuk memeriksa kelengkapan bentuk.</li>
            </ol>
          </div>

          {evaluation && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 flex items-start gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#8b1e1b] mt-0.5 shrink-0" />
              <div>
                <div className="font-bold mb-0.5">Umpan Balik Latihan:</div>
                <p className="leading-relaxed">{evaluation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
