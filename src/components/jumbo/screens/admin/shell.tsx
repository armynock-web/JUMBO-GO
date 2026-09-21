"use client";

import { useJumbo, type ScreenId } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  LayoutGrid,
  Users,
  Truck,
  ShieldCheck,
  IdCard,
  Briefcase,
  Tag,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV: { id: ScreenId; label: string; icon: React.ElementType }[] = [
  { id: "admin-dashboard", label: "แดชบอร์ด", icon: LayoutGrid },
  { id: "admin-users", label: "ผู้ใช้งาน", icon: Users },
  { id: "admin-drivers", label: "คนขับ", icon: Truck },
  { id: "admin-driver-detail", label: "รายละเอียดคนขับ", icon: IdCard },
  { id: "admin-kyc", label: "ตรวจ KYC", icon: ShieldCheck },
  { id: "admin-vehicles", label: "รถ", icon: IdCard },
  { id: "admin-jobs", label: "งานทั้งหมด", icon: Briefcase },
  { id: "admin-job-detail", label: "รายละเอียดงาน", icon: Briefcase },
  { id: "admin-pricing", label: "ตั้งค่าราคา", icon: Tag },
  { id: "admin-payments", label: "การชำระเงิน", icon: CreditCard },
  { id: "admin-reports", label: "รายงาน", icon: BarChart3 },
  { id: "admin-notifications", label: "การแจ้งเตือน", icon: Bell },
  { id: "admin-settings", label: "ตั้งค่าระบบ", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const go = useJumbo((s) => s.go);
  const screen = useJumbo((s) => s.screen);
  const logout = useJumbo((s) => s.logout);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full bg-surface">
      {/* sidebar (desktop) */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-line bg-white md:flex md:flex">
        <div className="flex items-center gap-1.5 px-4 py-3">
          <span className="text-[14px] font-extrabold italic tracking-tight text-ink">
            JUMBO
          </span>
          <span className="rounded bg-jumbo px-1 py-0.5 text-[14px] font-extrabold italic tracking-tight text-white">
            GO
          </span>
          <span className="ml-1 rounded-full bg-ink px-1.5 py-0.5 text-[8px] font-bold text-white">
            Admin
          </span>
        </div>
        <div className="mx-3 mb-2 rounded-lg bg-jumbo-light p-2 text-center">
          <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-jumbo text-[12px] font-bold text-white">
            AD
          </div>
          <p className="mt-1 text-[10px] font-bold text-ink">Super Admin</p>
          <p className="text-[9px] text-ink-muted">admin@jumbogo.co.th</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 scrollbar-hide">
          {NAV.map((it) => {
            const active = screen === it.id;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition ${
                  active
                    ? "bg-jumbo text-white"
                    : "text-ink-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
                {it.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-line p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-jumbo hover:bg-jumbo-light"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="flex w-full flex-col md:hidden">
        <StatusBar />
        <div className="flex items-center justify-between bg-white px-3 py-1">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
            aria-label="เมนู"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <span className="text-[13px] font-medium text-ink-muted">
            Admin Console
          </span>
          <div className="w-9" />
        </div>

        {/* mobile nav drawer */}
        {mobileNavOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-60 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1.5 px-4 py-3">
                <span className="text-[14px] font-extrabold italic tracking-tight text-ink">
                  JUMBO
                </span>
                <span className="rounded bg-jumbo px-1 py-0.5 text-[14px] font-extrabold italic tracking-tight text-white">
                  GO
                </span>
              </div>
              <nav className="px-2">
                {NAV.map((it) => {
                  const active = screen === it.id;
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        go(it.id);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium ${
                        active ? "bg-jumbo text-white" : "text-ink-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {it.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide md:pt-0">
        <div className="hidden items-center gap-2 bg-white px-5 py-2 md:flex">
          <span className="text-[16px] font-bold text-ink">
            {NAV.find((n) => n.id === screen)?.label ?? "แดชบอร์ด"}
          </span>
          <span className="text-[11px] text-ink-muted">/ JUMBO GO Admin</span>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

// === Dashboard content ===
export function AdminDashboardContent() {
  return (
    <div className="flex flex-col gap-4">
      {/* summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="ผู้ใช้งาน"
          value="1,420"
          change="+128"
          up
        />
        <SummaryCard
          icon={Truck}
          label="Driver"
          value="248"
          change="+12"
          up
        />
        <SummaryCard
          icon={Briefcase}
          label="งานวันนี้"
          value="86"
          change="+15%"
          up
        />
        <SummaryCard
          icon={ShieldCheck}
          label="KYC รอตรวจ"
          value="14"
          change="-3"
          down
        />
      </div>

      {/* today stats */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] text-ink-muted">งานสำเร็จวันนี้</p>
          <p className="mt-1 text-[28px] font-extrabold text-green-600">72</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-green-600">
            <TrendingUp className="h-3 w-3" />
            94% ของงานทั้งหมด
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] text-ink-muted">รายได้วันนี้</p>
          <p className="mt-1 text-[28px] font-extrabold text-jumbo">฿84,500</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-green-600">
            <TrendingUp className="h-3 w-3" />
            +฿12,300 จากเมื่อวาน
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[11px] text-ink-muted">งานที่มีปัญหา</p>
          <p className="mt-1 text-[28px] font-extrabold text-amber-600">2</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            รอเจ้าหน้าที่ตรวจสอบ
          </div>
        </div>
      </div>

      {/* recent KYC */}
      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-ink">KYC รอตรวสล่าสุด</h3>
          <button className="text-[11px] font-medium text-jumbo">
            ดูทั้งหมด
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-line text-ink-muted">
              <tr>
                <th className="py-1.5 pr-2 font-medium">รหัส</th>
                <th className="px-2 py-1.5 font-medium">ชื่อ</th>
                <th className="px-2 py-1.5 font-medium">รถ</th>
                <th className="px-2 py-1.5 font-medium">ส่งเมื่อ</th>
                <th className="py-1.5 pl-2 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["KYC-1024", "สมชาย ใจดี", "กระบะตู้ทึบ", "5 นาที", "รอตรวจ"],
                ["KYC-1023", "วันดี มีสุข", "6 ล้อ", "20 นาที", "รอตรวจ"],
                ["KYC-1022", "อนุชา รักไทย", "จัมโบ้", "1 ชม.", "รอตรวจ"],
                ["KYC-1021", "ประยุทธ สดใส", "กระบะ", "2 ชม.", "ตีกลบ"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-line/50">
                  <td className="py-1.5 pr-2 font-bold text-jumbo">{r[0]}</td>
                  <td className="px-2 py-1.5 font-medium text-ink">{r[1]}</td>
                  <td className="px-2 py-1.5 text-ink-muted">{r[2]}</td>
                  <td className="px-2 py-1.5 text-ink-muted">{r[3]}</td>
                  <td className="py-1.5 pl-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        r[4] === "ตีกลบ"
                          ? "bg-jumbo-light text-jumbo"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* jobs by status */}
      <div className="rounded-2xl border border-line bg-white p-4">
        <h3 className="mb-2 text-[13px] font-bold text-ink">
          งานวันนี้ตามสถานะ
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "ค้นหาคนขับ", value: 4, color: "bg-amber-500" },
            { label: "กำลังเดินทาง", value: 8, color: "bg-jumbo" },
            { label: "รับของแล้ว", value: 2, color: "bg-blue-500" },
            { label: "ส่งสำเร็จ", value: 72, color: "bg-green-600" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-28 text-[11px] text-ink-muted">
                {r.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full ${r.color}`}
                  style={{ width: `${Math.min(100, (r.value / 86) * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] font-bold text-ink">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  change,
  up,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  up?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-line bg-white p-3"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo-light">
          <Icon className="h-4 w-4 text-jumbo" />
        </span>
        <span
          className={`flex items-center gap-0.5 text-[10px] font-bold ${
            up ? "text-green-600" : "text-jumbo"
          }`}
        >
          {up ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change}
        </span>
      </div>
      <p className="mt-2 text-[20px] font-extrabold text-ink">{value}</p>
      <p className="text-[10px] text-ink-muted">{label}</p>
    </motion.div>
  );
}
