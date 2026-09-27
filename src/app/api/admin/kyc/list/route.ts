import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const kycList = await JumboRepository.getKycList();

    return NextResponse.json({
      success: true,
      kycList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}