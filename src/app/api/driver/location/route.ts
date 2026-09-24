import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { resolveDriverId } from "@/lib/request-auth";

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const driverId = await resolveDriverId(req, body.driverId as string | undefined);
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { success: false, message: "ต้องระบุ lat/lng ที่ถูกต้อง" },
        { status: 400 }
      );
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return NextResponse.json(
        { success: false, message: "พิกัด lat/lng อยู่นอกขอบเขตที่กำหนด" },
        { status: 400 }
      );
    }

    const driver = await JumboRepository.updateDriverLocation(driverId, lat, lng);

    return NextResponse.json({
      success: true,
      message: "อัปเดตพิกัด GPS เรียบร้อย",
      driverId,
      lat: driver.current_location_lat,
      lng: driver.current_location_lng,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}