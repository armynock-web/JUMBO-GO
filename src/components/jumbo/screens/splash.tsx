"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { JumboLogo } from "../logo";
import { StatusBar } from "../status-bar";
import { motion } from "framer-motion";

export function SplashScreen() {
  const go = useJumbo((s) => s.go);
  const login = useJumbo((s) => s.login);

  // Auto-advance after showing splash (simulates session check)
  useEffect(() => {
    const id = setTimeout(() => go("onboarding"), 2600);
    return () => clearTimeout(id);
  }, [go]);

  return (
    <div className="relative flex h-full flex-col items-center justify-between bg-white px-6 pb-10 pt-2">
      <StatusBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <JumboLogo size={140} />
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-[22px] font-extrabold leading-tight text-ink">
            เรียกรถขนของ ราคาคนไทย
          </h1>
          <p className="mt-1 text-[15px] font-medium text-jumbo">
            เร็ว • ปลอดภัย • ไว้ใจได้
          </p>
          <p className="mt-3 text-[13px] text-ink-muted">
            ขนได้ทุกที่ ไปได้ไกลกว่า ไปกับคนไทย
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="h-1 w-32 overflow-hidden rounded-full bg-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-jumbo"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
        </motion.div>
        <p className="text-[11px] text-ink-muted">
          กำลังตรวจสอบบัญชี...
        </p>
        <button
          onClick={() => {
            login();
            go("home");
          }}
          className="mt-1 text-[12px] font-medium text-ink-muted underline underline-offset-2"
        >
          ข้าม (skip) เข้าสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}
