"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { ONBOARDING_SLIDES, VEHICLES } from "@/lib/brand";
import { JumboLockup } from "../logo";
import { VehicleIcon } from "../vehicle-icon";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ShieldCheck, MapPin, Tag, Zap, Package, UserRound } from "lucide-react";

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
            {/* 1. Hero Graphic Illustration Area */}
            <div className="relative h-56 w-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-jumbo-light via-white to-surface border-b border-line/40">
              <div className="bg-grid absolute inset-0 opacity-40" />
              {step === 0 && <Slide1Art />}
              {step === 1 && <Slide2Art />}
              {step === 2 && <Slide3Art />}
            </div>

            {/* 2. Text & Feature Explanations */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-5 text-center">
              <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-ink">
                  {slide.headline}
                </h2>
                <p className="mt-1 text-[15px] font-bold text-jumbo">
                  {slide.sub}
                </p>
              </div>
              <p className="max-w-[320px] text-[13px] leading-relaxed text-ink-muted">
                {slide.desc}
              </p>

              {/* Feature Chips for Step 0 (Vehicles) */}
              {step === 0 && (
                <div className="mt-2 grid w-full max-w-[340px] grid-cols-3 gap-2">
                  {VEHICLES.slice(0, 3).map((v) => (
                    <div
                      key={v.type}
                      className="rounded-xl border border-line bg-surface p-2 text-center shadow-xs"
                    >
                      <VehicleIcon
                        type={v.type}
                        className="mx-auto h-8 w-auto"
                      />
                      <p className="mt-1 text-[11px] font-bold text-ink">
                        {v.name}
                      </p>
                      <p className="text-[10px] text-ink-muted">{v.tonRange}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Feature Chips for Step 1 */}
              {step === 1 && (
                <div className="mt-2 flex w-full max-w-[320px] flex-col gap-2">
                  {[
                    { Icon: Zap, t: "เร่งด่วนทันใจ เรียกรถได้ตลอด 24 ชม." },
                    { Icon: ShieldCheck, t: "คุ้มครองความเสียหายสูงสุด ฿50,000" },
                    { Icon: Package, t: "ขนส่งมาตรฐาน ทุกขนาด พัสดุถึงไว" },
                  ].map((f) => (
                    <div
                      key={f.t}
                      className="flex items-center gap-2.5 rounded-xl bg-surface px-3.5 py-2 text-left"
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

              {/* Feature Chips for Step 2 */}
              {step === 2 && (
                <div className="mt-2 grid w-full max-w-[320px] grid-cols-2 gap-2">
                  {[
                    { Icon: Tag, t: "ราคาชัดเจน ไม่มีค่าซ่อนเร้น" },
                    { Icon: MapPin, t: "ติดตามพิกัด GPS Real-time" },
                    { Icon: ShieldCheck, t: "คนขับตรวจประวัติ 100%" },
                    { Icon: Package, t: "ออกใบกำกับภาษีได้" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-xl bg-surface p-2.5 text-left"
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
                i === step ? "w-7 bg-jumbo" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`สไลด์ ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex w-full max-w-[360px] items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition hover:bg-jumbo-dark active:scale-[0.98]"
        >
          {isLast ? (
            "เริ่มใช้งาน JUMBO GO"
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
    <div className="relative flex h-full items-end justify-center">
      {/* City skyline background */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1.5 opacity-20">
        {[28, 45, 70, 52, 85, 60, 92, 48, 75, 35].map((h, i) => (
          <div
            key={i}
            className="w-5 bg-ink"
            style={{ height: h, borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
          />
        ))}
      </div>
      {/* Trucks row */}
      <div className="relative z-10 flex items-end gap-3 px-4 pb-3">
        {VEHICLES.slice(0, 4).map((v, i) => (
          <motion.div
            key={v.type}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-line bg-white p-2 shadow-md"
          >
            <VehicleIcon type={v.type} className="h-10 w-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Slide2Art() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-jumbo shadow-lg shadow-jumbo/30">
            <UserRound className="h-11 w-11 text-white" strokeWidth={2.5} />
          </div>
          <span className="mt-1 rounded-md bg-jumbo px-2 py-0.5 text-[10px] font-bold text-white">
            คนขับมืออาชีพ
          </span>
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <span className="h-1 w-8 rounded-full bg-jumbo" />
          <span className="text-[11px] font-black text-jumbo">JUMBO GO</span>
          <span className="h-1 w-8 rounded-full bg-jumbo" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 shadow-lg">
            <Package className="h-11 w-11 text-white" strokeWidth={2} />
          </div>
          <span className="mt-1 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">
            ดูแลสินค้าปลอดภัย
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function Slide3Art() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="bg-grid absolute inset-0 opacity-30" />
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 shadow-xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-black text-ink">รับประกันสินค้าทุกเที่ยว</p>
          <p className="text-[11px] text-ink-muted">คุ้มครองสูงสุด ฿50,000 ต่อเที่ยววิ่ง</p>
        </div>
      </motion.div>
    </div>
  );
}
