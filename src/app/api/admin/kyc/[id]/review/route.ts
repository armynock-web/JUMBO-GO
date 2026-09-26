import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const status = body.status === "approved" ? "approved" : "rejected";
    const rejectionReason = body.rejectionReason ? String(body.rejectionReason) : undefined;

    // resolve driver_id จริง: id ที่ส่งมาอาจเป็น kyc row id หรือ driver_id ก็ได้
    const list = await JumboRepository.getKycList();
    const byRowId = list.find((k) => k.id === id);
    const driverId = byRowId?.driver_id ?? id;

    const kyc = await JumboRepository.reviewKyc(driverId, status, rejectionReason);

    return NextResponse.json({
      success: true,
      message:
        status === "approved"
          ? "อนุมัติ KYC คนขับเรียบร้อย คนขับสามารถเริ่มเปิดรับงานได้ทันที"
          : "ปฏิเสธเอกสาร KYC เรียบร้อยและส่งแจ้งเตือนให้คนขับแก้ไข",
      kycId: id,
      driverId,
      status,
      rejectionReason: rejectionReason || null,
      reviewedAt: new Date().toISOString(),
      kyc,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}