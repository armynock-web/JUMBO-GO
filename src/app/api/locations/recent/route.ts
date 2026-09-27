import { NextRequest, NextResponse } from "next/server";
import { getTokenUserId } from "@/lib/request-auth";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const userId = getTokenUserId(req);
    if (!userId) {
      return NextResponse.json({ success: true, locations: [] });
    }

    const list = await JumboRepository.getSavedLocations(userId);
    return NextResponse.json({ success: true, locations: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}