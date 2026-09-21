"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { JOB_HISTORY, formatTHB } from "@/lib/brand";
import {
  Search,
  Filter,
  MapPin,
  ChevronRight,
  Truck,
  Clock,
} from "lucide-react";
import { useState } from "react";

export function JobsScreen() {
  const go = useJumbo((s) => s.go);
  const [filter, setFilter] = useState<"all" | "done" | "cancel">("all");

  const jobs = JOB_HISTORY.filter((j) => {
    if (filter === "done") return j.status === "เสร็จสิ้น";
    if (filter === "cancel") return j.status === "ยกเลิก";
    return true;
  });

  return (
    <div className="relative flex min-h-full flex-col bg-surface pb-20">
      <StatusBar />
      {/* header */}
      <div className="bg-white px-5 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-extrabold text-ink">ประวัติงาน</h1>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
            aria-label="ค้นหา"
          >
            <Search className="h-4 w-4 text-ink" />
          </button>
        </div>
        {/* filters */}
        <div className="mt-3 flex gap-2">
          {[
            { k: "all" as const, label: "ทั้งหมด" },
            { k: "done" as const, label: "เสร็จสิ้น" },
            { k: "cancel" as const, label: "ยกเลิก" },
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
              {t.label}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-[12px] font-medium text-ink-muted">
            <Filter className="h-3 w-3" /> ตัวกรอง
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-jumbo p-3 text-white">
          <p className="text-[11px] opacity-90">งานสำเร็จ</p>
          <p className="text-[22px] font-extrabold">23</p>
          <p className="text-[10px] opacity-80">งานในเดือนนี้</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-[11px] text-ink-muted">ค่าใช้จ่ายรวม</p>
          <p className="text-[22px] font-extrabold text-jumbo">฿12,540</p>
          <p className="text-[10px] text-ink-muted">เดือนนี้</p>
        </div>
      </div>

      {/* list */}
      <div className="mt-3 flex-1 px-4">
        <div className="flex items-center justify-between px-1 pb-2">
          <h2 className="text-[14px] font-bold text-ink">งานล่าสุด</h2>
          <button className="text-[12px] font-medium text-jumbo">
            ดูทั้งหมด
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-ink-muted" />
              <p className="mt-2 text-[13px] text-ink-muted">
                ยังไม่มีประวัติงาน
              </p>
              <button
                onClick={() => go("home")}
                className="mt-2 rounded-xl bg-jumbo px-4 py-2 text-[12px] font-bold text-white"
              >
                เริ่มเรียกรถ
              </button>
            </div>
          ) : (
            jobs.map((j) => (
              <button
                key={j.id}
                onClick={() => go("completed")}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left transition active:bg-surface"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    j.status === "เสร็จสิ้น"
                      ? "bg-green-100 text-green-700"
                      : "bg-jumbo-light text-jumbo"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-bold text-ink">
                      {j.route}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                    <MapPin className="h-3 w-3" />
                    {j.vehicle} • {j.id}
                  </div>
                  <p className="text-[10px] text-ink-muted">{j.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-[14px] font-bold ${
                      j.status === "เสร็จสิ้น"
                        ? "text-green-700"
                        : "text-jumbo"
                    }`}
                  >
                    ฿{formatTHB(j.price)}
                  </p>
                  <span
                    className={`text-[10px] font-medium ${
                      j.status === "เสร็จสิ้น"
                        ? "text-green-700"
                        : "text-jumbo"
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
