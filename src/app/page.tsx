"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/jumbo/app-shell";
import { PhoneFrame, DesktopRail } from "@/components/jumbo/phone-frame";
import { JumboLogo } from "@/components/jumbo/logo";
import { useJumbo, type ScreenId, type Mode } from "@/store/jumbo";
import { BRAND, VEHICLES } from "@/lib/brand";
import { VehicleIcon } from "@/components/jumbo/vehicle-icon";
import {
  Truck,
  ShieldCheck,
  Tag,
  Navigation,
  Bell,
  Clock,
  MapPin,
  ChevronRight,
  Smartphone,
  Github,
  Zap,
} from "lucide-react";

export default function Page() {
  const screen = useJumbo((s) => s.screen);
  const mode = useJumbo((s) => s.mode);
  const go = useJumbo((s) => s.go);
  const setMode = useJumbo((s) => s.setMode);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mobile: render the app shell directly (full screen app)
  if (!isDesktop) {
    return <MobileApp />;
  }

  // Desktop: showcase layout with phone frame + side panels
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0c0c0e] text-white">
      {/* Background patterns */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #ED1C24, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #C91017, transparent)",
        }}
      />

      {/* top brand bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <JumboLogo size={36} showWord={false} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-extrabold italic tracking-tight text-white">
                JUMBO
              </span>
              <span className="rounded bg-jumbo px-1.5 py-0.5 text-[15px] font-extrabold italic tracking-tight text-white">
                GO
              </span>
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
                Live Prototype v1.0
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              {BRAND.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 transition hover:bg-white/10"
            href="#features"
          >
            <Zap className="h-3.5 w-3.5 text-jumbo" />
            ฟีเจอร์
          </a>
          <a
            className="flex items-center gap-1.5 rounded-full bg-jumbo px-3 py-1.5 text-[12px] font-bold text-white"
            href="#screens"
          >
            <Smartphone className="h-3.5 w-3.5" />
            ดูทุกหน้า
          </a>
        </div>
      </header>

      {/* main 3-col layout */}
      <main className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-8 pb-16">
        {/* Left: hero copy */}
        <section className="col-span-3 flex flex-col justify-center pt-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-jumbo/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-jumbo">
            <span className="h-1.5 w-1.5 rounded-full bg-jumbo" />
            พิมพ์เขียว JUMBO GO
          </span>
          <h1 className="mt-3 text-[42px] font-extrabold leading-[1.05] tracking-tight text-white">
            เรียกรถขนของ
            <br />
            <span className="text-jumbo">ราคาคนไทย</span>
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/70">
            {BRAND.promise}
            <br />
            {BRAND.slogan}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {[
              "Splash → Login → OTP → Home",
              "Booking Flow 5 ขั้น (Pickup → Dropoff → Vehicle → Summary → Confirm)",
              "Dispatch + Realtime Tracking",
              "Account / Jobs / Notifications / Support",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 text-[12px] text-white/80"
              >
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-jumbo" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => go("splash")}
              className="flex items-center gap-1.5 rounded-full bg-jumbo px-4 py-2 text-[12px] font-bold text-white shadow-lg shadow-jumbo/30"
            >
              <Smartphone className="h-3.5 w-3.5" /> เริ่มต้นใหม่
            </button>
            <button
              onClick={() => go("home")}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-medium text-white/80"
            >
              ไปหน้าหลัก
            </button>
          </div>
        </section>

        {/* Center: phone frame */}
        <section
          id="screens"
          className="col-span-5 flex items-start justify-center pt-4"
        >
          <PhoneFrame>
            <AppShell />
          </PhoneFrame>
        </section>

        {/* Right: rail */}
        <section className="col-span-4 flex flex-col pt-8">
          <DesktopRail
            current={screen}
            mode={mode}
            onPick={(s) => go(s as ScreenId)}
            onMode={(m) => setMode(m as Mode)}
          />
        </section>
      </main>

      {/* features strip */}
      <section
        id="features"
        className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur"
      >
        <div className="mx-auto max-w-[1400px] px-8 py-8">
          <div className="grid grid-cols-5 gap-4">
            <FeatureCard
              icon={Tag}
              title="ราคาชัดเจน"
              desc="คำนวณฝั่ง Server ไม่มีค่าซ่อนเร้น"
            />
            <FeatureCard
              icon={Navigation}
              title="Realtime Tracking"
              desc="ติดตามพิกัดคนขับสด พร้อม ETA"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="ปลอดภัย RLS"
              desc="ข้อมูลผ่าน Supabase RLS ทุกตาราง"
            />
            <FeatureCard
              icon={Truck}
              title="5 ประเภทรถ"
              desc="กระบะ • ตู้ทึบ • คอก • จัมโบ้ • 6 ล้อ"
            />
            <FeatureCard
              icon={Bell}
              title="Thai UI"
              desc="ภาษาไทยทุกหน้า ใช้ Noto Sans Thai"
            />
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <p className="text-[11px] text-white/50">
            © 2025 JUMBO GO • สร้างตามพิมพ์เขียว • Next.js 16 + TypeScript +
            Tailwind 4
          </p>
          <div className="flex items-center gap-3 text-[11px] text-white/50">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> อัปเดตล่าสุด: วันนี้
            </span>
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3" /> MVP
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mobile view - render the app full screen with role switcher & screen picker overlay
function MobileApp() {
  const mode = useJumbo((s) => s.mode);
  const screen = useJumbo((s) => s.screen);
  const setMode = useJumbo((s) => s.setMode);
  const go = useJumbo((s) => s.go);
  const [showPicker, setShowPicker] = useState(false);

  const screensForMode =
    mode === "user"
      ? [
          { id: "home" as const, label: "05 หน้าหลัก" },
          { id: "pickup" as const, label: "06 จุดรับ" },
          { id: "dropoff" as const, label: "07 จุดส่ง" },
          { id: "vehicle-type" as const, label: "08 เลือกรถ" },
          { id: "summary" as const, label: "09 สรุปราคา" },
          { id: "confirm" as const, label: "10 ยืนยัน" },
          { id: "searching" as const, label: "11 หาคนขับ" },
          { id: "tracking" as const, label: "13 ติดตาม" },
          { id: "jobs" as const, label: "15 ประวัติงาน (Live DB)" },
          { id: "profile" as const, label: "17 โปรไฟล์" },
        ]
      : mode === "driver"
        ? [
            { id: "driver-dashboard" as const, label: "Dashboard คนขับ" },
            { id: "driver-jobs" as const, label: "งานคนขับ" },
            { id: "driver-onboarding" as const, label: "KYC 10 ขั้น" },
            { id: "driver-earnings" as const, label: "รายได้" },
          ]
        : [
            { id: "admin-dashboard" as const, label: "Admin Dash" },
            { id: "admin-jobs" as const, label: "งานทั้งหมด" },
            { id: "admin-drivers" as const, label: "คนขับ" },
            { id: "admin-kyc" as const, label: "ตรวจ KYC" },
          ];

  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-white">
      {/* top quick bar to jump screens */}
      <div className="fixed top-2 right-2 z-50 flex items-center gap-1.5">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1 rounded-full border border-black/10 bg-black/85 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur active:scale-95"
          title="สลับหน้าพรีวิว UI"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          หน้า: {screen}
        </button>
      </div>

      {/* Screen quick switcher popup on mobile */}
      {showPicker && (
        <div className="fixed inset-x-3 top-12 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-line bg-white/95 p-3 shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between border-b border-line pb-2">
            <span className="text-[12px] font-bold text-ink">เลือกดูหน้า UI (Preview)</span>
            <button
              onClick={() => setShowPicker(false)}
              className="text-[11px] font-bold text-jumbo"
            >
              ปิด ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {screensForMode.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  go(item.id);
                  setShowPicker(false);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-left text-[11px] font-medium transition ${
                  screen === item.id
                    ? "bg-jumbo text-white"
                    : "bg-surface text-ink hover:bg-line/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* floating role switcher */}
      <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/95 p-1 shadow-lg backdrop-blur">
        {[
          { m: "user" as const, label: "User" },
          { m: "driver" as const, label: "Driver" },
          { m: "admin" as const, label: "Admin" },
        ].map((r) => (
          <button
            key={r.m}
            onClick={() => setMode(r.m)}
            className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
              mode === r.m ? "bg-jumbo text-white" : "text-ink-muted"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <AppShell />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white">
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <p className="mt-2 text-[13px] font-bold text-white">{title}</p>
      <p className="text-[11px] leading-tight text-white/60">{desc}</p>
    </div>
  );
}
