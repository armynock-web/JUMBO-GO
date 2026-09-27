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
  ShieldCheck,
  User,
} from "lucide-react";

export default function Page() {
  const mode = useJumbo((s) => s.mode);
  const screen = useJumbo((s) => s.screen);
  const setMode = useJumbo((s) => s.setMode);
  const go = useJumbo((s) => s.go);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMode("user");
    // Ensure initial screen is 'home' directly without splash delay
    if (useJumbo.getState().screen === "splash") {
      go("home");
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setMode, go]);

  // Mobile View (< 1024px): Full-screen Native Web App (No splash delays, no fake status bar)
  if (!isDesktop) {
    return (
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-white text-slate-900 font-sans">
        {/* Mobile Clean Commercial Header */}
        <header className="flex h-14 w-full flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs z-30">
          <div
            onClick={() => go("home")}
            className="flex cursor-pointer items-center gap-2"
          >
            <img
              src="/images/brand/app-icon.jpg"
              alt="JUMBO GO"
              className="h-7 w-7 rounded-lg object-contain shadow-xs"
            />
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-black italic tracking-tight text-slate-900">
                JUMBO
              </span>
              <span className="rounded bg-jumbo px-1.5 py-0.2 text-[16px] font-black italic tracking-tight text-white">
                GO
              </span>
              <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-jumbo">
                ออนดีมานด์
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:021234567"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Call center 24h"
              title="โทร 02-123-4567"
            >
              <PhoneCall className="h-4 w-4 text-jumbo" />
            </a>
          </div>
        </header>

        {/* Mobile Content Area */}
        <main className="flex-1 overflow-hidden bg-white">
          <AppShell />
        </main>
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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100/70 text-slate-900 font-sans">
      {/* 1. Top Commercial Navbar (Customer Portal) */}
      <header className="z-30 flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 text-slate-900 shadow-xs">
        <div className="flex items-center gap-6">
          <div
            onClick={() => go("home")}
            className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
          >
            <img
              src="/images/brand/app-icon.jpg"
              alt="JUMBO GO"
              className="h-9 w-9 rounded-xl object-contain shadow-xs border border-slate-100"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-black italic tracking-tight text-slate-900">
                  JUMBO
                </span>
                <span className="rounded bg-jumbo px-1.5 py-0.2 text-[18px] font-black italic tracking-tight text-white">
                  GO
                </span>
                <span className="ml-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-extrabold text-jumbo">
                  ขนส่งออนดีมานด์
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5">{BRAND.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-slate-200">
            <button
              onClick={() => go("home")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-bold transition ${
                screen !== "jobs" && screen !== "profile"
                  ? "bg-jumbo/10 text-jumbo"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Truck className="h-4 w-4" />
              เรียกรถขนของ
            </button>
            <button
              onClick={() => go("jobs")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-bold transition ${
                screen === "jobs"
                  ? "bg-jumbo/10 text-jumbo"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              รายการจองของฉัน
            </button>
            <button
              onClick={() => go("onboarding")}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              <HelpCircle className="h-4 w-4 text-amber-500" />
              แนะนำบริการ (1-2-3)
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Link to Driver Portal */}
          <a
            href="/driver"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>ร่วมขับกับเรา</span>
          </a>

          {/* Hotline */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] text-slate-600">
            <PhoneCall className="h-3.5 w-3.5 text-jumbo" />
            <span>ศูนย์ช่วยเหลือ 24 ชม.: <strong className="text-slate-900">02-123-4567</strong></span>
          </div>

          {/* User Profile */}
          <div
            onClick={() => go("profile")}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-[12px] font-bold text-slate-800 shadow-xs hover:border-slate-300 transition"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-[11px] font-black text-white shadow-xs">
              สญ
            </span>
            <span>สมหญิง ใจเย็น</span>
          </div>
        </div>
      </header>

      {/* 2. Main Commercial Workspace with White-frame Split View */}
      <main className="relative flex flex-1 overflow-hidden p-3 lg:p-4 gap-3 lg:gap-4">
        {/* Left Column: Customer Booking Console in Elevated White Container */}
        <section className="relative z-20 flex h-full w-full lg:w-[510px] flex-shrink-0 flex-col rounded-2xl border border-slate-200/90 bg-white shadow-lg overflow-hidden">
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
        <section className="relative hidden lg:flex flex-1 h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <RealMap />
        </section>
      </main>
    </div>
  );
}
