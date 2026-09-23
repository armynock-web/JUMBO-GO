import { NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { VEHICLES } from "@/lib/brand";

export async function GET() {
  try {
    const list = await JumboRepository.getVehicleTypes();
    if (list && list.length > 0) {
      // Map live database rows into standardized shape for frontend
      const mapped = list.map((item: any) => {
        // Handle both schema naming variations
        const basePrice = item.base_fare ?? item.base_price ?? 350;
        const perKm = item.price_per_km ?? 15;
        const name = item.name ?? item.name_th ?? "รถขนของ";
        const desc = item.description ?? "";
        const capacity = item.capacity_kg ? `${item.capacity_kg} กก.` : (item.capacity_ton ? `${item.capacity_ton} ตัน` : "1.5 ตัน");
        const dimension = item.dimension_text ?? item.dimensions ?? "";
        const id = item.id;
        
        // Determine type key for brand mapping
        let typeKey = "PICKUP";
        if (id.includes("box")) typeKey = "CLOSED_PICKUP";
        else if (id.includes("fence") || id.includes("cage")) typeKey = "CAGE_PICKUP";
        else if (id.includes("jumbo")) typeKey = "JUMBO";
        else if (id.includes("6w") || id.includes("six")) typeKey = "SIX_WHEEL";

        return {
          id,
          typeKey,
          name,
          basePrice,
          perKm,
          capacity,
          dimension,
          desc,
          popular: item.popular ?? false,
          isActive: item.is_active ?? true,
        };
      });
      return NextResponse.json({ success: true, source: "database", vehicles: mapped });
    }

    // Fallback only if database returned empty
    const fallback = VEHICLES.map((v) => ({
      id: v.type.toLowerCase(),
      typeKey: v.type,
      name: v.name,
      basePrice: v.basePrice,
      perKm: v.perKm,
      capacity: v.capacity,
      dimension: "",
      desc: v.desc,
      popular: v.type === "CLOSED_PICKUP" || v.type === "JUMBO",
      isActive: true,
    }));
    return NextResponse.json({ success: true, source: "fallback", vehicles: fallback });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
