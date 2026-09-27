import { NextRequest } from "next/server";
import { describe, it, expect } from "vitest";
import { GET as getVehicleTypes } from "@/app/api/vehicle-types/route";
import { POST as postEstimate } from "@/app/api/pricing/estimate/route";

const BASE = "http://localhost/api";

describe("GET /api/vehicle-types", () => {
  it("returns live vehicles from database with normalized fields", async () => {
    const res = await getVehicleTypes();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.source).toBe("database");
    expect(Array.isArray(body.vehicles)).toBe(true);
    expect(body.vehicles.length).toBeGreaterThan(0);
    expect(body.vehicles[0]).toHaveProperty("basePrice");
    expect(body.vehicles[0]).toHaveProperty("perKm");
    expect(body.vehicles[0]).toHaveProperty("typeKey");
  });
});

describe("POST /api/pricing/estimate", () => {
  it("returns 400 for zero/negative distance", async () => {
    const req = new NextRequest(`${BASE}/pricing/estimate`, {
      method: "POST",
      body: JSON.stringify({ vehicleType: "pickup", distanceKm: 0 }),
    });
    const res = await postEstimate(req);
    expect(res.status).toBe(400);
  });

  it("computes fare from real vehicle_types (pickup, 10km)", async () => {
    const req = new NextRequest(`${BASE}/pricing/estimate`, {
      method: "POST",
      body: JSON.stringify({ vehicleType: "pickup", distanceKm: 10 }),
    });
    const res = await postEstimate(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.vehicleName).toBeTruthy();
    expect(body.distanceFare).toBe(body.perKm * 10);
    expect(body.totalFare).toBe(body.baseFare + body.distanceFare);
  });

  it("adds helper + expressway fees when requested", async () => {
    const req = new NextRequest(`${BASE}/pricing/estimate`, {
      method: "POST",
      body: JSON.stringify({ vehicleType: "jumbo", distanceKm: 20, hasHelper: true, expressway: true }),
    });
    const res = await postEstimate(req);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.extraHelperFee).toBe(150);
    expect(body.expresswayFee).toBe(50);
    expect(body.totalFare).toBe(body.baseFare + body.distanceFare + 150 + 50);
  });

  it("returns 404 for unknown vehicle type", async () => {
    const req = new NextRequest(`${BASE}/pricing/estimate`, {
      method: "POST",
      body: JSON.stringify({ vehicleType: "helicopter", distanceKm: 10 }),
    });
    const res = await postEstimate(req);
    expect(res.status).toBe(404);
  });
});