/**
 * JUMBO GO - Pricing Calculation (pure functions)
 * - คำนวณค่าโดยสารจากอัตราจริงใน vehicle_types
 * - แยกออกจาก route เพื่อให้ unit test ได้ตรงจุด (ARM-AES testability)
 */
import type { Database } from "./supabase/types";

export type VehicleTypeRow =
  Database["public"]["Tables"]["vehicle_types"]["Row"];

export const EXTRA_HELPER_FEE = 150;
export const EXPRESSWAY_FEE = 50;

/** map ประเภทรถจาก request ไป id จริงในตาราง vehicle_types */
export function matchVehicleType(
  vehicleType: string,
  dbTypes: VehicleTypeRow[]
): VehicleTypeRow | null {
  const v = vehicleType.toLowerCase();
  return (
    dbTypes.find((t) => {
      const tid = t.id.toLowerCase();
      if (v === "pickup" && tid === "pickup") return true;
      if (v === "closed_pickup" && (tid.includes("box") || tid.includes("closed"))) return true;
      if (v === "cage_pickup" && (tid.includes("fence") || tid.includes("cage"))) return true;
      if (v === "jumbo" && tid.includes("jumbo")) return true;
      if (v === "six_wheel" && (tid.includes("6w") || tid.includes("six"))) return true;
      return tid === v;
    }) ?? null
  );
}

/** คำนวณค่าโดยสารแบบ Deterministic — มี helper/expressway เป็น option */
export function calculateFare(params: {
  baseFare: number;
  perKm: number;
  distanceKm: number;
  hasHelper?: boolean;
  expressway?: boolean;
}) {
  const distanceFare = Math.round(params.distanceKm * params.perKm);
  const extraHelperFee = params.hasHelper ? EXTRA_HELPER_FEE : 0;
  const expresswayFee = params.expressway ? EXPRESSWAY_FEE : 0;
  const totalFare = params.baseFare + distanceFare + extraHelperFee + expresswayFee;
  return { distanceFare, extraHelperFee, expresswayFee, totalFare };
}

/** คำนวณระยะทาง (km) ระหว่างสองพิกัดด้วย Haversine */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}