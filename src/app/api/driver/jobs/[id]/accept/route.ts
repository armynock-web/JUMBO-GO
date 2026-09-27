import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { resolveDriverId } from "@/lib/request-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const driverId = await resolveDriverId(req, body.driverId as string | undefined);
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const booking = await JumboRepository.assignDriver(id, driverId);

    return NextResponse.json({
      success: true,
      message: "รับงานเรียบร้อยแล้ว เตรียมเดินทางไปยังจุดรับ",
      status: booking.status,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}