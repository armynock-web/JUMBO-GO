"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { ONBOARDING_SLIDES, VEHICLES } from "@/lib/brand";
import { JumboLockup } from "../logo";
import { VehiclePhoto } from "../vehicle-icon";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShieldCheck, MapPin, Tag, Zap, Package, CheckCircle2 } from "lucide-react";

export function OnboardingScreen() {
  const go = useJumbo((s) => s.go);
  const [step, setStep] = useState(0);
  const slide = ONBOARDING_SLIDES[step];
  const isLast = step === ONBOARDING_SLIDES.length - 1;

  const next = () => (isLast ? go("login") : setStep((s) => s + 1));

  return (
    <div className="relative flex min-h-full flex-1 flex-col justify-between bg-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-line/60 px-5 py-3">
        <JumboLockup />
        <button
          onClick={() => go("login")}
          className="rounded-lg px-2.5 py-1 text-[13px] font-semibold text-ink-muted hover:bg-slate-100 hover:text-ink transition"
        >
          ข้าม
        </button>
      </div>

      {/* Main Slide Body */}
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            {/* 1. Hero Graphic Illustration Area with Real Imagery */}
            <div className="relative h-60 w-full flex-shrink-0 overflow-hidden border-b border-line/40">
              {step === 0 && <Slide1Art />}
              {step === 1 && <Slide2Art />}
              {step === 2 && <Slide3Art />}
            </div>

            {/* 2. Text & Feature Explanations */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-5 text-center">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-jumbo-light px-3 py-0.5 text-[11px] font-black text-jumbo">
                  <span>ขั้นตอนที่ {slide.badge ?? step + 1} จาก 3</span>
                </div>
                <h2 className="text-[22px] font-black leading-tight text-ink">
                  {slide.headline}
                </h2>
                <p className="mt-1 text-[15px] font-bold text-jumbo">
                  {slide.sub}
                </p>
              </div>
              <p className="max-w-[340px] text-[13px] leading-relaxed text-ink-muted">
                {slide.desc}
              </p>

              {/* Feature Chips for Step 0 (Real Vehicles) */}
              {step === 0 && (
                <div className="mt-2 grid w-full max-w-[360px] grid-cols-3 gap-2">
                  {VEHICLES.slice(0, 3).map((v) => (
                    <div
                      key={v.type}
                      className="rounded-xl border border-line bg-surface p-2 text-center shadow-xs"
                    >
                      <div className="mx-auto flex h-10 w-full items-center justify-center overflow-hidden">
                        <VehiclePhoto type={v.type} className="h-8 w-auto object-contain" />
                      </div>
                      <p className="mt-1 text-[11px] font-bold text-ink">
                        {v.name}
                      </p>
                      <p className="text-[10px] text-ink-muted">{v.tonRange}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Feature Chips for Step 1 (Verified Driver Guarantees) */}
              {step === 1 && (
                <div className="mt-2 flex w-full max-w-[340px] flex-col gap-2">
                  {[
                    { Icon: CheckCircle2, t: "ตรวจประวัติอาชญากรรมคนขับ 100%" },
                    { Icon: ShieldCheck, t: "ประกันคุ้มครองสินค้าสูงสุด ฿50,000 ต่อเที่ยว" },
                    { Icon: Zap, t: "เรียกรถได้ตลอด 24 ชม. ทั่วประเทศ" },
                  ].map((f) => (
                    <div
                      key={f.t}
                      className="flex items-center gap-2.5 rounded-xl border border-line/60 bg-surface px-3 py-2 text-left"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-white flex-shrink-0">
                        <f.Icon className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                      <span className="text-[12px] font-bold text-ink">
                        {f.t}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Feature Chips for Step 2 (Tracking & Transparent Pricing) */}
              {step === 2 && (
                <div className="mt-2 grid w-full max-w-[340px] grid-cols-2 gap-2">
                  {[
                    { Icon: Tag, t: "รู้ราคาก่อนเริ่มงาน ไม่มีบวกเพิ่ม" },
                    { Icon: MapPin, t: "ติดตามพิกัด GPS Real-time" },
                    { Icon: ShieldCheck, t: "ยืนยันส่งพัสดุด้วย OTP/ภาพถ่าย" },
                    { Icon: Package, t: "ออกใบเสร็จ/ใบกำกับภาษีได้" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-xl border border-line/60 bg-surface p-2.5 text-left"
                    >
                      <f.Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-jumbo" />
                      <span className="text-[11px] font-bold leading-tight text-ink">
                        {f.t}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-1 text-[11px] italic text-ink-muted">
                {slide.footnote}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Bottom Footer CTA Area */}
      <div className="flex flex-col items-center gap-3 border-t border-line/40 px-6 py-4">
        {/* Step Indicator Dots */}
        <div className="flex items-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-jumbo" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`สไลด์ ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition hover:bg-jumbo-dark active:scale-[0.98]"
        >
          {isLast ? (
            "เริ่มต้นใช้งาน JUMBO GO"
          ) : (
            <>
              ถัดไป
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Slide1Art() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-900">
      <img
        src="/images/banner/hero-trucks.jpg"
        alt="JUMBO GO Fleet"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-[13px] font-black text-white shadow-md">
          1
        </span>
        <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          กองทัพรถขนส่งครบวงจร
        </span>
      </div>
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-around gap-1.5 rounded-xl bg-white/95 p-1.5 shadow-md backdrop-blur-sm">
        {VEHICLES.slice(0, 5).map((v) => (
          <div key={v.type} className="flex flex-col items-center">
            <div className="h-7 w-9 overflow-hidden flex items-center justify-center">
              <VehiclePhoto type={v.type} className="h-6 w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-ink">{v.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide2Art() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-900">
      <img
        src="/images/banner/driver-showcase.jpg"
        alt="JUMBO GO Verified Drivers"
        className="h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-[13px] font-black text-white shadow-md">
          2
        </span>
        <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          คนขับมืออาชีพผ่านการคัดกรอง
        </span>
      </div>
      <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between rounded-xl bg-black/75 px-3 py-1.5 text-white backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-[11px] font-bold">ตรวจประวัติอาชญากรรม 100%</span>
        </div>
        <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black">
          VERIFIED
        </span>
      </div>
    </div>
  );
}

function Slide3Art() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950 p-3">
      {/* Visual map route tracker preview */}
      <div className="relative flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/90 p-3 text-white shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-[13px] font-black text-white shadow-md">
              3
            </span>
            <span className="text-[12px] font-bold text-white">
              ติดตามเส้นทาง GPS Real-time
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            สด (LIVE)
          </span>
        </div>

        {/* Route visualization */}
        <div className="my-auto flex items-center justify-between px-2">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white shadow">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 text-[10px] font-semibold text-slate-300">จุดรับของ</span>
          </div>

          <div className="relative mx-3 flex-1">
            <div className="h-1 w-full bg-slate-700 rounded-full" />
            <div className="absolute top-0 left-0 h-1 w-2/3 bg-jumbo rounded-full" />
            <div className="absolute -top-3 left-2/3 -translate-x-1/2 rounded-full bg-white p-1 shadow">
              <img
                src="/images/vehicles/pickup.jpg"
                alt="Truck"
                className="h-4 w-5 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 text-[10px] font-semibold text-slate-300">จุดส่งของ</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-1.5 text-xs">
          <span className="text-slate-300">ค่าบริการสุทธิ</span>
          <span className="font-extrabold text-amber-300">฿350 (ราคาสุทธิ ไม่มีค่าซ่อนเร้น)</span>
        </div>
      </div>
    </div>
  );
}

