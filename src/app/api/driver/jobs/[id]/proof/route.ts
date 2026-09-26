import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { resolveDriverId } from "@/lib/request-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));

    const driverId = await resolveDriverId(req, body.driverId as string | undefined);
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const proofUrl = String(body.proofUrl || body.photo_url || "");
    if (!proofUrl) {
      return NextResponse.json(
        { success: false, message: "ต้องระบุ proofUrl (url รูปหลักฐาน)" },
        { status: 400 }
      );
    }

    const proof = await JumboRepository.createDeliveryProof({
      booking_id: id,
      driver_id: driverId,
      proof_type: String(body.proofType || "delivery"),
      photo_url: proofUrl,
      note: body.note ? String(body.note) : (body.signature ? "signed" : null),
    });

    return NextResponse.json({
      success: true,
      message: "บันทึกรูปถ่ายหลักฐานส่งมอบสินค้าเรียบร้อย",
      jobId: id,
      proof,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}