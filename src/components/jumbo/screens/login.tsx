"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { JumboLockup } from "../logo";
import { StatusBar } from "../status-bar";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Phone,
  Lock,
  AlertCircle,
} from "lucide-react";

export function LoginScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const login = useJumbo((s) => s.login);
  const [phone, setPhone] = useState("081-234-5678");
  const [password, setPassword] = useState("jumbogo");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (phone.replace(/\D/g, "").length < 9) {
      setError("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
      go("home");
    }, 800);
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />
      {/* red hero */}
      <div className="relative overflow-hidden bg-jumbo px-5 pb-8 pt-2 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" />
        <div className="relative flex items-center justify-between">
          <button
            onClick={back}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"
            aria-label="ย้อนกลับ"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-[13px] font-medium opacity-90">เข้าสู่ระบบ</span>
          <div className="w-9" />
        </div>
        <div className="relative mt-3">
          <div className="flex items-center justify-center">
            <JumboLockup className="[&_*]:!text-white" />
          </div>
          <p className="mt-2 text-center text-[13px] font-medium opacity-90">
            เรียกรถขนของ ราคาคนไทย
          </p>
        </div>
      </div>

      {/* form */}
      <div className="flex flex-1 flex-col gap-3 px-5 pt-6">
        <h1 className="text-[22px] font-extrabold text-ink">
          ยินดีต้อนรับกลับ
        </h1>
        <p className="-mt-2 text-[13px] text-ink-muted">
          ล็อกอินเพื่อเรียกรถและติดตามงานของคุณ
        </p>

        {/* phone */}
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

        {/* password */}
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
              className="ml-1 text-ink-muted"
              aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        {/* remember + forgot */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setRemember((r) => !r)}
            className="flex items-center gap-2"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border-2 transition ${
                remember
                  ? "border-jumbo bg-jumbo"
                  : "border-line bg-white"
              }`}
            >
              {remember && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.4"
                >
                  <path d="M2 5 L4 7 L8 3" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span className="text-[12px] text-ink-muted">จำฉันไว้</span>
          </button>
          <button
            onClick={() => go("register")}
            className="text-[12px] font-medium text-jumbo"
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        {/* error */}
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

        {/* submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-60"
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

        {/* social */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] text-ink-muted">หรือ</span>
          <div className="h-px flex-1 bg-line" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={submit}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-[13px] font-medium text-ink"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            onClick={submit}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-[13px] font-medium text-ink"
          >
            <AppleIcon />
            Apple
          </button>
        </div>

        <p className="mt-auto mb-4 text-center text-[12px] text-ink-muted">
          ยังไม่มีบัญชี?{" "}
          <button
            onClick={() => go("register")}
            className="font-bold text-jumbo"
          >
            สมัครสมาชิก
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.36 1.43c.04 1.08-.34 2.12-1.02 2.95-.7.85-1.86 1.5-2.99 1.41-.06-1.06.42-2.18 1.06-2.92.69-.81 1.92-1.42 2.95-1.44zM20.94 17.7c-.51 1.18-.76 1.7-1.42 2.74-.92 1.47-2.22 3.3-3.83 3.31-1.43.01-1.8-.93-3.74-.92-1.94.01-2.34.93-3.77.92-1.61-.01-2.84-1.66-3.76-3.13-2.58-4.11-2.85-8.93-1.26-11.48.9-1.43 2.32-2.27 3.65-2.27 1.35 0 2.2.93 3.31.93 1.08 0 1.74-.93 3.3-.93 1.18 0 2.43.65 3.32 1.77-2.92 1.6-2.45 5.78.5 7.06z" />
    </svg>
  );
}
