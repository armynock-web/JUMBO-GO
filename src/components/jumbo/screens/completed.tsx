"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { VEHICLES, formatTHB } from "@/lib/brand";
import {
  CheckCircle2,
  FileText,
  RefreshCw,
  Share2,
  Star,
  Download,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

export function CompletedScreen() {
  const go = useJumbo((s) => s.go);
  const resetFlow = useJumbo((s) => s.resetFlow);
  const draft = useJumbo((s) => s.draft);

  const vehicle = VEHICLES.find((v) => v.type === draft.vehicleType);
  const total = draft.estimatedPrice ?? 520;
  const jobId = "JG-2025-00108";
  const date = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />

      {/* success header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 px-5 pb-6 pt-4 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <CheckCircle2 className="h-9 w-9 text-green-600" strokeWidth={2.5} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mt-2 text-center text-[22px] font-extrabold"
        >
          ส่งงานสำเร็จ!
        </motion.h1>
        <p className="relative mt-0.5 text-center text-[12px] opacity-90">
          ขอบคุณที่ใช้บริการ JUMBO GO
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 pt-3 scrollbar-hide">
        {/* receipt card */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-line bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] text-ink-muted">เลขที่งาน</span>
            <span className="rounded bg-surface px-2 py-0.5 text-[11px] font-bold text-ink">
              {jobId}
            </span>
          </div>
          <Row label="วันที่" value={date} />
          <Row
            label="ประเภทรถ"
            value={vehicle?.name ?? "กระบะตู้ทึบ"}
          />
          <Row
            label="ระยะทาง"
            value={`${draft.distanceKm ?? 28.5} กม.`}
          />
          <Row label="วิธีชำระเงิน" value="เงินสด จ่ายปลายทาง" />

          <div className="my-3 border-t border-dashed border-line" />

          <div className="flex items-end justify-between">
            <span className="text-[13px] text-ink-muted">ยอดชำระรวม</span>
            <span className="text-[26px] font-extrabold text-jumbo">
              ฿{formatTHB(total)}
            </span>
          </div>
        </motion.div>

        {/* rating prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 rounded-2xl border border-line bg-surface p-3 text-center"
        >
          <p className="text-[13px] font-semibold text-ink">
            ให้คะแนนคนขับของคุณ
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s, i) => (
              <motion.button
                key={s}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="rounded-full p-1"
                aria-label={`${s} ดาว`}
              >
                <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
              </motion.button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-ink-muted">
            แตะดาวเพื่อให้คะแนน
          </p>
        </motion.div>

        {/* actions */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white py-3">
            <FileText className="h-5 w-5 text-jumbo" />
            <span className="text-[12px] font-semibold text-ink">
              ดูใบเสร็จ
            </span>
          </button>
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white py-3">
            <Download className="h-5 w-5 text-jumbo" />
            <span className="text-[12px] font-semibold text-ink">
              ดาวน์โหลด
            </span>
          </button>
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-3 text-[13px] font-bold text-ink">
          <Share2 className="h-4 w-4" /> แชร์ใบเสร็จ
        </button>

        {draft.pickup && draft.dropoff && (
          <div className="mt-3 rounded-xl bg-surface p-3 text-[11px]">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-green-600" />
              <span className="text-ink-muted">จุดรับ:</span>
              <span className="truncate font-semibold text-ink">
                {draft.pickup.address}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-jumbo" />
              <span className="text-ink-muted">จุดส่ง:</span>
              <span className="truncate font-semibold text-ink">
                {draft.dropoff.address}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() => {
            resetFlow();
            go("home");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          เรียกรถอีกครั้ง
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-ink-muted">{label}</span>
      <span className="text-[12px] font-semibold text-ink">{value}</span>
    </div>
  );
}
