"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  Truck,
  MapPin,
  TrendingUp,
  X,
  Check,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const NEW_JOBS = [
  {
    id: "JG-2025-00109",
    pickup: "เซ็นทรัลลาดพร้าว",
    dropoff: "อารีย์ ศาลายา",
    distance: 4.2,
    total: 28.5,
    earning: 520,
    vehicle: "กระบะตู้ทึบ",
    time: "20 นาที",
  },
  {
    id: "JG-2025-00110",
    pickup: "บางนา ทาวเวอร์",
    dropoff: "สนามบินสุวรรณภูมิ",
    distance: 6.8,
    total: 32,
    earning: 680,
    vehicle: "6 ล้อ",
    time: "30 นาที",
  },
];

const ACTIVE_JOBS = [
  {
    id: "JG-2025-00108",
    pickup: "บ้าน",
    dropoff: "สนามบินสุวรรณภูมิ",
    status: "กำลังเดินทาง",
    earning: 619,
    step: 2,
  },
];

export function DriverJobsScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);

  const availableJobs = NEW_JOBS.filter(
    (j) => !rejectedIds.includes(j.id) && !acceptedIds.includes(j.id),
  );

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
          งานของฉัน
        </span>
        <div className="w-9" />
      </div>

      {/* tabs */}
      <div className="bg-white px-5 pb-3">
        <div className="flex gap-2">
          <button className="flex-1 rounded-full bg-jumbo py-1.5 text-[12px] font-bold text-white">
            งานใหม่ ({availableJobs.length})
          </button>
          <button className="flex-1 rounded-full bg-surface py-1.5 text-[12px] font-medium text-ink-muted">
            กำลังทำ ({ACTIVE_JOBS.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {/* active jobs */}
        {ACTIVE_JOBS.length > 0 && (
          <div className="mb-3">
            <p className="mb-2 px-1 text-[12px] font-bold text-ink">
              กำลังดำเนินการ
            </p>
            {ACTIVE_JOBS.map((j) => (
              <div
                key={j.id}
                className="rounded-2xl border-2 border-jumbo bg-jumbo-light p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-jumbo-dark">
                    {j.id}
                  </p>
                  <span className="rounded-full bg-jumbo px-2 py-0.5 text-[10px] font-bold text-white">
                    {j.status}
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    <div className="my-0.5 h-6 w-0.5 bg-line" />
                    <MapPin className="h-3.5 w-3.5 text-jumbo" />
                  </div>
                  <div className="flex-1 text-[11px]">
                    <p className="font-semibold text-ink">{j.pickup}</p>
                    <p className="font-semibold text-ink">{j.dropoff}</p>
                  </div>
                  <span className="text-[14px] font-bold text-jumbo">
                    ฿{j.earning}
                  </span>
                </div>
                <button
                  onClick={() => go("driver-dashboard")}
                  className="mt-2 w-full rounded-xl bg-jumbo py-2 text-[12px] font-bold text-white"
                >
                  ดำเนินการต่อ
                </button>
              </div>
            ))}
          </div>
        )}

        {/* new jobs */}
        <p className="mb-2 px-1 text-[12px] font-bold text-ink">งานใหม่</p>
        {availableJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <Truck className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-2 text-[13px] text-ink-muted">
              ยังไม่มีงานใหม่ในขณะนี้
            </p>
            <p className="text-[11px] text-ink-muted">
              ระบบจะแจ้งเตือนเมื่อมีงานใหม่
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {availableJobs.map((j, i) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-line bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-ink">{j.id}</p>
                  <span className="flex items-center gap-1 text-[10px] text-amber-600">
                    <Clock className="h-3 w-3" /> ใหม่
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-jumbo" />
                  <span className="text-[11px] text-ink-muted">
                    {j.vehicle}
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2 border-t border-line pt-2">
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <div className="my-0.5 h-5 w-0.5 bg-line" />
                    <MapPin className="h-3 w-3 text-jumbo" />
                  </div>
                  <div className="flex-1 text-[11px]">
                    <p className="font-semibold text-ink">{j.pickup}</p>
                    <p className="font-semibold text-ink">{j.dropoff}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-surface p-1.5">
                    <p className="text-[9px] text-ink-muted">ไปรับ</p>
                    <p className="text-[11px] font-bold text-ink">
                      {j.distance} กม.
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface p-1.5">
                    <p className="text-[9px] text-ink-muted">รวม</p>
                    <p className="text-[11px] font-bold text-ink">
                      {j.total} กม.
                    </p>
                  </div>
                  <div className="rounded-lg bg-jumbo-light p-1.5">
                    <p className="text-[9px] text-jumbo-dark">รายได้</p>
                    <p className="text-[11px] font-bold text-jumbo">
                      ฿{j.earning}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setRejectedIds((r) => [...r, j.id])}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-line bg-white py-2.5 text-[12px] font-bold text-ink-muted"
                  >
                    <X className="h-3.5 w-3.5" /> ปฏิเสธ
                  </button>
                  <button
                    onClick={() => setAcceptedIds((r) => [...r, j.id])}
                    className="flex flex-[1.4] items-center justify-center gap-1 rounded-xl bg-jumbo py-2.5 text-[12px] font-bold text-white shadow"
                  >
                    <Check className="h-3.5 w-3.5" /> รับงาน
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
