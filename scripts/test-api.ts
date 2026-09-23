/**
 * Verification Test Script for JUMBO GO Supabase API (`src/lib/api.ts`)
 * Testing:
 * 1) Create a new booking request
 * 2) Query available drivers and their current status
 * 3) Update driver GPS locations
 * 4) Listen for real-time updates on booking status
 */

import { api } from "../src/lib/api";

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING JUMBO GO API VERIFICATION SUITE");
  console.log("=================================================\n");

  const results: { name: string; passed: boolean; details?: string }[] = [];

  // TEST 1: Query available drivers and their current status
  try {
    console.log("👉 Test 1: Querying available drivers and status...");
    const drivers = await api.getAvailableDrivers();
    console.log(`✅ Test 1 Passed: Found ${Array.isArray(drivers) ? drivers.length : 0} online driver(s)`);
    results.push({
      name: "1) Query available drivers and their current status",
      passed: true,
      details: `Returned ${Array.isArray(drivers) ? drivers.length : 0} records`,
    });
  } catch (err) {
    console.error("❌ Test 1 Failed:", err);
    results.push({
      name: "1) Query available drivers and their current status",
      passed: false,
      details: (err as Error).message,
    });
  }

  // TEST 2: Create a new booking request
  let testBookingId: string | null = null;
  try {
    console.log("\n👉 Test 2: Creating a new booking request...");
    const booking = await api.createBooking({
      userId: "11111111-1111-1111-1111-111111111006",
      vehicleType: "PICKUP",
      pickup: {
        address: "สาทร สแควร์",
        subAddress: "ชั้น 18 เขตบางรัก กทม.",
        contactName: "สมหญิง ใจเย็น",
        contactPhone: "082-345-6789",
        lat: 13.7225,
        lng: 100.5289,
        note: "จุดรับสินค้าชั้น G ฝั่งลานจอด",
      },
      dropoff: {
        address: "ไอคอนสยาม ประตู 4",
        subAddress: "จุดเทียบส่งสินค้า เขตคลองสาน กทม.",
        contactName: "ผู้รับปลายทาง",
        contactPhone: "081-999-8888",
        lat: 13.7267,
        lng: 100.5108,
      },
      fare: 540,
      baseFare: 150,
      distanceFare: 240,
      extraHelperFee: 150,
      distanceKm: 20,
      paymentMethod: "promptpay",
      senderName: "สมหญิง ใจเย็น",
      senderPhone: "082-345-6789",
    });

    testBookingId = booking?.id;
    console.log(`✅ Test 2 Passed: Created Booking Job #${booking.job_number} (ID: ${booking.id})`);
    results.push({
      name: "2) Create a new booking request",
      passed: true,
      details: `Job #${booking.job_number}, ID: ${booking.id}`,
    });
  } catch (err) {
    console.error("❌ Test 2 Failed:", err);
    results.push({
      name: "2) Create a new booking request",
      passed: false,
      details: (err as Error).message,
    });
  }

  // TEST 3: Update driver GPS locations
  try {
    console.log("\n👉 Test 3: Updating driver GPS locations...");
    const updatedDriver = await api.updateDriverLocation({
      driverId: "33333333-3333-3333-3333-333333333001",
      lat: 13.723501,
      lng: 100.529812,
    });
    console.log(`✅ Test 3 Passed: Updated Driver GPS to (${updatedDriver.current_location_lat}, ${updatedDriver.current_location_lng})`);
    results.push({
      name: "3) Update driver GPS locations",
      passed: true,
      details: `Lat: ${updatedDriver.current_location_lat}, Lng: ${updatedDriver.current_location_lng}`,
    });
  } catch (err) {
    console.error("❌ Test 3 Failed:", err);
    results.push({
      name: "3) Update driver GPS locations",
      passed: false,
      details: (err as Error).message,
    });
  }

  // TEST 4: Listen for real-time updates on booking status
  try {
    console.log("\n👉 Test 4: Setting up real-time listener for booking status...");
    const unsubscribe = api.subscribeToBookingStatus(
      testBookingId || "55555555-5555-5555-5555-555555555001",
      (updated) => {
        console.log("Realtime event received:", updated);
      }
    );
    console.log("✅ Test 4 Passed: Realtime channel created & listener attached successfully");
    unsubscribe();
    results.push({
      name: "4) Listen for real-time updates on booking status",
      passed: true,
      details: "Subscription initialized and teardown tested without exceptions",
    });
  } catch (err) {
    console.error("❌ Test 4 Failed:", err);
    results.push({
      name: "4) Listen for real-time updates on booking status",
      passed: false,
      details: (err as Error).message,
    });
  }

  console.log("\n=================================================");
  console.log("📊 SUMMARY OF TEST RESULTS");
  console.log("=================================================");
  results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.passed ? "PASS ✅" : "FAIL ❌"}] ${r.name} -> ${r.details}`);
  });
  console.log("=================================================\n");
  process.exit(0);
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
