import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { matchVehicleType, calculateFare } from "@/lib/pricing";

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
    const matched = matchVehicleType(vehicleType, dbTypes);

    if (!matched || matched.is_active === false) {
      return NextResponse.json(
        { success: false, message: `ไม่พบประเภทยานพาหนะ "${vehicleType}"` },
        { status: 404 }
      );
    }

    const computed = calculateFare({
      baseFare: matched.base_fare,
      perKm: matched.price_per_km,
      distanceKm,
      hasHelper,
      expressway,
    });

    return NextResponse.json({
      success: true,
      source: "database",
      vehicleType,
      vehicleName: matched.name,
      distanceKm,
      baseFare: matched.base_fare,
      perKm: matched.price_per_km,
      distanceFare: computed.distanceFare,
      extraHelperFee: computed.extraHelperFee,
      expresswayFee: computed.expresswayFee,
      totalFare: computed.totalFare,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}