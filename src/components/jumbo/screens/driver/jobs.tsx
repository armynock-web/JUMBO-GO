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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FALLBACK_NEW_JOBS = [
  {
    id: "JG-2026-00109",
    rawId: "mock-109",
    pickup: "เซ็นทรัลลาดพร้าว (จุดรับ)",
    dropoff: "อารีย์ ศาลายา (จุดส่ง)",
    distance: 4.2,
    total: 28.5,
    earning: 520,
    vehicle: "กระบะตู้ทึบ",
    time: "20 นาที",
  },
  {
    id: "JG-2026-00110",
    rawId: "mock-110",
    pickup: "บางนา ทาวเวอร์ (จุดรับ)",
    dropoff: "สนามบินสุวรรณภูมิ (จุดส่ง)",
    distance: 6.8,
    total: 32,
    earning: 680,
    vehicle: "6 ล้อ",
    time: "30 นาที",
  },
];

const FALLBACK_ACTIVE_JOBS = [
  {
    id: "JG-2026-00108",
    rawId: "mock-108",
    pickup: "สยามพารากอน (จุดรับสินค้า)",
    dropoff: "เมกาบางนา (จุดส่งสินค้า)",
    status: "กำลังเดินทาง",
    earning: 619,
    step: 2,
  },
];

const DRIVER_TOKEN = "jumbo_f74c32ed-7cb6-49a8-9963-a21d34e73335";

