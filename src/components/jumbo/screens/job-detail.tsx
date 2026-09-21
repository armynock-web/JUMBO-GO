"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { JOB_HISTORY, JOB_TIMELINE, formatTHB } from "@/lib/brand";
import { VehicleIcon } from "../vehicle-icon";
import {
  ChevronLeft,
  MapPin,
  Truck,
  Star,
  Phone,
  MessageSquare,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

export function JobDetailScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  // Use the first job from history as the "selected" job
  const job = JOB_HISTORY[0];

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
          รายละเอียดงาน
        </span>
        <button
          onClick={() => go("jobs")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="รายการ"
        >
          <FileText className="h-4 w-4 text-ink" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 pt-3 scrollbar-hide">
        {/* job header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-line bg-white p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-ink-muted">เลขที่งาน</p>
              <p className="text-[15px] font-bold text-jumbo">{job.id}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                job.status === "เสร็จสิ้น"
                  ? "bg-green-100 text-green-700"
                  : "bg-jumbo-light text-jumbo"
              }`}
            >
              {job.status}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
            <Clock className="h-3 w-3" />
            {job.date}
          </div>
        </motion.div>

        {/* route */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">เส้นทาง</p>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
              <div className="my-1 h-10 w-0.5 bg-line" />
              <MapPin className="h-4 w-4 text-jumbo" />
            </div>
            <div className="flex-1">
              <div>
                <p className="text-[10px] text-ink-muted">จุดรับ</p>
                <p className="text-[13px] font-semibold text-ink">
                  {job.route.split(" → ")[0]}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-ink-muted">จุดส่ง</p>
                <p className="text-[13px] font-semibold text-ink">
                  {job.route.split(" → ")[1]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* driver info */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">คนขับ</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-jumbo text-white">
              <Truck className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">สมชาย ใจดี</p>
              <div className="flex items-center gap-1 text-[11px]">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-ink">4.8</span>
                <span className="text-ink-muted">(320 รีวิว)</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <a
                href="tel:0812345678"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white"
                aria-label="โทร"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo text-white"
                aria-label="แชท"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface p-2 text-[11px]">
            <Truck className="h-3.5 w-3.5 text-ink-muted" />
            <span className="text-ink-muted">{job.vehicle}</span>
            <span className="ml-auto rounded bg-ink px-2 py-0.5 text-[10px] font-bold text-white">
              ขข 1234
            </span>
          </div>
        </div>

        {/* timeline */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">สถานะงาน</p>
          <div className="relative pl-1">
            {JOB_TIMELINE.map((step, i) => {
              const done = i < JOB_TIMELINE.length - 1;
              return (
                <div key={step.key} className="flex items-start gap-2.5 pb-3">
                  <span
                    className={`relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-green-600 text-white"
                        : "bg-surface text-ink-muted ring-2 ring-line"
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  <div>
                    <p
                      className={`text-[12px] ${done ? "font-semibold text-ink" : "text-ink-muted"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-ink-muted">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* price */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">รายละเอียดราคา</p>
          <div className="flex flex-col gap-1">
            <PriceRow label="ค่าขนส่ง" value={`฿${formatTHB(job.price - 75)}`} />
            <PriceRow label="ค่าทางด่วน" value="฿75" />
            <PriceRow label="ค่ารอ (ฟรี)" value="฿0" />
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-2">
              <span className="flex items-center gap-1 text-[13px] font-bold text-ink">
                <Wallet className="h-3.5 w-3.5 text-jumbo" /> ยอดรวม
              </span>
              <span className="text-[18px] font-extrabold text-jumbo">
                ฿{formatTHB(job.price)}
              </span>
            </div>
          </div>
        </div>

        {/* receipt */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white py-3">
            <FileText className="h-5 w-5 text-jumbo" />
            <span className="text-[11px] font-semibold text-ink">ดูใบเสร็จ</span>
          </button>
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white py-3">
            <Download className="h-5 w-5 text-jumbo" />
            <span className="text-[11px] font-semibold text-ink">ดาวน์โหลด</span>
          </button>
        </div>
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-2.5 text-[12px] font-bold text-ink">
          <Share2 className="h-4 w-4" /> แชร์ใบเสร็จ
        </button>

        {/* CTA */}
        <button
          onClick={() => go("home")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[14px] font-bold text-white shadow-lg shadow-jumbo/30"
        >
          เรียกรถอีกครั้ง
        </button>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[12px] text-ink-muted">{label}</span>
      <span className="text-[12px] font-semibold text-ink">{value}</span>
    </div>
  );
}
