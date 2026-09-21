"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { ONBOARDING_SLIDES, VEHICLES } from "@/lib/brand";
import { JumboLockup } from "../logo";
import { VehicleIcon } from "../vehicle-icon";
import { StatusBar } from "../status-bar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, ShieldCheck, MapPin, Tag, Zap, Package, UserRound } from "lucide-react";

export function OnboardingScreen() {
  const go = useJumbo((s) => s.go);
  const [step, setStep] = useState(0);
  const slide = ONBOARDING_SLIDES[step];
  const isLast = step === ONBOARDING_SLIDES.length - 1;

  const next = () => (isLast ? go("login") : setStep((s) => s + 1));

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />

      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-2">
        <JumboLockup />
        <button
          onClick={() => go("login")}
          className="text-[13px] font-medium text-ink-muted"
        >
          ข้าม
        </button>
      </div>

      {/* slide content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* hero illustration */}
            <div className="relative h-[44%] overflow-hidden bg-gradient-to-br from-jumbo-light via-white to-surface">
              <div className="bg-grid absolute inset-0 opacity-50" />
              {step === 0 && <Slide1Art />}
              {step === 1 && <Slide2Art />}
              {step === 2 && <Slide3Art />}
            </div>

            {/* text */}
            <div className="flex flex-1 flex-col items-center justify-start gap-3 px-6 pt-6 text-center">
              <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-ink">
                  {slide.headline}
                </h2>
                <p className="mt-1 text-[15px] font-semibold text-jumbo">
                  {slide.sub}
                </p>
              </div>
              <p className="max-w-[300px] text-[13px] leading-relaxed text-ink-muted">
                {slide.desc}
              </p>

              {/* feature chips */}
              {step === 0 && (
                <div className="mt-1 grid w-full max-w-[320px] grid-cols-3 gap-2">
                  {VEHICLES.slice(0, 3).map((v) => (
                    <div
                      key={v.type}
                      className="rounded-xl border border-line bg-white p-2 text-center"
                    >
                      <VehicleIcon
                        type={v.type}
                        className="mx-auto h-7 w-auto"
                      />
                      <p className="mt-1 text-[10px] font-medium text-ink">
                        {v.name}
                      </p>
                      <p className="text-[9px] text-ink-muted">{v.tonRange}</p>
                    </div>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="mt-1 flex w-full max-w-[320px] flex-col gap-1.5">
                  {[
                    { Icon: Zap, t: "เร่งด่วนทันใจ" },
                    { Icon: ShieldCheck, t: "คุ้มครองความเสียหาย" },
                    { Icon: Package, t: "ขนของไปทั่วประเทศ" },
                  ].map((f) => (
                    <div
                      key={f.t}
                      className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jumbo text-white">
                        <f.Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-[12px] font-medium text-ink">
                        {f.t}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="mt-1 grid w-full max-w-[320px] grid-cols-2 gap-2">
                  {[
                    { Icon: Tag, t: "เลือกราคา ที่ใช่ที่สุด" },
                    { Icon: MapPin, t: "ติดตามพิกัด Real-time" },
                    { Icon: ShieldCheck, t: "จองล่วงหน้า ยกเลิกง่าย" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 rounded-lg bg-surface p-2 text-left"
                    >
                      <f.Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-jumbo" />
                      <span className="text-[11px] font-medium leading-tight text-ink">
                        {f.t}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 max-w-[300px] text-[11px] italic text-ink-muted">
                {slide.footnote}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer CTA */}
      <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-1">
        {/* dots */}
        <div className="flex gap-1.5">
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-jumbo" : "w-1.5 bg-line"
              }`}
              aria-label={`สไลด์ ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex w-full max-w-[340px] items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
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
        {isLast && (
          <p className="text-[11px] text-ink-muted">
            ประสบการณ์ใหม่ที่คุณต้องลอง
          </p>
        )}
      </div>
    </div>
  );
}

function Slide1Art() {
  return (
    <div className="relative flex h-full items-end justify-center">
      {/* city skyline */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1.5 opacity-25">
        {[24, 38, 60, 48, 72, 54, 80, 42, 66, 30].map((h, i) => (
          <div
            key={i}
            className="w-5 bg-ink"
            style={{ height: h, borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
          />
        ))}
      </div>
      {/* trucks row */}
      <div className="relative z-10 flex items-end gap-3 px-4 pb-2">
        {VEHICLES.slice(0, 5).map((v, i) => (
          <motion.div
            key={v.type}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-line bg-white p-1.5 shadow-sm"
          >
            <VehicleIcon type={v.type} className="h-8 w-auto" />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="absolute right-6 top-10 flex h-12 w-12 items-center justify-center rounded-full bg-jumbo text-white shadow-lg"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={3} />
      </motion.div>
    </div>
  );
}

function Slide2Art() {
  return (
    <div className="relative flex h-full items-end justify-center">
      <div className="bg-grid absolute inset-0 opacity-40" />
      {/* driver illustration */}
      <div className="relative z-10 flex items-end gap-3">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-jumbo">
            <UserRound className="h-12 w-12 text-white" strokeWidth={2} />
          </div>
          <div className="-mt-2 rounded-md bg-jumbo px-2 py-0.5 text-[10px] font-bold text-white">
            Driver
          </div>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink">
            <UserRound className="h-10 w-10 text-white" strokeWidth={2} />
          </div>
          <div className="-mt-2 rounded-md bg-ink px-2 py-0.5 text-[10px] font-bold text-white">
            ลูกค้า
          </div>
        </motion.div>
      </div>
      {/* brush stroke banner */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-jumbo px-3 py-1 text-[11px] font-bold text-white shadow">
        มาตรฐานบริการ มืออาชีพ
      </div>
    </div>
  );
}

function Slide3Art() {
  return (
    <div className="relative flex h-full items-end justify-center">
      <div className="bg-dots absolute inset-0 opacity-30" />
      {/* phone mockup with map */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-2 h-44 w-28 rounded-2xl border-4 border-ink bg-white p-1.5 shadow-2xl"
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface">
          <div className="bg-grid absolute inset-0" />
          {/* route */}
          <svg
            viewBox="0 0 100 140"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M20 20 Q60 60 30 80 T70 130"
              stroke="#ED1C24"
              strokeWidth="3"
              fill="none"
              strokeDasharray="4 3"
            />
            <circle cx="20" cy="20" r="5" fill="#16A34A" />
            <circle cx="70" cy="130" r="5" fill="#ED1C24" />
          </svg>
          {/* ETA card */}
          <div className="absolute left-2 top-2 rounded-md bg-white px-2 py-0.5 text-[9px] font-bold text-jumbo shadow">
            8 นาที
          </div>
          {/* driver card */}
          <div className="absolute bottom-1 left-1 right-1 rounded-md bg-white p-1 shadow">
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-jumbo">
                <UserRound className="h-3 w-3 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-bold leading-tight text-ink">
                  สมชาย
                </p>
                <p className="text-[7px] leading-tight text-ink-muted">
                  ★ 4.8
                </p>
              </div>
              <span className="rounded bg-surface px-1 text-[7px] text-ink">
                ขข 1234
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
