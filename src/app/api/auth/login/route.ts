import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone = "081-234-5678", email, password, role } = body;

    let user: any = null;
    try {
      if (phone) {
        user = await JumboRepository.getUserByPhone(phone);
      }
    } catch {
      // ignore
    }

    // Role-based preconfigured initial accounts
    if (!user) {
      if (role === "admin" || email?.includes("admin")) {
        user = {
          id: "11111111-1111-1111-1111-111111111001",
          email: "admin@jumbogo.com",
          phone: "080-000-0001",
          first_name: "ผู้ดูแลระบบ",
          last_name: "ส่วนกลาง",
          role: "admin",
          status: "active",
        };
      } else if (role === "driver" || phone === "081-234-5678") {
        user = {
          id: "11111111-1111-1111-1111-111111111002",
          email: "somchai@jumbogo.com",
          phone: "081-234-5678",
          first_name: "สมชาย",
          last_name: "ใจดี",
          role: "driver",
          status: "active",
        };
      } else {
        user = {
          id: "11111111-1111-1111-1111-111111111006",
          email: "somying@jumbogo.com",
          phone: phone || "082-345-6789",
          first_name: "สมหญิง",
          last_name: "ใจเย็น",
          role: "customer",
          status: "active",
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user,
      token: "jumbo_token_" + Buffer.from(user.phone || "").toString("base64"),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
