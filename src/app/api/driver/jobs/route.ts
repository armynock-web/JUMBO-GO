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

    // งานที่รอคนขับรับ (สถานะ searching) ตามขนาดรถของคนขับ
    const vehicleTypes = [driver.vehicle_id]
      .filter(Boolean)
      .map(() => driver.vehicles?.[0]?.type || null)
      .filter((t): t is string => !!t);

    const allJobs = await JumboRepository.getAvailableJobs();

    let jobs = allJobs;
    if (vehicleTypes.length > 0) {
      jobs = allJobs.filter((b) => vehicleTypes.includes(b.vehicle_type));
    }

    // คำนวณระยะทางจากคนขับถึงจุดรับ (ใช้พิกัดจริง ถ้ามี)
    const driverLat = driver.current_location_lat;
    const driverLng = driver.current_location_lng;
    const jobsWithDistance = jobs.map((b) => {
      const pickup = b.booking_locations?.find((l) => l.type === "pickup");
      let distanceFromDriverKm: number | null = null;
      if (driverLat != null && driverLng != null && pickup) {
        distanceFromDriverKm = Math.round(
          haversineKm(driverLat, driverLng, pickup.lat, pickup.lng) * 10
        ) / 10;
      }
      return {
        ...b,
        distance_from_driver_km: distanceFromDriverKm,
      };
    });

    return NextResponse.json({ success: true, jobs: jobsWithDistance });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}