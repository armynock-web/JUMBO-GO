import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Repository Error Handling Tests
// ครอบ branch `if (error) throw error` ของทุก method ใน JumboRepository
// โดย mock supabaseServer ให้คืน error -> ทุก method ต้อง reject/rethrow
// ตามหลัก ARM-AES: DAL ไม่ swallow error ทุก error ปล่อยผ่านสู่ route layer
// ============================================================

const dbError = { message: "boom", code: "500", details: "" };

vi.mock("@/lib/supabase/server", () => {
  const createPromise = () =>
    Promise.resolve({ data: null, error: dbError, count: null, status: 500, statusText: "Error" });

  const buildQuery = () => {
    const q: Record<string, unknown> = {};
    [
      "select",
      "eq",
      "neq",
      "gt",
      "gte",
      "lt",
      "lte",
      "ilike",
      "like",
      "in",
      "or",
      "order",
      "limit",
      "range",
      "single",
      "maybeSingle",
      "insert",
      "update",
      "upsert",
      "delete",
      "returning",
      "abortSignal",
    ].forEach((m) => {
      q[m] = () => q;
    });
    q.then = (onFulfilled: (v: unknown) => unknown) =>
      createPromise().then(onFulfilled);
    return q as PromiseLike<{ data: unknown; error: unknown }> & {
      [method: string]: unknown;
    };
  };

  return {
    supabaseServer: {
      from: vi.fn(() => buildQuery()),
      auth: {
        admin: {
          listUsers: vi.fn(),
        },
      },
    },
  };
});

import { JumboRepository } from "@/lib/supabase/repository";

describe("JumboRepository - error propagation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes through errors instead of swallowing them", async () => {
    const expectThrow = (p: Promise<unknown>) =>
      expect(p).rejects.toThrow(/boom/);

    await expectThrow(JumboRepository.getUsers());
    await expectThrow(JumboRepository.getUserById("id"));
    await expectThrow(JumboRepository.getUserByPhone("0800000000"));
    await expectThrow(
      JumboRepository.createUser({ id: "id", phone: "0800000000" })
    );
    await expectThrow(JumboRepository.updateUser("id", {}));
    await expectThrow(JumboRepository.getDrivers());
    await expectThrow(JumboRepository.getDriverById("id"));
    await expectThrow(JumboRepository.getDriverByUserId("id"));
    await expectThrow(JumboRepository.setDriverOnline("id", true));
    await expectThrow(JumboRepository.updateDriverLocation("id", 1, 2));
    await expectThrow(JumboRepository.updateDriver("id", {}));
    await expectThrow(JumboRepository.getVehicleTypes());
    await expectThrow(JumboRepository.getVehicleTypeById("id"));
    await expectThrow(JumboRepository.updateVehicleType("id", {}));
    await expectThrow(JumboRepository.getVehicles());
    await expectThrow(JumboRepository.getBookings());
    await expectThrow(JumboRepository.getBookingsByUser("id"));
    await expectThrow(JumboRepository.getBookingsByDriver("id"));
    await expectThrow(JumboRepository.getAvailableJobs());
    await expectThrow(JumboRepository.getBookingById("id"));
    await expectThrow(
      JumboRepository.createBooking({
        user_id: "user",
        vehicle_type: "PICKUP",
        status: "searching",
        fare: 100,
      } as never)
    );
    await expectThrow(
      JumboRepository.addBookingLocation({
        booking_id: "b",
        type: "pickup",
        address: "a",
        lat: 1,
        lng: 2,
        sequence: 0,
      } as never)
    );
    await expectThrow(JumboRepository.updateBooking("id", {}));
    await expectThrow(JumboRepository.createDeliveryProof({
      booking_id: "b",
      driver_id: "d",
      proof_type: "delivery",
      photo_url: "u",
    } as never));
    await expectThrow(JumboRepository.getKycStatus("id"));
    await expectThrow(JumboRepository.upsertKyc("id", {}));
    await expectThrow(JumboRepository.getKycList());
    await expectThrow(JumboRepository.reviewKyc("id", "approved"));
    await expectThrow(JumboRepository.getSavedLocations("id"));
    await expectThrow(JumboRepository.searchSavedLocations("q"));
    await expectThrow(JumboRepository.getNotificationsByRole("user"));
    await expectThrow(JumboRepository.getNotificationsByUser("id"));
    await expectThrow(JumboRepository.markNotificationRead("id"));
    await expectThrow(
      JumboRepository.createNotification({
        type: "info",
        title: "t",
        message: "m",
      } as never)
    );
    await expectThrow(
      JumboRepository.addReview("b", "u", "d", 5)
    );
    await expectThrow(JumboRepository.getReviewsByDriver("id"));
    await expectThrow(JumboRepository.getPayments());
    await expectThrow(JumboRepository.getTransactionsByDriver("id"));
    await expectThrow(JumboRepository.getDriverWallet("id"));
    await expectThrow(JumboRepository.getAdminStats());
  });
});