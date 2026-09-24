import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = (body.reason as string | undefined) || "ลูกค้ายกเลิกคำขอ";

    const updated = await JumboRepository.updateBooking(id, {
      status: "cancelled",
      cancel_reason: reason,
    });

    return NextResponse.json({
      success: true,
      message: "ยกเลิกคำขอจองเรียบร้อย",
      status: "cancelled",
      reason,
      booking: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
