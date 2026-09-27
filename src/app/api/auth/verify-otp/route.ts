import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = body.phone || "081-234-5678";
    const otp = body.otp;
    const cleanPhone = phone.replace(/\D/g, "");

    const stored = otpStore.get(cleanPhone);

    // Demo mode: ยอมรับเฉพาะ OTP ที่ระบบสร้างเอง (ไม่มีการ magic bypass "123456")
    if (!stored || stored.code !== otp) {
      return NextResponse.json({ success: false, message: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(cleanPhone);
      return NextResponse.json({ success: false, message: "รหัส OTP หมดอายุ" }, { status: 400 });
    }

    // ค้น user จากข้อมูลจริง ถ้ายังไม่มีให้ upsert (id ใหม่)
    const { data: existing } = await supabaseServer
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    let user = existing;
    if (!user) {
      const newId = crypto.randomUUID();
      const profile = {
        id: newId,
        email: `${cleanPhone}@jumbogo.local`,
        phone,
        first_name: "ผู้ใช้",
        last_name: "จัมโบ้",
        role: "user",
      };
      const { data, error } = await supabaseServer.from("users").insert(profile).select().single();
      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
      user = data;
    }

    otpStore.delete(cleanPhone);

    return NextResponse.json({
      success: true,
      message: "ยืนยัน OTP สำเร็จ",
      token: "jumbo_" + user.id,
      user,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}