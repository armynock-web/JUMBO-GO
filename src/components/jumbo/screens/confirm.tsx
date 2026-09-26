"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { StepIndicator } from "../step-indicator";
import { VehicleIcon } from "../vehicle-icon";
import { VEHICLES, formatTHB } from "@/lib/brand";
import {
  ChevronLeft,
  MapPin,
  Truck,
  Route,
  Wallet,
  Pencil,
  CheckCircle2,
  Database,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export function ConfirmScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const draft = useJumbo((s) => s.draft);
  const setActiveBooking = useJumbo((s) => s.setActiveBooking);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const vehicle = VEHICLES.find((v) => v.type === draft.vehicleType);

  const submit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: draft.pickup,
          dropoff: draft.dropoff,
          vehicleType: draft.vehicleType,
          fare: draft.estimatedPrice ?? 619,
          distanceKm: draft.distanceKm ?? 15.5,
          expresswayFee: 50,
          senderName: "สมหญิง ใจเย็น (ลูกค้า)",
          senderPhone: "082-345-6789",
          receiverName: draft.dropoff?.address || "ผู้รับสินค้าปลายทาง",
          receiverPhone: "081-999-8888",
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking.id, data.booking.job_number);
        go("searching");
      } else {
        // Fallback for UI flow if backend error
        console.warn("Booking creation notice:", data.message);
        go("searching");
      }
    } catch (err) {
      console.error("Failed to submit booking:", err);
      // Still proceed so user experience is not blocked
      go("searching");
    } finally {
      setLoading(false);
    }
  };

  const fallbackVehicle = VEHICLES.find((v) => v.type === "JUMBO") || VEHICLES[0];
  const activeVehicle = vehicle || fallbackVehicle;
  const total = draft.estimatedPrice ?? 619;
  const displayPickup = draft.pickup?.address || "สยามพารากอน (จุดรับสินค้า)";
  const displayDropoff = draft.dropoff?.address || "เมกาบางนา (จุดส่งสินค้า)";

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
          ขั้นที่ 5 จาก 5
        </span>
        <div className="w-9" />
      </div>
      <div className="bg-white">
        <StepIndicator current={5} />
        <div className="px-5 pb-3">
          <h1 className="text-[22px] font-extrabold text-ink">
            ยืนยันเรียกรถ
          </h1>
          <p className="-mt-1 text-[12px] text-ink-muted">
            ตรวจสอบข้อมูลให้ครบก่อนกดยืนยัน
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {/* route */}
        <div className="mb-3 rounded-2xl border border-line bg-white p-3">
          <SectionLabel icon={<Route className="h-3.5 w-3.5" />} text="เส้นทาง" />
          <div className="flex items-start gap-3 pt-2">
            <div className="flex flex-col items-center pt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <div className="my-1 h-8 w-0.5 bg-line" />
              <MapPin className="h-4 w-4 text-jumbo" />
            </div>
            <div className="flex-1">
              <div>
                <p className="text-[10px] text-ink-muted">จุดรับ</p>
                <p className="text-[13px] font-semibold text-ink">
                  {displayPickup}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-ink-muted">จุดส่ง</p>
                <p className="text-[13px] font-semibold text-ink">
                  {displayDropoff}
                </p>
              </div>
            </div>
            <button
              onClick={() => go("pickup")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-ink-muted"
              aria-label="แก้ไข"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* vehicle */}
        <div className="mb-3 rounded-2xl border border-line bg-white p-3">
          <SectionLabel
            icon={<Truck className="h-3.5 w-3.5" />}
            text="ประเภทรถ"
          />
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-surface">
              <VehicleIcon
                type={activeVehicle.type}
                className="h-10 w-auto"
                color="#111111"
              />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink">{activeVehicle.name}</p>
              <p className="text-[11px] text-ink-muted">
                {activeVehicle.capacity}
              </p>
              <p className="text-[11px] text-ink-muted">{activeVehicle.tonRange}</p>
            </div>
            <button
              onClick={() => go("vehicle-type")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-ink-muted"
              aria-label="แก้ไข"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* price */}
        <div className="mb-3 rounded-2xl border border-line bg-white p-3">
          <SectionLabel
            icon={<Wallet className="h-3.5 w-3.5" />}
            text="ราคาโดยประมาณ"
          />
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-ink-muted">รวมทั้งหมด</p>
              <p className="text-[10px] text-ink-muted">
                ระยะทาง {draft.distanceKm} กม.
              </p>
            </div>
            <p className="text-[26px] font-extrabold text-jumbo">
              ฿{formatTHB(total)}
            </p>
          </div>
        </div>

        {/* payment */}
        <div className="mb-3 rounded-2xl border border-line bg-white p-3">
          <SectionLabel text="วิธีชำระเงิน" />
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-9 w-12 items-center justify-center rounded-md bg-surface text-[10px] font-bold text-ink">
              เงินสด
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-ink">
                เงินสด จ่ายปลายทาง
              </p>
              <p className="text-[11px] text-ink-muted">
                จ่ายเมื่อคนขับส่งของถึงที่
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-jumbo" />
          </div>
        </div>

        <p className="px-2 text-[11px] leading-relaxed text-ink-muted">
          เมื่อกดยืนยัน ระบบจะสร้าง Order, Booking และ Job
          แล้วเริ่มค้นหาคนขับในพื้นที่ของคุณ
        </p>
      </div>

      <div className="border-t border-line bg-white p-3">
        <div className="flex gap-2">
          <button
            onClick={back}
            disabled={loading}
            className="flex-1 rounded-2xl border border-line bg-white py-3.5 text-[14px] font-bold text-ink transition active:scale-[0.98]"
          >
            แก้ไขข้อมูล
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-[1.6] rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                กำลังสร้างงาน...
              </span>
            ) : (
              "ยืนยันเรียกรถ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  text,
}: {
  icon?: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && <span className="text-jumbo">{icon}</span>}
      <span className="text-[12px] font-bold text-ink">{text}</span>
    </div>
  );
}
