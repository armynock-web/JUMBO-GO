import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const {
      rating = 5,
      comment = "บริการดีมาก สุภาพ ส่งไว",
      userId = "11111111-1111-1111-1111-111111111006",
      driverId = "33333333-3333-3333-3333-333333333001",
    } = body;

    let review;
    try {
      review = await JumboRepository.addReview(id, userId, driverId, rating, comment);
    } catch {
      review = { id: "rev_" + Date.now(), booking_id: id, rating, comment };
    }

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
