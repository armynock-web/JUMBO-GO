import { NextRequest } from "next/server";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { GET as apiRoot } from "@/app/api/route";
import { GET as getVehicleTypes } from "@/app/api/vehicle-types/route";
import { GET as getBookings, POST as postBooking } from "@/app/api/bookings/route";
import { GET as getBookingById } from "@/app/api/bookings/[id]/route";
import { POST as cancelBooking } from "@/app/api/bookings/[id]/cancel/route";
import { POST as rateBooking } from "@/app/api/bookings/[id]/rate/route";
import { GET as getDriverJobs } from "@/app/api/driver/jobs/route";
import { POST as acceptJob } from "@/app/api/driver/jobs/[id]/accept/route";
import { POST as updateJobStatus } from "@/app/api/driver/jobs/[id]/status/route";
import { POST as submitProof } from "@/app/api/driver/jobs/[id]/proof/route";
import { POST as rejectJob } from "@/app/api/driver/jobs/[id]/reject/route";
import { GET as getEarnings } from "@/app/api/driver/earnings/route";
import { GET as getKyc } from "@/app/api/driver/kyc/route";
import { POST as postKyc } from "@/app/api/driver/kyc/route";
import { POST as submitKyc } from "@/app/api/driver/kyc/submit/route";
import { POST as goOnline } from "@/app/api/driver/availability/online/route";
import { POST as goOffline } from "@/app/api/driver/availability/offline/route";
import { POST as postLocation } from "@/app/api/driver/location/route";
import { GET as getProfile } from "@/app/api/driver/profile/route";
import { GET as getStats } from "@/app/api/admin/stats/route";
import { GET as getPricing, PUT as putPricing } from "@/app/api/admin/pricing/route";
import { GET as getKycList } from "@/app/api/admin/kyc/list/route";
import { POST as reviewKyc } from "@/app/api/admin/kyc/[id]/review/route";
import { GET as getNotifications } from "@/app/api/notifications/route";
import { POST as readNotification } from "@/app/api/notifications/[id]/read/route";
import { GET as searchLocations } from "@/app/api/locations/search/route";
import { GET as recentLocations } from "@/app/api/locations/recent/route";

// ทดสอบผ่าน service role (RLS bypass) กับข้อมูลจริง + cleanup หลังเสร็จ
const CUSTOMER_ID = "a9dce7bb-a9cf-4f21-874a-129b0138fd56";
const DRIVER_USER_ID = "f74c32ed-7cb6-49a8-9963-a21d34e73335";
const DRIVER_ID = "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76";
const BASE = "http://localhost";

