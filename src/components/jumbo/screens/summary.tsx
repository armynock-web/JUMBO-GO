"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { StepIndicator } from "../step-indicator";
import { VEHICLES, formatTHB } from "@/lib/brand";
import { ChevronLeft, MapPin, Truck, Route, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function SummaryScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const draft = useJumbo((s) => s.draft);
  const setPrice = useJumbo((s) => s.setPrice);

  const vehicle = VEHICLES.find((v) => v.type === draft.vehicleType);

  // Calculate price server-side simulated (must not be client-trusted per blueprint rule)
  // We simulate a "server estimate" here.
  useEffect(() => {
    if (!draft.pickup || !draft.dropoff || !draft.vehicleType) return;
    // fake distance using lat/lng delta
    const lat1 = draft.pickup.latitude;
    const lng1 = draft.pickup.longitude;
    const lat2 = draft.dropoff.latitude;
    const lng2 = draft.dropoff.longitude;
    const dLat = (lat2 - lat1) * 111;
    const dLng = (lng2 - lng1) * 111 * Math.cos((lat1 * Math.PI) / 180);
    const km = Math.max(2.5, Math.sqrt(dLat * dLat + dLng * dLng));
    const v = VEHICLES.find((x) => x.type === draft.vehicleType);
    if (v) {
      const price = Math.round(v.basePrice + km * v.perKm);
      setPrice(Math.round(km * 10) / 10, price);
    }
  }, []);

  const km = draft.distanceKm ?? 28.5;
  const baseFare = vehicle?.basePrice ?? 220;
  const perKmTotal = Math.round(km * (vehicle?.perKm ?? 15));
  const waitFee = 0;
  const expresswayFee = 75;
  const total = draft.estimatedPrice ?? baseFare + perKmTotal + expresswayFee;

  if (!draft.pickup || !draft.dropoff || !vehicle) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="text-[14px] text-ink-muted">
          ข้อมูลการจองยังไม่ครบ กรุณากลับไปเลือกใหม่
        </p>
        <button
          onClick={() => go("home")}
          className="rounded-xl bg-jumbo px-5 py-2.5 text-[13px] font-bold text-white"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

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
          ขั้นที่ 4 จาก 5
        </span>
        <div className="w-9" />
      </div>
      <div className="bg-white">
        <StepIndicator current={4} />
        <div className="px-5 pb-3">
          <h1 className="text-[22px] font-extrabold text-ink">สรุปราคา</h1>
          <p className="-mt-1 text-[12px] text-ink-muted">
            ราคานี้เป็นราคาโดยประมาณเท่านั้น
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {/* map */}
        <div className="relative mb-3 h-40 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="bg-grid absolute inset-0 bg-surface" />
          <svg
            viewBox="0 0 300 160"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <path d="M0 60 L300 70" stroke="#fff" strokeWidth="8" />
            <path d="M120 0 L140 160" stroke="#fff" strokeWidth="6" />
            <path
              d="M40 40 Q150 90 260 130"
              stroke="#ED1C24"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="6 4"
            />
            <g transform="translate(40 40)">
              <circle r="14" fill="#16A34A22" />
              <circle r="6" fill="#16A34A" />
              <circle r="2" fill="#fff" />
            </g>
            <g transform="translate(260 130)">
              <path d="M0 -14 L8 -2 L0 12 L-8 -2 Z" fill="#ED1C24" />
              <circle r="3" fill="#fff" cx="0" cy="-2" />
            </g>
          </svg>
          <div className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-ink shadow">
            ระยะทาง {km} กม.
          </div>
        </div>

        {/* route info */}
        <div className="mb-3 rounded-2xl border border-line bg-white p-3">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <div className="my-1 h-8 w-0.5 bg-line" />
              <MapPin className="h-4 w-4 text-jumbo" />
            </div>
            <div className="flex-1">
              <div>
                <p className="text-[10px] text-ink-muted">จุดรับ</p>
                <p className="text-[13px] font-semibold text-ink">
                  {draft.pickup.address}
                </p>
                {draft.pickup.sub && (
                  <p className="text-[11px] text-ink-muted">
                    {draft.pickup.sub}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-ink-muted">จุดส่ง</p>
                <p className="text-[13px] font-semibold text-ink">
                  {draft.dropoff.address}
                </p>
                {draft.dropoff.sub && (
                  <p className="text-[11px] text-ink-muted">
                    {draft.dropoff.sub}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* price breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-2xl border border-line bg-white p-3"
        >
          <h2 className="mb-2 text-[14px] font-bold text-ink">
            รายละเอียดราคา
          </h2>
          <Row
            icon={<Truck className="h-4 w-4 text-jumbo" />}
            label={`ค่าขนส่ง ${vehicle.name}`}
            value={`฿${formatTHB(baseFare)}`}
          />
          <Row
            icon={<Route className="h-4 w-4 text-jumbo" />}
            label={`ระยะทาง ${km} กม. × ฿${vehicle.perKm}`}
            value={`฿${formatTHB(perKmTotal)}`}
          />
          <Row
            icon={<Wallet className="h-4 w-4 text-jumbo" />}
            label="ค่ารอ (15 นาทีแรก)"
            value={waitFee === 0 ? "ฟรี" : `฿${formatTHB(waitFee)}`}
          />
          <Row
            icon={<Route className="h-4 w-4 text-jumbo" />}
            label="ค่าทางด่วน"
            value="ตามจริง"
            note="ประมาณ ฿75"
          />

          <div className="mt-3 border-t border-dashed border-line pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-ink-muted">รวมโดยประมาณ</p>
                <p className="text-[10px] text-ink-muted">
                  อาจมีการปรับตามสภาพจราจร
                </p>
              </div>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-[24px] font-extrabold text-jumbo"
              >
                ฿{formatTHB(total)}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <div className="mb-3 rounded-xl bg-jumbo-light p-3">
          <p className="text-[11px] font-medium text-jumbo-dark">
            ⚠️ ราคานี้เป็นราคาโดยประมาณ ราคาจริงคำนวณฝั่ง Server
            ตามระยะทางและค่าทางด่วนจริง
          </p>
        </div>
      </div>

      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() => go("confirm")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
        >
          ดำเนินการต่อไปยืนยัน
        </button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo-light">
        {icon}
      </span>
      <span className="flex-1 text-[13px] text-ink">
        {label}
        {note && (
          <span className="ml-1 text-[10px] text-ink-muted">({note})</span>
        )}
      </span>
      <span className="text-[13px] font-semibold text-ink">{value}</span>
    </div>
  );
}
