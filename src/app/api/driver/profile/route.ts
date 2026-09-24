import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { resolveDriverId } from "@/lib/request-auth";

export async function GET(req: NextRequest) {
  try {
    const driverId = await resolveDriverId(
      req,
      req.nextUrl.searchParams.get("driverId")
    );
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const driver = await JumboRepository.getDriverById(driverId);
    if (!driver) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลคนขับ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      driver,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}