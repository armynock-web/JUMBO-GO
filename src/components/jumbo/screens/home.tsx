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
  UserRound,
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
      <div className="relative overflow-hidden bg-slate-900">
        {/* Background real trucks banner with gradient */}
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src="/images/banner/hero-trucks.jpg"
            alt="JUMBO GO Fleet"
            className="h-full w-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

          {/* Top Nav Bar inside Hero */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-3 text-white">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
              aria-label="เมนู"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
              <img
                src="/images/brand/app-icon.jpg"
                alt="JUMBO GO"
                className="h-5 w-5 rounded object-contain"
              />
              <span className="text-[15px] font-extrabold italic tracking-tight text-white">
                JUMBO
              </span>
              <span className="rounded bg-jumbo px-1.5 py-0.2 text-[13px] font-extrabold italic tracking-tight text-white">
                GO
              </span>
            </div>
            <button
              onClick={() => go("notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
              aria-label="แจ้งเตือน"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-jumbo ring-2 ring-white" />
            </button>
          </div>

          {/* Official Slogan and Branding */}
          <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[22px] font-black leading-tight drop-shadow-md text-white"
            >
              จะขน จะย้าย เรียก JUMBO GO
            </motion.h1>
            <p className="mt-0.5 text-[13px] font-bold text-amber-300 drop-shadow">
              สะดวก • ปลอดภัย • ไว้ใจได้
            </p>
          </div>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="relative -mt-2 rounded-t-3xl bg-white px-4 pt-4">
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

        {/* vehicle selector with real vehicle photos */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">
              เลือกรถจริงตามความต้องการ
            </h2>
            <button
              onClick={() => go("vehicle-type")}
              className="text-[12px] font-medium text-jumbo hover:underline"
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
                  className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-2xl border-2 p-2.5 transition ${
                    active
                      ? "border-jumbo bg-jumbo-light shadow-sm"
                      : "border-line bg-white hover:border-slate-300"
                  }`}
                  style={{ width: 102 }}
                >
                  <div
                    className={`flex h-14 w-20 items-center justify-center overflow-hidden rounded-xl p-0.5 ${
                      active ? "bg-white ring-1 ring-jumbo/20" : "bg-surface"
                    }`}
                  >
                    <img
                      src={`/images/vehicles/${
                        v.type === "PICKUP"
                          ? "pickup"
                          : v.type === "CLOSED_PICKUP"
                          ? "box"
                          : v.type === "CAGE_PICKUP"
                          ? "cage"
                          : v.type === "JUMBO"
                          ? "jumbo"
                          : "six-wheel"
                      }.jpg`}
                      alt={v.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[12px] font-bold text-ink truncate w-full text-center">
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

        {/* Red CTA Pill Button matching official poster */}
        <button
          onClick={handleCallToAction}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-jumbo py-3.5 text-[16px] font-black text-white shadow-lg shadow-jumbo/35 transition hover:bg-jumbo-dark active:scale-[0.98]"
        >
          <span>เรียกรถเลย</span>
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </button>
        {/* feature highlights matching official advertisement */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { title: "รวดเร็ว ทันใจ", sub: "เรียกรถได้ตลอด 24 ชม.", icon: Tag },
            { title: "ปลอดภัย ไร้กังวล", sub: "คนขับตรวจประวัติ 100%", icon: ShieldCheck },
            { title: "ราคามาตรฐาน", sub: "โปร่งใส ไม่มีบวกเพิ่ม", icon: Navigation },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-surface p-2.5 text-center shadow-xs"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white shadow-xs">
                <f.icon className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <p className="text-[11px] font-bold leading-tight text-ink">
                {f.title}
              </p>
              <p className="text-[9px] leading-tight text-ink-muted">
                {f.sub}
              </p>
            </motion.div>
          ))}
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

        {/* Real Brand Driver & Trust Showcase Banner */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="relative h-44 w-full overflow-hidden bg-slate-100">
            <img
              src="/images/banner/driver-showcase.jpg"
              alt="JUMBO GO Verified Driver & Delivery"
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="rounded bg-jumbo px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                มาตรฐาน JUMBO GO
              </span>
              <p className="mt-1 text-[13px] font-extrabold leading-tight text-white drop-shadow">
                ทุกการเดินทางของคุณ คือความไว้วางใจของเรา
              </p>
              <p className="text-[11px] font-medium text-slate-200">
                JUMBO GO มากกว่าการขนของ คือความสบายใจ
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-muted">
          JUMBO GO v1.5.0 • ใช้งานได้จริงตามมาตรฐานแพลตฟอร์มเชิงพาณิชย์
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
