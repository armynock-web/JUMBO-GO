import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function runSeedAndTest() {
  console.log("=== JUMBO GO - LIVE SUPABASE SEED & INTEGRATION VERIFICATION ===");

  // 1. Seed Users
  console.log("\n[1/6] Seeding Users...");
  const usersToSeed = [
    {
      id: "11111111-1111-1111-1111-111111111001",
      email: "admin@jumbogo.com",
      phone: "080-000-0001",
      first_name: "แอดมิน",
      last_name: "ส่วนกลาง",
      role: "admin",
    },
    {
      id: "11111111-1111-1111-1111-111111111002",
      email: "somchai@jumbogo.com",
      phone: "081-234-5678",
      first_name: "สมชาย",
      last_name: "ใจดี",
      role: "driver",
    },
    {
      id: "11111111-1111-1111-1111-111111111003",
      email: "wandee@jumbogo.com",
      phone: "081-555-1212",
      first_name: "วันดี",
      last_name: "มีสุข",
      role: "driver",
    },
    {
      id: "11111111-1111-1111-1111-111111111004",
      email: "anucha@jumbogo.com",
      phone: "089-999-9999",
      first_name: "อนุชา",
      last_name: "รักไทย",
      role: "driver",
    },
    {
      id: "11111111-1111-1111-1111-111111111005",
      email: "prayuth@jumbogo.com",
      phone: "085-111-2222",
      first_name: "ประยุทธ",
      last_name: "สดใส",
      role: "driver",
    },
    {
      id: "11111111-1111-1111-1111-111111111006",
      email: "somying@jumbogo.com",
      phone: "082-345-6789",
      first_name: "สมหญิง",
      last_name: "ใจเย็น",
      role: "user",
    },
  ];

  for (const u of usersToSeed) {
    const { error } = await supabase.from("users").upsert(u);
    if (error) console.error("User upsert error:", u.email, error.message);
    else console.log("✓ User synced:", u.first_name, u.last_name, `(${u.role})`);
  }

  // 2. Seed Vehicles
  console.log("\n[2/6] Seeding Vehicles...");
  const vehiclesToSeed = [
    {
      id: "22222222-2222-2222-2222-222222222001",
      type: "กระบะตู้ทึบ",
      brand: "Isuzu",
      model: "D-Max Spark",
      year: 2023,
      plate_number: "ขข 1234",
      color: "ขาว",
      is_active: true,
    },
    {
      id: "22222222-2222-2222-2222-222222222002",
      type: "6 ล้อ",
      brand: "Hino",
      model: "500 Series",
      year: 2022,
      plate_number: "กก 5678",
      color: "ขาว",
      is_active: true,
    },
    {
      id: "22222222-2222-2222-2222-222222222003",
      type: "จัมโบ้",
      brand: "Toyota",
      model: "Hilux Revo Jumbo",
      year: 2024,
      plate_number: "ขค 9012",
      color: "บรอนซ์เงิน",
      is_active: true,
    },
    {
      id: "22222222-2222-2222-2222-222222222004",
      type: "กระบะ",
      brand: "Toyota",
      model: "Hilux Revo Single Cab",
      year: 2021,
      plate_number: "กง 3456",
      color: "เทา",
      is_active: true,
    },
  ];

  for (const v of vehiclesToSeed) {
    const { error } = await supabase.from("vehicles").upsert(v);
    if (error) console.error("Vehicle upsert error:", v.plate_number, error.message);
    else console.log("✓ Vehicle synced:", v.brand, v.model, `(${v.type} ทะเบียน ${v.plate_number})`);
  }

  // 3. Seed Drivers
  console.log("\n[3/6] Seeding Drivers...");
  const driversToSeed = [
    {
      id: "33333333-3333-3333-3333-333333333001",
      user_id: "11111111-1111-1111-1111-111111111002",
      phone: "081-234-5678",
      first_name: "สมชาย",
      last_name: "ใจดี",
      vehicle_id: "22222222-2222-2222-2222-222222222001",
      is_verified: true,
      is_online: true,
      rating_avg: 4.8,
      rating_count: 128,
      total_earnings: 38400,
    },
    {
      id: "33333333-3333-3333-3333-333333333002",
      user_id: "11111111-1111-1111-1111-111111111003",
      phone: "081-555-1212",
      first_name: "วันดี",
      last_name: "มีสุข",
      vehicle_id: "22222222-2222-2222-2222-222222222002",
      is_verified: true,
      is_online: false,
      rating_avg: 4.9,
      rating_count: 112,
      total_earnings: 32100,
    },
    {
      id: "33333333-3333-3333-3333-333333333003",
      user_id: "11111111-1111-1111-1111-111111111004",
      phone: "089-999-9999",
      first_name: "อนุชา",
      last_name: "รักไทย",
      vehicle_id: "22222222-2222-2222-2222-222222222003",
      is_verified: true,
      is_online: false,
      rating_avg: 4.7,
      rating_count: 98,
      total_earnings: 28500,
    },
    {
      id: "33333333-3333-3333-3333-333333333004",
      user_id: "11111111-1111-1111-1111-111111111005",
      phone: "085-111-2222",
      first_name: "ประยุทธ",
      last_name: "สดใส",
      vehicle_id: "22222222-2222-2222-2222-222222222004",
      is_verified: false,
      is_online: false,
      rating_avg: 4.6,
      rating_count: 45,
      total_earnings: 14200,
    },
  ];

  for (const d of driversToSeed) {
    const { error } = await supabase.from("drivers").upsert(d);
    if (error) console.error("Driver upsert error:", d.first_name, error.message);
    else console.log("✓ Driver synced:", d.first_name, d.last_name, `(Rating ${d.rating_avg}★)`);
  }

  // 4. Seed Bookings & Locations
  console.log("\n[4/6] Seeding Bookings & Locations...");
  const bookingsToSeed = [
    {
      id: "55555555-5555-5555-5555-555555555001",
      user_id: "11111111-1111-1111-1111-111111111006",
      driver_id: "33333333-3333-3333-3333-333333333001",
      vehicle_type: "pickup_box",
      status: "in_transit",
      fare: 619.0,
      distance_km: 23.5,
      duration_min: 45,
    },
    {
      id: "55555555-5555-5555-5555-555555555002",
      user_id: "11111111-1111-1111-1111-111111111006",
      driver_id: "33333333-3333-3333-3333-333333333002",
      vehicle_type: "pickup",
      status: "completed",
      fare: 450.0,
      distance_km: 25.0,
      duration_min: 50,
    },
  ];

  for (const b of bookingsToSeed) {
    const { error } = await supabase.from("bookings").upsert(b);
    if (error) console.error("Booking upsert error:", b.id, error.message);
    else console.log("✓ Booking synced:", b.vehicle_type, `฿${b.fare}`, `(${b.status})`);
  }

  const locationsToSeed = [
    {
      id: "66666666-6666-6666-6666-666666666001",
      booking_id: "55555555-5555-5555-5555-555555555001",
      type: "pickup",
      address: "บ้าน (บางนา-ตราด กม. 4)",
      lat: 13.668217,
      lng: 100.614021,
      sequence: 1,
    },
    {
      id: "66666666-6666-6666-6666-666666666002",
      booking_id: "55555555-5555-5555-5555-555555555001",
      type: "dropoff",
      address: "สนามบินสุวรรณภูมิ คลังสินค้า 3",
      lat: 13.69,
      lng: 100.75,
      sequence: 2,
    },
  ];

  for (const l of locationsToSeed) {
    const { error } = await supabase.from("booking_locations").upsert(l);
    if (error) console.error("Location upsert error:", l.address, error.message);
    else console.log("✓ Location synced:", l.type, "->", l.address);
  }

  // 5. Seed Payments
  console.log("\n[5/6] Seeding Payments...");
  const paymentsToSeed = [
    {
      id: "77777777-7777-7777-7777-777777777001",
      booking_id: "55555555-5555-5555-5555-555555555001",
      amount: 619.0,
      method: "promptpay",
      status: "completed",
      transaction_id: "TXN-5021",
    },
    {
      id: "77777777-7777-7777-7777-777777777002",
      booking_id: "55555555-5555-5555-5555-555555555002",
      amount: 450.0,
      method: "cash",
      status: "completed",
      transaction_id: "TXN-5020",
    },
  ];

  for (const p of paymentsToSeed) {
    const { error } = await supabase.from("payments").upsert(p);
    if (error) console.error("Payment upsert error:", p.transaction_id, error.message);
    else console.log("✓ Payment synced:", p.transaction_id, `฿${p.amount}`, `(${p.status})`);
  }

  // 6. Seed Notifications
  console.log("\n[6/6] Seeding Notifications...");
  const notificationsToSeed = [
    {
      id: "88888888-8888-8888-8888-888888888001",
      user_id: "11111111-1111-1111-1111-111111111006",
      type: "driver_accepted",
      title: "คนขับรับงานแล้ว!",
      message: "สมชาย ใจดี (★4.8) รับงาน JG-2025-00108 ของคุณแล้ว กำลังมารับ",
      is_read: false,
      data: { role: "customer", priority: "high", jobId: "JG-2025-00108" },
    },
    {
      id: "88888888-8888-8888-8888-888888888002",
      user_id: "11111111-1111-1111-1111-111111111002",
      type: "new_job_nearby",
      title: "มีงานใหม่ใกล้ตัว!",
      message: "งานใหม่ห่างจากคุณ 4.2 กม. รายได้ ฿520 กรุณาตอบรับภายใน 30 วินาที",
      is_read: false,
      data: { role: "driver", priority: "urgent", amount: 520 },
    },
    {
      id: "88888888-8888-8888-8888-888888888003",
      user_id: "11111111-1111-1111-1111-111111111001",
      type: "admin_action_required",
      title: "ต้องให้แอดมินจัดการ: KYC ค้าง",
      message: "มี KYC รอตรวจ 14 รายการ เกิน 24 ชม. กรุณาเร่งตรวจเพื่อรักษา SLA",
      is_read: false,
      data: { role: "admin", priority: "normal", target: "admin-kyc" },
    },
  ];

  for (const n of notificationsToSeed) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("notifications").upsert(n as any);
    if (error) console.error("Notification upsert error:", n.title, error.message);
    else console.log("✓ Notification synced:", n.title);
  }

  console.log("\n============================================================");
  console.log("VERIFYING COUNTS ACROSS ALL LIVE SUPABASE TABLES:");
  const tables = ["users", "drivers", "vehicles", "bookings", "booking_locations", "payments", "notifications"];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    if (error) console.log(`  - ${t}: Error: ${error.message}`);
    else console.log(`  - ${t}: ${count} rows`);
  }
  console.log("============================================================\n");
}

runSeedAndTest().catch(console.error);
