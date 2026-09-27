"use client";

import { useEffect, useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { JOB_TIMELINE, DRIVER_DEMO } from "@/lib/brand";
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  MapPin,
  AlertCircle,
  HelpCircle,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";

export function TrackingScreen() {
  const go = useJumbo((s) => s.go);
  const trackingStep = useJumbo((s) => s.trackingStep);
  const setTrackingStep = useJumbo((s) => s.setTrackingStep);
  const draft = useJumbo((s) => s.draft);
  const d = DRIVER_DEMO;

  const [eta, setEta] = useState(21);

  // Advance timeline step smoothly
  useEffect(() => {
    if (trackingStep >= JOB_TIMELINE.length - 1) {
      const id = setTimeout(() => go("completed"), 2000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setTrackingStep(trackingStep + 1);
      setEta((prev) => Math.max(2, prev - 4));
    }, 4500);
    return () => clearTimeout(id);
  }, [trackingStep, go, setTrackingStep]);

  const currentTimeline = JOB_TIMELINE[trackingStep] || JOB_TIMELINE[0];
  const jobNumber = draft.activeJobNumber || "JG-2026-00108";

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-hidden text-slate-800">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/80 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => go("home")}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-black text-slate-900 tracking-tight">
                {jobNumber}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                กำลังดำเนินการ
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => go("home")}
          className="text-[12px] font-bold text-slate-500 hover:text-slate-900 transition"
        >
          กลับหน้าหลัก
        </button>
      </div>

      {/* 2. Scrollable Tracking Details */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
        {/* Status Highlight Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  สถานะการจัดส่ง
                </p>
                <h3 className="text-[16px] font-black text-slate-950">
                  {currentTimeline.label}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                เวลาโดยประมาณ
              </span>
              <span className="text-[18px] font-black text-emerald-600">
                ~{eta} นาที
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Driver & Vehicle Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-[16px] shadow-sm">
                สช
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[14px] font-black text-slate-900">
                    {d.name}
                  </h4>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {d.rating}
                  </span>
                </div>
                <p className="text-[12px] font-semibold text-slate-600">
                  {d.vehicle} • ทะเบียน <strong>{d.plate}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <a
              href={`tel:${d.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-[12px] font-bold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>โทรหาคนขับ</span>
            </a>
            <button
              onClick={() => alert(`เปิดแชทกับคนขับ: ${d.name}`)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
              <span>ส่งข้อความ</span>
            </button>
          </div>
        </div>

        {/* Route Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
            รายละเอียดจุดรับ-ส่ง
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white flex-shrink-0 mt-0.5">
                A
              </span>
              <div>
                <p className="text-[13px] font-bold text-slate-900">
                  {draft.pickup?.address || "สยามพารากอน"}
                </p>
                <p className="text-[11px] text-slate-500">
                  ผู้ส่ง: {draft.senderName} ({draft.senderPhone})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-jumbo text-[10px] font-black text-white flex-shrink-0 mt-0.5">
                B
              </span>
              <div>
                <p className="text-[13px] font-bold text-slate-900">
                  {draft.dropoff?.address || "เมกาบางนา"}
                </p>
                <p className="text-[11px] text-slate-500">
                  ผู้รับ: {draft.receiverName} ({draft.receiverPhone})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Timeline Steps */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            ลำดับความคืบหน้าของงาน
          </h4>

          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />
            {JOB_TIMELINE.map((item, idx) => {
              const isDone = idx <= trackingStep;
              const isCurrent = idx === trackingStep;

              return (
                <div key={item.key} className="relative flex items-center gap-3">
                  <div
                    className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition ${
                      isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p
                      className={`text-[13px] font-bold ${
                        isCurrent
                          ? "text-emerald-600 font-black"
                          : isDone
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Summary & Help Bar */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex items-center justify-between flex-shrink-0 text-[12px]">
        <div className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>ประกันสินค้าคุ้มครอง ฿50,000</span>
        </div>
        <a
          href="tel:021234567"
          className="font-bold text-jumbo hover:underline"
        >
          ศูนย์ช่วยเหลือ 02-123-4567
        </a>
      </div>
    </div>
  );
}
