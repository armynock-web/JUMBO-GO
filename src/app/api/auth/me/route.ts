import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Return current authenticated profile or default mock profile based on query/header
  const role = req.nextUrl.searchParams.get("role") || "customer";

  const user = {
    id: role === "admin" ? "11111111-1111-1111-1111-111111111001" : (role === "driver" ? "11111111-1111-1111-1111-111111111002" : "11111111-1111-1111-1111-111111111006"),
    phone: role === "admin" ? "080-000-0001" : (role === "driver" ? "081-234-5678" : "082-345-6789"),
    first_name: role === "admin" ? "ผู้ดูแลระบบ" : (role === "driver" ? "สมชาย" : "สมหญิง"),
    last_name: role === "admin" ? "ส่วนกลาง" : (role === "driver" ? "ใจดี" : "ใจเย็น"),
    role,
    status: "active",
  };

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
