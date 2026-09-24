# Version History

## Current Version: 1.4.0

### Version 1.4.0 (Current) — Production Assembly & Verified Backend
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