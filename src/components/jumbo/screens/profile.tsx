"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { VEHICLES } from "@/lib/brand";
import {
  ChevronRight,
  User,
  Truck,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  MapPin,
  Star,
  Settings,
  Phone,
  Mail,
} from "lucide-react";

export function ProfileScreen() {
  const go = useJumbo((s) => s.go);
  const logout = useJumbo((s) => s.logout);

  return (
    <div className="relative flex min-h-full flex-col bg-surface pb-20">
      <StatusBar />
      {/* header */}
      <div className="relative overflow-hidden bg-jumbo px-5 pb-8 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center justify-between">
          <h1 className="text-[18px] font-bold">บัญชีของฉัน</h1>
          <button
            onClick={() => go("support")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15"
            aria-label="ตั้งค่า"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <div className="relative mt-3 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <User className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-bold">สมชาย ใจดี</p>
            <p className="text-[12px] opacity-90">081-234-5678</p>
            <div className="mt-1 flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span className="text-[11px] font-semibold">
                สมาชิก JUMBO GO
              </span>
            </div>
          </div>
          <button
            onClick={() => go("support")}
            className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold"
          >
            แก้ไข
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="-mt-4 mx-4 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm">
        <Stat label="งานสำเร็จ" value="23" />
        <div className="border-x border-line" />
        <Stat label="เดือนนี้" value="3" />
      </div>

      <div className="mt-3 px-4">
        <MenuGroup title="บัญชี">
          <MenuItem
            icon={User}
            label="ข้อมูลส่วนตัว"
            value="สมชาย ใจดี"
            onClick={() => go("support")}
          />
          <MenuItem
            icon={MapPin}
            label="ที่อยู่ของฉัน"
            value="3 รายการ"
            onClick={() => go("support")}
          />
          <MenuItem
            icon={CreditCard}
            label="วิธีชำระเงิน"
            value="เงินสด"
            onClick={() => go("support")}
          />
        </MenuGroup>

        <MenuGroup title="บริการ">
          <MenuItem
            icon={Truck}
            label="ประเภทรถที่ใช้บ่อย"
            value={VEHICLES[1].name}
            onClick={() => go("vehicle-type")}
          />
          <MenuItem
            icon={Bell}
            label="การแจ้งเตือน"
            value="เปิด"
            onClick={() => go("notifications")}
          />
          <MenuItem
            icon={Shield}
            label="ความปลอดภัยและความเป็นส่วนตัว"
            onClick={() => go("support")}
          />
        </MenuGroup>

        <MenuGroup title="ช่วยเหลือ">
          <MenuItem
            icon={HelpCircle}
            label="ศูนย์ช่วยเหลือ"
            onClick={() => go("support")}
          />
          <MenuItem
            icon={Phone}
            label="โทรหาสายด่วน"
            value="1365"
          />
          <MenuItem
            icon={Mail}
            label="ติดต่อเรา"
            value="support@jumbogo.co.th"
          />
        </MenuGroup>

        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-jumbo bg-white py-3 text-[14px] font-bold text-jumbo transition active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </button>

        <p className="mt-3 text-center text-[11px] text-ink-muted">
          JUMBO GO เวอร์ชัน 1.0.0
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-extrabold text-ink">{value}</p>
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
      <span className="flex-1 text-[13px] font-medium text-ink">
        {label}
      </span>
      {value && (
        <span className="text-[12px] text-ink-muted">{value}</span>
      )}
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </button>
  );
}
