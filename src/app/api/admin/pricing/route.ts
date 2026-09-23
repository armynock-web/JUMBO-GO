import { NextRequest, NextResponse } from "next/server";
import { VEHICLES } from "@/lib/brand";

export async function GET() {
  return NextResponse.json({
    success: true,
    pricing: VEHICLES.map((v) => ({
      code: v.type,
      name: v.name,
      basePrice: v.basePrice,
      perKm: v.perKm,
      capacity: v.capacity,
    })),
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, basePrice, perKm } = body;

    return NextResponse.json({
      success: true,
      message: `ปรับปรุงเรทราคาประเภทรถ ${code} เรียบร้อย`,
      updated: { code, basePrice, perKm },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
