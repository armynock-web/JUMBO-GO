import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const reason = body.reason ? String(body.reason) : null;

    const booking = await JumboRepository.rejectAssignment(id);
    if (reason) {
      await JumboRepository.updateBooking(id, { cancel_reason: reason });
    }

    return NextResponse.json({
      success: true,
      message: "ปฏิเสธงานเรียบร้อย งานกลับเข้าสู่ระบบ",
      jobId: id,
      reason,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}