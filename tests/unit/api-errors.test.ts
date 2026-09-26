import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// API Client Layer Error/Edge Tests
// ครอบ branch ที่ integration tests (DB จริง) ยังไม่ถูกแตะ:
// - throw เมื่อ DB error (ทุก method ของ api)
// - createBooking: !booking, locError, optional fields ครบชุด
// - getAvailableDrivers: normalize vehicles (object/array/null)
// - getNotifications: filter role / userId branch
// ============================================================

const dbError = { message: "boom", code: "500", details: "" };

// จัดการผลลัพธ์ต่อตาราง (table -> result) เพื่อทดสอบหลาย scenario ในไฟล์เดียว
const store = vi.hoisted(() => ({
  results: new Map<string, { data: unknown; error: unknown }>(),
  defaultResult: { data: [], error: null },
  set(table: string, data: unknown, error: unknown = null) {
    this.results.set(table, { data, error });
  },
  setError(table: string) {
    this.results.set(table, { data: null, error: dbError });
  },
}));

vi.mock("@/lib/supabase/server", () => {
  const buildQuery = (table: string) => {
    const q: Record<string, unknown> = {};
    [
      "select",
      "eq",
      "neq",
      "in",
      "or",
      "ilike",
      "order",
      "limit",
      "single",
      "maybeSingle",
      "insert",
      "update",
      "upsert",
    ].forEach((m) => {
      q[m] = () => q;
    });
    q.then = (onFulfilled: (v: unknown) => unknown) => {
      const result = store.results.get(table) ?? store.defaultResult;
      return Promise.resolve(result).then(onFulfilled);
    };
    return q as PromiseLike<{ data: unknown; error: unknown }> & {
      [method: string]: unknown;
    };
  };

  return {
    supabaseServer: {
      from: vi.fn((table: string) => buildQuery(table)),
    },
  };
});

import { api } from "@/lib/api";

const bookingRow = {
  id: "b1",
  job_number: "JG-2026-10000",
  user_id: "u1",
  vehicle_type: "PICKUP",
  status: "searching",
  fare: 619,
  base_fare: 350,
  distance_fare: 219,
  extra_helper_fee: 0,
  expressway_fee: 50,
  distance_km: 15.5,
  duration_min: 34,
  sender_name: "สมหญิง",
  sender_phone: "082-345-6789",
  receiver_name: "ผู้รับ",
  receiver_phone: "081-999-8888",
  driver_id: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
} as never;

describe("api.createBooking", () => {
  beforeEach(() => {
    store.results.clear();
  });

  it("creates booking with full optional fields", async () => {
    store.set("bookings", bookingRow);
    store.set("booking_locations", null);

    const created = await api.createBooking({
      userId: "u1",
      vehicleType: "PICKUP",
      pickup: {
        address: "A",
        contactName: "คนส่ง",
        contactPhone: "080-000-0000",
        lat: 13.5,
        lng: 100.5,
      },
      dropoff: {
        address: "B",
        contactName: "คนรับ",
        contactPhone: "081-000-0000",
        lat: 13.6,
        lng: 100.6,
      },
      fare: 619,
      baseFare: 350,
      distanceFare: 219,
      extraHelperFee: 0,
      expresswayFee: 50,
      distanceKm: 15.5,
      senderName: "สมหญิง",
      senderPhone: "082-345-6789",
      receiverName: "ผู้รับ",
      receiverPhone: "081-999-8888",
    });

    expect(created.id).toBe("b1");
  });

  it("creates booking without optional fields (uses pickup/dropoff contact as fallback)", async () => {
    store.set("bookings", bookingRow);
    store.set("booking_locations", null);

    const created = await api.createBooking({
      userId: "u1",
      vehicleType: "pickup",
      pickup: { address: "A", lat: 1, lng: 2 },
      dropoff: { address: "B", lat: 3, lng: 4 },
      fare: 300,
      distanceKm: 5,
    });

    expect(created.id).toBe("b1");
  });

  it("throws when booking insert fails", async () => {
    store.setError("bookings");
    store.set("booking_locations", null);

    await expect(
      api.createBooking({
        userId: "u1",
        vehicleType: "PICKUP",
        pickup: { address: "A", lat: 1, lng: 2 },
        dropoff: { address: "B", lat: 3, lng: 4 },
        fare: 300,
        distanceKm: 5,
      })
    ).rejects.toThrow(/boom/);
  });

  it("throws when booking insert returns no row", async () => {
    store.set("bookings", null);
    store.set("booking_locations", null);

    await expect(
      api.createBooking({
        userId: "u1",
        vehicleType: "PICKUP",
        pickup: { address: "A", lat: 1, lng: 2 },
        dropoff: { address: "B", lat: 3, lng: 4 },
        fare: 300,
        distanceKm: 5,
      })
    ).rejects.toThrow(/ไม่สามารถสร้างใบจองได้/);
  });

  it("throws when inserting booking locations fails", async () => {
    store.set("bookings", bookingRow);
    store.setError("booking_locations");

    await expect(
      api.createBooking({
        userId: "u1",
        vehicleType: "PICKUP",
        pickup: { address: "A", lat: 1, lng: 2 },
        dropoff: { address: "B", lat: 3, lng: 4 },
        fare: 300,
        distanceKm: 5,
      })
    ).rejects.toThrow(/boom/);
  });
});

