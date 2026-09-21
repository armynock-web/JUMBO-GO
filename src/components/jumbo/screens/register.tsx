"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { ChevronLeft, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";

export function RegisterScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);

  const [form, setForm] = useState({
    fullName: "สมชาย ใจดี",
    phone: "081-234-5678",
    password: "jumbogo",
    confirm: "jumbogo",
    consent: false,
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    setError(null);
    if (form.fullName.trim().length < 3) {
      setError("ชื่อ–นามสกุลต้องไม่ว่าง");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      setError("เบอร์โทรศัพท์ไม่ถูกต้อง");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (form.password !== form.confirm) {
      setError("รหัสผ่านสองช่องไม่ตรงกัน");
      return;
    }
    if (!form.consent) {
      setError("กรุณายอมรับข้อกำหนดการใช้บริการ");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      go("verify-otp");
    }, 700);
  };

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
          สมัครสมาชิก
        </span>
        <div className="w-9" />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4 scrollbar-hide">
        <div>
          <h1 className="text-[22px] font-extrabold text-ink">สมัครสมาชิก</h1>
          <p className="-mt-1 text-[13px] text-ink-muted">
            สมัครเพื่อเริ่มเรียกรถขนของได้เลย
          </p>
        </div>

        <Field
          label="ชื่อ–นามสกุล"
          value={form.fullName}
          onChange={(v) => set("fullName", v)}
          placeholder="เช่น สมชาย ใจดี"
        />

        <Field
          label="เบอร์โทรศัพท์"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          placeholder="081-234-5678"
          inputMode="tel"
        />

        {/* password */}
        <label className="block">
          <span className="mb-1 block text-[13px] font-medium text-ink">
            รหัสผ่าน
          </span>
          <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:border-jumbo focus-within:bg-white">
            <input
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
            />
            <button
              onClick={() => setShow((s) => !s)}
              className="text-ink-muted"
              aria-label={show ? "ซ่อน" : "แสดง"}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </label>

        <Field
          label="ยืนยันรหัสผ่าน"
          value={form.confirm}
          onChange={(v) => set("confirm", v)}
          type={show ? "text" : "password"}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
        />

        {/* consent */}
        <button
          onClick={() => set("consent", !form.consent)}
          className="flex items-start gap-2.5 rounded-xl bg-surface p-3 text-left"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
              form.consent
                ? "border-jumbo bg-jumbo"
                : "border-line bg-white"
            }`}
          >
            {form.consent && (
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            )}
          </span>
          <span className="text-[12px] leading-relaxed text-ink-muted">
            ฉันได้อ่านและยอมรับ{" "}
            <span className="font-semibold text-jumbo">
              ข้อกำหนดการใช้บริการ
            </span>{" "}
            และ{" "}
            <span className="font-semibold text-jumbo">
              นโยบายความเป็นส่วนตัว
            </span>{" "}
            ของ JUMBO GO แล้ว
          </span>
        </button>

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
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              กำลังสมัคร...
            </span>
          ) : (
            "สมัครสมาชิก"
          )}
        </button>

        <p className="text-center text-[12px] text-ink-muted">
          มีบัญชีอยู่แล้ว?{" "}
          <button
            onClick={() => go("login")}
            className="font-bold text-jumbo"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "tel" | "text" | "numeric";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:border-jumbo focus-within:bg-white">
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
        />
      </div>
    </label>
  );
}
