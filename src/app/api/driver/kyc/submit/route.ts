import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const driverId = body.driverId || "33333333-3333-3333-3333-333333333003";

    return NextResponse.json({
      success: true,
      message: "ส่งเอกสาร KYC ครบ 10 ขั้นตอนเรียบร้อยแล้ว กรุณารอผลตรวจภายใน 24 ชม.",
      driverId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
