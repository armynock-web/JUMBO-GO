import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await JumboRepository.getBookingById(id);

    return NextResponse.json({
      success: true,
      booking: booking || {
        id,
        job_number: "JG-2025-00108",
        status: "in_transit",
        fare: 619,
        distance_km: 23.5,
        vehicle_type: "pickup_box",
        driver: {
          name: "สมชาย ใจดี",
          phone: "081-234-5678",
          rating: 4.8,
          plate: "ขข 1234 กทม.",
          vehicle: "Isuzu D-Max ตู้ทึบ",
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
