import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, phone, role = "user", email, password } = body;

    if (!fullName || (!phone && !email)) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อ และเบอร์โทรศัพท์หรืออีเมล" },
        { status: 400 }
      );
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ") || "ไม่ระบุนามสกุล";

    const authEmail = email || `${phone.replace(/\D/g, "")}@jumbogo.local`;
    const authPassword = password || `${firstName.slice(0, 6)}1234`;
    // Supabase Auth บังคับเบอร์โทรเป็น E.164 (เช่น +66xxxxxxxxx)
    // เก็บ format ไทยเดิมไว้ใน users table แต่ส่ง E.164 ไปให้ auth เท่านั้น
    const authPhone = toE164(phone);

    // 1) create REAL Supabase Auth user (id ใช้เป็น PK ของ users table จริงด้วย)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password: authPassword,
        phone: authPhone,
        email_confirm: true,
        phone_confirm: false,
        user_metadata: { full_name: fullName, role },
      });

    if (authError) {
      // ถ้ามีอยู่แล้ว ใช้ user เดิมแทน error
      if (authError.code === "user_already_exists" || /already/i.test(authError.message)) {
        const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
        const found = existing?.users.find(
          (u) => u.email === authEmail.toLowerCase() || u.phone === phone?.replace(/\D/g, "")
        );
        if (found) {
          await upsertProfile(found.id, { email: authEmail, phone, firstName, lastName, role });
          return NextResponse.json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ (ผู้ใช้เดิม)",
            user: toUser(found.id, authEmail, phone, firstName, lastName, role),
            token: makeToken(found.id),
          });
        }
      }
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    const authUser = authData?.user;

    if (authUser) {
      await upsertProfile(
        authUser.id,
        { email: authEmail, phone, firstName, lastName, role }
      );
      return NextResponse.json({
        success: true,
        message: "ลงทะเบียนผู้ใช้งานสำเร็จ",
        user: toUser(authUser.id, authEmail, phone, firstName, lastName, role),
        token: makeToken(authUser.id),
      });
    }

    return NextResponse.json(
      { success: false, message: "สร้างผู้ใช้ไม่สำเร็จ" },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

async function upsertProfile(
  id: string,
  p: { email: string; phone?: string; firstName: string; lastName: string; role: string }
) {
  const { error } = await supabaseServer.from("users").upsert(
    {
      id,
      email: p.email,
      phone: p.phone || null,
      first_name: p.firstName,
      last_name: p.lastName,
      role: p.role,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

function toUser(
  id: string,
  email: string,
  phone: string | undefined,
  firstName: string,
  lastName: string,
  role: string
) {
  return { id, email, phone: phone || null, first_name: firstName, last_name: lastName, role, status: "active" };
}

function makeToken(userId: string) {
  return "jumbo_" + userId;
}

// แปลงเบอร์โทรทั่วไป (0xx-xxx-xxxx) เป็น E.164 (+66xxxxxxxxx) สำหรับ Supabase Auth
function toE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+66${digits.slice(1)}`;
  return `+${digits}`;
}