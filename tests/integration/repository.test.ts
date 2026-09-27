import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { randomUUID } from "node:crypto";
import { supabaseServer } from "@/lib/supabase/server";
import { JumboRepository } from "@/lib/supabase/repository";

// Test ของ DATA ACCESS LAYER — ใช้ service role กับข้อมูลจริง แล้ว cleanup หลังเสร็จ
// FK constraint ที่คำนึง: bookings.user_id → auth.users, drivers.vehicle_id → vehicles
const CUSTOMER_ID = "a9dce7bb-a9cf-4f21-874a-129b0138fd56";
const DRIVER_ID = "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76";

// สร้าง id ปลายทางที่ cleanup ได้เสมอ (แม้ test กลางคัน)
let createdUser = { id: "", phone: "" };
let createdBooking = { id: "", locationId: "", proofId: "", reviewId: "", notifId: "" };

let snapDriver = { is_online: false, is_verified: false, lat: null as number | null, lng: null as number | null };

beforeAll(async () => {
  const drv = await supabaseServer.from("drivers").select("*").eq("id", DRIVER_ID).single();
  snapDriver.is_online = drv.data?.is_online ?? false;
  snapDriver.is_verified = drv.data?.is_verified ?? false;
  snapDriver.lat = drv.data?.current_location_lat ?? null;
  snapDriver.lng = drv.data?.current_location_lng ?? null;
});

afterAll(async () => {
  // Cleanup child → parent เรียงลำดับตาม FK
  const c = createdBooking;
  if (c.proofId) await supabaseServer.from("delivery_proofs").delete().eq("id", c.proofId);
  if (c.reviewId) await supabaseServer.from("reviews").delete().eq("id", c.reviewId);
  if (c.notifId) await supabaseServer.from("notifications").delete().eq("id", c.notifId);
  if (c.locationId) await supabaseServer.from("booking_locations").delete().eq("id", c.locationId);
  if (c.id) await supabaseServer.from("bookings").delete().eq("id", c.id);

  if (createdUser.id) await supabaseServer.from("users").delete().eq("id", createdUser.id);

  // restore สถานะ driver
  await supabaseServer
    .from("drivers")
    .update({
      is_online: snapDriver.is_online,
      is_verified: snapDriver.is_verified,
      current_location_lat: snapDriver.lat,
      current_location_lng: snapDriver.lng,
    })
    .eq("id", DRIVER_ID);
});

