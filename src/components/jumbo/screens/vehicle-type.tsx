"use client";

import { useEffect, useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { StepIndicator } from "../step-indicator";
import { VehicleIcon } from "../vehicle-icon";
import { VEHICLES, VehicleType } from "@/lib/brand";
import { ChevronLeft, Check, Database, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type VehicleItem = {
  id: string;
  typeKey: VehicleType;
  name: string;
  basePrice: number;
  perKm: number;
  capacity: string;
  dimension: string;
  desc: string;
  popular?: boolean;
};

export function VehicleTypeScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const draft = useJumbo((s) => s.draft);
  const setVehicle = useJumbo((s) => s.setVehicle);

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDb, setIsFromDb] = useState(false);

  // Fetch live vehicle types from Supabase
  useEffect(() => {
    let isMounted = true;
    async function fetchVehicleTypes() {
      try {
        const res = await fetch("/api/vehicle-types");
        const json = await res.json();
        if (isMounted && json.success && json.vehicles) {
          setVehicles(json.vehicles);
          setIsFromDb(json.source === "database");
        }
      } catch (err) {
        console.error("Failed to load vehicle types from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchVehicleTypes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Display list (live DB or fallback to brand constants)
  const displayList: VehicleItem[] =
    vehicles.length > 0
      ? vehicles
      : VEHICLES.map((v) => ({
          id: v.type.toLowerCase(),
          typeKey: v.type,
          name: v.name,
          basePrice: v.basePrice,
          perKm: v.perKm,
          capacity: v.capacity,
          dimension: "",
          desc: v.desc,
          popular: v.type === "CLOSED_PICKUP" || v.type === "JUMBO",
        }));

  const select = (type: VehicleType) => {
    setVehicle(type);
    go("summary");
  };

  const selectedVehicle = displayList.find((v) => v.typeKey === draft.vehicleType);

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex items-center justify-between px-3 py-1">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          ขั้นที่ 3 จาก 5
        </span>
        <div className="w-9" />
      </div>
      <StepIndicator current={3} />

      <div className="px-5 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-extrabold text-ink">
            เลือกประเภทรถ
          </h1>
          {isFromDb && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <Database className="h-3 w-3" />
              Live DB
            </span>
          )}
        </div>
        <p className="-mt-1 text-[12px] text-ink-muted">
          เลือกรถตามปริมาณและขนาดของสินค้า (ข้อมูลจริงจากระบบ)
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-3 scrollbar-hide">
        {loading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-jumbo" />
            <p className="text-[12px] text-ink-muted">กำลังโหลดประเภทรถจาก Supabase...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayList.map((v, i) => {
              const active = draft.vehicleType === v.typeKey;
              return (
                <motion.button
                  key={v.id || v.typeKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => select(v.typeKey)}
                  className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border-2 p-3 text-left transition ${
                    active
                      ? "border-jumbo bg-jumbo-light"
                      : "border-line bg-white active:bg-surface"
                  }`}
                >
                  {/* vehicle illustration */}
                  <div
                    className={`flex h-20 w-24 flex-shrink-0 items-center justify-center rounded-xl ${
                      active ? "bg-white" : "bg-surface"
                    }`}
                  >
                    <VehicleIcon
                      type={v.typeKey}
                      className="h-12 w-auto"
                      color={active ? "#ED1C24" : "#111111"}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-extrabold text-ink">
                        {v.name}
                      </h3>
                      {v.popular && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          ยอดนิยม
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] font-medium text-ink-muted">
                      ความจุ {v.capacity}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-ink-muted">
                      {v.desc}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="text-[14px] font-black text-jumbo">
                        ฿{v.basePrice}
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        เริ่มต้น + ฿{v.perKm}/กม.
                      </span>
                    </div>
                  </div>
                  {active && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-jumbo text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        <div className="mt-4 rounded-xl bg-surface p-3">
          <p className="text-[11px] font-bold text-ink">หมายเหตุ</p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            อัตราค่าบริการดึงจากฐานข้อมูลจริง `vehicle_types` บน Supabase โดยตรง และคำนวณราคาสรุปตามระยะทางจริงในขั้นตอนถัดไป
          </p>
        </div>
      </div>

      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() =>
            draft.vehicleType ? go("summary") : setVehicle("CLOSED_PICKUP")
          }
          disabled={!draft.vehicleType}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-50"
        >
          {selectedVehicle
            ? `เลือก ${selectedVehicle.name} และดูราคา`
            : "กรุณาเลือกประเภทรถ"}
        </button>
      </div>
    </div>
  );
}
