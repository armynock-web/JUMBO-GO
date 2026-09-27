import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const stats = await JumboRepository.getAdminStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}