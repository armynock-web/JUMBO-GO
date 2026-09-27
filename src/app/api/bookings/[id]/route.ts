import { NextRequest, NextResponse } from "next/server";
import { getTokenUserId } from "@/lib/request-auth";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenUserId = getTokenUserId(req);
    if (!tokenUserId) {
      return NextResponse.json(
        { success: false, message: "ไม่ได้รับอนุญาต" },
        { status: 401 }
      );
    }
    const booking = await JumboRepository.getBookingById(id);

    if (!booking || booking.user_id !== tokenUserId) {
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