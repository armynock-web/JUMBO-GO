"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function AdminLoginScreen() {
  const go = useJumbo((s) => s.go);
  const login = useJumbo((s) => s.login);
  const setAdminAuthenticated = useJumbo((s) => s.setAdminAuthenticated);
  const [email, setEmail] = useState("admin@jumbogo.co.th");
  const [password, setPassword] = useState("admin");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("กรุณากรอกอีเมลแอดมินให้ถูกต้อง");
      return;
    }
    if (!trimmedPass) {
      setError("กรุณากรอกรหัสผ่านผู้ดูแลระบบ");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isValidEmail =
        trimmedEmail === "admin@jumbogo.co.th" ||
        trimmedEmail === "admin@jumbogo.com" ||
        trimmedEmail === "superadmin@jumbogo.com" ||
        (trimmedEmail.startsWith("admin") && (trimmedEmail.endsWith("@jumbogo.co.th") || trimmedEmail.endsWith("@jumbogo.com")));

      const isValidPass =
        trimmedPass === "admin" ||
        trimmedPass === "admin1234" ||
        trimmedPass === "jumbo2025" ||
        trimmedPass === "jumbogo2025";

      if (!isValidEmail || !isValidPass) {
        setLoading(false);
        setError("อีเมลหรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (เฉพาะเจ้าหน้าที่ JUMBO GO)");
        return;
      }

      setLoading(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("jumbo_admin_auth", "true");
      }
      setAdminAuthenticated(true);
      login();
      go("admin-dashboard");
    }, 500);
  };

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-jumbo" />
          <span className="text-[13px] font-bold text-ink">
            JUMBO GO Admin Portal
          </span>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
          ระบบความปลอดภัยเจ้าหน้าที่
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-jumbo text-white shadow-lg"
        >
          <Shield className="h-8 w-8" />
        </motion.div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[18px] font-extrabold italic tracking-tight text-ink">
            JUMBO
          </span>
          <span className="rounded bg-jumbo px-1.5 py-0.5 text-[18px] font-extrabold italic tracking-tight text-white">
            GO
          </span>
          <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">
            Admin
          </span>
        </div>
        <p className="mt-1 text-[12px] text-ink-muted">
          เข้าสู่ระบบสำหรับเจ้าหน้าที่
        </p>

        <div className="mt-5 w-full max-w-[320px] flex flex-col gap-3">
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-ink">
              อีเมล
            </span>
            <div className="flex items-center rounded-xl border border-line bg-white px-3 focus-within:border-jumbo">
              <User className="h-4 w-4 text-ink-muted" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                placeholder="admin@jumbogo.co.th"
                className="ml-2 flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-ink">
              รหัสผ่าน
            </span>
            <div className="flex items-center rounded-xl border border-line bg-white px-3 focus-within:border-jumbo">
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

          <p className="text-center text-[11px] text-ink-muted">
            ระบบจะบันทึก Audit Log ทุกการกระทำ
          </p>

          <div className="mt-2 rounded-xl bg-slate-100 p-2.5 border border-slate-200 text-center">
            <p className="text-[11px] font-semibold text-slate-700">บัญชีเจ้าหน้าที่ (Admin Demo):</p>
            <p className="text-[11px] text-slate-500 font-mono">admin@jumbogo.co.th / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
