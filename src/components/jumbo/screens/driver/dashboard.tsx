"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  Bell,
  Truck,
  TrendingUp,
  Briefcase,
  Megaphone,
  Power,
  Star,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

export function DriverDashboardScreen() {
  const go = useJumbo((s) => s.go);
  const driverOnline = useJumbo((s) => s.driverOnline);
  const toggleDriverOnline = useJumbo((s) => s.toggleDriverOnline);

  return (
    <div className="relative flex min-h-full flex-col bg-surface pb-20">
      <StatusBar />
      {/* header */}
      <div className="relative overflow-hidden bg-jumbo px-5 pb-5 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] opacity-90">สวัสดี</p>
            <p className="text-[18px] font-bold">สมชาย ใจดี</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                Driver JG-00108
              </span>
              <span className="flex items-center gap-0.5 text-[11px]">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                4.8
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go("notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-jumbo" />
            </button>
            <button
              onClick={() => go("driver-profile")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15"
              aria-label="โปรไฟล์"
            >
              <UserRound className="h-7 w-7 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* online toggle */}
        <div className="relative mt-3 flex items-center justify-between rounded-2xl bg-white/15 p-3 backdrop-blur">
          <div>
            <p className="text-[11px] opacity-90">สถานะปัจจุบัน</p>
            <p className="text-[15px] font-bold">
              {driverOnline ? "ออนไลน์ (พร้อมรับงาน)" : "ออฟไลน์"}
            </p>
          </div>
          <button
            onClick={toggleDriverOnline}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold transition ${
              driverOnline
                ? "bg-green-500 text-white"
                : "bg-white text-jumbo"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                driverOnline ? "bg-white animate-pulse" : "bg-jumbo"
              }`}
            />
            {driverOnline ? "เปิดรับงาน" : "ปิดรับงาน"}
          </button>
        </div>
      </div>

      <div className="-mt-2 rounded-t-3xl bg-surface px-4 pt-4">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-line bg-white p-3"
          >
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-jumbo" />
              <span className="text-[11px] text-ink-muted">งานวันนี้</span>
            </div>
            <p className="mt-1 text-[22px] font-extrabold text-ink">3 งาน</p>
            <p className="text-[10px] text-green-600">↑ 1 งานจากเมื่อวาน</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-line bg-white p-3"
          >
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-jumbo" />
              <span className="text-[11px] text-ink-muted">รายได้วันนี้</span>
            </div>
            <p className="mt-1 text-[22px] font-extrabold text-jumbo">฿1,250</p>
            <p className="text-[10px] text-green-600">↑ ฿320 จากเมื่อวาน</p>
          </motion.div>
        </div>

        {/* ongoing */}
        <Section
          title="งานที่กำลังดำเนินการ"
          action={
            <button
              onClick={() => go("driver-jobs")}
              className="text-[12px] font-medium text-jumbo"
            >
              ดูทั้งหมด
            </button>
          }
        >
          <button
            onClick={() => go("driver-jobs")}
            className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jumbo-light">
              <Truck className="h-5 w-5 text-jumbo" />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">
                JG-2025-00108
              </p>
              <p className="text-[11px] text-ink-muted">
                บ้าน → สนามบินสุวรรณภูมิ
              </p>
              <p className="text-[11px] text-jumbo">กำลังเดินทาง • ฿619</p>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        </Section>

        {/* latest earnings */}
        <Section
          title="รายได้ล่าสุด"
          action={
            <button
              onClick={() => go("driver-earnings")}
              className="text-[12px] font-medium text-jumbo"
            >
              ดูทั้งหมด
            </button>
          }
        >
          <div className="flex flex-col gap-1.5">
            {[
              { id: "JG-00105", time: "08:30 น.", amount: 450, status: "โอนแล้ว" },
              { id: "JG-00100", time: "เมื่อวาน 16:20", amount: 720, status: "รอโอน" },
              { id: "JG-00098", time: "เมื่อวาน 11:15", amount: 380, status: "โอนแล้ว" },
            ].map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5"
              >
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-ink">{e.id}</p>
                  <p className="text-[10px] text-ink-muted">{e.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-jumbo">฿{e.amount}</p>
                  <p
                    className={`text-[10px] ${
                      e.status === "โอนแล้ว"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {e.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* announcements */}
        <Section title="ประกาศจากระบบ">
          <div className="rounded-2xl border border-line bg-jumbo-light p-3">
            <div className="flex items-start gap-2">
              <Megaphone className="mt-0.5 h-4 w-4 flex-shrink-0 text-jumbo" />
              <div>
                <p className="text-[12px] font-bold text-jumbo-dark">
                  โปรโมชั่น! รายได้พิเศษ 20%
                </p>
                <p className="mt-0.5 text-[11px] text-jumbo-dark">
                  รับงานครบ 10 งานในสัปดาห์นี้ รับโบนัสพิเศษ 20% ของรายได้
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* quick actions */}
        <div className="grid grid-cols-4 gap-2">
          <QuickBtn
            icon={Briefcase}
            label="งาน"
            onClick={() => go("driver-jobs")}
          />
          <QuickBtn
            icon={TrendingUp}
            label="รายได้"
            onClick={() => go("driver-earnings")}
          />
          <QuickBtn
            icon={Truck}
            label="ประวัติ"
            onClick={() => go("driver-history")}
          />
          <QuickBtn
            icon={Power}
            label="โปรไฟล์"
            onClick={() => go("driver-profile")}
          />
        </div>
      </div>

      {/* driver bottom nav */}
      <DriverBottomNav />
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-bold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function QuickBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white py-3 transition active:scale-95"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[11px] font-semibold text-ink">{label}</span>
    </button>
  );
}

// Driver-specific bottom navigation
function DriverBottomNav() {
  const go = useJumbo((s) => s.go);
  const screen = useJumbo((s) => s.screen);
  const items = [
    { key: "dashboard", label: "แดชบอร์ด", icon: TrendingUp, screen: "driver-dashboard" as const },
    { key: "jobs", label: "งาน", icon: Briefcase, screen: "driver-jobs" as const },
    { key: "earnings", label: "รายได้", icon: Truck, screen: "driver-earnings" as const },
    { key: "history", label: "ประวัติ", icon: Bell, screen: "driver-history" as const },
    { key: "profile", label: "โปรไฟล์", icon: Power, screen: "driver-profile" as const },
  ];
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 backdrop-blur-md">
      <div className="flex items-stretch justify-between px-1.5 pb-2 pt-1.5">
        {items.map((it) => {
          const active = screen === it.screen;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => go(it.screen)}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5"
              aria-label={it.label}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${active ? "text-jumbo" : "text-ink-muted"}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? "text-jumbo" : "text-ink-muted"
                }`}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mx-auto mb-1 h-1 w-28 rounded-full bg-ink/30" />
    </nav>
  );
}
