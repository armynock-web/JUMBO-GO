"use client";

import { useJumbo } from "@/store/jumbo";
import {
  MapPin,
  Navigation,
  Truck,
  ShieldCheck,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function CommercialMap() {
  const draft = useJumbo((s) => s.draft);
  const screen = useJumbo((s) => s.screen);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite">("standard");
  const [zoomLevel, setZoomLevel] = useState(1);

  const pickupName = draft.pickup?.address || "สยามพารากอน (จุดรับสินค้า)";
  const dropoffName = draft.dropoff?.address || "เมกาบางนา (จุดส่งสินค้า)";
  const distance = draft.distanceKm ?? 18.2;
  const estMin = Math.round(distance * 1.8 + 10);

  // Simulated nearby active fleet
  const nearbyDrivers = [
    { id: "JG-00108", type: "กระบะตู้ทึบ", x: 38, y: 44, status: "ว่าง", eta: "4 นาที" },
    { id: "JG-00107", type: "6 ล้อ", x: 62, y: 58, status: "ว่าง", eta: "8 นาที" },
    { id: "JG-00106", type: "จัมโบ้ 4 ล้อ", x: 48, y: 35, status: "ว่าง", eta: "6 นาที" },
    { id: "JG-00112", type: "กระบะคอก", x: 55, y: 70, status: "ว่าง", eta: "11 นาที" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0f172a] select-none">
      {/* Background Map Grid & Roads (High-tech Logistics Canvas) */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 800"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ED1C24" />
            </linearGradient>
          </defs>

          <rect width="1000" height="800" fill="url(#grid)" />

          {/* Chao Phraya River Representation */}
          <path
            d="M 220 0 Q 340 260 280 440 T 360 800"
            fill="none"
            stroke="#0369a1"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Major Expressways / Arterials */}
          <path d="M 0 350 L 1000 480" stroke="#334155" strokeWidth="8" />
          <path d="M 120 0 L 780 800" stroke="#334155" strokeWidth="8" />
          <path d="M 500 0 L 450 800" stroke="#334155" strokeWidth="7" />
          <path d="M 0 650 Q 500 550 1000 680" stroke="#334155" strokeWidth="7" />

          {/* Active Logistics Route Polyline */}
          <motion.path
            d="M 350 380 Q 520 440 720 620"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 6"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Top Floating Status: Live Fleet Availability */}
      <div className="absolute left-6 right-6 top-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-2.5 backdrop-blur-md shadow-xl">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white flex items-center gap-1.5">
              <span>กำลังตรวจสอบตำแหน่งรถบรรทุกรอบพื้นที่</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                14 คันพร้อมรับงาน
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              เวลารอรถเฉลี่ยในเขตกรุงเทพฯ-ปริมณฑล: <strong className="text-white">10 - 15 นาที</strong>
            </p>
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/85 p-1 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setMapStyle(mapStyle === "standard" ? "satellite" : "standard")}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-white/10 transition"
            title="เปลี่ยนรูปแบบแผนที่"
          >
            <Layers className="h-3.5 w-3.5" />
            {mapStyle === "standard" ? "ถนน" : "ดาวเทียม"}
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
            title="ขยาย"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
            title="ย่อ"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Markers on Map */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: "50% 50%" }}
      >
        {/* Pickup Marker (Origin - Green) */}
        <div className="absolute left-[35%] top-[47.5%] -translate-x-1/2 -translate-y-full pointer-events-auto z-10">
          <div className="group relative flex flex-col items-center">
            <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 px-3 py-1 text-center shadow-lg backdrop-blur">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">จุดรับสินค้า</span>
              <span className="text-[11px] font-bold text-white max-w-[140px] truncate block">{pickupName}</span>
            </div>
            <div className="relative mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute -bottom-1" />
          </div>
        </div>

        {/* Dropoff Marker (Destination - Red) */}
        <div className="absolute left-[72%] top-[77.5%] -translate-x-1/2 -translate-y-full pointer-events-auto z-10">
          <div className="group relative flex flex-col items-center">
            <div className="rounded-xl border border-red-500/40 bg-slate-900/90 px-3 py-1 text-center shadow-lg backdrop-blur">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">จุดส่งสินค้า</span>
              <span className="text-[11px] font-bold text-white max-w-[140px] truncate block">{dropoffName}</span>
            </div>
            <div className="relative mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-jumbo text-white shadow-lg shadow-jumbo/50">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="h-2 w-2 rounded-full bg-red-400 animate-ping absolute -bottom-1" />
          </div>
        </div>

        {/* Active Moving Truck / Fleet Pins */}
        {nearbyDrivers.map((d) => (
          <motion.div
            key={d.id}
            className="absolute pointer-events-auto z-10 cursor-pointer"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            animate={{
              x: [0, (Math.random() - 0.5) * 15, 0],
              y: [0, (Math.random() - 0.5) * 15, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="group relative flex flex-col items-center">
              <div className="hidden group-hover:flex absolute -top-8 rounded-lg bg-slate-900 border border-white/20 px-2 py-0.5 text-[10px] text-white whitespace-nowrap shadow-lg">
                {d.id} • {d.type} (ถึงใน {d.eta})
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-amber-400 shadow-xl transition-transform hover:scale-110">
                <Truck className="h-4 w-4" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-800/80 px-1.5 py-0.2 text-[9px] font-medium text-slate-300 border border-white/10">
                {d.type.split(" ")[0]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Floating Card: Route & Delivery Assurance */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
        {/* Route Metric Card */}
        <div className="pointer-events-auto flex items-center gap-5 rounded-2xl border border-white/15 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-jumbo/20 text-jumbo border border-jumbo/30">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">ระยะทางขนส่งโดยประมาณ</p>
              <p className="text-[20px] font-extrabold text-white">
                {distance} <span className="text-[13px] font-semibold text-slate-400">กม.</span>
              </p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">เวลาเดินทางประเมิน</p>
              <p className="text-[20px] font-extrabold text-white">
                ~{estMin} <span className="text-[13px] font-semibold text-slate-400">นาที</span>
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Trust Guarantees */}
        <div className="pointer-events-auto hidden xl:flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[12px] text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>ประกันสินค้าคุ้มครองสูงสุด <strong>฿50,000</strong></span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-2 text-[12px] text-slate-300">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>คนขับผ่านการตรวจประวัติอาชญากรรม 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
