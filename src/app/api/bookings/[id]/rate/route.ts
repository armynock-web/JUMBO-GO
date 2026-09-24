import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { getTokenUserId } from "@/lib/request-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));

    const userId = getTokenUserId(req) || (body.userId as string | undefined);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนผู้ใช้ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const rating = Number(body.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "คะแนนต้องอยู่ระหว่าง 1-5" },
        { status: 400 }
      );
    }
    const comment = typeof body.comment === "string" ? body.comment : undefined;

    const booking = await JumboRepository.getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "ไม่พบรายการจอง" },
        { status: 404 }
      );
    }
    if (!booking.driver_id) {
      return NextResponse.json(
        { success: false, message: "รายการนี้ยังไม่มีคนขับที่สามารถให้คะแนนได้" },
        { status: 422 }
      );
    }

    const review = await JumboRepository.addReview(
      id,
      userId,
      booking.driver_id,
      rating,
      comment
    );

    return NextResponse.json({
      success: true,
      message: "บันทึกรีวิวสำเร็จ",
      review,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}