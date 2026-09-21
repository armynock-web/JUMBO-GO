"use client";

import { useJumbo, type Mode, type ScreenId } from "@/store/jumbo";
import { JumboLockup } from "./logo";
import { User, Truck, Shield } from "lucide-react";

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

// Right rail for desktop: role switcher + screen selector + JUMBO info
export function DesktopRail({
  current,
  mode,
  onPick,
  onMode,
}: {
  current: string;
  mode: Mode;
  onPick: (s: string) => void;
  onMode: (m: Mode) => void;
}) {
  const groups: {
    title: string;
    items: { id: ScreenId; label: string }[];
  }[] =
    mode === "user"
      ? [
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
              { id: "support", label: "U18 — ศูนย์ช่วยเหลือ" },
            ],
          },
        ]
      : mode === "driver"
        ? [
            {
              title: "Driver Auth",
              items: [
                { id: "driver-register", label: "D01 — สมัคร Driver" },
                { id: "driver-login", label: "D02 — เข้าสู่ระบบ" },
              ],
            },
            {
              title: "Driver KYC Onboarding (10 ขั้น)",
              items: [
                { id: "driver-onboarding", label: "D03–D12 — Stepper" },
                { id: "driver-onboarding-status", label: "D13 — สถานะ KYC" },
              ],
            },
            {
              title: "Driver Dashboard",
              items: [
                { id: "driver-dashboard", label: "D14 — Driver Dashboard" },
                { id: "driver-jobs", label: "D15 — งานของ Driver" },
                { id: "driver-earnings", label: "D16 — รายได้" },
                { id: "driver-history", label: "D17 — ประวัติงาน" },
                { id: "driver-profile", label: "D18 — โปรไฟล์ Driver" },
                { id: "notifications", label: "การแจ้งเตือน Driver" },
              ],
            },
          ]
        : [
            {
              title: "Admin Auth",
              items: [{ id: "admin-login", label: "A01 — Admin Login" }],
            },
            {
              title: "Admin Console",
              items: [
                { id: "admin-dashboard", label: "A02 — Dashboard" },
                { id: "admin-users", label: "A03 — ผู้ใช้งาน" },
                { id: "admin-drivers", label: "A04 — คนขับ" },
                { id: "admin-kyc", label: "A05 — ตรวจ KYC" },
                { id: "admin-vehicles", label: "A06 — รถ" },
                { id: "admin-jobs", label: "A07 — งานทั้งหมด" },
                { id: "admin-pricing", label: "A08 — ตั้งค่าราคา" },
                { id: "admin-payments", label: "A09 — การชำระเงิน" },
                { id: "admin-reports", label: "A10 — รายงาน" },
                { id: "admin-notifications", label: "A14 — การแจ้งเตือน" },
                { id: "admin-settings", label: "A11 — ตั้งค่าระบบ" },
              ],
            },
          ];

  return (
    <div className="flex w-full flex-col">
      <JumboLockup />

      {/* Role switcher */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-white/5 p-1.5">
        {[
          { m: "user" as const, label: "User", Icon: User },
          { m: "driver" as const, label: "Driver", Icon: Truck },
          { m: "admin" as const, label: "Admin", Icon: Shield },
        ].map((r) => {
          const active = mode === r.m;
          return (
            <button
              key={r.m}
              onClick={() => onMode(r.m)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-bold transition ${
                active
                  ? "bg-jumbo text-white shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <r.Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              {r.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-white/70">
        {mode === "user" &&
          "แพลตฟอร์มเรียกรถขนของ ส่งของ • ย้ายบ้าน • ใช้งานง่าย สร้างตามพิมพ์เขียวครบทุก Screen ID"}
        {mode === "driver" &&
          "ฝั่งคนขับ ตั้งแต่สมัคร → KYC 10 ขั้น → อนุมัติ → รับงาน → รายได้"}
        {mode === "admin" &&
          "หลังบ้านสำหรับเจ้าหน้าที่ ตรวจ KYC จัดการ Driver รถ งาน ราคา รายงาน"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-jumbo">
          Screen Inventory
        </h3>
        <span className="rounded-full bg-jumbo px-2 py-0.5 text-[10px] font-bold text-white">
          {current}
        </span>
      </div>

      <div className="mt-2 max-h-[420px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
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
