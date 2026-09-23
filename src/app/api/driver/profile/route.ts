import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const driverId =
      req.nextUrl.searchParams.get("driverId") ||
      "33333333-3333-3333-3333-333333333001";
    const driver = await JumboRepository.getDriverById(driverId);

    return NextResponse.json({
      success: true,
      driver: driver || {
        id: driverId,
        driver_code: "JG-00108",
        first_name: "สมชาย",
        last_name: "ใจดี",
        phone: "081-234-5678",
        is_online: true,
        rating_avg: 4.8,
        rating_count: 128,
        total_earnings: 38400,
        bank_name: "กสิกรไทย",
        bank_account_number: "123-4-56789-0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
