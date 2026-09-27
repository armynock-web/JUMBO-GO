# JUMBO GO — รายการตั๋วงานระบบ (Task Decomposition / Tracer Bullet Tickets)
**เวอร์ชัน:** 1.1.0  
**สถานะ:** กำลังดำเนินการ (In Progress)  
**มาตรฐาน:** ARM AI Engineering Standard (ARM-AES) & AEOS v1.0

---

## ตารางสรุปตั๋วงาน (Tickets Overview)

| Ticket ID | ชื่องาน (Task Name) | ลำดับ (Dependency) | สถานะ (Status) |
|---|---|---|---|
| **T-001** | ติดตั้งและกำหนดค่า Supabase Environment (.env.local, .env.example) | Pre-requisite | ✅ เสร็จสิ้น |
| **T-002** | จัดทำเอกสารสถาปัตยกรรม พิมพ์เขียว และสเปคทางเทคนิค | T-001 | ✅ เสร็จสิ้น |
| **T-003** | สร้างไฟล์ Migration Schema SQL และ Master Setup (00_master_complete_setup.sql) | T-002 | ✅ เสร็จสิ้น |
| **T-004** | พัฒนา Supabase Client SDK, Type Definitions และ API Service Layer | T-003 | ✅ เสร็จสิ้น |
| **T-005** | ปรับปรุง API Routes ใน src/app/api และ src/lib/api.ts ให้สอดคล้องกับโครงสร้างข้อมูล | T-004 | ✅ เสร็จสิ้น |
| **T-006** | ทดสอบการเชื่อมต่อและดึงข้อมูลจริง (Integration Verification Suite: 7/7 PASS) | T-005 | ✅ เสร็จสิ้น |
| **T-007** | ตรวจสอบคุณภาพโค้ด (Lint, Typecheck, Applet Compilation ผ่าน 100%) | T-006 | ✅ เสร็จสิ้น |
| **T-008** | จัดทำเอกสารพิมพ์เขียวและการนำขึ้นระบบจริง (BLUEPRINT_BACKEND_DEPLOYMENT.md) | T-007 | ✅ เสร็จสิ้น |
| **T-009** | ปลดล็อค Database Constraints และยืนยันผลเชื่อมต่อ Live Supabase 14 ตาราง | T-008 | ✅ เสร็จสิ้น |
| **T-010** | ตรวจสอบความถูกต้องของตารางและการเขียนข้อมูลจริง (Integration Testing) | T-009 | ✅ เสร็จสิ้น |
| **T-011** | จัดทำเอกสาร Architecture Document ระบุโครงสร้างโฟลเดอร์และความสัมพันธ์ Zustand-DB | T-010 | ✅ เสร็จสิ้น |
| **T-012** | พัฒนา Phase 1: Customer Booking Flow เชื่อมต่อ Live Database (VehicleType, Summary, Confirm, Jobs) | T-011 | ✅ เสร็จสิ้น |

---

## รายละเอียดแต่ละ Ticket

### Ticket T-003: Supabase Schema DDL & Seed Script
- **ขอบเขต:** สร้างไฟล์ `supabase/schema.sql` และ `supabase/seed.sql` ที่มีตารางครบถ้วนตาม UI: `vehicle_types`, `driver_kyc`, `job_timeline`, `saved_locations`, `system_settings`, `transactions` พร้อมคอลัมน์และ RLS
- **การทดสอบ:** Syntax ตรวจสอบได้ตามมาตรฐาน PostgreSQL 15+

### Ticket T-004: Supabase Client SDK & Data Repository
- **ขอบเขต:** สร้าง `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/types.ts` และ `src/lib/supabase/repository.ts` เพื่อให้ Frontend และ Backend ดึง/บันทึกข้อมูลอย่างปลอดภัย
- **การทดสอบ:** TypeScript Compile ผ่าน 100%

### Ticket T-005: Live Database Seeding
- **ขอบเขต:** ดำเนินการยิงข้อมูลจำลองจริงที่สอดคล้องกับ UI (สมชาย ใจดี, วันดี มีสุข, ประยุทธ สดใส, งาน JG-00108, การแจ้งเตือน) เข้าสู่ Supabase Database
- **การทดสอบ:** ตรวจสอบผ่าน Node script ว่าข้อมูลถูกบันทึกสำเร็จจริง
