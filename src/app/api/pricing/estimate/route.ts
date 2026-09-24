import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";

type EstimateInput = {
  vehicleType?: string;
  distanceKm?: number;
  hasHelper?: boolean;
  expressway?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body: EstimateInput = await req.json().catch(() => ({}));
    const vehicleType = String(body.vehicleType || "PICKUP").toLowerCase();
    const distanceKm = Number(body.distanceKm ?? 12.5);
    const hasHelper = Boolean(body.hasHelper);
    const expressway = Boolean(body.expressway);

    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      return NextResponse.json(
        { success: false, message: "ระยะทางต้องมากกว่า 0" },
        { status: 400 }
      );
    }

    const dbTypes = await JumboRepository.getVehicleTypes();
    const matched = dbTypes.find((t) => {
      const tid = t.id.toLowerCase();
      if (vehicleType === "pickup" && tid === "pickup") return true;
      if (vehicleType === "closed_pickup" && (tid.includes("box") || tid.includes("closed"))) return true;
      if (vehicleType === "cage_pickup" && (tid.includes("fence") || tid.includes("cage"))) return true;
      if (vehicleType === "jumbo" && tid.includes("jumbo")) return true;
      if (vehicleType === "six_wheel" && (tid.includes("6w") || tid.includes("six"))) return true;
      return tid === vehicleType;
    });

    if (!matched || matched.is_active === false) {
      return NextResponse.json(
        { success: false, message: `ไม่พบประเภทยานพาหนะ "${vehicleType}"` },
        { status: 404 }
      );
    }

    const baseFare = matched.base_fare;
    const perKm = matched.price_per_km;

    const distanceFare = Math.round(distanceKm * perKm);
    const extraHelperFee = hasHelper ? 150 : 0;
    const expresswayFee = expressway ? 50 : 0;
    const totalFare = baseFare + distanceFare + extraHelperFee + expresswayFee;

    return NextResponse.json({
      success: true,
      source: "database",
      vehicleType,
      vehicleName: matched.name,
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