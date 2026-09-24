import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const pricing = await JumboRepository.getVehicleTypes();

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const id = String(body.code || body.id || "");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ต้องระบุ code (id) ของประเภทยานพาหนะ" },
        { status: 400 }
      );
    }

    const fields: Record<string, unknown> = {};
    if (typeof body.baseFare === "number") fields.base_fare = body.baseFare;
    if (typeof body.perKm === "number") fields.price_per_km = body.perKm;
    if (typeof body.name === "string") fields.name = body.name;
    if (typeof body.capacityKg === "number") fields.capacity_kg = body.capacityKg;
    if (typeof body.isActive === "boolean") fields.is_active = body.isActive;

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลให้ปรับปรุง" },
        { status: 400 }
      );
    }

    const updated = await JumboRepository.updateVehicleType(id, fields);

    return NextResponse.json({
      success: true,
      message: `ปรับปรุงเรทราคาประเภทรถ ${id} เรียบร้อย`,
      updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}