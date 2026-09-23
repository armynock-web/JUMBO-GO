import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const status = body.status || "in_transit";

    const updated = await JumboRepository.updateBookingStatus(id, status);

    return NextResponse.json({
      success: true,
      message: `อัปเดตสถานะงานเป็น ${status} สำเร็จ`,
      status,
      booking: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
