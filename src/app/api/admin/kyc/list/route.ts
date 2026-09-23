import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kycList = [
      {
        id: "44444444-4444-4444-4444-444444444003",
        kyc_code: "KYC-1022",
        driver_name: "อนุชา รักไทย",
        phone: "089-999-9999",
        vehicle_type: "จัมโบ้",
        plate_number: "ขค 9012 นนทบุรี",
        current_step: 8,
        status: "pending",
        submitted_at: "1 ชม. ที่แล้ว",
      },
      {
        id: "44444444-4444-4444-4444-444444444004",
        kyc_code: "KYC-1021",
        driver_name: "ประยุทธ สดใส",
        phone: "085-111-2222",
        vehicle_type: "กระบะ",
        plate_number: "กง 3456 ปทุมธานี",
        current_step: 9,
        status: "rejected",
        submitted_at: "2 ชม. ที่แล้ว",
        rejection_reason: "รูปถ่ายใบขับขี่สะท้อนแสง ไม่ชัดเจน",
      },
      {
        id: "44444444-4444-4444-4444-444444444001",
        kyc_code: "KYC-1024",
        driver_name: "สมชาย ใจดี",
        phone: "081-234-5678",
        vehicle_type: "กระบะตู้ทึบ",
        plate_number: "ขข 1234 กทม.",
        current_step: 10,
        status: "approved",
        submitted_at: "5 วันที่แล้ว",
      },
    ];

    return NextResponse.json({
      success: true,
      kycList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
