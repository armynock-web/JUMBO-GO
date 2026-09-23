import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { status = "approved", rejectionReason } = body;

    return NextResponse.json({
      success: true,
      message:
        status === "approved"
          ? "อนุมัติ KYC คนขับเรียบร้อย คนขับสามารถเริ่มเปิดรับงานได้ทันที"
          : "ปฏิเสธเอกสาร KYC เรียบร้อยและส่งแจ้งเตือนให้คนขับแก้ไข",
      kycId: id,
      status,
      rejectionReason: rejectionReason || null,
      reviewedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
