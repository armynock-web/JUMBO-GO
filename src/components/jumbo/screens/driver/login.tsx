"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import { ChevronLeft, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function DriverLoginScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const login = useJumbo((s) => s.login);
  const [phone, setPhone] = useState("081-234-5678");
  const [password, setPassword] = useState("driver");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (phone.replace(/\D/g, "").length < 9) {
      setError("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return;
    }
    if (password.length < 4) {
      setError("รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
      // Driver who logs in goes to onboarding (KYC not yet approved) OR dashboard
      go("driver-onboarding");
    }, 700);
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
          เข้าสู่ระบบ Driver
        </span>
        <div className="w-9" />
      </div>

      <div className="flex items-center justify-center gap-1.5 px-5 pb-2 pt-3">
        <span className="text-[22px] font-extrabold italic tracking-tight text-ink">
          JUMBO
        </span>
        <span className="rounded bg-jumbo px-1.5 py-0.5 text-[22px] font-extrabold italic tracking-tight text-white">
          GO
        </span>
        <span className="ml-1 rounded-full bg-jumbo-light px-2 py-0.5 text-[10px] font-bold text-jumbo">
          Driver
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-ink">
            เข้าสู่ระบบ Driver
          </h1>
          <p className="-mt-1 text-[13px] text-ink-muted">
            ล็อกอินเพื่อรับงานและดูรายได้
          </p>
        </div>

        <label className="block">
          <span className="mb-1 block text-[13px] font-medium text-ink">
            เบอร์โทรศัพท์
          </span>
          <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:border-jumbo focus-within:bg-white">
            <Phone className="h-4 w-4 text-ink-muted" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="081-234-5678"
              className="ml-2 flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-[13px] font-medium text-ink">
            รหัสผ่าน
          </span>
          <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:border-jumbo focus-within:bg-white">
            <Lock className="h-4 w-4 text-ink-muted" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="ml-2 flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
            />
            <button
              onClick={() => setShow((s) => !s)}
              className="text-ink-muted"
              aria-label={show ? "ซ่อน" : "แสดง"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg bg-jumbo-light px-3 py-2 text-[12px] text-jumbo-dark"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              กำลังเข้าสู่ระบบ...
            </span>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>

        <p className="mt-auto mb-4 text-center text-[12px] text-ink-muted">
          ยังไม่ได้สมัคร?{" "}
          <button
            onClick={() => go("driver-register")}
            className="font-bold text-jumbo"
          >
            สมัคร Driver
          </button>
        </p>
      </div>
    </div>
  );
}
