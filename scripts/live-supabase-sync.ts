import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://oqopribnhovxfaxnjoia.supabase.co";
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "SUPABASE_SERVICE_ROLE_KEY_REPLACED";

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("==================================================================");
  console.log("JUMBO GO: VERIFYING & SYNCHRONIZING REAL DATA TO SUPABASE LIVE");
  console.log("Supabase Project URL:", url);
  console.log("==================================================================\n");

  // 1. Check or create Auth Users for Somchai, Wandee, Somying, Admin
  const seedAccounts = [
    { email: "somchai@jumbogo.com", pass: "Jumbo123456!", name: "สมชาย", surname: "ใจดี", role: "driver", phone: "081-234-5678" },
    { email: "wandee@jumbogo.com", pass: "Jumbo123456!", name: "วันดี", surname: "มีสุข", role: "driver", phone: "081-555-1212" },
    { email: "somying@jumbogo.com", pass: "Jumbo123456!", name: "สมหญิง", surname: "ใจเย็น", role: "user", phone: "082-345-6789" },
  ];

  const userMap: Record<string, string> = {};

  const { data: existingAuth } = await supabase.auth.admin.listUsers();
  const existingByEmail = new Map<string, string>((existingAuth?.users.map((u) => [u.email, u.id] as [string, string]) || []));

  for (const acc of seedAccounts) {
    let authId = existingByEmail.get(acc.email);
    if (!authId) {
      console.log(`Creating auth user: ${acc.email}...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.pass,
        email_confirm: true,
        user_metadata: { first_name: acc.name, last_name: acc.surname, role: acc.role },
      });
      if (error) {
        console.error(`  Error creating auth user ${acc.email}:`, error.message);
        continue;
      }
      authId = data.user.id;
    }
    userMap[acc.email] = authId as string;

    // Sync into public.users
    const { error: userUpsertError } = await supabase.from("users").upsert({
      id: authId,
      email: acc.email,
      phone: acc.phone,
      first_name: acc.name,
      last_name: acc.surname,
      role: acc.role,
    });
    if (userUpsertError) {
      console.error(`  Error syncing public.users (${acc.name}):`, userUpsertError.message);
    } else {
      console.log(`✓ public.users synced: ${acc.name} ${acc.surname} [${acc.role}] (ID: ${authId})`);
    }
  }

  // 2. Sync Vehicles
  console.log("\n[Syncing Vehicles]");
  const vehicleItems = [
    { brand: "Isuzu", model: "D-Max Spark", year: 2023, plate_number: "ขข 1234", color: "ขาว", type: "van", is_active: true },
    { brand: "Hino", model: "500 Series", year: 2022, plate_number: "กก 5678", color: "ขาว", type: "van", is_active: true },
    { brand: "Toyota", model: "Hilux Revo", year: 2024, plate_number: "ขค 9012", color: "บรอนซ์เงิน", type: "car", is_active: true },
  ];

  const vehicleMap: Record<string, string> = {};
  for (const v of vehicleItems) {
    // Check if plate exists
    const { data: existingV } = await supabase.from("vehicles").select("id").eq("plate_number", v.plate_number).maybeSingle();
    if (existingV) {
      vehicleMap[v.plate_number] = existingV.id;
      console.log(`✓ Vehicle exists: ${v.brand} ${v.model} (${v.plate_number})`);
    } else {
      const { data: newV, error } = await supabase.from("vehicles").insert(v).select().single();
      if (error) {
        console.error(`  Error inserting vehicle ${v.plate_number}:`, error.message);
      } else {
        vehicleMap[v.plate_number] = newV.id;
        console.log(`✓ Vehicle created: ${v.brand} ${v.model} (${v.plate_number})`);
      }
    }
  }

  // 3. Sync Drivers
  console.log("\n[Syncing Drivers]");
  const driverSomchaiId = userMap["somchai@jumbogo.com"];
  const somchaiVehicleId = vehicleMap["ขข 1234"];

  if (driverSomchaiId && somchaiVehicleId) {
    const { data: existingD } = await supabase.from("drivers").select("id").eq("user_id", driverSomchaiId).maybeSingle();
    let driverId = existingD?.id;
    if (!existingD) {
      const { data: newD, error } = await supabase.from("drivers").insert({
        user_id: driverSomchaiId,
        phone: "081-234-5678",
        first_name: "สมชาย",
        last_name: "ใจดี",
        vehicle_id: somchaiVehicleId,
        is_verified: true,
        is_online: true,
        rating_avg: 4.8,
        rating_count: 128,
        total_earnings: 38400,
      }).select().single();
      if (error) console.error("  Error creating driver Somchai:", error.message);
      else {
        driverId = newD.id;
        console.log("✓ Driver Somchai created:", driverId);
      }
    } else {
      console.log("✓ Driver Somchai already exists:", driverId);
    }

    // 4. Sync Bookings
    console.log("\n[Syncing Sample Bookings]");
    const customerId = userMap["somying@jumbogo.com"];
    if (customerId && driverId) {
      const { data: booking, error: bErr } = await supabase.from("bookings").insert({
        user_id: customerId,
        driver_id: driverId,
        vehicle_type: "van",
        status: "accepted",
        fare: 619.0,
        distance_km: 23.5,
        duration_min: 45,
      }).select().single();

      if (bErr) {
        console.error("  Booking insert error:", bErr.message);
      } else {
        console.log("✓ Live Booking created:", booking.id, `fare: ฿${booking.fare}`);

        // Add Locations
        const { error: locErr } = await supabase.from("booking_locations").insert([
          { booking_id: booking.id, type: "pickup", address: "บ้าน (บางนา-ตราด กม. 4)", lat: 13.668217, lng: 100.614021, sequence: 1 },
          { booking_id: booking.id, type: "dropoff", address: "สนามบินสุวรรณภูมิ คลังสินค้า 3", lat: 13.69, lng: 100.75, sequence: 2 },
        ]);
        if (locErr) console.error("  Location insert error:", locErr.message);
        else console.log("✓ Booking locations attached (Pickup -> Dropoff)");

        // Add Payment
        const { error: payErr } = await supabase.from("payments").insert({
          booking_id: booking.id,
          amount: 619.0,
          method: "promptpay",
          status: "paid",
          transaction_id: "TXN-5021",
        });
        if (payErr) console.error("  Payment insert error:", payErr.message);
        else console.log("✓ Payment record attached (TXN-5021: ฿619.00 paid)");
      }
    }
  }

  // 5. Sync Notifications
  console.log("\n[Syncing Notifications]");
  const customerSomyingId = userMap["somying@jumbogo.com"];
  if (customerSomyingId) {
    const { error: notifErr } = await supabase.from("notifications").insert([
      {
        user_id: customerSomyingId,
        type: "booking",
        title: "คนขับรับงานแล้ว!",
        message: "สมชาย ใจดี (★4.8) รับงานขนส่งของคุณแล้ว กำลังเดินทางมารับ",
        is_read: false,
        data: { role: "customer", priority: "high", vehicle: "กระบะตู้ทึบ" },
      },
      {
        user_id: customerSomyingId,
        type: "payment",
        title: "ชำระเงินสำเร็จ ฿619.00",
        message: "ระบบได้รับยอดชำระผ่านพร้อมเพย์เรียบร้อย ขอบคุณที่ใช้บริการ JUMBO GO",
        is_read: true,
        data: { role: "customer", txn: "TXN-5021" },
      },
    ]);
    if (notifErr) console.error("  Notification sync error:", notifErr.message);
    else console.log("✓ Sample notifications inserted for Customer");
  }

  // Final count check
  console.log("\n==================================================================");
  console.log("CURRENT LIVE SUPABASE DATA AUDIT:");
  for (const t of ["users", "drivers", "vehicles", "bookings", "booking_locations", "payments", "notifications"]) {
    const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
    console.log(`  Table [${t.padEnd(18)}]: ${count ?? 0} records`);
  }
  console.log("==================================================================");
}

main().catch(console.error);
