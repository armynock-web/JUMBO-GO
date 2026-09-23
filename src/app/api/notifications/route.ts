import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const roleParam = req.nextUrl.searchParams.get("role") || "customer";
    const role = (["driver", "customer", "admin"].includes(roleParam) ? roleParam : "customer") as "driver" | "customer" | "admin";
    const notifications = await JumboRepository.getNotificationsByRole(role);

    return NextResponse.json({
      success: true,
      role,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
