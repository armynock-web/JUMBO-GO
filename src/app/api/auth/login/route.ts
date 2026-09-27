import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone, email, password } = body;

    let authEmail: string | null = null;
    let authUser: { id: string } | null = null;

    // 1) password login หากระบุ email+password
    if (email && password) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      const found = data?.users.find((u) => u.email === email.toLowerCase());
      if (error || !found) {
        return NextResponse.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
      }
      authUser = { id: found.id };
      authEmail = email;
    }

    // 2) phone lookup (ประกอบ superset ของ demo flow)
    if (!authUser && phone) {
      const clean = phone.replace(/\D/g, "");
      // Auth users หลายตัวมี phone ว่าง — เบอร์จริงเก็บใน users table
      // ค้น users table ก่อน (id เป็น PK เดียวกับ auth.users)
      const { data: phoneProfile } = await supabaseServer
        .from("users")
        .select("id, email")
        .ilike("phone", `%${clean}%`)
        .maybeSingle();
      if (phoneProfile) {
        authUser = { id: phoneProfile.id };
        authEmail = phoneProfile.email;
      } else {
        // fallback: user ใหม่ที่สมัครผ่าน register เก็บ phone เป็น E.164 ใน auth
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        const found = data?.users.find(
          (u) => u.phone?.replace(/\D/g, "") === clean
        );
        if (error || !found) {
          return NextResponse.json({ success: false, message: "ไม่พบผู้ใช้ของเบอร์นี้" }, { status: 404 });
        }
        authUser = { id: found.id };
        authEmail = found.email || null;
      }
    }

    if (!authUser) {
      return NextResponse.json({ success: false, message: "กรุณาระบุอีเมล+รหัสผ่าน หรือเบอร์โทร" }, { status: 400 });
    }

    // 3) โหลด profile จริงจาก users table
    const { data: profile, error: profileError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (profileError || !profile) {
      return NextResponse.json({ success: false, message: "ไม่พบโปรไฟล์ผู้ใช้" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: profile,
      token: "jumbo_" + authUser.id,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}