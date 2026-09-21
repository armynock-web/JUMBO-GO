"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  Truck,
  MapPin,
  Star,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const HISTORY = [
  {
    id: "JG-2025-00108",
    date: "วันนี้ 09:42",
    route: "บ้าน → สนามบิน",
    vehicle: "กระบะตู้ทึบ",
    earning: 619,
    status: "กำลังทำ",
    rating: null as number | null,
  },
  {
    id: "JG-2025-00105",
    date: "วันนี้ 08:30",
    route: "ออฟฟิศ → ไอคอนสยาม",
    vehicle: "กระบะ",
    earning: 450,
    status: "เสร็จสิ้น",
    rating: 5,
  },
  {
    id: "JG-2025-00100",
    date: "เมื่อวาน 16:20",
    route: "บางนา → สุวรรณภูมิ",
    vehicle: "6 ล้อ",
    earning: 720,
    status: "เสร็จสิ้น",
    rating: 5,
  },
  {
    id: "JG-2025-00098",
    date: "เมื่อวาน 11:15",
    route: "ลาดพร้าว → สยาม",
    vehicle: "จัมโบ้",
    earning: 380,
    status: "เสร็จสิ้น",
    rating: 4,
  },
  {
    id: "JG-2025-00094",
    date: "18 ก.ย.",
    route: "เซ็นทรัล → ดอนเมือง",
    vehicle: "6 ล้อ",
    earning: 1450,
    status: "ยกเลิก",
    rating: null,
  },
  {
    id: "JG-2025-00091",
    date: "16 ก.ย.",
    route: "บ้าน → ออฟฟิศ",
    vehicle: "กระบะตู้ทึบ",
    earning: 520,
    status: "เสร็จสิ้น",
    rating: 5,
  },
];

export function DriverHistoryScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const [filter, setFilter] = useState<"all" | "done" | "cancel">("all");

  const jobs = HISTORY.filter((j) =>
    filter === "all"
      ? true
      : filter === "done"
        ? j.status === "เสร็จสิ้น"
        : j.status === "ยกเลิก",
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
          ประวัติงาน
        </span>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ตัวกรอง"
        >
          <Filter className="h-4 w-4 text-ink" />
        </button>
      </div>

      {/* stats */}
      <div className="bg-white px-5 pb-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="งานสำเร็จ" value="42" color="text-green-600" />
          <Stat label="รายได้รวม" value="฿38k" color="text-jumbo" />
          <Stat label="คะแนน" value="4.8" color="text-amber-600" />
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-2 px-4 pb-2">
        {[
          { k: "all" as const, l: "ทั้งหมด" },
          { k: "done" as const, l: "เสร็จสิ้น" },
          { k: "cancel" as const, l: "ยกเลิก" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
              filter === t.k
                ? "bg-jumbo text-white"
                : "bg-surface text-ink-muted"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        <div className="flex flex-col gap-2">
          {jobs.map((j) => {
            const isDone = j.status === "เสร็จสิ้น";
            const isCancel = j.status === "ยกเลิก";
            return (
              <div
                key={j.id}
                className="rounded-2xl border border-line bg-white p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-ink">{j.id}</p>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isDone
                        ? "bg-green-100 text-green-700"
                        : isCancel
                          ? "bg-jumbo-light text-jumbo"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-3 w-3" />}
                    {isCancel && <XCircle className="h-3 w-3" />}
                    {j.status}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-muted">
                  <Truck className="h-3 w-3" />
                  {j.vehicle}
                  <span>•</span>
                  <span>{j.date}</span>
                </div>
                <div className="mt-1 flex items-start gap-2">
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    <div className="my-0.5 h-3 w-0.5 bg-line" />
                    <MapPin className="h-3 w-3 text-jumbo" />
                  </div>
                  <p className="text-[11px] font-semibold text-ink">
                    {j.route}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                  <span
                    className={`text-[13px] font-bold ${
                      isCancel ? "text-ink-muted" : "text-jumbo"
                    }`}
                  >
                    {isCancel ? "—" : `฿${j.earning}`}
                  </span>
                  {j.rating !== null && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-600">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {j.rating}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-2 text-center">
      <p className={`text-[15px] font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-ink-muted">{label}</p>
    </div>
  );
}
