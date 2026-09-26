import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

const ALLOWED_STATUSES = new Set([
  "going_to_pickup",
  "arrived_pickup",
  "picked_up",
  "in_transit",
  "arrived_dropoff",
  "completed",
]);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const status = String(body.status || "");

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `สถานะไม่ถูกต้อง (อนุญาต: ${[...ALLOWED_STATUSES].join(", ")})`,
        },
        { status: 400 }
      );
    }

    const updated = await JumboRepository.updateBookingStatus(
      id,
      status as "in_transit"
    );

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