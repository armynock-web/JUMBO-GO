import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const userId =
      req.nextUrl.searchParams.get("userId") ||
      "11111111-1111-1111-1111-111111111006";
    const bookings = await JumboRepository.getBookingsByUser(userId);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pickup,
      dropoff,
      vehicleType = "PICKUP",
      fare = 619,
      baseFare = 350,
      distanceFare = 219,
      distanceKm = 15.5,
      extraHelperFee = 0,
      expresswayFee = 50,
      paymentMethod = "promptpay",
      senderName = "สมหญิง ใจเย็น",
      senderPhone = "082-345-6789",
      senderNote = "",
      receiverName = "ผู้รับปลายทาง",
      receiverPhone = "081-999-8888",
      receiverNote = "",
    } = body;

    const jobNumber =
      "JG-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(10000 + Math.random() * 90000);

    // Determine valid user_id from session or default test user in database
    const validUserId = body.userId || "a9dce7bb-a9cf-4f21-874a-129b0138fd56";

    const bookingPayload = {
      user_id: validUserId,
      job_number: jobNumber,
      vehicle_type: vehicleType.toLowerCase(),
      status: "searching",
      fare: Math.round(fare),
      base_fare: Math.round(baseFare),
      distance_fare: Math.round(distanceFare),
      extra_helper_fee: Math.round(extraHelperFee),
      expressway_fee: Math.round(expresswayFee),
      distance_km: Number(distanceKm),
      duration_min: Math.round(Number(distanceKm) * 2.2),
      sender_name: senderName || "ลูกค้า JUMBO GO",
      sender_phone: senderPhone || "082-345-6789",
      sender_note: senderNote || pickup?.sub || "",
      receiver_name: receiverName || dropoff?.main || "ผู้รับสินค้า",
      receiver_phone: receiverPhone || "081-999-8888",
      receiver_note: receiverNote || dropoff?.sub || "",
    };

    const booking = await JumboRepository.createBooking(bookingPayload);

    return NextResponse.json({
      success: true,
      message: "สร้างรายการจองรถในระบบสำเร็จ",
      jobNumber,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
