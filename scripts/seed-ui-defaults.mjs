/**
 * JUMBO GO — Seed UI Default Data → Supabase
 * รันด้วย: npm run seed  หรือ  node scripts/seed-ui-defaults.mjs
 *
 * Seed:
 *   1. vehicle_types  (5 ประเภท — brand.ts เป็น Source of Truth)
 *   2. saved_locations (5 สถานที่ตัวอย่าง)
 *
 * saved_locations schema (จาก Supabase จริง):
 *   id, user_id, label, address, lat, lng, contact_name, contact_phone, is_default, created_at
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oqopribnhovxfaxnjoia.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "SUPABASE_SERVICE_ROLE_KEY_REPLACED";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Vehicle Types (brand.ts → DB) ───────────────────────────────────────────
// Schema จริง: id, name, category, base_fare, base_distance_km, price_per_km,
//              capacity_kg, dimension_text, description, popular, is_active
const VEHICLE_TYPES = [
  {
    id: "pickup",
    name: "กระบะ",
    category: "pickup",
    base_fare: 150,
    base_distance_km: 4,
    price_per_km: 12,
    capacity_kg: 1000,
    dimension_text: "1.7 x 2.2 x 0.8 ม.",
    description: "ส่งของเล็ก ย้ายห้อง ขนของทั่วไป",
    popular: false,
    is_active: true,
  },
  {
    id: "pickup_box",
    name: "กระบะตู้ทึบ",
    category: "pickup",
    base_fare: 220,
    base_distance_km: 4,
    price_per_km: 15,
    capacity_kg: 1200,
    dimension_text: "1.7 x 2.2 x 2.1 ม.",
    description: "กันฝนกันแดด เหมาะขนเอกสาร อุปกรณ์อิเล็กทรอนิกส์",
    popular: true,
    is_active: true,
  },
  {
    id: "pickup_fence",
    name: "กระบะคอก",
    category: "pickup",
    base_fare: 240,
    base_distance_km: 4,
    price_per_km: 16,
    capacity_kg: 1500,
    dimension_text: "1.7 x 2.2 x 1.9 ม.",
    description: "คอกสูง ขนของสูงหรือยาวได้ดี",
    popular: false,
    is_active: true,
  },
  {
    id: "jumbo",
    name: "จัมโบ้",
    category: "jumbo",
    base_fare: 420,
    base_distance_km: 5,
    price_per_km: 22,
    capacity_kg: 5000,
    dimension_text: "2.2 x 5.0 x 2.4 ม.",
    description: "ย้ายบ้าน ขนของหนัก เฟอร์นิเจอร์ขนาดใหญ่",
    popular: true,
    is_active: true,
  },
  {
    id: "truck_6w",
    name: "6 ล้อ",
    category: "truck",
    base_fare: 650,
    base_distance_km: 5,
    price_per_km: 30,
    capacity_kg: 10000,
    dimension_text: "2.3 x 7.0 x 2.5 ม.",
    description: "ขนของจำนวนมาก งานโรงงาน ขนวัสดุก่อสร้าง",
    popular: false,
    is_active: true,
  },
];


// ─── Saved Locations ─────────────────────────────────────────────────────────
// Schema จริง: id, user_id, label, address, lat, lng, contact_name, contact_phone, is_default
// ใช้ user ตัวอย่างที่มีอยู่แล้วใน DB (role=user)
const SEED_USER_ID = "a9dce7bb-a9cf-4f21-874a-129b0138fd56";

const SAVED_LOCATIONS = [
  {
    user_id: SEED_USER_ID,
    label: "บ้าน",
    address: "99/9 หมู่บ้านพฤกษาวิลล์ ถนนศรีนครินทร์ เขตสวนหลวง กรุงเทพมหานคร",
    lat: 13.7563,
    lng: 100.7014,
    is_default: true,
  },
  {
    user_id: SEED_USER_ID,
    label: "ออฟฟิศ",
    address: "ชั้น 18 อาคารสาทรซิตี้ทาวเวอร์ เขตสาทร กรุงเทพมหานคร",
    lat: 13.7234,
    lng: 100.5345,
    is_default: false,
  },
  {
    user_id: SEED_USER_ID,
    label: "สนามบินสุวรรณภูมิ",
    address: "ท่าอากาศยานสุวรรณภูมิ เขตสายไหม กรุงเทพมหานคร",
    lat: 13.69,
    lng: 100.7501,
    is_default: false,
  },
  {
    user_id: SEED_USER_ID,
    label: "ไอคอนสยาม",
    address: "ศูนย์การค้าไอคอนสยาม เขตคลองสาน กรุงเทพมหานคร",
    lat: 13.7244,
    lng: 100.5098,
    is_default: false,
  },
  {
    user_id: SEED_USER_ID,
    label: "เซ็นทรัลเวสต์เกต",
    address: "ศูนย์การค้าเซ็นทรัล เวสต์เกต เขตหลักสี่ กรุงเทพมหานคร",
    lat: 13.8474,
    lng: 100.5645,
    is_default: false,
  },
];

// ─── Seed Functions ───────────────────────────────────────────────────────────
async function seedVehicleTypes() {
  console.log("\n📦 Seeding vehicle_types...");
  for (const v of VEHICLE_TYPES) {
    const { error } = await supabase
      .from("vehicle_types")
      .upsert(v, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${v.slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${v.slug} (${v.name_th}) — ราคาเริ่มต้น ฿${v.base_fare}`);
    }
  }
}

async function seedSavedLocations() {
  console.log("\n📍 Seeding saved_locations...");

  // ตรวจก่อนว่ามีข้อมูลสำหรับ seed user หรือยัง
  const { data: existing } = await supabase
    .from("saved_locations")
    .select("id, label")
    .eq("user_id", SEED_USER_ID);

  if (existing && existing.length > 0) {
    console.log(`  ℹ มีข้อมูลอยู่แล้ว ${existing.length} แถว:`);
    existing.forEach((l) => console.log(`    - ${l.label}`));
    return;
  }

  const { error, data } = await supabase
    .from("saved_locations")
    .insert(SAVED_LOCATIONS)
    .select();

  if (error) {
    console.error("  ✗ Insert error:", error.message);
  } else {
    console.log(`  ✓ Insert ${data.length} สถานที่สำเร็จ`);
    data.forEach((l) => console.log(`    - ${l.label}`));
  }
}

async function main() {
  console.log("🚀 JUMBO GO — Seed UI Defaults → Supabase");
  console.log(`   URL: ${SUPABASE_URL}`);

  await seedVehicleTypes();
  await seedSavedLocations();

  console.log("\n✅ Seed เสร็จสิ้น");
}

main().catch((err) => {
  console.error("❌ Seed Error:", err);
  process.exit(1);
});
