import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const roleParam = req.nextUrl.searchParams.get("role") || "user";
    const role = (["user", "customer", "driver", "admin"].includes(roleParam) ? roleParam : "user") as "user" | "customer" | "driver" | "admin";
    const normalizedRole: "user" | "driver" | "admin" = role === "customer" ? "user" : role;
    const notifications = await JumboRepository.getNotificationsByRole(normalizedRole);

    return NextResponse.json({
      success: true,
      role: normalizedRole,
      notifications,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
