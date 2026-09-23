import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const list = await JumboRepository.getSavedLocations(
      "11111111-1111-1111-1111-111111111006"
    );
    return NextResponse.json({ success: true, locations: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
