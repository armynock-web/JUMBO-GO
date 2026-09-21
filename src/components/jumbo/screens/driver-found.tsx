"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { DRIVER_DEMO, VEHICLES } from "@/lib/brand";
import { VehicleIcon } from "../vehicle-icon";
import {
  Star,
  Phone,
  MessageSquare,
  X,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export function DriverFoundScreen() {
  const go = useJumbo((s) => s.go);
  const draft = useJumbo((s) => s.draft);
  const d = DRIVER_DEMO;
  const vehicle = VEHICLES.find((v) => v.type === draft.vehicleType);

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />

      {/* top map strip */}
      <div className="relative h-44 overflow-hidden bg-surface">
        <div className="bg-grid absolute inset-0" />
        <svg
          viewBox="0 0 300 180"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M0 60 L300 70" stroke="#fff" strokeWidth="10" />
          <path d="M120 0 L140 180" stroke="#fff" strokeWidth="8" />
          <path
            d="M40 40 Q150 100 260 140"
            stroke="#ED1C24"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray="6 4"
          />
          <g transform="translate(40 40)">
            <circle r="6" fill="#16A34A" />
            <circle r="2" fill="#fff" />
          </g>
          <g transform="translate(260 140)">
            <path d="M0 -10 L7 -2 L0 8 L-7 -2 Z" fill="#ED1C24" />
          </g>
          {/* driver truck approaching */}
          <g transform="translate(150 90)">
            <motion.g
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <circle r="20" fill="#ED1C2422" />
              <circle r="12" fill="#ED1C24" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fontSize="14"
                fill="white"
              >
                🚚
              </text>
            </motion.g>
          </g>
        </svg>

        {/* badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold text-white shadow"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          คนขับรับงานแล้ว!
        </motion.div>
        <button
          onClick={() => go("home")}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95"
          aria-label="ปิด"
        >
          <X className="h-4 w-4 text-ink" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {/* driver card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="-mt-8 rounded-2xl border border-line bg-white p-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-jumbo text-2xl text-white">
                👨
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white ring-2 ring-white">
                ✓
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink">{d.name}</p>
              <div className="flex items-center gap-1 text-[12px]">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-ink">{d.rating}</span>
                <span className="text-ink-muted">({d.reviews} รีวิว)</span>
              </div>
            </div>
            <button
              onClick={() => go("tracking")}
              className="rounded-lg bg-jumbo-light px-2 py-1 text-[10px] font-bold text-jumbo"
            >
              ดูโปรไฟล์
            </button>
          </div>

          {/* vehicle */}
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-surface p-2.5">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-white">
              <VehicleIcon
                type={draft.vehicleType ?? "CLOSED_PICKUP"}
                className="h-8 w-auto"
                color="#111111"
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">
                {vehicle?.name ?? d.vehicle}
              </p>
              <p className="text-[11px] text-ink-muted">
                ทะเบียน {d.plate} • {d.color} • {d.province}
              </p>
            </div>
            <div className="rounded-md bg-ink px-2 py-1 text-[12px] font-extrabold tracking-wider text-white">
              {d.plate}
            </div>
          </div>
        </motion.div>

        {/* ETA */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-white p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-jumbo" />
            <p className="mt-1 text-[20px] font-extrabold text-ink">
              {d.etaMin} นาที
            </p>
            <p className="text-[10px] text-ink-muted">ถึงจุดรับ</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-3 text-center">
            <MapPin className="mx-auto h-5 w-5 text-jumbo" />
            <p className="mt-1 text-[20px] font-extrabold text-ink">
              {d.distanceKm} กม.
            </p>
            <p className="text-[10px] text-ink-muted">จากคนขับ</p>
          </div>
        </div>

        {/* action buttons */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <a
            href={`tel:${d.phone}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 text-[14px] font-bold text-white shadow transition active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} />
            โทร
          </a>
          <button
            onClick={() => go("tracking")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[14px] font-bold text-white shadow transition active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2.5} />
            แชต
          </button>
        </div>

        {/* cancel */}
        <button
          onClick={() => go("home")}
          className="mt-3 w-full rounded-2xl border border-line bg-white py-3 text-[13px] font-bold text-ink-muted"
        >
          ยกเลิกการเรียก (ฟรี ภายใน 2 นาที)
        </button>

        <p className="mt-3 text-center text-[11px] text-ink-muted">
          คนขับกำลังมารับคุณ อีกประมาณ {d.etaMin} นาที
        </p>

        <button
          onClick={() => go("tracking")}
          className="mt-2 flex w-full items-center justify-center gap-1 text-[12px] font-bold text-jumbo"
        >
          เริ่มติดตามรถ <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
