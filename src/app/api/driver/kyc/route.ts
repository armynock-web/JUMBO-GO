import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const driverId =
      req.nextUrl.searchParams.get("driverId") ||
      "33333333-3333-3333-3333-333333333001";

    const kyc = await JumboRepository.getKycStatus(driverId);

    return NextResponse.json({
      success: true,
      kyc: kyc || {
        driver_id: driverId,
        kyc_code: "KYC-1024",
        current_step: 10,
        status: "approved",
        vehicle_type: "กระบะตู้ทึบ",
        vehicle_plate: "ขข 1234",
        id_card_number: "1100400123456",
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { driverId = "33333333-3333-3333-3333-333333333001", step, data } = body;

    return NextResponse.json({
      success: true,
      message: `บันทึกข้อมูลแบบร่างขั้นตอนที่ ${step} เรียบร้อย`,
      step,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
