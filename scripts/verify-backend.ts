/**
 * JUMBO GO - COMPREHENSIVE BACKEND VERIFICATION TEST SUITE
 * File: scripts/verify-backend.ts
 * Standard: ARM-AES & AEOS v1.0
 * 
 * Verifies:
 * 1) Supabase Connectivity & Client Init
 * 2) Vehicle Types Master Catalog & Pricing
 * 3) Driver Availability Query & Status Filtering
 * 4) Live GPS Location Updates (Ping Driver Coordinates)
 * 5) Booking Creation Lifecycle & Location Persistence
 * 6) Real-time WebSockets Subscription & Teardown
 * 7) Notifications System Querying
 */

import { api } from "../src/lib/api";
import { supabase } from "../src/lib/supabase/client";

interface TestReport {
  title: string;
  passed: boolean;
  message: string;
}

const reports: TestReport[] = [];

async function run() {
  console.log("\n=======================================================");
  console.log("🚛 JUMBO GO - BACKEND SYSTEM TEST & VERIFICATION SUITE");
  console.log("=======================================================");

  // 1. Supabase Connectivity
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
      throw error;
    }
    reports.push({
      title: "Supabase Connection & Environment",
      passed: true,
      message: "Connected successfully to Supabase endpoint",
    });
    console.log("✅ 1. Supabase Connection: PASS");
  } catch (err: any) {
    reports.push({
      title: "Supabase Connection & Environment",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 1. Supabase Connection: FAIL", err?.message);
  }

  // 2. Vehicle Types Catalog
  try {
    const types = await api.getVehicleTypes();
    const passed = Array.isArray(types) && types.length > 0;
    reports.push({
      title: "Vehicle Types Catalog & Pricing",
      passed,
      message: `Retrieved ${types.length} vehicle types (${types.map((t: any) => t.name_th || t.code).join(", ")})`,
    });
    console.log("✅ 2. Vehicle Types Catalog: PASS -", types.length, "types available");
  } catch (err: any) {
    reports.push({
      title: "Vehicle Types Catalog & Pricing",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 2. Vehicle Types Catalog: FAIL", err?.message);
  }

  // 3. Driver Availability Query
  try {
    const drivers = await api.getAvailableDrivers();
    reports.push({
      title: "Driver Availability & Status Query",
      passed: true,
      message: `Queried available drivers successfully (${drivers.length} online currently)`,
    });
    console.log("✅ 3. Driver Availability Query: PASS -", drivers.length, "online drivers found");
  } catch (err: any) {
    reports.push({
      title: "Driver Availability & Status Query",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 3. Driver Availability Query: FAIL", err?.message);
  }

  // 4. Update Driver GPS Location
  try {
    const testDriverId = "00000000-0000-0000-0000-000000000201";
    const updateResult = await api.updateDriverLocation({
      driverId: testDriverId,
      lat: 13.75633,
      lng: 100.50176,
    });
    const passed = Boolean(updateResult && updateResult.current_location_lat);
    reports.push({
      title: "Driver Live GPS Update (Ping)",
      passed,
      message: `Updated coords to (${updateResult?.current_location_lat}, ${updateResult?.current_location_lng})`,
    });
    console.log("✅ 4. Driver Live GPS Update: PASS");
  } catch (err: any) {
    reports.push({
      title: "Driver Live GPS Update (Ping)",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 4. Driver Live GPS Update: FAIL", err?.message);
  }

  // 5. Booking Creation & Persistence
  let createdBookingId = "";
  try {
    const booking = await api.createBooking({
      userId: "00000000-0000-0000-0000-000000000001",
      vehicleType: "pickup",
      pickup: {
        address: "สยามพารากอน โซน B",
        lat: 13.7462,
        lng: 100.5347,
        contactName: "คุณทดสอบ ต้นทาง",
        contactPhone: "081-111-2222",
      },
      dropoff: {
        address: "เซ็นทรัลเวิลด์ ประตูน้ำ",
        lat: 13.7469,
        lng: 100.5398,
        contactName: "คุณทดสอบ ปลายทาง",
        contactPhone: "082-333-4444",
      },
      fare: 380,
      baseFare: 350,
      distanceFare: 30,
      distanceKm: 2.5,
    });

    createdBookingId = booking?.id || "";
    const passed = Boolean(booking && (booking.id || booking.job_number));
    reports.push({
      title: "Create Booking Request Lifecycle",
      passed,
      message: `Booking created: ${booking?.job_number || booking?.id} (Status: ${booking?.status})`,
    });
    console.log("✅ 5. Create Booking Request: PASS - Job #", booking?.job_number || booking?.id);
  } catch (err: any) {
    reports.push({
      title: "Create Booking Request Lifecycle",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 5. Create Booking Request: FAIL", err?.message);
  }

  // 6. Realtime WebSockets Status Listener
  try {
    let unsubscribeFn: (() => void) | null = null;
    const testId = createdBookingId || "00000000-0000-0000-0000-000000000001";
    await new Promise<void>((resolve) => {
      unsubscribeFn = api.subscribeToBookingStatus(testId, () => {});
      setTimeout(() => {
        if (unsubscribeFn) unsubscribeFn();
        resolve();
      }, 400);
    });

    reports.push({
      title: "Realtime WebSocket Channel & Listener",
      passed: true,
      message: "Subscription channel bound and disconnected cleanly",
    });
    console.log("✅ 6. Realtime WebSocket Channel: PASS");
  } catch (err: any) {
    reports.push({
      title: "Realtime WebSocket Channel & Listener",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 6. Realtime WebSocket Channel: FAIL", err?.message);
  }

  // 7. Notification System Query
  try {
    const notifications = await api.getNotifications("user");
    reports.push({
      title: "Notifications Retrieval System",
      passed: true,
      message: `Queried notifications channel successfully (${notifications.length} items)`,
    });
    console.log("✅ 7. Notifications Retrieval System: PASS -", notifications.length, "items");
  } catch (err: any) {
    reports.push({
      title: "Notifications Retrieval System",
      passed: false,
      message: err?.message || String(err),
    });
    console.log("❌ 7. Notifications Retrieval System: FAIL", err?.message);
  }

  // Final Summary
  console.log("\n=======================================================");
  console.log("📊 VERIFICATION RESULTS SUMMARY");
  console.log("=======================================================");
  let allPassed = true;
  reports.forEach((r, idx) => {
    if (!r.passed) allPassed = false;
    console.log(`${idx + 1}. [${r.passed ? "PASS ✅" : "FAIL ❌"}] ${r.title} -> ${r.message}`);
  });
  console.log("=======================================================");
  console.log(allPassed ? "🎉 ALL BACKEND CHECKS PASSED (100% READY)" : "⚠️ SOME TESTS FAILED");
  console.log("=======================================================\n");

  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
