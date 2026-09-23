import { NextRequest, NextResponse } from "next/server";
import { VEHICLES, VehicleType } from "@/lib/brand";
import { JumboRepository } from "@/lib/supabase/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      vehicleType = "PICKUP",
      distanceKm = 12.5,
      hasHelper = false,
      expressway = false,
    } = body;

    // Fetch live rates from vehicle_types table
    const dbTypes = await JumboRepository.getVehicleTypes();
    let baseFare = 350;
    let perKm = 15;
    let vehicleName = "รถกระบะตอนเดียว";

    if (dbTypes && dbTypes.length > 0) {
      // Find matching type by id or name
      const matched = dbTypes.find((t: any) => {
        const tid = (t.id || "").toLowerCase();
        const vKey = (vehicleType as string).toLowerCase();
        if (vKey === "pickup" && tid === "pickup") return true;
        if (vKey === "closed_pickup" && (tid.includes("box") || tid.includes("closed"))) return true;
        if (vKey === "cage_pickup" && (tid.includes("fence") || tid.includes("cage"))) return true;
        if (vKey === "jumbo" && tid.includes("jumbo")) return true;
        if (vKey === "six_wheel" && (tid.includes("6w") || tid.includes("six"))) return true;
        return tid === vKey;
      });

      if (matched) {
        baseFare = matched.base_fare ?? matched.base_price ?? 350;
        perKm = matched.price_per_km ?? 15;
        vehicleName = matched.name ?? matched.name_th ?? vehicleName;
      }
    } else {
      // Fallback
      const vInfo =
        VEHICLES.find(
          (v) =>
            v.type === vehicleType ||
            v.type.toLowerCase() === (vehicleType as string).toLowerCase()
        ) || VEHICLES[0];
      baseFare = vInfo.basePrice;
      perKm = vInfo.perKm;
      vehicleName = vInfo.name;
    }

    const distanceFare = Math.round(distanceKm * perKm);
    const extraHelperFee = hasHelper ? 150 : 0;
    const expresswayFee = expressway ? 50 : 0;
    const totalFare = baseFare + distanceFare + extraHelperFee + expresswayFee;

    return NextResponse.json({
      success: true,
      source: "database",
      vehicleType,
      vehicleName,
      distanceKm,
      baseFare,
      perKm,
      distanceFare,
      extraHelperFee,
      expresswayFee,
      totalFare,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
