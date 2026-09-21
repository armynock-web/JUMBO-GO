"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Banknote,
  FileText,
  ShieldCheck,
  Pencil,
  LogOut,
  Bell,
  HelpCircle,
  UserRound,
} from "lucide-react";

export function DriverProfileScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const logout = useJumbo((s) => s.logout);

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex items-center justify-between bg-white px-3 py-1">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          โปรไฟล์ Driver
        </span>
        <div className="w-9" />
      </div>

      {/* profile header */}
      <div className="relative overflow-hidden bg-jumbo px-5 pb-5 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <UserRound className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-bold">สมชาย ใจดี</p>
            <p className="text-[12px] opacity-90">081-234-5678</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                JG-00108
              </span>
              <span className="flex items-center gap-0.5 text-[11px]">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                4.8 (320 รีวิว)
              </span>
            </div>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        {/* KYC badge */}
        <div className="relative mt-3 flex items-center gap-2 rounded-lg bg-white/15 p-2">
          <ShieldCheck className="h-4 w-4 text-green-300" />
          <span className="text-[11px] font-bold">KYC อนุมัติแล้ว</span>
          <span className="ml-auto text-[10px] opacity-80">
            อนุมัติ 15 ก.ย. 2025
          </span>
        </div>
      </div>

      {/* stats */}
      <div className="-mt-2 mx-4 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm">
        <Stat label="งานสำเร็จ" value="42" />
        <Stat label="รายได้เดือนนี้" value="฿22.8k" />
        <Stat label="อัตรารับงาน" value="94%" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-3 scrollbar-hide">
        {/* vehicle */}
        <MenuGroup title="รถของฉัน">
          <MenuItem
            icon={Truck}
            label="Isuzu D-Max กระบะตู้ทึบ"
            value="ขข 1234"
            onClick={() => go("driver-history")}
          />
          <MenuItem
            icon={Truck}
            label="+ เพิ่มรถ"
            value=""
            onClick={() => go("driver-onboarding")}
          />
        </MenuGroup>

        {/* finance */}
        <MenuGroup title="การเงิน">
          <MenuItem
            icon={Banknote}
            label="บัญชีธนาคาร"
            value="กสิกร ***1234"
            onClick={() => go("driver-earnings")}
          />
          <MenuItem
            icon={FileText}
            label="ใบเสร็จรับเงิน"
            value="42 ใบ"
            onClick={() => go("driver-history")}
          />
        </MenuGroup>

        {/* settings */}
        <MenuGroup title="ตั้งค่า">
          <MenuItem
            icon={Bell}
            label="การแจ้งเตือน"
            value="เปิด"
            onClick={() => go("driver-history")}
          />
          <MenuItem
            icon={ShieldCheck}
            label="เอกสาร KYC"
            value="อนุมัติ"
            onClick={() => go("driver-onboarding-status")}
          />
          <MenuItem
            icon={HelpCircle}
            label="ศูนย์ช่วยเหลือ"
            onClick={() => go("driver-history")}
          />
        </MenuGroup>

        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-jumbo bg-white py-3 text-[14px] font-bold text-jumbo"
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </button>

        <p className="mt-3 text-center text-[11px] text-ink-muted">
          JUMBO GO Driver v1.0.0
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[15px] font-extrabold text-jumbo">{value}</p>
      <p className="text-[10px] text-ink-muted">{label}</p>
    </div>
  );
}

function MenuGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 px-1 text-[12px] font-bold text-ink-muted">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {children}
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line px-3 py-3 text-left transition last:border-b-0 active:bg-surface"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo-light">
        <Icon className="h-4 w-4 text-jumbo" />
      </span>
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      {value && <span className="text-[11px] text-ink-muted">{value}</span>}
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </button>
  );
}
