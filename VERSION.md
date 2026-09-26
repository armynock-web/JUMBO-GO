# Version History

## Current Version: 1.5.0

### Version 1.5.0 (Current) — Commercial Platform & Full System Overhaul
- ✅ Commercial Desktop Split-Screen: หน้าแรกบน Desktop เป็น Web Portal เต็มจอจริง (ฟอร์มจองด้านซ้าย + แผนที่โลจิสติกส์สด `CommercialMap` ด้านขวา)
- ✅ Prototype Cleanup: ถอด `<PhoneFrame>`, กรอบ iPhone ปลอม, และเมนูนักพัฒนา `DesktopRail` ("SCREEN INVENTORY") ออกจากระบบ
- ✅ Mobile Experience: แสดงผลเต็มหน้าจอมือถือจริง Responsive Native-like ไร้กรอบจำลอง
- ✅ Customer Auth Binding: แก้ไข `confirm.tsx` ให้ส่ง Token Authorization ไปยัง `/api/bookings` บันทึกการจองลง Supabase สำเร็จจริง
- ✅ Driver Live API Integration: เชื่อมต่อหน้าคนขับ (`/driver`) กับ `GET /api/driver/jobs` และ `POST /api/driver/jobs/[id]/accept`
- ✅ Admin KYC Review Live API: เชื่อมต่อหน้าแอดมิน (`/admin`) กับ `GET /api/admin/kyc/list` และ `POST /api/admin/kyc/[id]/review` อนุมัติ/ปฏิเสธลง Supabase จริง
- ✅ Documentation Blueprint Complete: สร้าง `docs/api.md`, `docs/installation.md`, และ `docs/user-guide.md` ครบถ้วนตามมาตรฐานข้อ 3.1
- ✅ Quality Checks: TypeScript 0 errors, ESLint 0 errors, Vitest 130/130 passing, Next.js 16.3.6 production build passing

### Version 1.4.0 — Production Assembly & Verified Backend
- ✅ TypeScript 0 errors (`npx tsc --noEmit` exit code 0)
- ✅ Next.js Build success (`npx next build` exit code 0)
- ✅ Vitest Test Suite: 130 tests / 14 files all passing
- ✅ Test Coverage ≥ threshold: Statements 84.34% / Branches 74.21% / Functions 80.35% / Lines 86.28%
- ✅ Pricing Engine (DRY): `src/lib/pricing.ts` — ฟังก์ชัน pricing บริสุทธิ์ แยกจาก route layer
- ✅ Auth Fixes (เรียลดีขึ้นจาก Supabase จริง):
  - Register: แปลงเบอร์ไทย `0xx-xxx-xxxx` → E.164 `+66xxxxxxxxx` สำหรับ Supabase Auth
  - Login-by-phone: ค้น users table จริงก่อน (auth users มี phone ว่าง)
- ✅ Bug Fix: `getAvailableDrivers` normalize `vehicles` (to-one relation เป็น object → array)
- ✅ KYC app: unique constraint + FK `driver_kyc.driver_id → drivers.id` (migrations บันทึกใน repo)
- ✅ Deploy ready: `vercel.json` + `.env.example`
- ✅ ARM-AI Engineering Standard (ARM-AES) v1.0

### Version 1.3.0 — Phase 1 Customer Booking Flow (Live Supabase)
- ✅ UI → Supabase + Server Pricing ครบวงจร (VehicleType / Summary / Confirm / Searching / Jobs screens)
- ✅ 14 tables สร้างใน Supabase + RLS + Indexes

### Version 1.1.0 — Production-Ready Core
- ✅ 26 routes + 32 API endpoints compiled
- ✅ Realtime GPS tracking via Supabase Realtime WebSockets

### Version 0.3.0 — Blueprint
- ✅ Complete Supabase Blueprint & Architecture (`docs/`)
- ✅ Production PostgreSQL DDL Schema

### Version 0.2.1 — Project init
- Next.js 16.1.1 / React 19 / TypeScript 5 / Tailwind 4 / Shadcn UI components

---

**Version Format:** MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features, backwards compatible
- PATCH: Bug fixes, backwards compatible