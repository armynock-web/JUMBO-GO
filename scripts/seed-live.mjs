// JUMBO GO - Live Supabase Seed (aligned to REAL live schema, verified)
// Run: node scripts/seed-live.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const vars = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return vars;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing env. Put NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const CUSTOMER_ID = "11111111-1111-1111-1111-111111111006";
const DRIVER_USER_ID = "11111111-1111-1111-1111-111111111002";
const DRIVER_ID = "33333333-3333-3333-3333-333333333001";
const VEHICLE_ID = "22222222-2222-2222-2222-222222222001";
const ADMIN_USER_ID = "11111111-1111-1111-1111-111111111001";

async function upsert(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`  [${table}] ERROR: ${error.message}`);
    return false;
  }
  return true;
}

async function insert(table, rows) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`  [${table}] ERROR: ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  console.log("=== JUMBO GO - SEED LIVE (schema v2 / real) ===\n");

  console.log("[1/7] users");
  await upsert("users", [
    { id: CUSTOMER_ID, email: "somying@jumbogo.com", phone: "082-345-6789", first_name: "สมหญิง", last_name: "ใจเย็น", role: "user" },
    { id: DRIVER_USER_ID, email: "somchai@jumbogo.com", phone: "081-234-5678", first_name: "สมชาย", last_name: "ใจดี", role: "driver" },
    { id: ADMIN_USER_ID, email: "admin@jumbogo.com", phone: "080-000-0001", first_name: "แอดมิน", last_name: "ส่วนกลาง", role: "admin" },
  ], "id");

  console.log("[2/7] vehicles");
  await upsert("vehicles", [
    { id: VEHICLE_ID, driver_id: DRIVER_ID, type: "pickup_box", brand: "Isuzu", model: "D-Max", year: 2023, plate_number: "ขข 1234", color: "ขาว", is_active: true },
  ], "id");

  console.log("[3/7] drivers");
  await upsert("drivers", [
    { id: DRIVER_ID, user_id: DRIVER_USER_ID, phone: "081-234-5678", first_name: "สมชาย", last_name: "ใจดี", vehicle_id: VEHICLE_ID, is_verified: true, is_online: true },
  ], "id");

  console.log("[4/7] driver_kyc");
  await upsert("driver_kyc", [
    { id: "44444444-4444-4444-4444-444444444001", driver_id: DRIVER_ID, status: "approved" },
  ], "id");

  console.log("[5/7] bookings + booking_locations");
  const b1 = await upsert("bookings", [
    { id: "55555555-5555-5555-5555-555555555001", job_number: "JG-2026-00101", user_id: CUSTOMER_ID, driver_id: DRIVER_ID, vehicle_type: "pickup_box", status: "in_transit", fare: 819, base_fare: 450, distance_fare: 319, distance_km: 17.7, duration_min: 40, sender_name: "สมหญิง ใจเย็น", sender_phone: "082-345-6789", receiver_name: "ผู้รับปลายทาง", receiver_phone: "081-999-8888" },
    { id: "55555555-5555-5555-5555-555555555002", job_number: "JG-2026-00100", user_id: CUSTOMER_ID, driver_id: DRIVER_ID, vehicle_type: "pickup", status: "completed", fare: 650, base_fare: 350, distance_fare: 300, distance_km: 20, duration_min: 45, sender_name: "สมหญิง ใจเย็น", sender_phone: "082-345-6789", receiver_name: "ผู้รับปลายทาง", receiver_phone: "081-999-8888" },
  ], "id");

  if (b1) {
    await insert("booking_locations", [
      { booking_id: "55555555-5555-5555-5555-555555555001", type: "pickup", address: "สยามพารากอน (จุดรับสินค้า)", lat: 13.7462, lng: 100.5347, sequence: 0 },
      { booking_id: "55555555-5555-5555-5555-555555555001", type: "dropoff", address: "เมกาบางนา (จุดส่งสินค้า)", lat: 13.6467, lng: 100.6802, sequence: 1 },
      { booking_id: "55555555-5555-5555-5555-555555555002", type: "pickup", address: "บ้าน (บางนา-ตราด กม. 4)", lat: 13.6682, lng: 100.614, sequence: 0 },
      { booking_id: "55555555-5555-5555-5555-555555555002", type: "dropoff", address: "สนามบินสุวรรณภูมิ คลังสินค้า 3", lat: 13.69, lng: 100.75, sequence: 1 },
    ]);
  }

  console.log("[6/7] notifications");
  await insert("notifications", [
    { user_id: CUSTOMER_ID, type: "driver_accepted", title: "คนขับรับงานแล้ว!", message: "สมชาย ใจดี (★4.8) รับงานของคุณแล้ว กำลังมารับ", is_read: false, data: { role: "customer", priority: "high" } },
    { user_id: DRIVER_USER_ID, type: "new_job_nearby", title: "มีงานใหม่ใกล้ตัว!", message: "งานใหม่ห่างจากคุณ 4.2 กม. รายได้ ฿819 กรุณาตอบรับ", is_read: false, data: { role: "driver", priority: "urgent", amount: 819 } },
    { user_id: ADMIN_USER_ID, type: "admin_action_required", title: "ตรวจ KYC", message: "มี KYC รอตรวจ 1 รายการ", is_read: false, data: { role: "admin", priority: "normal" } },
  ]);

  console.log("[7/7] payments");
  await insert("payments", [
    { booking_id: "55555555-5555-5555-5555-555555555001", amount: 819, method: "promptpay", status: "unpaid", transaction_id: "TXN-2026-00101" },
    { booking_id: "55555555-5555-5555-5555-555555555002", amount: 650, method: "cash", status: "paid", transaction_id: "TXN-2026-00100" },
  ]);

  console.log("\n=== VERIFY COUNTS ===");
  const tables = ["users", "drivers", "vehicles", "driver_kyc", "bookings", "booking_locations", "notifications", "payments"];
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    console.log(`  ${t}: ${error ? "ERROR " + error.message : count + " rows"}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });