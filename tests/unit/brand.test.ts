import { describe, it, expect } from "vitest";
import {
  BRAND,
  VEHICLES,
  PROVINCES,
  RECENT_LOCATIONS,
  FEATURE_HIGHLIGHTS,
  ONBOARDING_SLIDES,
  DRIVER_DEMO,
  JOB_TIMELINE,
  JOB_HISTORY,
  formatTHB,
} from "@/lib/brand";

describe("BRAND constants", () => {
  it("is Thai-JUMBO-branded with defined color", () => {
    expect(BRAND.name).toBe("JUMBO GO");
    expect(BRAND.color).toBe("#ED1C24");
    expect(BRAND.tagline).toBeTruthy();
    expect(BRAND.promise).toBeTruthy();
  });
});

describe("VEHICLES catalog", () => {
  it("contains exactly the 5 blueprint vehicle types", () => {
    expect(VEHICLES.map((v) => v.type)).toEqual([
      "PICKUP",
      "CLOSED_PICKUP",
      "CAGE_PICKUP",
      "JUMBO",
      "SIX_WHEEL",
    ]);
  });

  it("every vehicle has Thai name, capacity, and positive pricing", () => {
    for (const v of VEHICLES) {
      expect(v.name).toBeTruthy();
      expect(v.capacity).toMatch(/ตัน/);
      expect(v.basePrice).toBeGreaterThan(0);
      expect(v.perKm).toBeGreaterThan(0);
      expect(v.icon).toBeTruthy();
    }
  });

  it("pricing ascending: cheapest first (PICKUP) most expensive last (SIX_WHEEL)", () => {
    const sorted = [...VEHICLES].sort((a, b) => a.basePrice - b.basePrice);
    expect(sorted).toEqual(VEHICLES);
  });
});

describe("PROVINCES / RECENT_LOCATIONS dimension data", () => {
  it("provinces list is non-empty and includes Bangkok", () => {
    expect(PROVINCES.length).toBeGreaterThan(10);
    expect(PROVINCES).toContain("กรุงเทพมหานคร");
  });

  it("recent locations each have valid lat/lng", () => {
    for (const loc of RECENT_LOCATIONS) {
      expect(loc.name).toBeTruthy();
      expect(loc.address).toBeTruthy();
      expect(Math.abs(loc.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(loc.lng)).toBeLessThanOrEqual(180);
    }
  });
});

describe("UI content data", () => {
  it("feature highlights are constant and described", () => {
    expect(FEATURE_HIGHLIGHTS.length).toBe(3);
    expect(FEATURE_HIGHLIGHTS[0].title).toBe("ราคาชัดเจน");
  });

  it("onboarding has 3 slides, driver demo coherent, timeline 6 steps, history 4 rows", () => {
    expect(ONBOARDING_SLIDES).toHaveLength(3);
    expect(DRIVER_DEMO.name).toBe("สมชาย ใจดี");
    expect(DRIVER_DEMO.phone).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    expect(JOB_TIMELINE).toHaveLength(6);
    expect(JOB_HISTORY).toHaveLength(4);
  });
});

describe("formatTHB", () => {
  it("formats Thai locale without decimals", () => {
    expect(formatTHB(1234567)).toContain("1,234,567");
  });

  it("handles zero", () => {
    expect(formatTHB(0)).toBe("0");
  });
});