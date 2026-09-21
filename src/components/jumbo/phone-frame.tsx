"use client";

import { JumboLockup } from "./logo";

// Phone frame wrapper for desktop showcase
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[60px] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #ED1C2444, transparent 60%), radial-gradient(circle at 80% 80%, #ED1C2433, transparent 50%)",
        }}
      />

      <div className="phone-shadow relative h-[760px] w-[360px] rounded-[48px] border-[3px] border-[#1a1a1a] bg-black p-[10px]">
        {/* notch */}
        <div className="absolute left-1/2 top-3 z-50 h-7 w-32 -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute left-1/2 top-[14px] z-50 h-1.5 w-2 -translate-x-12 rounded-full bg-[#222]">
          <div className="absolute inset-[2px] rounded-full bg-[#1a1a3a]" />
        </div>

        <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

// Right rail for desktop: screen selector + JUMBO info
export function DesktopRail({
  current,
  onPick,
}: {
  current: string;
  onPick: (s: string) => void;
}) {
  const groups: { title: string; items: { id: string; label: string; sub?: string }[] }[] = [
    {
      title: "Authentication",
      items: [
        { id: "splash", label: "U01 — Splash" },
        { id: "onboarding", label: "Onboarding" },
        { id: "login", label: "U02 — เข้าสู่ระบบ" },
        { id: "register", label: "U03 — สมัครสมาชิก" },
        { id: "verify-otp", label: "U04 — ยืนยัน OTP" },
      ],
    },
    {
      title: "Booking Flow",
      items: [
        { id: "home", label: "U05 — หน้าหลัก" },
        { id: "pickup", label: "U06 — จุดรับ" },
        { id: "dropoff", label: "U07 — จุดส่ง" },
        { id: "vehicle-type", label: "U08 — ประเภทรถ" },
        { id: "summary", label: "U09 — สรุปราคา" },
        { id: "confirm", label: "U10 — ยืนยันเรียกรถ" },
      ],
    },
    {
      title: "Dispatch & Tracking",
      items: [
        { id: "searching", label: "U11 — ค้นหาคนขับ" },
        { id: "driver-found", label: "U12 — คนขับรับงาน" },
        { id: "tracking", label: "U13 — ติดตามรถ" },
        { id: "completed", label: "U14 — ส่งงานสำเร็จ" },
      ],
    },
    {
      title: "Account",
      items: [
        { id: "jobs", label: "U15 — ประวัติงาน" },
        { id: "notifications", label: "U17 — แจ้งเตือน" },
        { id: "profile", label: "U16 — บัญชีของฉัน" },
        { id: "support", label: "U19 — ศูนย์ช่วยเหลือ" },
      ],
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <JumboLockup />
      <p className="mt-3 text-[13px] leading-relaxed text-white/70">
        แพลตฟอร์มเรียกรถขนของ ส่งของ • ย้ายบ้าน • ใช้งานง่าย
        <br />
        สร้างตามพิมพ์เขียว JUMBO GO ครบทุก Screen ID ตั้งแต่ U01 — U19
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Next.js", "TypeScript", "Tailwind", "Framer", "Zustand", "Thai UI"].map(
          (t) => (
            <span
              key={t}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80"
            >
              {t}
            </span>
          ),
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-jumbo">
          Screen Inventory
        </h3>
        <span className="rounded-full bg-jumbo px-2 py-0.5 text-[10px] font-bold text-white">
          {current}
        </span>
      </div>

      <div className="mt-2 max-h-[460px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
              {g.title}
            </p>
            <div className="flex flex-col gap-1">
              {g.items.map((it) => {
                const active = current === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => onPick(it.id)}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium transition ${
                      active
                        ? "bg-jumbo text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{it.label}</span>
                    {active && <span className="text-[10px]">●</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
