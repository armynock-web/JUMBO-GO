"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { Check, X, Loader2, Truck } from "lucide-react";
import { motion } from "framer-motion";

export function SearchingScreen() {
  const go = useJumbo((s) => s.go);
  const draft = useJumbo((s) => s.draft);
  const searchProgress = useJumbo((s) => s.searchProgress);
  const setSearchProgress = useJumbo((s) => s.setSearchProgress);

  useEffect(() => {
    setSearchProgress(0);
    let n = 0;
    const id = setInterval(() => {
      n += 4 + Math.random() * 4;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => go("driver-found"), 600);
      }
      setSearchProgress(Math.min(100, n));
    }, 220);
    return () => clearInterval(id);
  }, [go, setSearchProgress]);

  const steps = [
    {
      label: "กำลังส่งงานให้คนขับในพื้นที่",
      done: searchProgress > 15,
      active: searchProgress <= 15,
    },
    {
      label: "กำลังค้นหาคนขับที่เหมาะสม",
      done: searchProgress > 55,
      active: searchProgress > 15 && searchProgress <= 55,
    },
    {
      label: "รอคนขับตอบรับ",
      done: searchProgress >= 100,
      active: searchProgress > 55 && searchProgress < 100,
    },
  ];

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />

      {/* cancel */}
      <div className="flex items-center justify-between px-5 py-2">
        <span className="text-[13px] font-medium text-ink-muted">
          กำลังค้นหาคนขับ
        </span>
        <button
          onClick={() => go("home")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ยกเลิก"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {/* radar */}
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* concentric pulse rings */}
          {[0, 0.6, 1.2, 1.8].map((d, i) => (
            <span
              key={i}
              className="absolute h-32 w-32 rounded-full border-2 border-jumbo/40 animate-jumbo-pulse"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
          {/* center logo / truck */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-jumbo text-white shadow-xl"
          >
            <Truck className="h-12 w-12" strokeWidth={2.5} />
          </motion.div>
        </div>

        <div className="text-center">
          <h1 className="text-[22px] font-extrabold text-ink">
            กำลังค้นหาคนขับ
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            กรุณารอสักครู่... กำลังหาคนขับที่เหมาะสมที่สุดสำหรับคุณ
          </p>
        </div>

        {/* progress bar */}
        <div className="w-full max-w-[280px]">
          <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted">
            <span>ความคืบหน้า</span>
            <span className="font-bold text-jumbo tabular-nums">
              {Math.round(searchProgress)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full bg-gradient-to-r from-jumbo to-jumbo-dark"
              style={{ width: `${searchProgress}%` }}
            />
          </div>
        </div>

        {/* steps */}
        <div className="w-full max-w-[280px] space-y-2">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2.5"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                  s.done
                    ? "bg-green-600 text-white"
                    : s.active
                      ? "bg-jumbo text-white"
                      : "bg-surface text-ink-muted"
                }`}
              >
                {s.done ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : s.active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="text-[10px]">{i + 1}</span>
                )}
              </span>
              <span
                className={`text-[13px] ${
                  s.done
                    ? "font-semibold text-ink"
                    : s.active
                      ? "font-semibold text-jumbo"
                      : "text-ink-muted"
                }`}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {draft.pickup && draft.dropoff && (
          <div className="w-full max-w-[280px] rounded-xl border border-line bg-surface p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">จาก</span>
              <span className="font-semibold text-ink">
                {draft.pickup.address.slice(0, 28)}
                {draft.pickup.address.length > 28 ? "..." : ""}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-ink-muted">ไป</span>
              <span className="font-semibold text-ink">
                {draft.dropoff.address.slice(0, 28)}
                {draft.dropoff.address.length > 28 ? "..." : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() => go("home")}
          className="w-full rounded-2xl border border-line bg-white py-3 text-[14px] font-bold text-ink-muted transition active:scale-[0.98]"
        >
          ยกเลิกการเรียก
        </button>
      </div>
    </div>
  );
}
