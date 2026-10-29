"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Check, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
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

interface EvaluationResult {
  score: number;
  coverage: number;
  precision: number;
  status: "success" | "warning" | "error";
  title: string;
  feedback: string;
}

export function WritingCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<PracticeLetter>(PRACTICE_LETTERS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [canvasDim, setCanvasDim] = useState<number>(320);
  const { theme } = useTheme();

  // Resize canvas according to container
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const dim = Math.min(360, Math.max(220, containerWidth - 24));
    setCanvasDim(dim);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Draw background, grid, template glyph, and any existing user strokes
  const redrawAll = useCallback(
    (dim: number, currentStrokes: Array<Array<{ x: number; y: number }>>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = dim;
      canvas.height = dim;

      const isDark = document.documentElement.classList.contains("dark");

      // 1. Background
      ctx.fillStyle = isDark ? "#1d1d1f" : "#ffffff";
      ctx.fillRect(0, 0, dim, dim);

      // 2. Guide grid lines
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

      // 3. Faint template reference glyph
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = Math.round(dim * 0.52);
      ctx.font = `${fontSize}px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = isDark ? "#333336" : "#e0e0e0";
      ctx.fillText(selectedLetter.char, dim / 2, dim / 2);

      // 4. Redraw user strokes
      const lineWidth = Math.max(6, Math.round(dim / 35));
      ctx.strokeStyle = "#0066cc";
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const stroke of currentStrokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    },
    [selectedLetter]
  );

  useEffect(() => {
    redrawAll(canvasDim, strokes);
  }, [canvasDim, drawTemplateCheck, redrawAll, strokes, theme]);

  function drawTemplateCheck() {
    // helper to trigger redraw
  }

  // Reset when user picks another letter
  useEffect(() => {
    setStrokes([]);
    setEvaluation(null);
    redrawAll(canvasDim, []);
  }, [selectedLetter, canvasDim, redrawAll]);

  const resetCanvas = () => {
    setStrokes([]);
    setEvaluation(null);
    redrawAll(canvasDim, []);
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newStroke = [{ x, y }];
    setStrokes((prev) => [...prev, newStroke]);

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

    setStrokes((prev) => {
      if (prev.length === 0) return [[{ x, y }]];
      const updated = [...prev];
      const current = [...updated[updated.length - 1], { x, y }];
      updated[updated.length - 1] = current;
      return updated;
    });

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

  // Rigorous Pixel Overlap, Coverage & Precision Verification
  const evaluateDrawing = () => {
    if (strokes.length === 0 || strokes.every((s) => s.length < 2)) {
      setEvaluation({
        score: 0,
        coverage: 0,
        precision: 0,
        status: "error",
        title: "Kanvas Masih Kosong",
        feedback: "Belum ada goresan. Goreskan jari atau stylus mengikuti bayangan aksara."
      });
      return;
    }

    const GRID = 100; // 100x100 analysis grid
    const scaleFactor = GRID / canvasDim;

    // 1. Offscreen Reference Canvas (Render the target glyph alone)
    const refCanvas = document.createElement("canvas");
    refCanvas.width = GRID;
    refCanvas.height = GRID;
    const refCtx = refCanvas.getContext("2d");
    if (!refCtx) return;

    refCtx.fillStyle = "#ffffff";
    refCtx.fillRect(0, 0, GRID, GRID);
    refCtx.textAlign = "center";
    refCtx.textBaseline = "middle";
    const refFontSize = Math.round(GRID * 0.52);
    refCtx.font = `${refFontSize}px 'Noto Sans Batak', 'Plus Jakarta Sans', sans-serif`;
    refCtx.fillStyle = "#000000";
    refCtx.fillText(selectedLetter.char, GRID / 2, GRID / 2);

    const refData = refCtx.getImageData(0, 0, GRID, GRID).data;
    const refGrid = new Uint8Array(GRID * GRID);
    let refPixelCount = 0;

    for (let i = 0; i < GRID * GRID; i++) {
      // Invert check: black pixel = glyph ink
      if (refData[i * 4] < 200) {
        refGrid[i] = 1;
        refPixelCount++;
      }
    }

    // 2. Offscreen User Strokes Canvas (Render user strokes alone)
    const userCanvas = document.createElement("canvas");
    userCanvas.width = GRID;
    userCanvas.height = GRID;
    const userCtx = userCanvas.getContext("2d");
    if (!userCtx) return;

    userCtx.fillStyle = "#ffffff";
    userCtx.fillRect(0, 0, GRID, GRID);
    userCtx.strokeStyle = "#000000";
    userCtx.lineWidth = Math.max(4, Math.round(GRID / 30));
    userCtx.lineCap = "round";
    userCtx.lineJoin = "round";

    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      userCtx.beginPath();
      userCtx.moveTo(stroke[0].x * scaleFactor, stroke[0].y * scaleFactor);
      for (let i = 1; i < stroke.length; i++) {
        userCtx.lineTo(stroke[i].x * scaleFactor, stroke[i].y * scaleFactor);
      }
      userCtx.stroke();
    }

    const userData = userCtx.getImageData(0, 0, GRID, GRID).data;
    const userGrid = new Uint8Array(GRID * GRID);
    let userPixelCount = 0;

    for (let i = 0; i < GRID * GRID; i++) {
      if (userData[i * 4] < 200) {
        userGrid[i] = 1;
        userPixelCount++;
      }
    }

    if (userPixelCount < 18) {
      setEvaluation({
        score: 5,
        coverage: 5,
        precision: 10,
        status: "error",
        title: "Goresan Terlalu Singkat",
        feedback: "Goresan baru berupa titik atau coretan pendek. Lengkapi bentuk aksara sepenuhnya."
      });
      return;
    }

    // 3. Compute Coverage (how much of the glyph path is traced within tolerance)
    const TOLERANCE_RADIUS = 5;
    let hitRef = 0;

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (refGrid[y * GRID + x] === 1) {
          let foundUserNear = false;
          for (let dy = -TOLERANCE_RADIUS; dy <= TOLERANCE_RADIUS && !foundUserNear; dy++) {
            for (let dx = -TOLERANCE_RADIUS; dx <= TOLERANCE_RADIUS; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID) {
                if (userGrid[ny * GRID + nx] === 1) {
                  foundUserNear = true;
                  break;
                }
              }
            }
          }
          if (foundUserNear) hitRef++;
        }
      }
    }

    // 4. Compute Precision (how much of user's ink fell on or near the guideline)
    const GUIDE_TOLERANCE = 6;
    let validUser = 0;

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (userGrid[y * GRID + x] === 1) {
          let onTrack = false;
          for (let dy = -GUIDE_TOLERANCE; dy <= GUIDE_TOLERANCE && !onTrack; dy++) {
            for (let dx = -GUIDE_TOLERANCE; dx <= GUIDE_TOLERANCE; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID) {
                if (refGrid[ny * GRID + nx] === 1) {
                  onTrack = true;
                  break;
                }
              }
            }
          }
          if (onTrack) validUser++;
        }
      }
    }

    const coverage = refPixelCount > 0 ? hitRef / refPixelCount : 0;
    const precision = userPixelCount > 0 ? validUser / userPixelCount : 0;

    // Strict penalization for random scribbling:
    // If precision < 35%, user scribbled wildly outside the letter!
    let finalScore = 0;
    if (precision < 0.35) {
      finalScore = Math.round(precision * coverage * 100);
    } else {
      finalScore = Math.round((coverage * 0.55 + precision * 0.45) * 100);
    }
    finalScore = Math.max(0, Math.min(100, finalScore));

    const covPct = Math.round(coverage * 100);
    const precPct = Math.round(precision * 100);

    // Pedagogical feedback based on actual metrics
    if (finalScore >= 75) {
      setEvaluation({
        score: finalScore,
        coverage: covPct,
        precision: precPct,
        status: "success",
        title: "Bentuk Aksara Sangat Tepat!",
        feedback: `Akurasi goresan mencapai ${finalScore}%. Proporsi dan kelengkapan lekukan aksara '${selectedLetter.latin}' sangat presisi.`
      });
    } else if (finalScore >= 45) {
      if (coverage < 0.5) {
        setEvaluation({
          score: finalScore,
          coverage: covPct,
          precision: precPct,
          status: "warning",
          title: "Bentuk Aksara Belum Lengkap",
          feedback: `Kelengkapan baru ${covPct}%. Masih ada bagian huruf yang belum tergores. Lengkapi seluruh goresan.`
        });
      } else {
        setEvaluation({
          score: finalScore,
          coverage: covPct,
          precision: precPct,
          status: "warning",
          title: "Goresan Cukup Baik",
          feedback: `Akurasi ${finalScore}%. Bentuk dasar sudah tampak, tetapi beberapa garis melebar ke luar jalur bayangan.`
        });
      }
    } else {
      setEvaluation({
        score: finalScore,
        coverage: covPct,
        precision: precPct,
        status: "error",
        title: "Bentuk Belum Sesuai",
        feedback: `Akurasi hanya ${finalScore}%. Goresan tidak mengikuti pola aksara '${selectedLetter.latin}'. Coba bersihkan dan ikuti garis panduan secara perlahan.`
      });
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
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
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
              className="px-6 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-[13px] text-white font-medium transition active:scale-95 flex items-center gap-1.5 shadow-2xs"
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
              <li>Tekan tombol &ldquo;Cek Goresan&rdquo; untuk memeriksa akurasi bentuk.</li>
            </ol>
          </div>

          {evaluation && (
            <div
              className={`p-5 rounded-[18px] border text-[14px] transition-all duration-200 space-y-2.5 animate-fadeIn ${
                evaluation.status === "success"
                  ? "bg-white dark:bg-[#272729] border-emerald-500/40 text-[#1d1d1f] dark:text-white"
                  : evaluation.status === "warning"
                  ? "bg-white dark:bg-[#272729] border-amber-500/40 text-[#1d1d1f] dark:text-white"
                  : "bg-white dark:bg-[#272729] border-rose-500/40 text-[#1d1d1f] dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {evaluation.status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : evaluation.status === "warning" ? (
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-[15px]">{evaluation.title}</span>
                </div>

                {/* Score Pill Badge */}
                <span
                  className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    evaluation.status === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : evaluation.status === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                  }`}
                >
                  {evaluation.score}% Akurat
                </span>
              </div>

              <p className="text-[13px] text-[#7a7a7a] dark:text-[#a1a1a6] leading-relaxed">
                {evaluation.feedback}
              </p>

              {/* Progress metrics */}
              <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] grid grid-cols-2 gap-2 text-[12px] text-[#7a7a7a]">
                <div>
                  Kelengkapan: <span className="font-medium text-[#1d1d1f] dark:text-white">{evaluation.coverage}%</span>
                </div>
                <div>
                  Kerapian Garis: <span className="font-medium text-[#1d1d1f] dark:text-white">{evaluation.precision}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
