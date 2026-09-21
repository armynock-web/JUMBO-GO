"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import { JumboLogo } from "../../logo";
import { HeroTruck } from "../../vehicle-icon";
import {
  ChevronLeft,
  Truck,
  DollarSign,
  Clock,
  Headphones,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export function DriverRegisterScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);

  const benefits = [
    {
      icon: Truck,
      title: "งานต่อเนื่อง",
      desc: "มีงานทุกวัน ทั่วประเทศ",
    },
    {
      icon: DollarSign,
      title: "รายได้โปร่งใส",
      desc: "เห็นรายได้แบบเรียลไทม์ โอนเงินรวดเร็ว",
    },
    {
      icon: Clock,
      title: "เลือกเวลาทำงาน",
      desc: "เปิด/ปิดรับงานได้เอง ตามใจคุณ",
    },
    {
      icon: Headphones,
      title: "ทีมงานช่วยเหลือ",
      desc: "มีทีม Support 24 ชม.",
    },
  ];

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex items-center justify-between px-3 py-1">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          สมัคร Driver
        </span>
        <div className="w-9" />
      </div>

      {/* hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-jumbo via-jumbo-dark to-[#7a0d11] px-5 pb-6 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center justify-center">
          <JumboLogo size={56} showWord={false} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-2 text-center"
        >
          <h1 className="text-[22px] font-extrabold leading-tight">
            สมัครเป็นพาร์ตเนอร์<br />คนขับ JUMBO GO
          </h1>
          <p className="mt-1 text-[12px] opacity-90">
            สร้างรายได้จากรถของคุณ วันนี้!
          </p>
        </motion.div>
        <div className="relative mt-3 flex justify-center">
          <HeroTruck className="h-16 w-32 drop-shadow-lg" />
        </div>
      </div>

      {/* benefits */}
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
        <p className="mb-2 text-[13px] font-bold text-ink">
          ทำไมต้องเป็น Driver กับ JUMBO GO?
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-line bg-white p-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo-light">
                <b.icon className="h-4 w-4 text-jumbo" />
              </span>
              <p className="mt-1.5 text-[13px] font-bold text-ink">
                {b.title}
              </p>
              <p className="text-[11px] leading-tight text-ink-muted">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* steps preview */}
        <div className="mt-4 rounded-2xl bg-surface p-3">
          <p className="text-[12px] font-bold text-ink">
            ขั้นตอนการสมัคร (10 ขั้น)
          </p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {[
              "ข้อมูลส่วนตัว",
              "บัตรประชาชน",
              "ใบขับขี่",
              "ข้อมูลรถ",
              "เอกสารรถ",
              "บัญชีธนาคาร",
              "ยืนยันใบหน้า",
              "ข้อกำหนด",
              "ตรวจสอบ",
              "ส่งตรวจ",
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-lg bg-white p-1 text-center text-[8px] font-medium text-ink-muted"
              >
                <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-jumbo text-[9px] font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-0.5 leading-tight">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* requirements */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="text-[12px] font-bold text-ink">คุณสมบัติ</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {[
              "อายุ 20 ปีบริบูรณ์",
              "มีใบขับขี่รถยนต์ หรือ รถบรรทุก",
              "มีรถกระบะ / ตู้ทึบ / คอก / จัมโบ้ / 6 ล้อ",
              "มีบัตรประชาชนและทะเบียนรถ",
              "มีบัญชีธนาคาร",
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
                <span className="text-[12px] text-ink">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() => go("driver-onboarding")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
        >
          สมัครคนขับ
        </button>
        <p className="mt-2 text-center text-[12px] text-ink-muted">
          มีบัญชี Driver แล้ว?{" "}
          <button
            onClick={() => go("driver-login")}
            className="font-bold text-jumbo"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
}
