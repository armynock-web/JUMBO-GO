"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/jumbo/app-shell";
import { RealMap } from "@/components/jumbo/real-map";
import { DesktopOnboarding } from "@/components/jumbo/desktop-onboarding";
import { CustomerBookingConsole } from "@/components/jumbo/customer-booking-console";
import { JobsScreen } from "@/components/jumbo/screens/jobs";
import { ProfileScreen } from "@/components/jumbo/screens/profile";
import { SearchingScreen } from "@/components/jumbo/screens/searching";
import { TrackingScreen } from "@/components/jumbo/screens/tracking";
import { CompletedScreen } from "@/components/jumbo/screens/completed";
import { useJumbo } from "@/store/jumbo";
import { BRAND } from "@/lib/brand";
import {
  Truck,
  PhoneCall,
  Briefcase,
  HelpCircle,
} from "lucide-react";

export default function Page() {
  const mode = useJumbo((s) => s.mode);
  const screen = useJumbo((s) => s.screen);
  const setMode = useJumbo((s) => s.setMode);
  const go = useJumbo((s) => s.go);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMode("user");
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setMode]);

  // Mobile View (< 1024px): Full-screen Native Mobile Web App (100% viewport, no desktop sidebar)
  if (!isDesktop) {
    return (
      <div className="h-dvh w-full overflow-hidden bg-white">
        <AppShell />
      </div>
    );
  }

  // Desktop View (>= 1024px):
  // 1. If user clicks "แนะนำบริการ (1-2-3)", present the Full-width 1-2-3 Value Showcase
  if (screen === "onboarding") {
    return <DesktopOnboarding />;
  }

  // 2. Commercial Booking Console + Real Live Fleet Map
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-900 font-sans">
      {/* 1. Top Commercial Navbar (Customer Portal) */}
      <header className="z-30 flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-slate-200/20 bg-slate-900 px-6 text-white shadow-md">
        <div className="flex items-center gap-6">
          <div
            onClick={() => go("home")}
            className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
          >
            <img
              src="/images/brand/app-icon.jpg"
              alt="JUMBO GO"
              className="h-8 w-8 rounded-lg object-contain shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black italic tracking-tight text-white">
                  JUMBO
                </span>
                <span className="rounded bg-jumbo px-1.5 py-0.2 text-[17px] font-black italic tracking-tight text-white">
                  GO
                </span>
                <span className="ml-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  ขนส่งออนดีมานด์
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">{BRAND.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-white/10">
            <button
              onClick={() => go("home")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                screen !== "jobs" && screen !== "profile"
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Truck className="h-4 w-4 text-jumbo" />
              เรียกรถขนของ
            </button>
            <button
              onClick={() => go("jobs")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                screen === "jobs"
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              รายการจองของฉัน
            </button>
            <button
              onClick={() => go("onboarding")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <HelpCircle className="h-4 w-4 text-amber-400" />
              แนะนำบริการ (1-2-3)
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-slate-300">
            <PhoneCall className="h-3.5 w-3.5 text-jumbo" />
            <span>ศูนย์ช่วยเหลือลูกค้า: <strong>02-123-4567</strong></span>
          </div>

          <div
            onClick={() => go("profile")}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-3 text-[12px] font-semibold text-white hover:bg-white/15 transition"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-[11px] font-bold">
              สญ
            </span>
            <span>สมหญิง ใจเย็น</span>
          </div>
        </div>
      </header>

      {/* 2. Main Split-screen Workspace */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Left Column: Customer Booking Console */}
        <section className="relative z-20 flex h-full w-[490px] flex-shrink-0 flex-col border-r border-slate-200 bg-white shadow-2xl">
          <div className="flex-1 overflow-hidden">
            {screen === "jobs" ? (
              <JobsScreen />
            ) : screen === "profile" ? (
              <ProfileScreen />
            ) : screen === "searching" ? (
              <SearchingScreen />
            ) : screen === "tracking" ? (
              <TrackingScreen />
            ) : screen === "completed" ? (
              <CompletedScreen />
            ) : (
              <CustomerBookingConsole />
            )}
          </div>
        </section>

        {/* Right Column: Commercial Interactive Logistics Map with Real Road Routing */}
        <section className="relative flex-1 h-full overflow-hidden">
          <RealMap />
        </section>
      </main>
    </div>
  );
}
