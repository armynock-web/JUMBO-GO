"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { NOTIFICATIONS } from "@/lib/brand";
import { Bell, Truck, Tag, Settings, Check } from "lucide-react";
import { motion } from "framer-motion";

export function NotificationsScreen() {
  return (
    <div className="relative flex min-h-full flex-col bg-surface pb-20">
      <StatusBar />
      <div className="bg-white px-5 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-extrabold text-ink">การแจ้งเตือน</h1>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
            aria-label="ตั้งค่า"
          >
            <Settings className="h-4 w-4 text-ink" />
          </button>
        </div>
        <p className="-mt-1 text-[12px] text-ink-muted">
          ข้อความและอัปเดตจาก JUMBO GO
        </p>
      </div>

      <div className="flex-1 px-4 pt-3">
        {/* unread count */}
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[13px] font-bold text-ink">
            ยังไม่อ่าน (2)
          </p>
          <button className="flex items-center gap-1 text-[12px] font-medium text-jumbo">
            <Check className="h-3.5 w-3.5" /> อ่านทั้งหมด
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {NOTIFICATIONS.map((n, i) => {
            const Icon =
              n.type === "job"
                ? Truck
                : n.type === "promo"
                  ? Tag
                  : Bell;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-3 rounded-2xl border p-3 ${
                  n.unread
                    ? "border-jumbo bg-jumbo-light"
                    : "border-line bg-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                    n.unread ? "bg-jumbo text-white" : "bg-surface text-ink-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-ink">
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-jumbo" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{n.body}</p>
                  <p className="mt-1 text-[10px] text-ink-muted">{n.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* earlier */}
        <p className="mb-2 mt-4 px-1 text-[13px] font-bold text-ink-muted">
          ก่อนหน้านี้
        </p>
        <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-center">
          <Bell className="mx-auto h-6 w-6 text-ink-muted" />
          <p className="mt-1 text-[12px] text-ink-muted">
            ยังไม่มีการแจ้งเตือนอื่นๆ
          </p>
        </div>
      </div>
    </div>
  );
}
