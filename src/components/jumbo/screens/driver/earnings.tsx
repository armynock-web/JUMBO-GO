"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  Banknote,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function DriverEarningsScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const [tab, setTab] = useState<"today" | "week" | "month">("today");

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
        <span className="text-[13px] font-medium text-ink-muted">รายได้</span>
        <div className="w-9" />
      </div>

      {/* hero total */}
      <div className="relative overflow-hidden bg-jumbo px-5 pb-5 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center gap-1.5">
          <Wallet className="h-4 w-4" />
          <span className="text-[12px] opacity-90">รายได้รวม (พร้อมโอน)</span>
        </div>
        <motion.p
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mt-1 text-[34px] font-extrabold leading-none"
        >
          ฿12,540
        </motion.p>
        <p className="relative mt-1 text-[11px] opacity-80">
          รอบจ่ายถัดไป: 30 ก.ย. 2025
        </p>
        <button className="relative mt-3 flex items-center gap-2 rounded-full bg-white py-2 pl-4 pr-3 text-[12px] font-bold text-jumbo shadow">
          <ArrowDownToLine className="h-3.5 w-3.5" />
          ขอโอนเงิน
        </button>
      </div>

      {/* tabs */}
      <div className="flex gap-2 px-4 py-3">
        {[
          { k: "today" as const, l: "วันนี้", v: 1250 },
          { k: "week" as const, l: "สัปดาห์นี้", v: 5400 },
          { k: "month" as const, l: "เดือนนี้", v: 22840 },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 rounded-xl border-2 py-2 text-center transition ${
              tab === t.k
                ? "border-jumbo bg-jumbo-light"
                : "border-line bg-white"
            }`}
          >
            <p className="text-[11px] text-ink-muted">{t.l}</p>
            <p
              className={`text-[14px] font-bold ${
                tab === t.k ? "text-jumbo" : "text-ink"
              }`}
            >
              ฿{t.v.toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {/* breakdown */}
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-[13px] font-bold text-ink">รายละเอียดรายได้</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {[
              ["ค่าขนส่ง", "฿8,200"],
              ["ค่ารอ", "฿1,200"],
              ["โบนัส", "฿2,500"],
              ["ค่าทางด่วน (คืนให้)", "฿640"],
            ].map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1"
              >
                <span className="text-[12px] text-ink-muted">{r[0]}</span>
                <span className="text-[12px] font-semibold text-ink">
                  {r[1]}
                </span>
              </div>
            ))}
            <div className="mt-1 border-t border-dashed border-line pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink">
                  รวมสุทธิ
                </span>
                <span className="text-[16px] font-extrabold text-jumbo">
                  ฿12,540
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* pending payout */}
        <div className="mt-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            รายการรอจ่าย (1 รายการ)
          </p>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-white p-2">
            <div>
              <p className="text-[12px] font-semibold text-ink">
                รอบจ่ายสัปดาห์นี้
              </p>
              <p className="text-[10px] text-ink-muted">
                16-22 ก.ย. 2025 • โอน 30 ก.ย.
              </p>
            </div>
            <span className="text-[14px] font-bold text-amber-700">฿5,400</span>
          </div>
        </div>

        {/* transfer history */}
        <p className="mb-2 mt-4 px-1 text-[12px] font-bold text-ink">
          ประวัติการโอน
        </p>
        <div className="flex flex-col gap-2">
          {[
            { date: "15 ก.ย. 2025", amount: 4820, bank: "กสิกร ***1234", status: "สำเร็จ" },
            { date: "08 ก.ย. 2025", amount: 5160, bank: "กสิกร ***1234", status: "สำเร็จ" },
            { date: "01 ก.ย. 2025", amount: 3940, bank: "กสิกร ***1234", status: "สำเร็จ" },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Banknote className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-ink">
                  ฿{t.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-ink-muted">
                  {t.date} • {t.bank}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
