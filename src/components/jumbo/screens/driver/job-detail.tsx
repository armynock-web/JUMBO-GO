"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import { JOB_TIMELINE, JOB_HISTORY, formatTHB } from "@/lib/brand";
import {
  ChevronLeft,
  MapPin,
  Phone,
  MessageSquare,
  Camera,
  CheckCircle2,
  Clock,
  Navigation,
  Wallet,
  Upload,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { SignatureCanvas } from "../../signature-canvas";
import { PenTool, Image as ImageIcon, Loader2 } from "lucide-react";

export function DriverJobDetailScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const job = JOB_HISTORY[0];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [signerName, setSignerName] = useState<string>("");
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteJob = async () => {
    setIsSubmitting(true);
    try {
      if (photoUrl || signatureUrl) {
        await fetch(`/api/driver/jobs/${job.id}/proof`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proofUrl: photoUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
            proofType: signatureUrl ? "signature" : "photo",
            signature: signatureUrl || undefined,
            note: signerName ? `ลงชื่อโดย: ${signerName}` : "ส่งมอบสินค้าเรียบร้อย",
          }),
        }).catch(() => {});
      }
    } finally {
      setIsSubmitting(false);
      setIsCompleted(true);
      setTimeout(() => {
        go("driver-dashboard");
      }, 1200);
    }
  };

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
        <div className="w-9" />
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
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
              กำลังดำเนินการ
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-jumbo" />
            <span className="text-[11px] text-ink-muted">{job.vehicle}</span>
            <span className="ml-auto text-[14px] font-bold text-jumbo">
              ฿{formatTHB(job.price)}
            </span>
          </div>
        </motion.div>

        {/* customer info */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">ลูกค้า</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
              <span className="text-[12px] font-bold">สช</span>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">สมชาย ใจดี</p>
              <p className="text-[11px] text-ink-muted">081-234-5678</p>
            </div>
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
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo-light"
              aria-label="นำทาง"
            >
              <Navigation className="h-4 w-4 text-jumbo" />
            </button>
          </div>
        </div>

        {/* earning breakdown */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">รายได้รอบนี้</p>
          <div className="flex flex-col gap-1">
            <Row label="ค่าขนส่ง" value={`฿${formatTHB(job.price - 75)}`} />
            <Row label="ค่าทางด่วน (คืนให้)" value="฿75" />
            <Row label="ค่าคอมมิชชัน (10%)" value="-฿52" muted />
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-2">
              <span className="flex items-center gap-1 text-[13px] font-bold text-ink">
                <Wallet className="h-3.5 w-3.5 text-jumbo" /> รายได้สุทธิ
              </span>
              <span className="text-[18px] font-extrabold text-jumbo">
                ฿{formatTHB(job.price - 52)}
              </span>
            </div>
          </div>
        </div>

        {/* job status timeline */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">สถานะงาน</p>
          <div className="relative pl-1">
            {JOB_TIMELINE.slice(0, 5).map((step, i) => {
              const done = i < 2;
              const active = i === 2;
              return (
                <div key={step.key} className="flex items-start gap-2.5 pb-3">
                  <span
                    className={`relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-green-600 text-white"
                        : active
                          ? "bg-jumbo text-white ring-4 ring-jumbo-light"
                          : "bg-surface text-ink-muted ring-2 ring-line"
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />}
                    {active && (
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-white"
                      />
                    )}
                  </span>
                  <div>
                    <p
                      className={`text-[12px] ${
                        active ? "font-bold text-jumbo" : done ? "font-semibold text-ink" : "text-ink-muted"
                      }`}
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

        {/* delivery proof upload */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">
            หลักฐานการส่งมอบสินค้า (Proof of Delivery)
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Photo Proof */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-2 transition ${
                photoUrl
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100/70"
              }`}
            >
              {photoUrl ? (
                <div className="flex flex-col items-center gap-1 text-center">
                  <img
                    src={photoUrl}
                    alt="Proof"
                    className="h-14 w-full rounded-lg object-cover"
                  />
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> ถ่ายภาพแล้ว
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <Camera className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    ถ่ายรูปสินค้า
                  </span>
                  <span className="text-[9px] text-slate-400">
                    สินค้า/จุดส่งมอบ
                  </span>
                </div>
              )}
            </div>

            {/* 2. Digital Signature */}
            <div
              onClick={() => setShowSignatureModal(true)}
              className={`flex h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-2 transition ${
                signatureUrl
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100/70"
              }`}
            >
              {signatureUrl ? (
                <div className="flex flex-col items-center gap-1 text-center">
                  <img
                    src={signatureUrl}
                    alt="Signature"
                    className="h-14 w-full rounded-lg object-contain bg-white border border-slate-200"
                  />
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> เซ็นรับแล้ว
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <PenTool className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    ลงชื่อผู้รับ
                  </span>
                  <span className="text-[9px] text-slate-400">
                    ลายเซ็นดิจิทัล
                  </span>
                </div>
              )}
            </div>
          </div>

          {signerName && (
            <p className="mt-2 text-[11px] text-slate-600">
              ผู้รับสินค้า: <strong>{signerName}</strong>
            </p>
          )}
        </div>

        {/* actions */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (!photoUrl) fileInputRef.current?.click();
              else setShowSignatureModal(true);
            }}
            className="flex items-center justify-center gap-1 rounded-2xl border border-line bg-white py-3 text-[12px] font-bold text-ink hover:bg-slate-50"
          >
            <Upload className="h-3.5 w-3.5" /> เพิ่มหลักฐาน POD
          </button>
          <button
            onClick={handleCompleteJob}
            disabled={isSubmitting || isCompleted}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-jumbo py-3 text-[12px] font-bold text-white shadow-md shadow-jumbo/20 hover:bg-jumbo-dark disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>{isCompleted ? "ส่งงานเรียบร้อย!" : "ยืนยันส่งงาน"}</span>
          </button>
        </div>

        {/* Signature Modal */}
        {showSignatureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md">
              <SignatureCanvas
                defaultSignerName={signerName}
                onSave={(sigData, name) => {
                  setSignatureUrl(sigData);
                  setSignerName(name);
                  setShowSignatureModal(false);
                }}
                onCancel={() => setShowSignatureModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-[12px] ${muted ? "text-jumbo" : "text-ink-muted"}`}>
        {label}
      </span>
      <span className={`text-[12px] font-semibold ${muted ? "text-jumbo" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
