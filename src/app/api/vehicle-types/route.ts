import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET() {
  try {
    const list = await JumboRepository.getVehicleTypes();
    if (!list || list.length === 0) {
      return NextResponse.json(
        { success: false, message: "ยังไม่มีประเภทยานพาหนะในระบบ" },
        { status: 404 }
      );
    }

    const mapped = list.map((item) => {
      let typeKey = "PICKUP";
      const id = item.id.toLowerCase();
      if (id.includes("box")) typeKey = "CLOSED_PICKUP";
      else if (id.includes("fence") || id.includes("cage")) typeKey = "CAGE_PICKUP";
      else if (id.includes("jumbo")) typeKey = "JUMBO";
      else if (id.includes("6w") || id.includes("six")) typeKey = "SIX_WHEEL";

      return {
        id: item.id,
        typeKey,
        name: item.name,
        basePrice: item.base_fare,
        perKm: item.price_per_km,
        capacity: `${item.capacity_kg} กก.`,
        dimension: item.dimension_text ?? "",
        desc: item.description ?? "",
        popular: item.popular ?? false,
        isActive: item.is_active ?? true,
      };
    });

    return NextResponse.json({ success: true, source: "database", vehicles: mapped });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}