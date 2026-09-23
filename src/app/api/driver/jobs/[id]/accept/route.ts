import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await JumboRepository.updateBookingStatus(id, "driver_assigned");

    return NextResponse.json({
      success: true,
      message: "รับงานเรียบร้อยแล้ว เตรียมเดินทางไปยังจุดรับ",
      status: "driver_assigned",
      booking: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
