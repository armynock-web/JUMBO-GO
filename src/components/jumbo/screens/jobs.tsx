"use client";

import { useEffect, useState } from "react";
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
  Database,
  Loader2,
  RefreshCw,
} from "lucide-react";

type BookingItem = {
  id: string;
  job_number: string;
  vehicle_type: string;
  status: string;
  fare: number;
  distance_km: number;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
};

export function JobsScreen() {
  const go = useJumbo((s) => s.go);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [dbBookings, setDbBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings?userId=a9dce7bb-a9cf-4f21-874a-129b0138fd56");
      const json = await res.json();
      if (json.success && json.bookings) {
        setDbBookings(json.bookings);
      }
    } catch (err) {
      console.error("Failed to load user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    void fetchBookings();
  };

  useEffect(() => {
    void (async () => {
      await fetchBookings();
    })();
  }, []);

  // Filter list
  const filteredList = dbBookings.filter((b) => {
    if (filter === "active") return b.status === "searching" || b.status === "pending" || b.status === "accepted" || b.status === "in_progress";
    if (filter === "done") return b.status === "completed";
    return true;
  });

  const totalSpent = dbBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
  const completedCount = dbBookings.filter((b) => b.status === "completed").length;

  return (
    <div className="relative flex min-h-full flex-col bg-surface pb-20">
      <StatusBar />
      {/* header */}
      <div className="bg-white px-5 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-extrabold text-ink">ประวัติงาน</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <Database className="h-3 w-3" /> Live DB
            </span>
          </div>
          <button
            onClick={refresh}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface transition active:scale-95"
            aria-label="รีเฟรชข้อมูล"
            title="รีเฟรชข้อมูลจากฐานข้อมูล"
          >
            <RefreshCw className={`h-4 w-4 text-ink ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {/* filters */}
        <div className="mt-3 flex gap-2">
          {[
            { k: "all" as const, label: "ทั้งหมด" },
            { k: "active" as const, label: "กำลังดำเนินงาน" },
            { k: "done" as const, label: "เสร็จสิ้น" },
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
        </div>
      </div>

      {/* stats */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-jumbo p-3 text-white">
          <p className="text-[11px] opacity-90">งานทั้งหมดในระบบ</p>
          <p className="text-[22px] font-extrabold">{dbBookings.length}</p>
          <p className="text-[10px] opacity-80">บันทึกบน Supabase</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-[11px] text-ink-muted">ยอดรวมค่าบริการ</p>
          <p className="text-[22px] font-extrabold text-jumbo">฿{formatTHB(totalSpent)}</p>
          <p className="text-[10px] text-ink-muted">จากงานทั้งหมด</p>
        </div>
      </div>

      {/* list */}
      <div className="mt-3 flex-1 px-4">
        <div className="flex items-center justify-between px-1 pb-2">
          <h2 className="text-[14px] font-bold text-ink">รายการงานจริง</h2>
          <span className="text-[12px] font-medium text-ink-muted">
            {filteredList.length} รายการ
          </span>
        </div>

        {loading ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-jumbo" />
            <p className="text-[12px] text-ink-muted">กำลังดึงข้อมูลใบงานจาก Supabase...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-2 text-[13px] text-ink-muted">
              ยังไม่มีประวัติงานในสถานะนี้
            </p>
            <button
              onClick={() => go("home")}
              className="mt-2 rounded-xl bg-jumbo px-4 py-2 text-[12px] font-bold text-white"
            >
              เริ่มเรียกรถ
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredList.map((j) => {
              const isDone = j.status === "completed";
              const isSearching = j.status === "searching" || j.status === "pending";
              return (
                <button
                  key={j.id}
                  onClick={() => go("completed")}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left transition active:bg-surface"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-green-100 text-green-700"
                        : "bg-jumbo-light text-jumbo"
                    }`}
                  >
                    <Truck className="h-5 w-5" />
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-bold text-ink">
                        {j.job_number || j.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                      <MapPin className="h-3 w-3" />
                      {j.vehicle_type?.toUpperCase()} • {j.distance_km || 0} กม.
                    </div>
                    <p className="text-[10px] text-ink-muted">
                      {new Date(j.created_at).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[14px] font-black ${
                        isDone ? "text-green-700" : "text-jumbo"
                      }`}
                    >
                      ฿{formatTHB(j.fare || 0)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isDone
                          ? "bg-green-100 text-green-700"
                          : isSearching
                          ? "bg-amber-100 text-amber-800"
                          : "bg-jumbo-light text-jumbo"
                      }`}
                    >
                      {j.status === "searching"
                        ? "กำลังหาคนขับ"
                        : j.status === "pending"
                        ? "รอดำเนินการ"
                        : j.status === "completed"
                        ? "เสร็จสิ้น"
                        : j.status}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-muted" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