describe("api error propagation", () => {
  beforeEach(() => {
    store.results.clear();
  });

  it("getBookingDetail throws on db error", async () => {
    store.setError("bookings");
    await expect(api.getBookingDetail("x")).rejects.toThrow(/boom/);
  });

  it("getBookingDetail returns row", async () => {
    store.set("bookings", bookingRow);
    await expect(api.getBookingDetail("b1")).resolves.toBe(bookingRow);
  });

  it("getDriverActiveJob throws on db error", async () => {
    store.setError("bookings");
    await expect(api.getDriverActiveJob("d1")).rejects.toThrow(/boom/);
  });

  it("getDriverActiveJob returns null when no active job", async () => {
    store.set("bookings", null);
    await expect(api.getDriverActiveJob("d1")).resolves.toBeNull();
  });

  it("getAvailableJobsForDriver returns [] on empty data", async () => {
    store.set("bookings", null);
    await expect(api.getAvailableJobsForDriver()).resolves.toEqual([]);
  });

  it("getAvailableJobsForDriver throws on db error", async () => {
    store.setError("bookings");
    await expect(api.getAvailableJobsForDriver()).rejects.toThrow(/boom/);
  });

  it("getVehicleTypes returns [] on empty data and throws on error", async () => {
    store.set("vehicle_types", null);
    await expect(api.getVehicleTypes()).resolves.toEqual([]);

    store.setError("vehicle_types");
    await expect(api.getVehicleTypes()).rejects.toThrow(/boom/);
  });

  it("getUserProfile returns null on empty and throws on error", async () => {
    store.set("users", null);
    await expect(api.getUserProfile("u1")).resolves.toBeNull();

    store.setError("users");
    await expect(api.getUserProfile("u1")).rejects.toThrow(/boom/);
  });

  it("acceptJob throws on db error", async () => {
    store.setError("bookings");
    await expect(api.acceptJob("b1", "d1")).rejects.toThrow(/boom/);
  });

  it("updateJobStatus throws on db error", async () => {
    store.setError("bookings");
    await expect(api.updateJobStatus("b1", "in_transit")).rejects.toThrow(/boom/);
  });

  it("toggleDriverOnline throws on db error", async () => {
    store.setError("drivers");
    await expect(api.toggleDriverOnline("d1", true)).rejects.toThrow(/boom/);
  });

  it("updateDriverLocation throws on db error and on missing driver", async () => {
    store.setError("drivers");
    await expect(
      api.updateDriverLocation({ driverId: "d1", lat: 1, lng: 2 })
    ).rejects.toThrow(/boom/);

    store.results.clear();
    store.set("drivers", null);
    await expect(
      api.updateDriverLocation({ driverId: "missing", lat: 1, lng: 2 })
    ).rejects.toThrow(/ไม่พบคนขับ/);

    store.results.clear();
    store.set("drivers", { id: "d1", current_location_lat: 1, current_location_lng: 2 });
    await expect(
      api.updateDriverLocation({ driverId: "d1", lat: 1, lng: 2 })
    ).resolves.toHaveProperty("id", "d1");
  });

  it("markNotificationRead throws on db error", async () => {
    store.setError("notifications");
    await expect(api.markNotificationRead("n1")).rejects.toThrow(/boom/);
  });
});

describe("api.getAvailableDrivers", () => {
  beforeEach(() => {
    store.results.clear();
  });

  const driver = (id: string, vehicles: unknown) => ({
    id,
    first_name: "ด",
    is_online: true,
    current_location_lat: 13.5,
    current_location_lng: 100.5,
    rating_avg: 4.8,
    vehicles,
  });

  it("returns all drivers when no vehicleType provided", async () => {
    store.set("drivers", [driver("d1", null), driver("d2", [])]);
    const result = await api.getAvailableDrivers();
    expect(result).toHaveLength(2);
  });

  it("filters by vehicleType and normalizes vehicles object/array/null", async () => {
    store.set("drivers", [
      driver("d-obj", { type: "PICKUP" }),
      driver("d-arr", [{ type: "pickup" }]),
      driver("d-null", null),
      driver("d-empty", []),
      driver("d-mismatch", { type: "JUMBO" }),
    ]);
    const result = await api.getAvailableDrivers("PICKUP");
    const ids = result.map((d: { id: string }) => d.id);
    expect(ids).toEqual(["d-obj", "d-arr", "d-null", "d-empty"]);
  });

  it("throws on db error", async () => {
    store.setError("drivers");
    await expect(api.getAvailableDrivers("PICKUP")).rejects.toThrow(/boom/);
  });
});

describe("api.getNotifications", () => {
  beforeEach(() => {
    store.results.clear();
  });

  const note = (partial: Record<string, unknown>) => ({
    id: "n1",
    type: "info",
    title: "t",
    message: "m",
    is_read: false,
    created_at: "2026-01-01T00:00:00Z",
    ...partial,
  });

  it("filters by role from data.role and type prefix", async () => {
    store.set("notifications", [
      note({ data: { role: "driver" }, type: "info" }),
      note({ data: { role: "user" }, type: "info" }),
      note({ data: null, type: "role_admin" }),
      note({ data: {}, type: "other" }),
    ]);

    const drivers = await api.getNotifications("driver");
    expect(drivers).toHaveLength(1);
    expect(drivers[0].data).toEqual({ role: "driver" });

    const admins = await api.getNotifications("admin");
    expect(admins).toHaveLength(1);
    expect(admins[0].type).toBe("role_admin");
  });

  it("applies userId filter when userId provided", async () => {
    store.set("notifications", [note({ user_id: "u1", data: { role: "user" } })]);
    const result = await api.getNotifications("user", "u1");
    expect(result).toHaveLength(1);
  });

  it("throws on db error", async () => {
    store.setError("notifications");
    await expect(api.getNotifications("user")).rejects.toThrow(/boom/);
  });
});