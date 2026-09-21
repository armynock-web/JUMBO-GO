"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { StepIndicator } from "../step-indicator";
import { VehicleIcon } from "../vehicle-icon";
import { VEHICLES } from "@/lib/brand";
import { ChevronLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

export function VehicleTypeScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const draft = useJumbo((s) => s.draft);
  const setVehicle = useJumbo((s) => s.setVehicle);

  const select = (type: (typeof VEHICLES)[number]["type"]) => {
    setVehicle(type);
    go("summary");
  };

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
        <h1 className="text-[22px] font-extrabold text-ink">
          เลือกประเภทรถ
        </h1>
        <p className="-mt-1 text-[12px] text-ink-muted">
          เลือกรถตามปริมาณและขนาดของสินค้า
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-3 scrollbar-hide">
        <div className="flex flex-col gap-3">
          {VEHICLES.map((v, i) => {
            const active = draft.vehicleType === v.type;
            return (
              <motion.button
                key={v.type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => select(v.type)}
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
                    type={v.type}
                    className="h-12 w-auto"
                    color={active ? "#ED1C24" : "#111111"}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-extrabold text-ink">
                      {v.name}
                    </h3>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-ink-muted">
                      {v.tonRange}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">
                    {v.capacity}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-ink-muted">
                    {v.desc}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[13px] font-bold text-jumbo">
                      ฿{v.basePrice}
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      ตั้ง + ฿{v.perKm}/กม.
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

        <div className="mt-4 rounded-xl bg-surface p-3">
          <p className="text-[11px] font-bold text-ink">หมายเหตุ</p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            ราคาที่แสดงเป็นราคาเริ่มต้น ราคาจริงคำนวณฝั่ง Server
            ตามระยะทาง ค่ารอ และค่าทางด่วน
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
          {draft.vehicleType
            ? `เลือก ${
                VEHICLES.find((v) => v.type === draft.vehicleType)?.name
              } และดูราคา`
            : "กรุณาเลือกประเภทรถ"}
        </button>
      </div>
    </div>
  );
}
