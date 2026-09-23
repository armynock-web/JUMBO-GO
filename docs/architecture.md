# JUMBO GO — เอกสารสถาปัตยกรรมระบบ (Architecture Document)
**เวอร์ชัน:** 1.2.0 (Commercial Production Blueprint)  
**อัปเดตล่าสุด:** 2026-09-23  
**มาตรฐานทางวิศวกรรม:** ARM AI Engineering Standard (ARM-AES) & AEOS v1.0  
**สแต็กหลัก:** Next.js 15 (App Router) • Supabase PostgreSQL • TypeScript • Tailwind CSS v4 • Zustand

---

## 1. โครงสร้างโฟลเดอร์ของโปรเจกต์ (Project Directory Structure)

โครงสร้างระบบถูกออกแบบตามหลัก Modular & Decoupled Architecture เพื่อรองรับการเปิดใช้งานเชิงพาณิชย์จริง:

```
jumbo-go/
├── .gemini/
│   └── settings.json           # การตั้งค่า MCP Client เชื่อมต่อ Supabase MCP Server
├── docs/                       # เอกสารแหล่งความจริงของระบบ (Single Source of Truth)
│   ├── architecture.md         # เอกสารสถาปัตยกรรมระบบ (Architecture Document)
│   ├── tasks.md                # รายการตั๋วงานระบบและการติดตามสถานะ
│   ├── CHANGELOG.md            # บันทึกประวัติการเปลี่ยนแปลงของระบบ
│   ├── VERSION.md              # การควบคุมเวอร์ชันระบบ
│   └── BLUEPRINT_BACKEND_DEPLOYMENT.md # คู่มือการนำแบ็กเอนด์ขึ้น Production
├── supabase/
│   ├── schema.sql              # คำสั่ง DDL สร้าง 14 ตาราง, Constraints, และ RLS Policies
│   └── seed.sql                # ชุดข้อมูลเริ่มต้น (Master Data & Seeding)
├── src/
│   ├── app/                    # Next.js App Router (หน้าเว็บและ API Routes)
│   │   ├── api/                # Backend API Layer (REST Endpoints)
│   │   │   ├── admin/          # API สำหรับจัดการหลังบ้าน (Stats, KYC, Pricing)
│   │   │   ├── auth/           # API ระบบยืนยันตัวตน (Login, Register, OTP)
│   │   │   ├── bookings/       # API รายการจองงาน (Create, Status, Cancel, Rate)
│   │   │   ├── driver/         # API ฝั่งคนขับ (Jobs, KYC, Availability, Earnings)
│   │   │   ├── locations/      # API ค้นหาและบันทึกพิกัดสถานที่
│   │   │   ├── notifications/  # API แจ้งเตือน 24 รูปแบบ (3 Role)
│   │   │   ├── pricing/        # API คำนวณราคาฝั่ง Server (Zero Client Trust)
│   │   │   └── vehicle-types/  # API ดึงแคตตาล็อกประเภทรถ
│   │   ├── globals.css         # สไตล์ส่วนกลาง (Tailwind v4)
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Main Entry Showcase & Mobile Layout Shell
│   ├── components/
│   │   └── jumbo/              # UI Components ตาม Brand DNA JUMBO GO
│   │       ├── app-shell.tsx   # Core Router Shell สลับหน้าจอตาม Role (User/Driver/Admin)
│   │       ├── bottom-nav.tsx  # แถบนำทางด้านล่างของลูกค้า
│   │       ├── logo.tsx        # Brand SVG Logo
│   │       ├── phone-frame.tsx # กรอบจำลองมือถือและแผง Screen Rail
│   │       ├── status-bar.tsx  # แถบแสดงสถานะมือถือ (iOS/Android)
│   │       ├── vehicle-icon.tsx# ไอคอนประเภทยานพาหนะ (SVG)
│   │       └── screens/        # หน้าจอแอปพลิเคชันทั้งหมดตาม Screen ID
│   │           ├── admin/      # หน้าจอแอดมิน (Dashboard, KYC, Pricing, etc.)
│   │           ├── driver/     # หน้าจอคนขับ (Onboarding 10 ขั้น, Jobs, Dashboard)
│   │           └── *.tsx       # หน้าจอลูกค้า (Splash, Home, Booking Flow U01-U18)
│   ├── lib/
│   │   ├── brand.ts            # Brand Constants, Colors, Palettes, Helper Functions
│   │   └── supabase/           # Data Access Layer เชื่อมต่อฐานข้อมูล
│   │       ├── client.ts       # Supabase Browser Client (Anon Key)
│   │       ├── server.ts       # Supabase Server Client (Service Role Key)
│   │       ├── repository.ts   # JumboRepository (Abstraction Data Layer)
│   │       └── types.ts        # Database TypeScript Definitions
│   └── store/
│       └── jumbo.ts            # Frontend State Management (Zustand Store)
```

---

## 2. ความสัมพันธ์ระหว่าง Frontend State (Zustand) กับ Backend Database (Supabase)

