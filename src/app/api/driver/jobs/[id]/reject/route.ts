import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "ไม่สะดวกรับงานในขณะนี้";

    return NextResponse.json({
      success: true,
      message: "ปฏิเสธงานเรียบร้อย",
      jobId: id,
      reason,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
