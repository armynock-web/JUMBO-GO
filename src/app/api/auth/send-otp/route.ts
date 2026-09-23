import { NextRequest, NextResponse } from "next/server";

// In-memory OTP storage for internal OTP generation (Auto-fill support)
// No third-party SMS service used per project requirement
export const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = body.phone || "081-234-5678";

    // Generate internal 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    otpStore.set(phone.replace(/\D/g, ""), { code, expiresAt });

    return NextResponse.json({
      success: true,
      otp: code,
      phone,
      expiresIn: 300,
      message: "สร้างรหัส OTP 6 หลักในระบบเรียบร้อย (Internal Auto-fill)",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
