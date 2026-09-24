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

    const kyc = await JumboRepository.upsertKyc(driverId, {
      status: "pending",
      verified_at: null,
      verified_by: null,
      rejection_reason: null,
    });

    return NextResponse.json({
      success: true,
      message: "ส่งเอกสาร KYC เรียบร้อยแล้ว กรุณารอผลตรวจ",
      driverId,
      status: "pending",
      submittedAt: new Date().toISOString(),
      kyc,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}