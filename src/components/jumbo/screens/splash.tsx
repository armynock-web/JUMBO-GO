"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { JumboLogo } from "../logo";
import { motion } from "framer-motion";

export function SplashScreen() {
  const go = useJumbo((s) => s.go);
  const login = useJumbo((s) => s.login);

  // Directly navigate to customer booking console without blocking user
  useEffect(() => {
    login();
    go("home");
  }, [go, login]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <JumboLogo size={100} />
        <p className="text-sm font-semibold text-slate-500">
          กำลังเปิดหน้าจองรถ...
        </p>
      </motion.div>
    </div>
  );
}
