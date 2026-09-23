import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { driverId = "33333333-3333-3333-3333-333333333001", lat, lng } = body;

    return NextResponse.json({
      success: true,
      message: "อัปเดตพิกัด GPS เรียบร้อย",
      driverId,
      lat: lat || 13.7225,
      lng: lng || 100.5289,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
