"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Pencil,
  Phone,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function DriverOnboardingStatusScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const [status] = useState<"under_review" | "approved" | "rejected">(
    "under_review",
  );

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
          สถานะ KYC
        </span>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 scrollbar-hide">
        {/* status hero */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="flex flex-col items-center text-center"
        >
          {status === "under_review" && (
            <>
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-jumbo-pulse rounded-full bg-jumbo/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-jumbo text-white">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              <h1 className="mt-3 text-[20px] font-extrabold text-ink">
                กำลังตรวจสอบเอกสาร
              </h1>
              <p className="mt-1 text-[13px] text-ink-muted">
                เอกสารของคุณอยู่ระหว่างตรวจสอบ
              </p>
              <p className="text-[11px] text-ink-muted">
                ระยะเวลาโดยประมาณ: 1–2 วันทำการ
              </p>
            </>
          )}
        </motion.div>

        {/* progress timeline */}
        <div className="mt-5 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">ความคืบหน้า</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "ส่งเอกสาร", done: true, time: "วันนี้ 10:42 น." },
              { label: "รอตรวจสอบ", done: true, time: "วันนี้ 10:42 น." },
              { label: "กำลังตรวจสอบ", done: true, active: true, time: "กำลังดำเนินการ" },
              { label: "อนุมัติ", done: false, time: "รอผล" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    s.done
                      ? s.active
                        ? "bg-jumbo text-white"
                        : "bg-green-600 text-white"
                      : "bg-surface text-ink-muted"
                  }`}
                >
                  {s.done && !s.active && (
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  )}
                  {s.active && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-white"
                    />
                  )}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-[12px] ${
                      s.active ? "font-bold text-jumbo" : "font-semibold text-ink"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[10px] text-ink-muted">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* submitted docs */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">เอกสารที่ส่ง</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "บัตรประชาชน (หน้า)",
              "บัตรประชาชน (หลัง)",
              "Selfie",
              "ใบขับขี่ (หน้า)",
              "ใบขับขี่ (หลัง)",
              "เล่มทะเบียน",
              "พ.ร.บ.",
              "รูปหน้ารถ",
              "รูปด้านข้าง",
              "สมุดบัญชี",
            ].map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-lg bg-surface p-2"
              >
                <FileText className="h-3.5 w-3.5 flex-shrink-0 text-ink-muted" />
                <span className="truncate text-[10px] text-ink">{d}</span>
                <Eye className="ml-auto h-3 w-3 text-jumbo" />
              </div>
            ))}
          </div>
        </div>

        {/* rejection reason (only if rejected) */}
        {status === "rejected" && (
          <div className="mt-3 rounded-2xl border-2 border-jumbo bg-jumbo-light p-3">
            <p className="flex items-center gap-1.5 text-[12px] font-bold text-jumbo-dark">
              <XCircle className="h-4 w-4" />
              เหตุผลที่ปฏิเสธ
            </p>
            <p className="mt-1 text-[11px] text-jumbo-dark">
              รูปบัตรประชาชนด้านหลังไม่ชัดเจน กรุณาถ่ายใหม่
            </p>
          </div>
        )}

        {/* actions */}
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={() => go("driver-onboarding")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-3 text-[13px] font-bold text-ink"
          >
            <Pencil className="h-4 w-4" /> แก้ไขข้อมูล
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3 text-[13px] font-bold text-white">
            <Phone className="h-4 w-4" /> ติดต่อเจ้าหน้าที่
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-ink-muted">
          หากอนุมัติแล้ว ระบบจะแจ้งเตือน และคุณสามารถเปิดรับงานได้ทันที
        </p>
        <button
          onClick={() => go("driver-dashboard")}
          className="mt-2 w-full rounded-xl border-2 border-jumbo bg-white py-2.5 text-[12px] font-bold text-jumbo"
        >
          จำลองสถานะ “อนุมัติ” และไป Dashboard →
        </button>
      </div>
    </div>
  );
}
