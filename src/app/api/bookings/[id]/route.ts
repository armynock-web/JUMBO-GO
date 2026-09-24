import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await JumboRepository.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "ไม่พบรายการจอง" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}