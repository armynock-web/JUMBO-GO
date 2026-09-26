import { NextRequest } from "next/server";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { supabaseServer } from "@/lib/supabase/server";
import { api } from "@/lib/api";

// Test ของ src/lib/api.ts — ใช้ service role กับข้อมูลจริง แล้ว cleanup หลังเสร็จ
const CUSTOMER_ID = "a9dce7bb-a9cf-4f21-874a-129b0138fd56";
const DRIVER_USER_ID = "f74c32ed-7cb6-49a8-9963-a21d34e73335";
const DRIVER_ID = "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76";

let created = { bookingId: "", notifId: "" };
let snap = { driverIsOnline: true, driverLat: null as number | null, driverLng: null as number | null };

beforeAll(async () => {
  const drv = await supabaseServer.from("drivers").select("*").eq("id", DRIVER_ID).single();
  snap.driverIsOnline = drv.data?.is_online ?? true;
  snap.driverLat = drv.data?.current_location_lat ?? null;
  snap.driverLng = drv.data?.current_location_lng ?? null;
});

afterAll(async () => {
  if (created.notifId) {
    await supabaseServer.from("notifications").delete().eq("id", created.notifId);
  }
  if (created.bookingId) {
    await supabaseServer
      .from("bookings")
      .delete()
      .eq("id", created.bookingId);
  }
  await supabaseServer
    .from("drivers")
    .update({
      is_online: snap.driverIsOnline,
      current_location_lat: snap.driverLat,
      current_location_lng: snap.driverLng,
    })
    .eq("id", DRIVER_ID);
});

describe("api.createBooking", () => {
  const bookingPayload = {
    userId: CUSTOMER_ID,
    vehicleType: "pickup",
    pickup: { address: "ถนนสุขุมวิท 101", contactName: "ผู้ส่ง 1", contactPhone: "081-000-0001", lat: 13.69, lng: 100.61, note: "กล่อง 2 ใบ" },
    dropoff: { address: "ถนนศรีนครินทร์", contactName: "ผู้รับ 1", contactPhone: "081-000-0002", lat: 13.68, lng: 100.65 },
    fare: 500,
    baseFare: 150,
    distanceFare: 120,
    extraHelperFee: 150,
    expresswayFee: 50,
    distanceKm: 10,
    paymentMethod: "cash",
    senderName: "ผู้ส่งจริง",
    senderPhone: "081-000-0003",
    receiverName: "ผู้รับจริง",
    receiverPhone: "081-000-0004",
  };

  it("creates a searching booking with locations and computed fields", async () => {
    const booking = await api.createBooking(bookingPayload);
    created.bookingId = booking.id;

    expect(booking.status).toBe("searching");
    expect(booking.user_id).toBe(CUSTOMER_ID);
    expect(booking.fare).toBe(500);
    expect(booking.distance_km).toBe(10);
    expect(booking.base_fare).toBe(150);
    expect(booking.extra_helper_fee).toBe(150);
    expect(booking.expressway_fee).toBe(50);
    expect(booking.sender_name).toBe("ผู้ส่งจริง");
    expect(booking.sender_phone).toBe("081-000-0003");
    expect(booking.receiver_name).toBe("ผู้รับจริง");
    expect(booking.job_number).toMatch(/^JG-\d{4}-/);

    const locs = await supabaseServer
      .from("booking_locations")
      .select("*")
      .eq("booking_id", booking.id)
      .order("sequence");
    expect(locs.error).toBeNull();
    expect(locs.data).toHaveLength(2);
    expect(locs.data?.[0].type).toBe("pickup");
    expect(locs.data?.[0].lat).toBe(13.69);
    expect(locs.data?.[1].type).toBe("dropoff");
  });
});

describe("api.getBookingDetail", () => {
  it("returns booking with nested locations", async () => {
    const detail = await api.getBookingDetail(created.bookingId);
    expect(detail.id).toBe(created.bookingId);
    expect(Array.isArray(detail.booking_locations)).toBe(true);
    expect(detail.booking_locations).toHaveLength(2);
  });
});

