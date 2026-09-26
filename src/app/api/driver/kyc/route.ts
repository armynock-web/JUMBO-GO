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

    const kyc = await JumboRepository.getKycStatus(driverId);

    return NextResponse.json({
      success: true,
      kyc: kyc ?? null,
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
    const driverId = await resolveDriverId(
      req,
      (await req.json().catch(() => ({}))).driverId
    );
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const step = Number(body.step);
    const fields = (body.data || {}) as Record<string, unknown>;

    const kyc = await JumboRepository.upsertKyc(driverId, {
      step_completed: Number.isFinite(step) ? step : undefined,
      ...pickKnownKycFields(fields),
    });

    return NextResponse.json({
      success: true,
      message: `บันทึกข้อมูลแบบร่างขั้นตอนที่ ${step} เรียบร้อย`,
      step,
      kyc,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

const KYC_FIELDS = [
  "id_card_number",
  "id_card_image_url",
  "driving_license_number",
  "driving_license_image_url",
  "vehicle_registration_image_url",
  "act_insurance_image_url",
  "bank_name",
  "bank_account_number",
  "bank_account_name",
] as const;

function pickKnownKycFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of KYC_FIELDS) {
    const val = body[key];
    if (typeof val === "string" && val.trim() !== "") out[key] = val;
  }
  return out;
}