describe("users", () => {
  it("getUsers returns list; getUserById works for customer", async () => {
    const list = await JumboRepository.getUsers();
    expect(Array.isArray(list)).toBe(true);

    const one = await JumboRepository.getUserById(CUSTOMER_ID);
    expect(one?.id).toBe(CUSTOMER_ID);
  });

  it("createUser + updateUser roundtrip", async () => {
    createdUser = {
      id: randomUUID(),
      phone: `08${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
    const created = await JumboRepository.createUser({
      id: createdUser.id,
      phone: createdUser.phone,
      first_name: "ผู้ใช้",
      last_name: "ทดสอบ",
      role: "user",
    });
    expect(created.id).toBe(createdUser.id);

    const byPhone = await JumboRepository.getUserByPhone(createdUser.phone);
    expect(byPhone?.id).toBe(createdUser.id);

    const updated = await JumboRepository.updateUser(createdUser.id, { first_name: "ผู้ใช้แก้" });
    expect(updated.first_name).toBe("ผู้ใช้แก้");
  });
});

describe("drivers", () => {
  it("getDrivers/getDriverByUserId/getDriverById", async () => {
    const list = await JumboRepository.getDrivers();
    expect(list.length).toBeGreaterThan(0);

    const byUser = await JumboRepository.getDriverByUserId("f74c32ed-7cb6-49a8-9963-a21d34e73335");
    expect(byUser?.id).toBe(DRIVER_ID);

    const byId = await JumboRepository.getDriverById(DRIVER_ID);
    expect(byId?.id).toBe(DRIVER_ID);
  });

  it("setDriverOnline + updateDriverLocation + updateDriver (restore after)", async () => {
    const off = await JumboRepository.setDriverOnline(DRIVER_ID, false);
    expect(off.is_online).toBe(false);
    const on = await JumboRepository.setDriverOnline(DRIVER_ID, snapDriver.is_online);
    expect(on.is_online).toBe(snapDriver.is_online);

    const loc = await JumboRepository.updateDriverLocation(DRIVER_ID, 13.8, 100.6);
    expect(Number(loc.current_location_lat)).toBe(13.8);
    await supabaseServer
      .from("drivers")
      .update({ current_location_lat: snapDriver.lat, current_location_lng: snapDriver.lng })
      .eq("id", DRIVER_ID);

    const upd = await JumboRepository.updateDriver(DRIVER_ID, { is_verified: snapDriver.is_verified });
    expect(upd.is_verified).toBe(snapDriver.is_verified);
  });
});

describe("vehicles / vehicle_types", () => {
  it("getVehicleTypes sorted; getVehicleTypeById; updateVehicleType roundtrip", async () => {
    const types = await JumboRepository.getVehicleTypes();
    expect(types.length).toBeGreaterThan(0);
    const fares = types.map((v) => Number(v.base_fare));
    expect([...fares].sort((a, b) => a - b)).toEqual(fares);

    const pickup = await JumboRepository.getVehicleTypeById("pickup");
    expect(pickup?.id).toBe("pickup");

    const originalPerKm = Number(pickup?.price_per_km ?? 12);
    const upd = await JumboRepository.updateVehicleType("pickup", { price_per_km: originalPerKm + 0.5 });
    expect(Number(upd.price_per_km)).toBe(originalPerKm + 0.5);
    await JumboRepository.updateVehicleType("pickup", { price_per_km: originalPerKm });
  });

  it("getVehicles returns list", async () => {
    const vehicles = await JumboRepository.getVehicles();
    expect(vehicles.length).toBeGreaterThan(0);
  });
});

describe("bookings / jobs", () => {
  it("reads list/available/by user/by driver and byId", async () => {
    const all = await JumboRepository.getBookings();
    expect(all.length).toBeGreaterThan(0);
    const avail = await JumboRepository.getAvailableJobs();
    expect(Array.isArray(avail)).toBe(true);
    const byUser = await JumboRepository.getBookingsByUser(CUSTOMER_ID);
    expect(Array.isArray(byUser)).toBe(true);
    const byDriver = await JumboRepository.getBookingsByDriver(DRIVER_ID);
    expect(Array.isArray(byDriver)).toBe(true);
  });

  it("createBooking + addBookingLocation + update flows + proof + review", async () => {
    const booking = await JumboRepository.createBooking({
      user_id: CUSTOMER_ID,
      vehicle_type: "pickup",
      status: "searching",
      fare: 400,
      distance_km: 8,
      job_number: "JG-TEST-" + Math.floor(Math.random() * 99999),
    });
    createdBooking.id = booking.id;

    const place = await JumboRepository.addBookingLocation({
      booking_id: booking.id,
      type: "pickup",
      address: "จุดรับทดสอบ",
      lat: 13.7,
      lng: 100.5,
      sequence: 0,
    });
    createdBooking.locationId = place.id;

    const detail = await JumboRepository.getBookingById(booking.id);
    expect(detail?.id).toBe(booking.id);

    const upd = await JumboRepository.updateBooking(booking.id, { fare: 450 });
    expect(Number(upd.fare)).toBe(450);

    const assigned = await JumboRepository.assignDriver(booking.id, DRIVER_ID);
    expect(assigned.driver_id).toBe(DRIVER_ID);
    expect(assigned.status).toBe("driver_assigned");

    const rejected = await JumboRepository.rejectAssignment(booking.id);
    expect(rejected.driver_id).toBeNull();
    expect(rejected.status).toBe("searching");

    const statusUpd = await JumboRepository.updateBookingStatus(booking.id, "in_transit");
    expect(statusUpd.status).toBe("in_transit");

    const proof = await JumboRepository.createDeliveryProof({
      booking_id: booking.id,
      driver_id: DRIVER_ID,
      proof_type: "delivery",
      photo_url: "https://example.com/proof.jpg",
      note: "proof-test",
    });
    createdBooking.proofId = proof.id;

    const review = await JumboRepository.addReview(booking.id, CUSTOMER_ID, DRIVER_ID, 5, "ดี");
    createdBooking.reviewId = review.id;
    const reviews = await JumboRepository.getReviewsByDriver(DRIVER_ID);
    expect(reviews.some((r) => r.id === review.id)).toBe(true);
  });
});

describe("kyc", () => {
  it("getKycStatus/getKycList/upsertKyc/reviewKyc roundtrip", async () => {
    const current = await JumboRepository.getKycStatus(DRIVER_ID);
    await JumboRepository.upsertKyc(DRIVER_ID, {
      id_card_number: "KYC-DAL-TEST",
      step_completed: 2,
      status: "pending",
    });

    const approved = await JumboRepository.reviewKyc(DRIVER_ID, "approved");
    expect(approved.status).toBe("approved");
    const driverAfter = await JumboRepository.getDriverById(DRIVER_ID);
    expect(driverAfter?.is_verified).toBe(true);

    const rejectedKyc = await JumboRepository.reviewKyc(DRIVER_ID, "rejected", "เอกสารไม่ชัด");
    expect(rejectedKyc.status).toBe("rejected");
    expect(rejectedKyc.rejection_reason).toBe("เอกสารไม่ชัด");
    await JumboRepository.reviewKyc(DRIVER_ID, snapDriver.is_verified ? "approved" : "rejected");

    const list = await JumboRepository.getKycList();
    expect(Array.isArray(list)).toBe(true);
  });
});

describe("saved_locations / notifications / wallet / payments / stats", () => {
  it("getSavedLocations + searchSavedLocations", async () => {
    const saved = await JumboRepository.getSavedLocations(CUSTOMER_ID);
    expect(Array.isArray(saved)).toBe(true);
    const searched = await JumboRepository.searchSavedLocations("");
    expect(Array.isArray(searched)).toBe(true);
  });

  it("createNotification/getNotificationsByRole/getNotificationsByUser/markRead", async () => {
    const created = await JumboRepository.createNotification({
      user_id: CUSTOMER_ID,
      type: "role_user",
      title: "dal-test",
      message: "dal notification",
      is_read: false,
      data: { role: "user" },
    });
    createdBooking.notifId = created.id;

    const read = await JumboRepository.markNotificationRead(created.id);
    expect(read.is_read).toBe(true);

    const role = await JumboRepository.getNotificationsByRole("user");
    expect(role.some((n) => n.id === created.id)).toBe(true);

    const userList = await JumboRepository.getNotificationsByUser(CUSTOMER_ID);
    expect(userList.some((n) => n.id === created.id)).toBe(true);
  });

  it("payments / transactions / wallet / admin stats", async () => {
    const payments = await JumboRepository.getPayments();
    expect(Array.isArray(payments)).toBe(true);
    const transactions = await JumboRepository.getTransactionsByDriver(DRIVER_ID);
    expect(Array.isArray(transactions)).toBe(true);
    const wallet = await JumboRepository.getDriverWallet(DRIVER_ID);
    expect(wallet === null || typeof wallet.balance === "number").toBe(true);

    const stats = await JumboRepository.getAdminStats();
    expect(stats.systemHealth).toBe("operational");
    expect(typeof stats.totalBookings).toBe("number");
    expect(typeof stats.onlineDrivers).toBe("number");
  });
});