import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const users = await JumboRepository.getUsers();

    return NextResponse.json({
      success: true,
      count: users?.length ?? 0,
      users: users ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
