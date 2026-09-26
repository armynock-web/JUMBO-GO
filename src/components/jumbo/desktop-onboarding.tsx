"use client";

import { useJumbo } from "@/store/jumbo";
import { JumboLogo } from "./logo";
import { VehiclePhoto } from "./vehicle-icon";
import { VEHICLES } from "@/lib/brand";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Tag,
  Zap,
  Package,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export function DesktopOnboarding() {
  const go = useJumbo((s) => s.go);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950 text-white font-sans overflow-y-auto">
      {/* 1. Desktop Top Bar */}
      <header className="flex h-20 w-full items-center justify-between border-b border-white/10 bg-slate-900/80 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            src="/images/brand/app-icon.jpg"
            alt="JUMBO GO"
            className="h-10 w-10 rounded-xl object-contain shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black italic tracking-tight text-white">
                JUMBO
              </span>
              <span className="rounded bg-jumbo px-2 py-0.5 text-xl font-black italic tracking-tight text-white">
                GO
              </span>
            </div>
            <p className="text-xs text-slate-400">เรียกรถขนของ ราคาคนไทย • สะดวก ปลอดภัย ไว้ใจได้</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <PhoneCall className="h-4 w-4 text-jumbo" />
            <span>ศูนย์บริการลูกค้า: <strong>02-123-4567</strong></span>
          </div>

          <button
            onClick={() => go("home")}
            className="flex items-center gap-2 rounded-xl bg-jumbo px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-jumbo/30 transition hover:bg-jumbo-dark"
          >
            <span>เริ่มเรียกรถทันที</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Headline */}
      <div className="mx-auto max-w-6xl px-6 pt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-jumbo/30 bg-jumbo/10 px-4 py-1 text-xs font-bold text-jumbo mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>มาตรฐานใหม่แห่งการขนส่งออนดีมานด์ในประเทศไทย</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          จะขน จะย้าย เรียก <span className="text-jumbo italic">JUMBO GO</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-300">
          สะดวก • ปลอดภัย • ไว้ใจได้ — รู้ราคาก่อน ติดตามรถได้ ทุกขั้นตอนโปร่งใส ไร้กังวล
        </p>
      </div>

      {/* 3. The 3 Value Pillars (1 - 2 - 3 matching the user's reference mockup) */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: รถรับจ้างหลากหลายขนาด */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl transition hover:border-jumbo/50"
          >
            <div className="relative h-56 w-full overflow-hidden bg-slate-950">
              <img
                src="/images/banner/hero-trucks.jpg"
                alt="รถรับจ้างหลากหลายขนาด"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-jumbo text-base font-black text-white shadow-lg">
                1
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-jumbo">
                Fleet Variety
              </span>
              <h3 className="mt-1 text-xl font-black text-white">
                รถรับจ้างหลากหลายขนาด
              </h3>
              <p className="mt-1 text-sm font-bold text-amber-300">
                จะขน จะย้าย เรียก JUMBO GO
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                มีรถขนส่งให้เลือกครบทุกประเภท ทั้งกระบะ ตู้ทึบ คอก จัมโบ้ และ 6 ล้อ รองรับทุกขนาดงานขนส่งตั้งแต่ของชิ้นเล็กจนถึง 10 ตัน
              </p>

              {/* Vehicle Pills */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                {VEHICLES.slice(0, 3).map((v) => (
                  <div
                    key={v.type}
                    className="flex flex-col items-center rounded-xl bg-slate-800/80 p-2 text-center"
                  >
                    <div className="h-8 w-12 flex items-center justify-center">
                      <VehiclePhoto type={v.type} className="h-7 w-full object-contain" />
                    </div>
                    <span className="mt-1 text-[11px] font-bold text-white">{v.name}</span>
                    <span className="text-[9px] text-slate-400">{v.tonRange}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: คนขับมืออาชีพ ไว้วางใจได้ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl transition hover:border-jumbo/50"
          >
            <div className="relative h-56 w-full overflow-hidden bg-slate-950">
              <img
                src="/images/banner/driver-showcase.jpg"
                alt="คนขับมืออาชีพ ไว้วางใจได้"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-jumbo text-base font-black text-white shadow-lg">
                2
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Partners
              </span>
              <h3 className="mt-1 text-xl font-black text-white">
                คนขับมืออาชีพ ไว้วางใจได้
              </h3>
              <p className="mt-1 text-sm font-bold text-emerald-400">
                สะดวก • ปลอดภัย • ไว้ใจได้
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                คนขับทุกคนผ่านการตรวจประวัติอาชญากรรม 100% พร้อมระบบยืนยันตัวตน KYC และมีประกันคุ้มครองสินค้าทุกเที่ยววิ่ง
              </p>

              {/* Guarantees List */}
              <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
                {[
                  "ตรวจประวัติอาชญากรรม 100%",
                  "ประกันสินค้าสูงสุด ฿50,000 ต่อเที่ยว",
                  "อบรมมาตรฐานความปลอดภัยเข้มงวด",
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: เช็คราคาแม่นยำ ติดตามสถานะได้ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl transition hover:border-jumbo/50"
          >
            <div className="relative h-56 w-full overflow-hidden bg-slate-950 p-4">
              {/* Route Map Preview */}
              <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-900 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">ระบบติดตามสถานะสด</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400">GPS LIVE</span>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-white">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <span className="mt-1 text-[10px] text-slate-300">จุดรับของ</span>
                  </div>
                  <div className="relative flex-1 mx-2">
                    <div className="h-1 bg-slate-700 rounded-full" />
                    <div className="absolute top-0 left-0 h-1 w-2/3 bg-jumbo rounded-full" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <span className="mt-1 text-[10px] text-slate-300">จุดส่งของ</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1 text-xs">
                  <span className="text-slate-400">ราคามาตรฐาน</span>
                  <span className="font-bold text-amber-300">ไม่มีบวกเพิ่ม</span>
                </div>
              </div>

              <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-jumbo text-base font-black text-white shadow-lg">
                3
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Transparent Pricing
              </span>
              <h3 className="mt-1 text-xl font-black text-white">
                เช็คราคาแม่นยำ ติดตามสถานะได้
              </h3>
              <p className="mt-1 text-sm font-bold text-amber-400">
                รู้ราคาก่อน ติดตามรถได้ ทุกขั้นตอนโปร่งใส ไร้กังวล
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                คำนวณราคาตามระยะทางจริง ไม่มีค่าใช้จ่ายแอบแฝง ติดตามพิกัด GPS แบบ Real-time ตลอดเส้นทาง พร้อมหลักฐานการจัดส่งครบถ้วน
              </p>

              {/* Highlights List */}
              <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
                {[
                  "คำนวณราคาตามระยะทางจริง",
                  "ติดตามตำแหน่ง GPS Real-time",
                  "ออกใบกำกับภาษี/ใบเสร็จได้",
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Bottom Main Action CTA */}
      <div className="mx-auto max-w-xl pb-16 pt-4 text-center px-6">
        <button
          onClick={() => go("home")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-jumbo py-4 text-lg font-black text-white shadow-xl shadow-jumbo/40 transition hover:bg-jumbo-dark hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>เริ่มต้นใช้งาน / เรียกรถเลย</span>
          <ChevronRight className="h-6 w-6" strokeWidth={3} />
        </button>
        <p className="mt-3 text-xs text-slate-400">
          พร้อมให้บริการตลอด 24 ชั่วโมง ทั่วกรุงเทพฯ ปริมณฑล และทั่วประเทศ
        </p>
      </div>
    </div>
  );
}
