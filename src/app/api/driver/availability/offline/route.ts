import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const driverId = body.driverId || "33333333-3333-3333-3333-333333333001";

    let updated;
    try {
      updated = await JumboRepository.setDriverOnline(driverId, false);
    } catch {
      updated = { id: driverId, is_online: false };
    }

    return NextResponse.json({
      success: true,
      message: "ปิดสถานะรับงานเรียบร้อย",
      isOnline: false,
      driver: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
