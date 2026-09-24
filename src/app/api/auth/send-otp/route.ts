import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// In-memory OTP storage (demo mode: ไม่ใช้ SMS provider ภายนอกตาม project requirement)
// หมายเหตุ: Supabase phone provider ยังไม่เปิดใช้งานในโปรเจกต์นี้
export const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = body.phone || "081-234-5678";

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone.replace(/\D/g, ""), { code, expiresAt });

    return NextResponse.json({
      success: true,
      otp: code,
      phone,
      expiresIn: 300,
      message: "สร้างรหัส OTP 6 หลักในระบบเรียบร้อย (Internal demo mode)",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}