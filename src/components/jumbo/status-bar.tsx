"use client";

import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

// iOS-style status bar to make the phone-frame feel real
export function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = now.getHours().toString();
      const mm = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const color = dark ? "text-white" : "text-ink";

  return (
    <div
      className={`flex h-9 items-center justify-between px-5 text-[13px] font-semibold ${color}`}
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
        <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
        <BatteryFull className="h-4 w-4" strokeWidth={2} />
      </div>
    </div>
  );
}