export function DriverJobsScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [liveJobs, setLiveJobs] = useState<any[]>(FALLBACK_NEW_JOBS);
  const [activeTab, setActiveTab] = useState<"new" | "active">("new");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/driver/jobs", {
        headers: { Authorization: `Bearer ${DRIVER_TOKEN}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        const mapped = data.jobs.map((b: any) => {
          const pickupLoc = b.booking_locations?.find((l: any) => l.type === "pickup");
          const dropoffLoc = b.booking_locations?.find((l: any) => l.type === "dropoff");
          const driverEarning = Math.round((b.fare || 500) * 0.85);

          return {
            id: b.job_number || `JG-${b.id.slice(0, 8)}`,
            rawId: b.id,
            pickup: pickupLoc?.address || "จุดรับสินค้าตามหมุด",
            dropoff: dropoffLoc?.address || "จุดส่งสินค้าตามหมุด",
            distance: b.distance_from_driver_km ?? 3.5,
            total: b.distance_km ?? 15.0,
            earning: driverEarning,
            vehicle: b.vehicle_type || "กระบะ",
            time: `${Math.round((b.distance_km || 15) * 1.8)} นาที`,
          };
        });
        setLiveJobs(mapped);
      } else {
        setLiveJobs(FALLBACK_NEW_JOBS);
      }
    } catch {
      setLiveJobs(FALLBACK_NEW_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/driver/jobs", {
      headers: { Authorization: `Bearer ${DRIVER_TOKEN}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          const mapped = data.jobs.map((b: any) => {
            const pickupLoc = b.booking_locations?.find((l: any) => l.type === "pickup");
            const dropoffLoc = b.booking_locations?.find((l: any) => l.type === "dropoff");
            const driverEarning = Math.round((b.fare || 500) * 0.85);

            return {
              id: b.job_number || `JG-${b.id.slice(0, 8)}`,
              rawId: b.id,
              pickup: pickupLoc?.address || "จุดรับสินค้าตามหมุด",
              dropoff: dropoffLoc?.address || "จุดส่งสินค้าตามหมุด",
              distance: b.distance_from_driver_km ?? 3.5,
              total: b.distance_km ?? 15.0,
              earning: driverEarning,
              vehicle: b.vehicle_type || "กระบะ",
              time: `${Math.round((b.distance_km || 15) * 1.8)} นาที`,
            };
          });
          setLiveJobs(mapped);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleAccept = async (job: any) => {
    setAcceptingId(job.id);
    try {
      if (!job.rawId.startsWith("mock-")) {
        await fetch(`/api/driver/jobs/${job.rawId}/accept`, {
          method: "POST",
          headers: { Authorization: `Bearer ${DRIVER_TOKEN}` },
        });
      }
      setAcceptedIds((prev) => [...prev, job.id]);
      go("driver-job-detail");
    } catch (e) {
      console.error("Accept error:", e);
      setAcceptedIds((prev) => [...prev, job.id]);
      go("driver-job-detail");
    } finally {
      setAcceptingId(null);
    }
  };

  const availableJobs = liveJobs.filter(
    (j) => !rejectedIds.includes(j.id) && !acceptedIds.includes(j.id)
  );

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex items-center justify-between bg-white px-3 py-1 border-b border-line">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink hover:bg-slate-200 transition"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[14px] font-bold text-ink">
          งานขนส่งคนขับ
        </span>
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-muted hover:bg-slate-200"
          title="รีเฟรชงานใหม่"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-jumbo" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white px-5 py-3 border-b border-line">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 rounded-full py-1.5 text-[12px] font-bold transition ${
              activeTab === "new"
                ? "bg-jumbo text-white shadow"
                : "bg-surface text-ink-muted hover:bg-slate-200"
            }`}
          >
            งานใหม่รอบตัว ({availableJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 rounded-full py-1.5 text-[12px] font-bold transition ${
              activeTab === "active"
                ? "bg-jumbo text-white shadow"
                : "bg-surface text-ink-muted hover:bg-slate-200"
            }`}
          >
            กำลังทำ ({FALLBACK_ACTIVE_JOBS.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
        {/* Active tab */}
        {activeTab === "active" && (
          <div>
            <p className="mb-2 px-1 text-[12px] font-bold text-ink">
              งานที่กำลังดำเนินการจัดส่ง
            </p>
            {FALLBACK_ACTIVE_JOBS.map((j) => (
              <div
                key={j.id}
                className="rounded-2xl border-2 border-jumbo bg-jumbo-light p-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-extrabold text-jumbo-dark">
                    {j.id}
                  </p>
                  <span className="rounded-full bg-jumbo px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {j.status}
                  </span>
                </div>
                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div className="my-0.5 h-6 w-0.5 bg-line" />
                    <MapPin className="h-3.5 w-3.5 text-jumbo" />
                  </div>
                  <div className="flex-1 text-[12px]">
                    <p className="font-semibold text-ink">{j.pickup}</p>
                    <p className="font-semibold text-ink mt-1">{j.dropoff}</p>
                  </div>
                  <span className="text-[16px] font-black text-jumbo">
                    ฿{j.earning}
                  </span>
                </div>
                <button
                  onClick={() => go("driver-job-detail")}
                  className="mt-3 w-full rounded-xl bg-jumbo py-2.5 text-[12px] font-bold text-white shadow hover:bg-jumbo-dark transition"
                >
                  เปิดหน้าต่างนำทาง & ส่งงาน
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Jobs tab */}
        {activeTab === "new" && (
          <div>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[12px] font-bold text-ink">งานขนส่งที่ค้นหาคนขับ</p>
              <span className="text-[10px] text-emerald-600 font-semibold">● เรดาร์ค้นหาทำงานอยู่</span>
            </div>

            {availableJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
                <Truck className="mx-auto h-8 w-8 text-ink-muted" />
                <p className="mt-2 text-[13px] font-bold text-ink-muted">
                  ยังไม่มีงานใหม่ในรัศมีของคุณ
                </p>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  ระบบจะส่งเสียงเตือนเมื่อมีออเดอร์ใหม่เข้ามา
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
                    className="rounded-2xl border border-line bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-black text-ink">{j.id}</p>
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <Clock className="h-3 w-3" /> งานใหม่
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-jumbo" />
                      <span className="text-[11px] font-bold text-ink">
                        {j.vehicle}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-start gap-2 border-t border-line pt-2.5">
                      <div className="flex flex-col items-center pt-0.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <div className="my-0.5 h-5 w-0.5 bg-line" />
                        <MapPin className="h-3 w-3 text-jumbo" />
                      </div>
                      <div className="flex-1 text-[11px]">
                        <p className="font-semibold text-ink">{j.pickup}</p>
                        <p className="font-semibold text-ink mt-0.5">{j.dropoff}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-surface p-1.5">
                        <p className="text-[9px] text-ink-muted font-medium">ไปรับของ</p>
                        <p className="text-[11px] font-black text-ink">
                          {j.distance} กม.
                        </p>
                      </div>
                      <div className="rounded-xl bg-surface p-1.5">
                        <p className="text-[9px] text-ink-muted font-medium">ระยะวิ่งส่ง</p>
                        <p className="text-[11px] font-black text-ink">
                          {j.total} กม.
                        </p>
                      </div>
                      <div className="rounded-xl bg-jumbo-light p-1.5">
                        <p className="text-[9px] text-jumbo font-bold">รายได้สุทธิ</p>
                        <p className="text-[12px] font-black text-jumbo">
                          ฿{j.earning}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setRejectedIds((r) => [...r, j.id])}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-line bg-white py-2 text-[12px] font-bold text-ink-muted hover:bg-slate-50 transition"
                      >
                        <X className="h-3.5 w-3.5" /> ปฏิเสธ
                      </button>
                      <button
                        onClick={() => handleAccept(j)}
                        disabled={acceptingId === j.id}
                        className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-jumbo py-2 text-[12px] font-bold text-white shadow-md hover:bg-jumbo-dark transition"
                      >
                        {acceptingId === j.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        รับงานนี้
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
