import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await JumboRepository.markNotificationRead(id);

    return NextResponse.json({
      success: true,
      message: "ทำเครื่องหมายอ่านแล้วเรียบร้อย",
      notification: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
