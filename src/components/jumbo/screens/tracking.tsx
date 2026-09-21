"use client";

import { useEffect, useState, useMemo } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { JOB_TIMELINE, DRIVER_DEMO } from "@/lib/brand";
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Star,
  Check,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Route waypoints on the SVG (pickup → mid → dropoff)
// The truck follows a quadratic bezier M40,40 Q150,90 260,180
// We sample positions along this curve per timeline step.
const ROUTE_POINTS = [
  { x: 40, y: 40 }, // pickup (step 0: ACCEPTED — at pickup start)
  { x: 90, y: 65 }, // step 1: DRIVER_GOING_TO_PICKUP — approaching
  { x: 40, y: 40 }, // step 2: ARRIVED_PICKUP — at pickup
  { x: 100, y: 80 }, // step 3: PICKED_UP — just left pickup
  { x: 180, y: 130 }, // step 4: IN_TRANSIT — mid-route
  { x: 260, y: 180 }, // step 5: DELIVERED — at dropoff
];

// progress % along route (0 = at pickup, 100 = at dropoff)
const ROUTE_PROGRESS = [0, 5, 0, 25, 60, 100];

export function TrackingScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const trackingStep = useJumbo((s) => s.trackingStep);
  const setTrackingStep = useJumbo((s) => s.setTrackingStep);
  const draft = useJumbo((s) => s.draft);
  const d = DRIVER_DEMO;

  const [eta, setEta] = useState(d.etaMin);

  // Advance timeline automatically
  useEffect(() => {
    if (trackingStep >= JOB_TIMELINE.length - 1) {
      const id = setTimeout(() => go("completed"), 900);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setTrackingStep(trackingStep + 1);
      setEta(Math.max(1, eta - 2));
    }, 3500);
    return () => clearTimeout(id);
  }, [trackingStep, eta, go, setTrackingStep]);

  const current = JOB_TIMELINE[trackingStep];

  // Truck position + progress, tied to timeline step
  const target = ROUTE_POINTS[Math.min(trackingStep, ROUTE_POINTS.length - 1)];
  const truckProgress = ROUTE_PROGRESS[Math.min(trackingStep, ROUTE_PROGRESS.length - 1)];

  const truckPos = useMemo(() => ({ x: target.x, y: target.y }), [target]);

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
          ติดตามรถ
        </span>
        <div className="w-9" />
      </div>

      {/* map */}
      <div className="relative h-56 overflow-hidden bg-surface">
        <div className="bg-grid absolute inset-0" />
        <svg
          viewBox="0 0 300 220"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* roads */}
          <path d="M0 80 L300 90" stroke="#fff" strokeWidth="10" />
          <path d="M0 150 L300 160" stroke="#fff" strokeWidth="8" />
          <path d="M80 0 L100 220" stroke="#fff" strokeWidth="8" />
          <path d="M220 0 L200 220" stroke="#fff" strokeWidth="6" />
          {/* route path (pickup → dropoff) */}
          <path
            d="M40 40 Q150 90 260 180"
            stroke="#ED1C24"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray="6 4"
          />
          {/* traveled portion (green) — grows as timeline advances */}
          <path
            d="M40 40 Q150 90 260 180"
            stroke="#16A34A"
            strokeWidth="3.5"
            fill="none"
            pathLength={100}
            strokeDasharray={`${truckProgress} ${100 - truckProgress}`}
            style={{ transition: "stroke-dasharray 1.2s ease" }}
          />
          {/* pickup pin */}
          <g transform="translate(40 40)">
            <circle r="7" fill="#16A34A" />
            <circle r="2.5" fill="#fff" />
          </g>
          {/* dropoff pin */}
          <g transform="translate(260 180)">
            <path d="M0 -10 L7 -2 L0 8 L-7 -2 Z" fill="#ED1C24" />
            <circle r="2" fill="#fff" cx="0" cy="-2" />
          </g>
          {/* moving truck — smoothly animates to new position when trackingStep changes */}
          <motion.g
            animate={{ x: truckPos.x, y: truckPos.y }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            initial={false}
          >
            {/* pulse halo */}
            <circle r="18" fill="#ED1C2422" className="animate-jumbo-pulse" />
            <circle r="12" fill="#ED1C24" />
            <text x="0" y="4" textAnchor="middle" fontSize="13">
              🚚
            </text>
          </motion.g>
        </svg>

        {/* ETA card */}
        <motion.div
          key={trackingStep}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute left-3 right-3 top-3 flex items-center justify-between rounded-2xl bg-white p-2.5 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo text-white">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] text-ink-muted">
                {current.label}
              </p>
              <p className="text-[13px] font-bold text-ink">
                {trackingStep < 3
                  ? `อีก ${eta} นาทีถึงจุดรับ`
                  : trackingStep < 5
                    ? `อีก ${eta} นาทีถึงจุดส่ง`
                    : "ส่งของถึงจุดหมายแล้ว"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-ink-muted">
              {trackingStep < 3 ? "ระยะไปรับ" : "ระยะไปส่ง"}
            </p>
            <p className="text-[13px] font-bold text-ink">
              {trackingStep < 3
                ? `${d.distanceKm} กม.`
                : `${(d.distanceKm * 2.5).toFixed(1)} กม.`}
            </p>
          </div>
        </motion.div>

        {/* progress bar overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-green-600 shadow">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Realtime ซิงค์สด
          </span>
          <div className="flex-1">
            <div className="mb-0.5 flex items-center justify-between text-[9px] text-ink-muted">
              <span>รับ</span>
              <span>{Math.round(truckProgress)}%</span>
              <span>ส่ง</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/60">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-jumbo"
                animate={{ width: `${truckProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* timeline */}
      <div className="flex-1 overflow-y-auto bg-white px-4 pb-3 pt-3 scrollbar-hide">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <p className="text-[14px] font-bold text-ink">{d.name}</p>
          <span className="text-[12px] text-ink-muted">
            ★ {d.rating} ({d.reviews})
          </span>
        </div>

        {/* timeline */}
        <div className="relative pl-2">
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-line" />
          {JOB_TIMELINE.map((step, i) => {
            const done = i < trackingStep;
            const active = i === trackingStep;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex items-start gap-3 pb-4"
              >
                <span
                  className={`relative z-10 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white transition ${
                    done
                      ? "bg-green-600 text-white"
                      : active
                        ? "bg-jumbo text-white"
                        : "bg-surface text-ink-muted ring-line"
                  }`}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : active ? (
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-white"
                    />
                  ) : (
                    <span className="text-[9px] font-bold">{i + 1}</span>
                  )}
                </span>
                <div>
                  <p
                    className={`text-[13px] ${
                      active
                        ? "font-bold text-jumbo"
                        : done
                          ? "font-semibold text-ink"
                          : "text-ink-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-ink-muted">{step.desc}</p>
                  {active && (
                    <AnimatePresence>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 inline-flex items-center gap-1 rounded-full bg-jumbo-light px-2 py-0.5 text-[10px] font-bold text-jumbo"
                      >
                        <Clock className="h-2.5 w-2.5" />
                        กำลังดำเนินการ
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* actions */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${d.phone}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-[13px] font-bold text-white"
          >
            <Phone className="h-4 w-4" /> โทร
          </a>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-jumbo py-3 text-[13px] font-bold text-white">
            <MessageSquare className="h-4 w-4" /> แชต
          </button>
        </div>
        {draft.pickup && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface p-2.5">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-jumbo" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-ink-muted">ปลายทาง</p>
              <p className="truncate text-[12px] font-semibold text-ink">
                {draft.dropoff?.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
