# JUMBO GO — คู่มือการติดตั้งและตั้งค่าระบบ (Installation Guide)
**เวอร์ชัน:** 1.4.0  
**แพลตฟอร์ม:** Next.js 16 (App Router) + Supabase (PostgreSQL & Realtime)  
**มาตรฐาน:** ARM-AI Engineering Standard (ARM-AES)

---

## 1. ความต้องการของระบบ (System Prerequisites)

* **Node.js:** เวอร์ชัน 20.x หรือ 22.x LTS ขึ้นไป
* **npm:** เวอร์ชัน 10.x ขึ้นไป
* **Git:** สำหรับจัดการ Version Control
* **Supabase Project:** บัญชี Supabase Cloud หรือ Local Supabase CLI

---

## 2. ขั้นตอนการติดตั้งแบบทีละสเต็ป (Step-by-Step Installation)

### ขั้นตอนที่ 1: Clone Repository
```bash
git clone https://github.com/armynock-web/JUMBO-GO.git
cd JUMBO-GO
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
```bash
npm install
```

### ขั้นตอนที่ 3: กำหนดค่าตัวแปรสภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ต้นแบบ `.env.example` ไปเป็น `.env.local`:

```bash
cp .env.example .env.local
```

กรอกค่าคอนฟิกต่าง ๆ ใน `.env.local`:
```env
# ฐานข้อมูลและบริการ Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>

# Google OAuth (สำหรับการล็อกอินด้วย Google)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

> **คำเตือนด้านความปลอดภัย:**  
> ห้าม commit ไฟล์ `.env.local` หรือเปิดเผย `SUPABASE_SERVICE_ROLE_KEY` สู่สาธารณะเด็ดขาด

---

## 3. การเตรียมฐานข้อมูล (Database Migrations)

ไฟล์ Schema และโครงสร้างตารางถูกจัดเก็บไว้ใน `supabase/migrations/`:

1. **20260924024145_add_unique_driver_id_to_driver_kyc.sql**
2. **20260924031840_add_foreign_key_driver_kyc_to_drivers.sql**

คุณสามารถนำไฟล์ SQL ไปรันบน **Supabase SQL Editor** เพื่อสร้างตารางทั้ง 14 ตารางและนโยบาย RLS (Row Level Security)

---

## 4. คำสั่งการทำงาน (Available Scripts)

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รันเซิร์ฟเวอร์โหมด Development บนพอร์ต 3000 (`http://localhost:3000`) |
| `npm run build` | ทำการ Compile และสร้าง Production Build (พร้อม Type Check และ Route Generation) |
| `npm run start` | รันเซิร์ฟเวอร์โหมด Production จากไฟล์ Standalone Build |
| `npm run lint` | ตรวจสอบคุณภาพโค้ดและมาตรฐานการเขียนด้วย ESLint 9 |
| `npm test` | รันชุดทดสอบระบบทั้งหมดด้วย Vitest (130 Tests ครบทั้ง Unit และ Integration) |
| `npm run test:coverage` | รันการทดสอบพร้อมรายงานเปอร์เซ็นต์ Code Coverage |

---

## 5. การตรวจสอบความพร้อมก่อนส่งมอบ (Verification)

ก่อนการ Deploy ขึ้น Production ต้องมั่นใจว่ารันคำสั่งเหล่านี้ผ่านทั้งหมด:
```bash
# 1. Type Check
npx tsc --noEmit

# 2. Lint Check
npm run lint

# 3. Tests & Coverage Check
npm run test:coverage

# 4. Production Build Check
npm run build
```
