import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const availableJobs = [
      {
        id: "55555555-5555-5555-5555-555555555001",
        job_number: "JG-2025-00108",
        status: "in_transit",
        pickup_address: "บางนา กม.4 ซอย 12",
        dropoff_address: "สนามบินสุวรรณภูมิ คลังสินค้า 3",
        distance_km: 23.5,
        fare: 619.0,
        driver_earning: 526.0,
        vehicle_type: "กระบะตู้ทึบ",
        items_note: "กล่องเอกสาร 15 ลัง + อุปกรณ์ไอที",
        distance_from_driver_km: 1.2,
      },
      {
        id: "55555555-5555-5555-5555-555555555009",
        job_number: "JG-2025-00109",
        status: "searching",
        pickup_address: "สาทร สแควร์ ชั้น 18",
        dropoff_address: "ไอคอนสยาม ประตู 4",
        distance_km: 12.0,
        fare: 350.0,
        driver_earning: 297.5,
        vehicle_type: "กระบะ",
        items_note: "โต๊ะทำงาน 1 ตัว และเก้าอี้สำนักงาน",
        distance_from_driver_km: 4.2,
      },
    ];

    return NextResponse.json({
      success: true,
      jobs: availableJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
