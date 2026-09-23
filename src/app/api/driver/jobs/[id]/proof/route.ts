import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { proofUrl = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d", signature } = body;

    return NextResponse.json({
      success: true,
      message: "บันทึกรูปถ่ายหลักฐานส่งมอบสินค้าและลายเซ็นเรียบร้อย",
      jobId: id,
      proofUrl,
      signature: signature ? "signed" : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
