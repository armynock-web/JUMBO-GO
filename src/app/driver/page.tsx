"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { AppShell } from "@/components/jumbo/app-shell";
import { Truck } from "lucide-react";

export default function DriverPage() {
  useEffect(() => {
    const store = useJumbo.getState();
    store.setMode("driver");
    if (!store.screen.startsWith("driver-")) {
      store.go("driver-dashboard");
    }
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-900 text-slate-900">
      {/* Driver Top Navigation / Shortcut Bar for Desktop */}
      <header className="z-30 flex h-14 w-full flex-shrink-0 items-center justify-between border-b border-white/10 bg-slate-950 px-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jumbo text-white">
              <Truck className="h-4 w-4" />
            </span>
            <span className="text-[14px] font-bold text-white tracking-tight">
              JUMBO GO — Driver Partner Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            เชื่อมต่อเซิร์ฟเวอร์เรียบร้อย
          </span>
        </div>
      </header>

      {/* Driver App Container: Full-width responsive web console */}
      <main className="flex flex-1 flex-col overflow-hidden bg-white">
        <AppShell />
      </main>
    </div>
  );
}