เพื่อให้เป็นไปตามกฎความปลอดภัยระดับ Production ข้อมูลในระบบจะถูกแบ่งเป็น **Ephemeral UI State (จัดการด้วย Zustand)** และ **Persistent System State (จัดเก็บบน Supabase PostgreSQL)** โดยมี Data Flow เชื่อมโยงกันอย่างเป็นระบบ:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA RELATIONSHIP & SYNCHRONIZATION FLOW                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [FRONTEND STATE]                     [API / DATA LAYER]        [BACKEND SUPABASE]    │
│   Zustand Store (useJumbo)             Next.js Route / Repo      PostgreSQL Tables     │
│  ─────────────────────────             ────────────────────      ─────────────────     │
│                                                                                        │
│   1. Booking Draft                      POST /api/bookings                             │
│      • pickup (lat/lng/addr)    ───►    JumboRepository.       ───►  [bookings]        │
│      • dropoff (lat/lng/addr)           createBooking()              [booking_locations│
│      • vehicleType                                                   [job_timeline]    │
│      • estimatedPrice (Server)                                                         │
│                                                                                        │
│   2. Vehicle Catalog                    GET /api/vehicle-types                         │
│      • vehicleTypes[]           ◄───    JumboRepository.       ◄───  [vehicle_types]   │
│        (แสดงใน VehicleTypeScreen)       getVehicleTypes()                               │
│                                                                                        │
│   3. Driver Status                      POST /api/driver/availability                  │
│      • driverOnline: boolean    ───►    JumboRepository.       ───►  [drivers]         │
│                                         setDriverOnline()            (is_online, lat)  │
│                                                                                        │
│   4. Driver KYC Form                    POST /api/driver/kyc/submit                    │
│      • kycStep: 1..10           ───►    JumboRepository.       ───►  [driver_kyc]      │
│      • kycSubmitted: boolean            submitKyc()                  (status: pending) │
│                                                                                        │
│   5. Admin Controls                     POST /api/admin/pricing                        │
│      • systemSettings / rates   ───►    JumboRepository.       ───►  [vehicle_types]   │
│                                         updatePricing()              [system_settings] │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. รายละเอียดการจับคู่ State กับ Schema (State-to-Database Mapping)

| หมวดหมู่ (Category) | Frontend Zustand State (`src/store/jumbo.ts`) | ตารางฐานข้อมูล Supabase (`supabase/schema.sql`) | นโยบายความปลอดภัยและการซิงก์ (Sync Policy) |
|---|---|---|---|
| **Role & Session** | `mode`: `'user' \| 'driver' \| 'admin'`<br>`isAuthenticated`: boolean | `users`<br>`drivers` | ตรวจสอบสิทธิ์ผ่าน Supabase Auth / JWT + RLS Policy |
| **ใบงานชั่วคราว (Draft)**| `draft.pickup`<br>`draft.dropoff`<br>`draft.vehicleType`<br>`draft.estimatedPrice` | `bookings`<br>`booking_locations` | อยู่ใน Client Memory จนกว่าลูกค้าจะกด "ยืนยันเรียกรถ" (ConfirmScreen) จึงจะยิง `INSERT` |
| **แคตตาล็อกรถ** | `draft.vehicleType` | `vehicle_types` | ดึงข้อมูลสด (Master Data) จาก Supabase ไม่ Hardcode เพื่อรองรับการปรับราคาจาก Admin |
| **การติดตามงานสด** | `searchProgress`<br>`trackingStep` | `job_timeline`<br>`drivers.current_lat / lng` | อัปเดตแบบ Realtime ผ่าน Supabase Channel / Polling ตามสถานะงานจริง |
| **การสมัครคนขับ (KYC)**| `kycStep`: 1..10<br>`kycSubmitted`: boolean | `driver_kyc`<br>`drivers` | กรอกบันทึกข้อมูลและอัปโหลดรูปภาพ เมื่อตรวจผ่าน AdminKycPage จะอัปเดต `drivers.is_verified = true` |
| **สถานะคนขับออนไลน์** | `driverOnline`: boolean | `drivers.is_online`<br>`drivers.updated_at` | ซิงก์ทันทีเมื่อคนขับกดสวิตช์เปิด/ปิดรับงาน เพื่อให้ระบบกระจายงานจับคู่ได้ถูกต้อง |

---

## 4. มาตรการความปลอดภัยของข้อมูล (Data Security Standard)

1. **Zero Client-Side Fare Calculation:** การคำนวณราคาค่าบริการทั้งหมดเกิดขึ้นที่ Server (`/api/pricing/estimate`) ผ่านการคำนวณระยะทางกับเรทราคาใน `vehicle_types` โดย Client จะส่งเพียงพิกัดและประเภทรถเท่านั้น ป้องกันการดัดแปลงราคาหน้าบ้าน
2. **Row-Level Security (RLS):** ผู้ใช้งานแต่ละบทบาทจะเข้าถึงได้เฉพาะแถวข้อมูลที่ตนเองเป็นเจ้าของ
3. **Decoupled Architecture:** Frontend เรียกใช้งานผ่าน API Routes / Repository Layer เท่านั้น โดยไม่มีการฝัง Service Role Key ในฝั่ง Client
