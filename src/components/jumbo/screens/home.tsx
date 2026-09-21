"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { VehicleIcon, HeroTruck } from "../vehicle-icon";
import { VEHICLES, FEATURE_HIGHLIGHTS, RECENT_LOCATIONS } from "@/lib/brand";
import {
  Menu,
  Bell,
  MapPin,
  Search,
  Navigation,
  ChevronRight,
  Tag,
  ShieldCheck,
  Clock,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function HomeScreen() {
  const go = useJumbo((s) => s.go);
  const draft = useJumbo((s) => s.draft);
  const [menuOpen, setMenuOpen] = useState(false);

  const pickupLabel = draft.pickup?.address ?? "ตำแหน่งปัจจุบัน";
  const dropoffLabel = draft.dropoff?.address ?? "ปลายทาง";

  const handleCallToAction = () => {
    if (!draft.pickup) {
      go("pickup");
    } else if (!draft.dropoff) {
      go("dropoff");
    } else if (!draft.vehicleType) {
      go("vehicle-type");
    } else {
      go("summary");
    }
  };

  return (
    <div className="relative flex min-h-full flex-col bg-white pb-20">
      {/* === HERO HEADER === */}
      <div className="relative overflow-hidden">
        {/* skyline bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-jumbo via-jumbo-dark to-[#7a0d11]" />
        <div className="bg-grid absolute inset-0 opacity-10" />
        {/* city skyline */}
        <svg
          className="absolute bottom-0 left-0 right-0 h-24 w-full opacity-20"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <g fill="#000">
            <rect x="10" y="40" width="20" height="60" />
            <rect x="40" y="20" width="28" height="80" />
            <rect x="80" y="50" width="18" height="50" />
            <rect x="105" y="10" width="32" height="90" />
            <rect x="145" y="35" width="22" height="65" />
            <rect x="175" y="5" width="38" height="95" />
            <rect x="220" y="45" width="20" height="55" />
            <rect x="245" y="25" width="30" height="75" />
            <rect x="285" y="40" width="22" height="60" />
            <rect x="315" y="15" width="34" height="85" />
            <rect x="355" y="50" width="18" height="50" />
          </g>
        </svg>

        <div className="relative">
          <StatusBar dark />
          {/* top bar */}
          <div className="flex items-center justify-between px-4 pb-2 pt-1 text-white">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"
              aria-label="เมนู"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-extrabold italic tracking-tight">
                JUMBO
              </span>
              <span className="rounded bg-white px-1.5 py-0.5 text-[17px] font-extrabold italic tracking-tight text-jumbo">
                GO
              </span>
            </div>
            <button
              onClick={() => go("notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15"
              aria-label="แจ้งเตือน"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-jumbo" />
            </button>
          </div>

          {/* hero text */}
          <div className="px-4 pb-1 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[26px] font-extrabold leading-tight"
            >
              อยาก ขับรถ ใหญ่
              <br />
              <span className="text-white">JUMBO GO</span>
            </motion.h1>
            <div className="mt-2 inline-block -rotate-1 rounded-md bg-white px-3 py-1 text-[12px] font-bold text-jumbo shadow">
              ส่งของ • ย้ายบ้าน • ใช้งานง่าย
            </div>
          </div>

          {/* hero truck */}
          <div className="relative flex justify-center pb-1">
            <HeroTruck className="h-24 w-48 drop-shadow-xl" />
          </div>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="relative -mt-3 rounded-t-3xl bg-white px-4 pt-5">
        {/* location input */}
        <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
          <button
            onClick={() => go("pickup")}
            className="flex w-full items-center gap-3 border-b border-line pb-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo-light">
              <div className="h-2.5 w-2.5 rounded-full bg-jumbo" />
            </span>
            <div className="flex-1 text-left">
              <p className="text-[11px] font-medium text-ink-muted">
                รับของที่ไหน?
              </p>
              <p className="truncate text-[14px] font-semibold text-ink">
                {pickupLabel}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
          <button
            onClick={() => go("dropoff")}
            className="flex w-full items-center gap-3 pt-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo-light">
              <MapPin className="h-4 w-4 text-jumbo" />
            </span>
            <div className="flex-1 text-left">
              <p className="text-[11px] font-medium text-ink-muted">
                ส่งที่ไหน?
              </p>
              <p className="truncate text-[14px] font-semibold text-ink">
                {dropoffLabel}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        </div>

        {/* vehicle selector */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">
              เลือกประเภทรถ
            </h2>
            <button
              onClick={() => go("vehicle-type")}
              className="text-[12px] font-medium text-jumbo"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {VEHICLES.map((v, i) => {
              const active = draft.vehicleType === v.type;
              return (
                <motion.button
                  key={v.type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => go("vehicle-type")}
                  className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-2xl border-2 p-3 transition ${
                    active
                      ? "border-jumbo bg-jumbo-light"
                      : "border-line bg-white"
                  }`}
                  style={{ width: 96 }}
                >
                  <div
                    className={`flex h-14 w-20 items-center justify-center rounded-xl ${
                      active ? "bg-white" : "bg-surface"
                    }`}
                  >
                    <VehicleIcon
                      type={v.type}
                      className="h-9 w-auto"
                      color={active ? "#ED1C24" : "#111111"}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-ink">
                    {v.name}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {v.tonRange}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleCallToAction}
          className="mt-5 flex w-full items-center justify-between rounded-2xl bg-jumbo px-5 py-4 text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <VehicleIcon
                type={draft.vehicleType ?? "PICKUP"}
                className="h-5 w-auto"
                color="#FFFFFF"
              />
            </span>
            <span className="text-[16px] font-bold">ดูราคาและเรียกรถ</span>
          </span>
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* feature highlights */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {FEATURE_HIGHLIGHTS.map((f, i) => {
            const Icon =
              f.icon === "tag" ? Tag : f.icon === "pin" ? Navigation : ShieldCheck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex flex-col items-center gap-1 rounded-xl bg-surface p-2.5 text-center"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white">
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <p className="text-[11px] font-bold leading-tight text-ink">
                  {f.title}
                </p>
                <p className="text-[9px] leading-tight text-ink-muted">
                  {f.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* recent locations */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-ink-muted" />
            <h2 className="text-[14px] font-bold text-ink">สถานที่ล่าสุด</h2>
          </div>
          <div className="flex flex-col gap-2">
            {RECENT_LOCATIONS.slice(0, 3).map((loc) => (
              <button
                key={loc.name}
                onClick={() => go("pickup")}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 text-left transition active:bg-surface"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo-light">
                  <MapPin className="h-4 w-4 text-jumbo" />
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-[13px] font-semibold text-ink">
                    {loc.name} • {loc.tag}
                  </p>
                  <p className="truncate text-[11px] text-ink-muted">
                    {loc.address}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </button>
            ))}
          </div>
        </div>

        {/* promo banner */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface to-white shadow-sm">
          <div className="flex items-center">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center bg-jumbo-light">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-jumbo text-2xl text-white">
                👨
              </div>
              <span className="absolute bottom-1 rounded bg-white px-1 text-[8px] font-bold text-jumbo">
                Driver
              </span>
            </div>
            <div className="flex-1 p-3">
              <p className="text-[13px] font-extrabold text-ink">JUMBO GO</p>
              <p className="brush-underline text-[12px] font-medium text-ink">
                บริการขนส่งของ หนักเบาทุกชนิด
              </p>
              <button
                onClick={() => go("vehicle-type")}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-jumbo"
              >
                เรียกรถเลย <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-muted">
          JUMBO GO v1.0.0 • ใช้งานได้จริงตามพิมพ์เขียว
        </p>
      </div>

      {/* Side drawer */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/40"
          onClick={() => setMenuOpen(false)}
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-72 bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-extrabold italic tracking-tight text-ink">
                  JUMBO
                </span>
                <span className="rounded bg-jumbo px-1.5 py-0.5 text-[18px] font-extrabold italic tracking-tight text-white">
                  GO
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2"
                aria-label="ปิดเมนู"
              >
                <X className="h-5 w-5 text-ink-muted" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-jumbo p-3 text-white">
              <p className="text-[12px] opacity-90">สวัสดี</p>
              <p className="text-[16px] font-bold">สมชาย ใจดี</p>
              <p className="mt-1 text-[11px] opacity-80">
                สมาชิก JUMBO GO
              </p>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {[
                { label: "หน้าหลัก", screen: "home" as const, icon: Menu },
                {
                  label: "ประวัติงาน",
                  screen: "jobs" as const,
                  icon: Bell,
                },
                {
                  label: "การแจ้งเตือน",
                  screen: "notifications" as const,
                  icon: Bell,
                },
                {
                  label: "บัญชีของฉัน",
                  screen: "profile" as const,
                  icon: ShieldCheck,
                },
                {
                  label: "ศูนย์ช่วยเหลือ",
                  screen: "support" as const,
                  icon: Tag,
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    go(item.screen);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-ink transition hover:bg-surface"
                >
                  <item.icon className="h-4 w-4 text-ink-muted" />
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </div>
  );
}