describe("api.getDriverActiveJob / getAvailableJobsForDriver", () => {
  it("getDriverActiveJob returns null or an active booking for this driver", async () => {
    const active = await api.getDriverActiveJob(DRIVER_ID);
    if (active === null) {
      expect(active).toBeNull();
    } else {
      expect(active.driver_id).toBe(DRIVER_ID);
      expect(active.status).toMatch(
        /driver_assigned|going_to_pickup|arrived_pickup|picked_up|in_transit|arrived_dropoff/
      );
    }
  });

  it("getAvailableJobsForDriver returns an array", async () => {
    const jobs = await api.getAvailableJobsForDriver();
    expect(Array.isArray(jobs)).toBe(true);
  });
});

describe("api.getAvailableDrivers", () => {
  it("returns online drivers, filtered optionally by vehicle type", async () => {
    const all = await api.getAvailableDrivers();
    expect(Array.isArray(all)).toBe(true);

    const pickup = await api.getAvailableDrivers("PICKUP");
    expect(Array.isArray(pickup)).toBe(true);

    const nonexistent = await api.getAvailableDrivers("NONEXISTENT");
    expect(Array.isArray(nonexistent)).toBe(true);
  });
});

describe("api.acceptJob / updateJobStatus / reject (via direct update)", () => {
  it("accepts then updates status chain on the created booking", async () => {
    const accepted = await api.acceptJob(created.bookingId, DRIVER_ID);
    expect(accepted.driver_id).toBe(DRIVER_ID);
    expect(accepted.status).toBe("driver_assigned");

    expect((await api.updateJobStatus(created.bookingId, "in_transit")).status).toBe("in_transit");

    // คืนค่าเป็น original (searching) เพื่อไม่ให้กระทบข้อมูลจริงถาวร
    const back = await supabaseServer
      .from("bookings")
      .update({ status: "cancelled", driver_id: null })
      .eq("id", created.bookingId)
      .select()
      .single();
    expect(back.data?.status).toBe("cancelled");
  });
});

describe("api.updateDriverLocation / api.toggleDriverOnline", () => {
  it("updates GPS then restores", async () => {
    const updated = await api.updateDriverLocation({ driverId: DRIVER_ID, lat: 13.76, lng: 100.52 });
    expect(updated.current_location_lat).toBe(13.76);
    expect(updated.current_location_lng).toBe(100.52);
  });

  it("throws when driver id does not exist", async () => {
    await expect(api.updateDriverLocation({ driverId: "no-such-driver", lat: 1, lng: 1 })).rejects.toThrow();
  });

  it("toggles online state and restores", async () => {
    const off = await api.toggleDriverOnline(DRIVER_ID, false);
    expect(off.is_online).toBe(false);
    const on = await api.toggleDriverOnline(DRIVER_ID, true);
    expect(on.is_online).toBe(true);
  });
});

describe("api.getNotifications / api.markNotificationRead", () => {
  it("creates a notification, lists it by role filter, marks read", async () => {
    const inserted = await supabaseServer
      .from("notifications")
      .insert({
        user_id: CUSTOMER_ID,
        title: "api-client test",
        message: "integration",
        type: "role_user",
        data: { role: "user" },
        is_read: false,
      })
      .select()
      .single();
    if (inserted.error) throw inserted.error;
    created.notifId = inserted.data.id;

    const notifications = await api.getNotifications("user", CUSTOMER_ID);
    const found = notifications.find((n) => n.id === created.notifId);
    expect(found).toBeTruthy();

    const marked = await api.markNotificationRead(created.notifId);
    expect(marked.is_read).toBe(true);
  });
});

describe("api.getVehicleTypes / api.getUserProfile", () => {
  it("returns active vehicle types sorted by base fare", async () => {
    const types = await api.getVehicleTypes();
    expect(types.length).toBeGreaterThan(0);
    const fares = types.map((t) => t.base_fare);
    expect([...fares].sort((a, b) => a - b)).toEqual(fares);
  });

  it("returns user profile", async () => {
    const profile = await api.getUserProfile(CUSTOMER_ID);
    expect(profile?.id).toBe(CUSTOMER_ID);
  });
});