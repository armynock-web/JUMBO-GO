# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-09-27

### Added
- **Commercial Desktop Split-Screen Platform:** หน้าแรกบน Desktop เป็น Web Portal เต็มจอจริง (ฟอร์มจองซ้าย + แผนที่โลจิสติกส์สด `CommercialMap` ขวา)
- **Interactive Commercial Logistics Map:** แสดงเส้นทาง, พิกัดรับ-ส่ง, ระยะทาง, เวลาประเมิน และตำแหน่งรถบรรทุกที่กำลังเคลื่อนที่รอบพื้นที่
- **Driver Live API Integration:** หน้ารับงานคนขับ (`/driver`) ดึงข้อมูลจริงจาก `GET /api/driver/jobs` และรับงานจริงผ่าน `POST /api/driver/jobs/[id]/accept`
- **Admin KYC Review Live API:** หน้าตรวจ KYC แอดมิน (`/admin`) ดึงข้อมูลจริงจาก `GET /api/admin/kyc/list` และอนุมัติ/ปฏิเสธผ่าน `POST /api/admin/kyc/[id]/review`
- **Documentation Standards (Rule 3.1):** สร้างเอกสารพิมพ์เขียวครบถ้วน:
  - `docs/api.md` (ข้อกำหนดและสัญญาของ API ทั้ง 28 Endpoints)
  - `docs/installation.md` (คู่มือการติดตั้งและคอนฟิกระบบ)
  - `docs/user-guide.md` (คู่มือการใช้งานสำหรับลูกค้า คนขับ และแอดมิน)

### Removed
- ถอด `<PhoneFrame>`, กรอบ iPhone ปลอม, และเมนูนักพัฒนา `DesktopRail` ("SCREEN INVENTORY") ออกจากหน้าโปรดักชัน

### Fixed
- แก้ไข `confirm.tsx` ให้ส่ง Authorization Token ไปยัง `/api/bookings` ป้องกันข้อผิดพลาด 401 และบันทึกการจองลง Supabase จริง

## [1.1.0] - 2026-09-24

### Added
- **Phase 1: Customer Booking Flow เชื่อมต่อ Live Database (T-012)**
  - `src/app/api/bookings/route.ts`: POST endpoint สร้าง Booking จริงใน Supabase
  - `src/app/api/vehicle-types/route.ts`: ดึงประเภทรถจาก `vehicle_types` table
  - `screens/vehicle-type.tsx`: ดึงข้อมูลจริงจาก `/api/vehicle-types` พร้อม Live DB badge
  - `screens/summary.tsx`: คำนวณราคาจาก vehicle_type จริง (base_price + perKm × km)
  - `screens/confirm.tsx`: POST ไปยัง `/api/bookings` บันทึกลง Supabase จริง
  - `screens/searching.tsx`: แสดง Job Number จริงจาก Supabase response
  - `screens/jobs.tsx`: ดึงและแสดงประวัติงานจริงจาก Supabase พร้อม Live DB badge
- **Full API Layer (32 endpoints):** Auth, Bookings, Driver, Admin, Pricing, Notifications
- **Realtime GPS Subscription** ผ่าน Supabase Realtime WebSockets
- **ARM-AI Engineering Standard (ARM-AES) v1.0** documentation

### Fixed
- `scripts/live-supabase-sync.ts`: แก้ TypeScript tuple type error ใน `new Map()`
- `scripts/seed-and-test.ts`: แก้ union type mismatch ใน notifications upsert
- `src/lib/supabase/repository.ts`: ลบ `@ts-expect-error` ที่ไม่จำเป็น 3 จุด

### Verified
- `npx tsc --noEmit`: ✅ exit code 0 (0 errors)
- `npx next build`: ✅ exit code 0 (26 routes, 32 API endpoints compiled)
- Live Supabase 14 tables: ✅ ทุกตารางเชื่อมต่อจริง

## [0.3.0] - 2026-09-23

### Added
- **Supabase Database Blueprint & Engineering Docs:**
  - `docs/requirements.md`: Comprehensive requirement analysis of all JUMBO GO UI pages, data fields, and entity relationships
  - `docs/architecture.md`: 3-tier architecture, complete ASCII ERD diagram, security model, and data flow
  - `docs/technical-spec.md`: Full PostgreSQL data contract, tables, constraints, RLS policies, and REST/TypeScript interfaces
  - `docs/tasks.md`: Tracer bullet tickets (T-001 to T-007) with DoD and testing gates
- **Supabase Production DDL & Seed Scripts:**
  - `supabase/schema.sql`: Production DDL with 13 tables (users, drivers, driver_kyc, vehicle_types, vehicles, bookings, booking_locations, job_timeline, payments, transactions, reviews, notifications, saved_locations, system_settings) and comprehensive RLS policies
  - `supabase/seed.sql`: Seed dataset matching all UI mockup entities (Somchai, Wandee, Somying, Isuzu D-Max, Hino 500, Revo Jumbo, jobs JG-2025-00108, transactions TXN-5021, and 24 role-based notifications)
- **Supabase Integration & Repository:**
  - `src/lib/supabase/client.ts`: Client-side singleton Supabase client
  - `src/lib/supabase/server.ts`: Server-side singleton Supabase client using Service Role
  - `src/lib/supabase/types.ts`: Comprehensive TypeScript database types
  - `src/lib/supabase/repository.ts`: Typed data access repository
- **Live Sync & Testing Script:**
  - `scripts/live-supabase-sync.ts`: Automated sync and validation script that created real auth accounts, verified foreign key constraints, and verified live database counts

### Changed
- Installed `@supabase/supabase-js` in `package.json`