function req(method: string, path: string, opts: { body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  if (opts.token) headers.authorization = `Bearer jumbo_${opts.token}`;
  return new NextRequest(`${BASE}${path}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

// ============ state กลาง (สร้าง→ใช้→ลบ ภายในไฟล์เดียว) ============
let created = { bookingId: "", jobNumber: "", reviewId: "", notifId: "", kycDriverId: "", kycRowId: "" };

// snapshot ก่อนโดน mutate เพื่อ restore ค่าเดิม
let snap = {
  pickup: {} as Record<string, unknown>,
  driver: { is_online: true, is_verified: true, lat: null, lng: null },
  kyc: null as Record<string, unknown> | null,
};

beforeAll(async () => {
  const [vts, drv, kycRow] = await Promise.all([
    supabaseServer.from("vehicle_types").select("*").eq("id", "pickup").single(),
    supabaseServer.from("drivers").select("*").eq("id", DRIVER_ID).single(),
    supabaseServer.from("driver_kyc").select("*").eq("driver_id", DRIVER_ID).maybeSingle(),
  ]);
  snap.pickup = vts.data ?? {};
  if (drv.data) {
    snap.driver.is_online = drv.data.is_online ?? false;
    snap.driver.is_verified = drv.data.is_verified ?? false;
  }
  snap.kyc = kycRow.data ?? null;
});

afterAll(async () => {
  // 1) ลบข้อมูลที่สร้างขึ้นใน test
  if (created.reviewId) {
    await supabaseServer.from("reviews").delete().eq("id", created.reviewId);
  }
  if (created.notifId) {
    await supabaseServer.from("notifications").delete().eq("id", created.notifId);
  }
  if (created.bookingId) {
    await supabaseServer.from("bookings").delete().eq("id", created.bookingId);
  }
  // 2) restore ข้อมูลจริงที่ถูก mutate
  await supabaseServer.from("vehicle_types").update(snap.pickup).eq("id", "pickup");
  const kycFields = snap.kyc
    ? { ...snap.kyc }
    : { driver_id: DRIVER_ID, step_completed: 0, status: "draft" };
  delete (kycFields as Record<string, unknown>)["created_at"];
  await supabaseServer.from("driver_kyc").upsert(kycFields, { onConflict: "driver_id" });
  await supabaseServer
    .from("drivers")
    .update({
      is_online: snap.driver.is_online,
      is_verified: snap.driver.is_verified,
      current_location_lat: snap.driver.lat,
      current_location_lng: snap.driver.lng,
    })
    .eq("id", DRIVER_ID);
});

describe("GET /api (root)", () => {
  it("returns hello world", async () => {
    const res = await apiRoot();
    const body = await res.json();
    expect(body.message).toBe("Hello, world!");
  });
});

describe("vehicle-types", () => {
  it("returns live vehicles sorted with normalized fields", async () => {
    const res = await getVehicleTypes();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.vehicles.length).toBeGreaterThan(0);
    expect(body.vehicles[0].id).toBe("pickup");
    expect(body.vehicles[0].typeKey).toBe("PICKUP");
  });
});

describe("bookings", () => {
  it("GET returns list (defaults to seed customer)", async () => {
    const res = await getBookings(req("GET", "/api/bookings"));
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.bookings)).toBe(true);
  });

  it("POST creates searching booking, GET [id] finds it, cancel works", async () => {
    const postRes = await postBooking(
      req("POST", "/api/bookings", {
        body: {
          userId: CUSTOMER_ID,
          vehicleType: "PICKUP",
          pickup: { main: "ตึก BTS อโศก" },
          dropoff: { main: "บางนา" },
          distanceKm: 10,
          fare: 500,
        },
      })
    );
    const postBody = await postRes.json();
    expect(postRes.status).toBe(200);
    expect(postBody.success).toBe(true);
    expect(postBody.booking.status).toBe("searching");
    created.bookingId = postBody.booking.id;
    created.jobNumber = postBody.jobNumber;
    expect(postBody.jobNumber).toMatch(/^JG-\d{4}-/);

    const detailRes = await getBookingById(req("GET", "/api/bookings/x"), {
      params: Promise.resolve({ id: created.bookingId }),
    });
    const detailBody = await detailRes.json();
    expect(detailBody.success).toBe(true);
    expect(detailBody.booking.id).toBe(created.bookingId);

    const cancelRes = await cancelBooking(
      req("POST", "/api/bookings/x", { body: { reason: "ทดสอบยกเลิก" } }),
      { params: Promise.resolve({ id: created.bookingId }) }
    );
    const cancelBody = await cancelRes.json();
    expect(cancelBody.success).toBe(true);
    expect(cancelBody.booking.status).toBe("cancelled");
    expect(cancelBody.booking.cancel_reason).toBe("ทดสอบยกเลิก");
  });
});

describe("driver identity (profile / earnings / jobs via real driver)", () => {
  it("profile returns driver row with vehicles", async () => {
    const res = await getProfile(
      req("GET", "/api/driver/profile", { token: DRIVER_USER_ID })
    );
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.driver.id).toBe(DRIVER_ID);
  });

  it("rejects unknown driver token with 401", async () => {
    const res = await getProfile(req("GET", "/api/driver/profile", { token: CUSTOMER_ID }));
    expect(res.status).toBe(401);
  });

  it("earnings returns summary + transactions", async () => {
    const res = await getEarnings(
      req("GET", "/api/driver/earnings", { token: DRIVER_USER_ID })
    );
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.summary.driverId).toBe(DRIVER_ID);
    expect(typeof body.summary.totalLifetime).toBe("number");
    expect(Array.isArray(body.transactions)).toBe(true);
  });

  it("jobs returns success with array", async () => {
    const res = await getDriverJobs(
      req("GET", "/api/driver/jobs", { token: DRIVER_USER_ID })
    );
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.jobs)).toBe(true);
  });
});

describe("driver lifecycle on real driver (restored after)", () => {
  it("toggling online -> offline -> online keeps state restored", async () => {
    const off = await goOffline(
      req("POST", "/api/driver/availability/offline", { body: {}, token: DRIVER_USER_ID })
    );
    expect((await off.json()).isOnline).toBe(false);

    const on = await goOnline(
      req("POST", "/api/driver/availability/online", { body: {}, token: DRIVER_USER_ID })
    );
    expect((await on.json()).isOnline).toBe(true);
  });

  it("location updates current GPS and lat/lng bounds are validated", async () => {
    const ok = await postLocation(
      req("POST", "/api/driver/location", { body: { lat: 13.75, lng: 100.5 }, token: DRIVER_USER_ID })
    );
    const okBody = await ok.json();
    expect(okBody.success).toBe(true);
    expect(okBody.lat).toBe(13.75);

    const bad = await postLocation(
      req("POST", "/api/driver/location", { body: { lat: 999, lng: 100 } , token: DRIVER_USER_ID})
    );
    expect(bad.status).toBe(400);
  });

  it("kyc GET returns row or null; admin list & review roundtrip", async () => {
    // POST kyc ก่อน (route อ่าน body 2 ครั้ง → step = NaN ตาม contract จริง)
    const kycRes = await postKyc(
      req("POST", "/api/driver/kyc", {
        body: { driverId: DRIVER_ID, step: 1, data: { id_card_number: "TEST1234" } },
        token: DRIVER_USER_ID,
      })
    );
    const kycBody = await kycRes.json();
    expect(kycRes.status).toBe(200);

    const submitRes = await submitKyc(
      req("POST", "/api/driver/kyc/submit", { body: {}, token: DRIVER_USER_ID })
    );
    const submitBody = await submitRes.json();
    expect(submitBody.success).toBe(true);
    expect(submitBody.status).toBe("pending");
    created.kycDriverId = submitBody.driverId || DRIVER_ID;

    const listRes = await getKycList();
    const listBody = await listRes.json();
    expect(listBody.success).toBe(true);
    const row = (listBody.kycList || []).find((k: { driver_id: string }) => k.driver_id === DRIVER_ID);
    expect(row).toBeTruthy();
    created.kycRowId = row?.id;
    expect(row?.status).toBe("pending");

    const reviewRes = await reviewKyc(
      req("POST", "/api/admin/kyc/x", { body: { status: "approved" } }),
      { params: Promise.resolve({ id: row?.id || DRIVER_ID }) }
    );
    const reviewBody = await reviewRes.json();
    expect(reviewBody.success).toBe(true);
    expect(reviewBody.status).toBe("approved");
  });
});

describe("driver job accept -> status chain -> proof (on created booking)", () => {
  it("full job lifecycle using a fresh booking", async () => {
    const p = await postBooking(
      req("POST", "/api/bookings", {
        body: { userId: CUSTOMER_ID, vehicleType: "PICKUP", distanceKm: 8, fare: 620 },
      })
    );
    const pb = await p.json();
    created.bookingId = pb.booking.id;

    const acc = await acceptJob(
      req("POST", "/api/driver/jobs/x", { body: {}, token: DRIVER_USER_ID }),
      { params: Promise.resolve({ id: created.bookingId }) }
    );
    const accBody = await acc.json();
    expect(accBody.success).toBe(true);
    expect(accBody.booking.status).toBe("driver_assigned");
    expect(accBody.booking.driver_id).toBe(DRIVER_ID);

    for (const s of ["going_to_pickup", "arrived_pickup", "picked_up", "in_transit", "arrived_dropoff", "completed"]) {
      const sr = await updateJobStatus(
        req("POST", "/api/driver/jobs/x", { body: { status: s } }),
        { params: Promise.resolve({ id: created.bookingId }) }
      );
      expect((await sr.json()).booking.status).toBe(s);
    }

    const pf = await submitProof(
      req("POST", "/api/driver/jobs/x", {
        body: { proofUrl: "https://example.com/proof.jpg", note: "ทดสอบ" },
        token: DRIVER_USER_ID,
      }),
      { params: Promise.resolve({ id: created.bookingId }) }
    );
    const pfBody = await pf.json();
    expect(pfBody.success).toBe(true);
    expect(pfBody.jobId).toBe(created.bookingId);

    const rj = await rejectJob(
      req("POST", "/api/driver/jobs/x", { body: { reason: "สิ้นสุดรอบการทดสอบ" } }),
      { params: Promise.resolve({ id: created.bookingId }) }
    );
    const rjBody = await rj.json();
    expect(rjBody.success).toBe(true);
    expect(rjBody.booking.status).toBe("searching");
    expect(rjBody.booking.driver_id).toBeNull();
  });
});

describe("rate booking (needs a driver-assigned completed booking)", () => {
  it("returns 422 when no driver assigned, then 200 after assignment", async () => {
    const p = await postBooking(
      req("POST", "/api/bookings", {
        body: { userId: CUSTOMER_ID, vehicleType: "PICKUP", fare: 450 },
      })
    );
    const pb = await p.json();
    const bId: string = pb.booking.id;

    const noDriver = await rateBooking(
      req("POST", "/api/bookings/x", { body: { rating: 5, userId: CUSTOMER_ID } }),
      { params: Promise.resolve({ id: bId }) }
    );
    expect(noDriver.status).toBe(422);

    await acceptJob(
      req("POST", "/api/driver/jobs/x", { body: {}, token: DRIVER_USER_ID }),
      { params: Promise.resolve({ id: bId }) }
    );
    const r = await rateBooking(
      req("POST", "/api/bookings/x", { body: { rating: 5, comment: "ดีมาก", userId: CUSTOMER_ID } }),
      { params: Promise.resolve({ id: bId }) }
    );
    const rb = await r.json();
    expect(rb.success).toBe(true);
    created.reviewId = rb.review?.id;

    await supabaseServer.from("bookings").update({ status: "completed" }).eq("id", bId);
    await supabaseServer.from("bookings").delete().eq("id", bId);
    created.bookingId = "";
  });

  it("rejects rating out of range", async () => {
    const r = await rateBooking(
      req("POST", "/api/bookings/x", { body: { rating: 99, userId: CUSTOMER_ID } }),
      { params: Promise.resolve({ id: created.bookingId || "none" }) }
    );
    expect(r.status).toBe(400);
  });
});

describe("admin", () => {
  it("stats returns all keys", async () => {
    const res = await getStats();
    const body = await res.json();
    expect(body.success).toBe(true);
    for (const k of ["activeBookings", "onlineDrivers", "totalDrivers", "totalUsers", "totalBookings", "completedBookings", "cancelledBookings", "pendingKycCount", "systemHealth"]) {
      expect(body.stats).toHaveProperty(k);
    }
  });

  it("pricing GET returns rows; PUT updates and then we restore", async () => {
    const g = await getPricing();
    const gb = await g.json();
    expect(gb.success).toBe(true);
    const pickupBefore = gb.pricing.find((v: { id: string }) => v.id === "pickup");

    const put = await putPricing(
      req("PUT", "/api/admin/pricing", {
        body: { code: "pickup", perKm: Number(pickupBefore.price_per_km) + 1 },
      })
    );
    const putBody = await put.json();
    expect(putBody.success).toBe(true);
    expect(putBody.updated.price_per_km).toBe(pickupBefore.price_per_km + 1);
  });
});

describe("notifications", () => {
  it("creates, lists by role, and marks read", async () => {
    const insert = await supabaseServer
      .from("notifications")
      .insert({
        user_id: CUSTOMER_ID,
        title: "ทดสอบแจ้งเตือน",
        message: "integration test",
        type: "role_user",
        data: { role: "user" },
        is_read: false,
      })
      .select()
      .single();
    if (insert.error) throw insert.error;
    created.notifId = insert.data.id;

    const list = await getNotifications(req("GET", "/api/notifications?role=user"));
    const lb = await list.json();
    expect(lb.success).toBe(true);
    expect(lb.role).toBe("user");
    expect(lb.notifications.some((n: { id: string }) => n.id === created.notifId)).toBe(true);
    expect(lb.notifications.some((n: { is_read: boolean }) => n.is_read === false)).toBe(true);

    const mark = await readNotification(
      req("POST", "/api/notifications/x"),
      { params: Promise.resolve({ id: created.notifId }) }
    );
    const mb = await mark.json();
    expect(mb.success).toBe(true);
    expect(mb.notification.is_read).toBe(true);
  });
});

describe("locations", () => {
  it("search returns results (empty q returns all)", async () => {
    const res = await searchLocations(req("GET", "/api/locations/search?q="));
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.results)).toBe(true);
  });

  it("recent returns [] without token and saved locations with token", async () => {
    const anon = await recentLocations(req("GET", "/api/locations/recent"));
    expect((await anon.json()).success).toBe(true);

    const auth = await recentLocations(
      req("GET", "/api/locations/recent", { token: CUSTOMER_ID })
    );
    const body = await auth.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.locations)).toBe(true);
  });
});