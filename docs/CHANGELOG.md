# CHANGELOG - JUMBO GO Platform

All notable changes to the database and backend infrastructure of this project will be documented in this file.

## [1.4.0] - 2026-09-24
### Production Assembly & Verified Backend (feature/production-flow-assembly)
- **Vitest Test Suite มาตรฐานเต็มระบบ:**
  - 130 tests / 14 files ผ่านทั้งหมด (unit + integration + route tests) ต่อฐานข้อมูลจริง
  - Coverage ผ่าน threshold ทุกตัว: Statements 84.34% / Branches 74.21% / Functions 80.35% / Lines 86.28%
  - ไฟล์ tests ใหม่: `tests/unit/*` (brand, notifications, utils, api-errors, db, api-subscriptions, repository-errors, pricing, request-auth), `tests/integration/*` (api, api-client, repository), `tests/routes/*` (auth, pricing)
- **Pricing Engine แยกเป็น Library (DRY):**
  - สร้าง `src/lib/pricing.ts` — ฟังก์ชันคำนวณราคาบริสุทธิ์ (base fare + per-km + fees)
  - Refactor `/api/pricing/estimate` และ `/api/driver/jobs` ให้เรียกใช้ lib เดียวกัน
- **แก้ Bug จริงที่ค้นพบจาก tests:**
  - `src/lib/api.ts getAvailableDrivers`: `vehicles` เป็น to-one relation (ตอบกลับเป็น object ไม่ใช่ array) → normalize ให้เป็น array เสมอ กัน `TypeError: vehicles.some is not a function`
  - `src/app/api/auth/register`: Supabase Auth ต้องการเบอร์รูปแบบ E.164 → เพิ่ม helper `toE164()` แปลง `0xx-xxx-xxxx` → `+66xxxxxxxxx` เก็บเบอร์ไทยเดิมใน users table
  - `src/app/api/auth/login`: เบอร์จริงอยู่ใน users table (auth users มี phone ว่าง) → ค้น users table ก่อนด้วย `ilike` แล้ว fallback เทียบ digits ใน auth
- **Schema Migrations บันทึกลง repo (Single Source of Truth):**
  - `supabase/migrations/20260924024145_add_unique_driver_id_to_driver_kyc.sql` — UNIQUE(driver_id) ทำให้ `upsertKyc` ทำงานจริง
  - `supabase/migrations/20260924031840_add_foreign_key_driver_kyc_to_drivers.sql` — FK `driver_kyc.driver_id → drivers.id` (ON DELETE CASCADE)
- **Deploy Preparation:**
  - เพิ่ม `vercel.json` (framework nextjs, region bkk1) และปรับ `.env.example` (ลบ Prisma ที่ไม่ใช้)
  - เพิ่ม scripts `test` / `test:coverage` ใน package.json
  - แก้ id ปลอมใน `scripts/verify-backend.ts` / `scripts/test-api.ts` เป็น id จริงใน production

## [1.3.0] - 2026-09-23
### เฟสที่ 1: ขั้นตอนการเรียกรถสำหรับลูกค้า (Phase 1 Customer Booking Flow)
- **เชื่อมต่อ UI กับ Supabase และ Server Pricing ครบวงจร:**
  - **VehicleTypeScreen (U08):** ดึงรายการประเภทรถ 5 ประเภทจากตาราง `vehicle_types` บน Supabase โดยตรง พร้อมแสดง Badge 'Live DB' และเรทราคาจริง
  - **SummaryScreen (U09):** คำนวณราคาค่าขนส่งแบบ Server-side Verified ผ่าน `/api/pricing/estimate` โดยดึง base_fare และ price_per_km สดจากฐานข้อมูล
  - **ConfirmScreen (U10):** บันทึกใบงานจริง (INSERT INTO `bookings`) ลงในฐานข้อมูล Supabase สำเร็จ พร้อมสร้างรหัสงาน `job_number` (เช่น `JG-2026-XXXXX`)
  - **SearchingScreen (U11):** แสดงเลขที่ใบงานจริงที่ได้รับจากฐานข้อมูลระหว่างค้นหาคนขับ
  - **JobsScreen (U15):** เชื่อมต่อการดึงประวัติงานจริงของลูกค้าจากตาราง `bookings` บน Supabase พร้อมปุ่ม Refresh และตัวกรองสถานะงาน
- **อัปเดต API Routes และ Repository:**
  - ปรับปรุง `/api/vehicle-types/route.ts` ให้คืนค่าข้อมูลจากฐานข้อมูลพร้อม Normalize ฟิลด์
  - ปรับปรุง `/api/pricing/estimate/route.ts` ให้คำนวณราคาอิงเรทในตาราง `vehicle_types`
  - ปรับปรุง `/api/bookings/route.ts` ให้รองรับการ INSERT ผ่าน Service Role ป้องกัน Foreign Key และ RLS Violation

## [1.2.0] - 2026-09-23
### สถาปัตยกรรมระบบ (Architecture Document & Directory Structure)
- **สร้างเอกสารสถาปัตยกรรมฉบับสมบูรณ์ (docs/architecture.md):**
  - ระบุโครงสร้างโฟลเดอร์ของโปรเจกต์ Next.js 15 App Router แบบแยกส่วน (Decoupled Layer)
  - แผนผังความสัมพันธ์ระหว่าง Frontend State Management (Zustand: useJumbo) กับ Backend Database (Supabase PostgreSQL 14 ตาราง)
  - กำหนด State-to-Database Mapping และ Sync Policy ที่ชัดเจน
  - บันทึกมาตรฐานความปลอดภัย Zero Client-Side Fare Calculation และ Row-Level Security (RLS)

## [1.1.0] - 2026-09-23
### ฐานข้อมูลและการเชื่อมต่อสด (Live Supabase Integration)
- **สร้างตารางใหม่ครบทั้งระบบ (14 ตารางหลัก):**
  - `vehicle_types`: ตารางแคตตาล็อกประเภทรถ 5 ประเภทของ JUMBO GO และเรทคำนวณราคาเริ่มต้นและต่อกิโลเมตร
  - `driver_kyc`: ตารางจัดเก็บเอกสารยืนยันตัวตน 10 ขั้นตอนของคนขับ
  - `saved_locations`: ตารางจุดรับส่งที่บันทึกไว้
  - `delivery_proofs`: ตารางหลักฐานรูปถ่ายการรับและส่งสินค้า
  - `driver_wallet`: กระเป๋าเงินคนขับ
  - `transactions`: บันทึกธุรกรรมการเงินและถอนเงิน
- **ปลดล็อคข้อจำกัด (Constraints Refactoring):**
  - ปลดล็อค `bookings_vehicle_type_check` และ `vehicles_type_check` เพื่อรองรับประเภทยานพาหนะจริง: `pickup`, `pickup_box`, `pickup_fence`, `jumbo`, `truck_6w`
  - ปลดล็อค `drivers_user_id_fkey`, `payments_status_check`, `notifications_type_check`
- **ระบบความปลอดภัย (Row Level Security):**
  - เปิดใช้งาน RLS ครบทุก 14 ตาราง
  - เพิ่ม Service Role Bypass และ Public Read Policy สำหรับ `vehicle_types`
- **สถานะการทำงานจริง:**
  - เชื่อมต่อ Supabase Live URL `https://oqopribnhovxfaxnjoia.supabase.co` สำเร็จ 100%
  - รองรับการเขียนและอ่านข้อมูลการจองจริงผ่าน API Routes
