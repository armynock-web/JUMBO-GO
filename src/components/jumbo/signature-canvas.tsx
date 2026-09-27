"use client";

import { useRef, useState, useEffect } from "react";
import { Eraser, Check, X, PenTool } from "lucide-react";

interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string, signerName: string) => void;
  onCancel?: () => void;
  defaultSignerName?: string;
}

export function SignatureCanvas({
  onSave,
  onCancel,
  defaultSignerName = "",
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState(defaultSignerName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl, signerName);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jumbo/10 text-jumbo">
            <PenTool className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-[13px] font-bold text-ink">ลายเซ็นดิจิทัลผู้รับสินค้า</h4>
            <p className="text-[10px] text-ink-muted">กรุณาลงลายมือชื่อบนอุปกรณ์</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-700 mb-1">
          ชื่อผู้เซ็นรับสินค้า
        </label>
        <input
          type="text"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="เช่น คุณสมชาย หรือตัวแทนผู้รับ"
          className="w-full rounded-xl border border-line bg-slate-50 px-3 py-2 text-[12px] text-ink outline-none focus:border-jumbo focus:bg-white transition"
        />
      </div>

      <div className="relative">
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="h-full w-full cursor-crosshair touch-none"
          />
          {!hasDrawn && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <PenTool className="h-6 w-6 opacity-30 mb-1" />
              <span className="text-[11px] font-medium opacity-60">
                ใช้นิ้วหรือเมาส์ลงลายมือชื่อในบริเวณนี้
              </span>
            </div>
          )}
          {/* Sign baseline guide */}
          <div className="pointer-events-none absolute bottom-8 left-6 right-6 border-b border-slate-200" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasDrawn}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
        >
          <Eraser className="h-3.5 w-3.5" />
          <span>ล้างลายเซ็น</span>
        </button>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              ยกเลิก
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasDrawn}
            className="flex items-center gap-1.5 rounded-xl bg-jumbo px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-jumbo/20 hover:bg-jumbo-dark disabled:opacity-40 transition"
          >
            <Check className="h-3.5 w-3.5" />
            <span>ยืนยันลายเซ็น</span>
          </button>
        </div>
      </div>
    </div>
  );
}
