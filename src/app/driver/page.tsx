"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { AppShell } from "@/components/jumbo/app-shell";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

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
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-200 hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            กลับหน้าลูกค้า (Customer)
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
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
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1 text-[12px] font-medium text-slate-300 hover:bg-white/10 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            ระบบแอดมิน (Admin)
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            เชื่อมต่อเซิร์ฟเวอร์เรียบร้อย
          </span>
        </div>
      </header>

      {/* Driver App Container: Responsive Center Column on Desktop, Full Screen on Mobile */}
      <main className="flex flex-1 items-center justify-center overflow-hidden bg-slate-900 p-0 md:p-4">
        <div className="h-full w-full max-w-[480px] overflow-hidden bg-white shadow-2xl md:rounded-3xl border border-slate-700/40">
          <AppShell />
        </div>
      </main>
    </div>
  );
}