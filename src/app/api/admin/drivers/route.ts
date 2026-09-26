import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const drivers = await JumboRepository.getDrivers();

    return NextResponse.json({
      success: true,
      count: drivers?.length ?? 0,
      drivers: drivers ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
