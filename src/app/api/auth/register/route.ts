import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, phone, role = "customer", email } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อและเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ") || "ไม่ระบุนามสกุล";

    let user;
    try {
      user = await JumboRepository.getUserByPhone(phone);
    } catch {
      // ignore
    }

    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        email: email || `${phone.replace(/\D/g, "")}@jumbogo.local`,
        phone,
        first_name: firstName,
        last_name: lastName,
        role,
        status: "active",
      };
    }

    return NextResponse.json({
      success: true,
      message: "ลงทะเบียนผู้ใช้งานสำเร็จ",
      user,
      token: "jumbo_token_" + Buffer.from(phone).toString("base64"),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
