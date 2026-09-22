"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { ChevronLeft, RefreshCw, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { verifyCode, resendVerificationCode } from "../../../lib/auth/verification";
import { getCurrentUser } from "../../../lib/auth/client";

export function VerifyOtpScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const login = useJumbo((s) => s.login);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // โหลดรหัสยืนยันเมื่อ component mount
  useEffect(() => {
    const loadVerificationCode = async () => {
      const user = await getCurrentUser();
      if (user) {
        const code = await resendVerificationCode(user.id);
        setVerificationCode(code);
      }
    };
    loadVerificationCode();
  }, []);

  const verify = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        setLoading(false);
        return;
      }

      const code = digits.join("");
      const isValid = await verifyCode(user.id, code);

      if (isValid) {
        login();
        go("home");
      } else {
        setError("รหัสยืนยันไม่ถูกต้อง กรุณาลองใหม่");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, [digits, login, go]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    // auto-submit when all 6 digits are filled
    if (v && next.every((d) => d !== "")) {
      verify();
    }
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const resend = async () => {
    setSeconds(60);
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();

    try {
      const user = await getCurrentUser();
      if (user) {
        const code = await resendVerificationCode(user.id);
        setVerificationCode(code);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งรหัสใหม่");
    }
  };

  const phone = "081-234-5678";

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex items-center justify-between px-5 py-2">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          ยืนยัน OTP
        </span>
        <div className="w-9" />
      </div>

      <div className="flex flex-1 flex-col items-center gap-5 px-5 pt-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-jumbo-light"
        >
          <Smartphone className="h-8 w-8 text-jumbo" strokeWidth={2.5} />
        </motion.div>

        <div className="text-center">
          <h1 className="text-[22px] font-extrabold text-ink">
            ยืนยันตัวตน
          </h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            กรอกรหัสยืนยัน 6 หลัก
          </p>
          {verificationCode && (
            <p className="mt-0.5 text-[14px] font-bold text-jumbo">
              รหัสของคุณ: {verificationCode}
            </p>
          )}
        </div>

        {/* OTP boxes */}
        <div className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              className={`h-12 w-11 rounded-xl border-2 bg-white text-center text-[20px] font-bold outline-none transition ${
                d
                  ? "border-jumbo text-jumbo"
                  : "border-line text-ink focus:border-jumbo"
              }`}
              aria-label={`หลักที่ ${i + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[12px] text-jumbo-dark">{error}</p>
        )}

        {loading && (
          <p className="flex items-center gap-2 text-[12px] text-jumbo">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-jumbo/30 border-t-jumbo" />
            กำลังตรวจสอบ...
          </p>
        )}

        {/* resend */}
        <div className="flex items-center gap-2">
          {seconds > 0 ? (
            <span className="text-[13px] text-ink-muted">
              ส่งรหัสใหม่ได้ใน{" "}
              <span className="font-bold text-ink">{seconds} วินาที</span>
            </span>
          ) : (
            <button
              onClick={resend}
              className="flex items-center gap-1.5 text-[13px] font-bold text-jumbo"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              ส่งรหัสใหม่
            </button>
          )}
        </div>

        <button
          onClick={verify}
          disabled={loading || digits.some((d) => d === "")}
          className="mt-4 w-full max-w-[340px] rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-50"
        >
          ยืนยัน
        </button>

        <p className="text-center text-[11px] text-ink-muted">
          รหัสยืนยันจะแสดงด้านบน (สำหรับการทดสอบ)
        </p>
        <button
          onClick={() => {
            login();
            go("home");
          }}
          className="text-[12px] text-ink-muted underline underline-offset-2"
        >
          ข้าม (สำหรับทดลอง)
        </button>
      </div>
    </div>
  );
}
