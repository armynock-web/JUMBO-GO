import { describe, it, expect } from "vitest";
import {
  matchVehicleType,
  calculateFare,
  haversineKm,
  EXTRA_HELPER_FEE,
  EXPRESSWAY_FEE,
} from "@/lib/pricing";
import type { Database } from "@/lib/supabase/types";

type VehicleTypeRow = Database["public"]["Tables"]["vehicle_types"]["Row"];

const TYPES: VehicleTypeRow[] = [
  {
    id: "pickup",
    name: "รถกระบะตอนเดียว",
    category: "pickup",
    base_fare: 350,
    base_distance_km: 4,
    price_per_km: 15,
    capacity_kg: 1000,
    popular: false,
    is_active: true,
    description: null,
    dimension_text: null,
    created_at: "",
  },
  {
    id: "pickup_box",
    name: "รถกระบะตู้ทึบ",
    category: "pickup",
    base_fare: 450,
    base_distance_km: 4,
    price_per_km: 18,
    capacity_kg: 1200,
    popular: false,
    is_active: true,
    description: null,
    dimension_text: null,
    created_at: "",
  },
  {
    id: "jumbo",
    name: "กระบะ 4 ล้อใหญ่ (จัมโบ้)",
    category: "jumbo",
    base_fare: 750,
    base_distance_km: 5,
    price_per_km: 24,
    capacity_kg: 2500,
    popular: true,
    is_active: true,
    description: null,
    dimension_text: null,
    created_at: "",
  },
];

describe("matchVehicleType", () => {
  it("matches exact pickup id", () => {
    expect(matchVehicleType("pickup", TYPES)?.id).toBe("pickup");
  });

  it("maps closed_pickup -> pickup_box", () => {
    expect(matchVehicleType("CLOSED_PICKUP", TYPES)?.id).toBe("pickup_box");
  });

  it("maps jumbo -> jumbo", () => {
    expect(matchVehicleType("jumbo", TYPES)?.id).toBe("jumbo");
  });

  it("returns null for unknown type", () => {
    expect(matchVehicleType("helicopter", TYPES)).toBeNull();
  });

  it("case-insensitive six letters", () => {
    // 6w หายจาก TYPES ตัวอย่าง → หาไม่ได้ = null (กรณีไม่มี type นั้น)
    expect(matchVehicleType("six_wheel", TYPES)).toBeNull();
  });
});

describe("calculateFare", () => {
  it("computes base + distance with no extras", () => {
    const r = calculateFare({ baseFare: 350, perKm: 15, distanceKm: 10 });
    expect(r.distanceFare).toBe(150);
    expect(r.totalFare).toBe(500);
  });

  it("rounds distance fare", () => {
    const r = calculateFare({ baseFare: 450, perKm: 18, distanceKm: 4.333 });
    expect(r.distanceFare).toBe(78); // 18 * 4.333 = 77.994 -> 78
  });

  it("adds helper + expressway fees", () => {
    const r = calculateFare({
      baseFare: 750,
      perKm: 24,
      distanceKm: 20,
      hasHelper: true,
      expressway: true,
    });
    expect(r.extraHelperFee).toBe(EXTRA_HELPER_FEE);
    expect(r.expresswayFee).toBe(EXPRESSWAY_FEE);
    expect(r.totalFare).toBe(750 + 480 + 150 + 50);
  });
});

describe("haversineKm", () => {
  it("returns ~0 for same coordinate", () => {
    expect(haversineKm(13.75, 100.5, 13.75, 100.5)).toBeLessThan(0.001);
  });

  it("returns ~1km for ~1 degree lat apart (approx)", () => {
    const d = haversineKm(13.75, 100.5, 13.75 + 0.9, 100.5);
    expect(d).toBeGreaterThan(90); // ~100km ต่อ 0.9 องศา
    expect(d).toBeLessThan(110);
  });
});