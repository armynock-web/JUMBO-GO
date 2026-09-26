# JUMBO GO — ข้อกำหนดทางเทคนิค (Technical Specification)
**เวอร์ชัน:** 1.1.0  
**สถานะ:** ข้อกำหนดพร้อมนำไปปฏิบัติการ (Executable Technical Contract)  
**มาตรฐาน:** ARM AI Engineering Standard (ARM-AES) & AEOS v1.0

---

## 1. ข้อกำหนดสกีมาฐานข้อมูล (Supabase PostgreSQL Schema Contract)

### 1.1 ตาราง: `users`
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสผู้ใช้ |
| `email` | `text` | UNIQUE, NULLABLE | อีเมล |
| `phone` | `text` | UNIQUE, NULLABLE | เบอร์โทรศัพท์ |
| `first_name` | `text` | NOT NULL | ชื่อจริง |
| `last_name` | `text` | NOT NULL | นามสกุล |
| `avatar_url` | `text` | NULLABLE | รูปประจำตัว |
| `role` | `text` | DEFAULT 'customer' | 'customer' \| 'driver' \| 'admin' |
| `status` | `text` | DEFAULT 'active' | 'active' \| 'suspended' \| 'pending' |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้าง |
| `updated_at` | `timestamptz` | DEFAULT now() | วันที่แก้ไขล่าสุด |

### 1.2 ตาราง: `vehicle_types`
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสประเภทรถ |
| `code` | `text` | UNIQUE, NOT NULL | e.g. 'pickup', 'pickup_box', 'pickup_fence', 'jumbo', 'truck_6w' |
| `name_th` | `text` | NOT NULL | e.g. 'กระบะ', 'กระบะตู้ทึบ', 'จัมโบ้', '6 ล้อ' |
| `capacity_ton` | `numeric(4,2)` | NOT NULL | พิกัดบรรทุก (ตัน) |
| `base_price` | `numeric(10,2)` | NOT NULL | ราคาเริ่มต้น (บาท) |
| `price_per_km` | `numeric(10,2)` | NOT NULL | ราคาต่อกิโลเมตร (บาท) |
| `dimensions` | `text` | NULLABLE | มิติกว้าง x ยาว x สูง |
| `icon_name` | `text` | NULLABLE | ชื่อไอคอนแสดงผล |
| `is_active` | `boolean` | DEFAULT true | สถานะเปิดใช้งาน |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้าง |

### 1.3 ตาราง: `drivers`
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสคนขับ |
| `user_id` | `uuid` | REFERENCES users(id) ON DELETE CASCADE | ผู้ใช้ระบบ |
| `driver_code` | `text` | UNIQUE | e.g. 'JG-00108' |
| `phone` | `text` | NOT NULL | เบอร์โทร |
| `first_name` | `text` | NOT NULL | ชื่อจริง |
| `last_name` | `text` | NOT NULL | นามสกุล |
| `avatar_url` | `text` | NULLABLE | รูปถ่าย |
| `vehicle_id` | `uuid` | NULLABLE | ยานพาหนะหลัก |
| `is_verified` | `boolean` | DEFAULT false | ยืนยันตัวตน KYC ผ่านแล้ว |
| `is_online` | `boolean` | DEFAULT false | สถานะเปิดรับงาน |
| `current_location_lat` | `numeric(10,7)` | NULLABLE | พิกัดละติจูดปัจจุบัน |
| `current_location_lng` | `numeric(10,7)` | NULLABLE | พิกัดลองจิจูดปัจจุบัน |
| `rating_avg` | `numeric(3,2)` | DEFAULT 5.00 | คะแนนเฉลี่ย (เต็ม 5) |
| `rating_count` | `integer` | DEFAULT 0 | จำนวนรีวิวทั้งหมด |
| `total_earnings` | `numeric(12,2)` | DEFAULT 0.00 | ยอดรายได้สะสม |
| `bank_name` | `text` | NULLABLE | ชื่อธนาคาร |
| `bank_account_number` | `text` | NULLABLE | เลขบัญชี |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้าง |
| `updated_at` | `timestamptz` | DEFAULT now() | วันที่แก้ไข |

### 1.4 ตาราง: `driver_kyc` (การตรวจสอบเอกสาร 10 ขั้นตอน)
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสเอกสาร KYC |
| `driver_id` | `uuid` | REFERENCES drivers(id) ON DELETE CASCADE | รหัสคนขับ |
| `kyc_code` | `text` | UNIQUE | e.g. 'KYC-1024' |
| `current_step` | `integer` | DEFAULT 1 | ขั้นตอนปัจจุบัน (1-10) |
| `id_card_number` | `text` | NULLABLE | เลขประจำตัวประชาชน 13 หลัก |
| `id_card_front_url` | `text` | NULLABLE | ภาพบัตรประชาชนด้านหน้า |
| `id_card_back_url` | `text` | NULLABLE | ภาพบัตรประชาชนด้านหลัง |
| `selfie_url` | `text` | NULLABLE | ภาพเซลฟี่คู่กับบัตร |
| `license_number` | `text` | NULLABLE | เลขที่ใบขับขี่ |
| `license_expiry` | `date` | NULLABLE | วันหมดอายุใบขับขี่ |
| `license_front_url` | `text` | NULLABLE | ภาพใบขับขี่ด้านหน้า |
| `license_back_url` | `text` | NULLABLE | ภาพใบขับขี่ด้านหลัง |
| `vehicle_registration_url`| `text` | NULLABLE | ภาพสมุดจดทะเบียนรถ / หน้าภาษี |
| `compulsory_insurance_url`| `text` | NULLABLE | ภาพกรมธรรม์ พ.ร.บ. |
| `vehicle_front_url` | `text` | NULLABLE | ภาพถ่ายหน้ารถ |
| `vehicle_side_url` | `text` | NULLABLE | ภาพถ่ายข้างรถ |
| `bank_book_url` | `text` | NULLABLE | ภาพหน้าสมุดบัญชี |
| `consent_accepted` | `boolean` | DEFAULT false | ยินยอมข้อกำหนดและ PDPA |
| `status` | `text` | DEFAULT 'pending' | 'draft' \| 'pending' \| 'approved' \| 'rejected' |
| `reject_reason` | `text` | NULLABLE | เหตุผลที่ปฏิเสธ (ถ้ามี) |
| `reviewed_by` | `uuid` | REFERENCES users(id) | ผู้ดูแลที่ตรวจ |
| `reviewed_at` | `timestamptz` | NULLABLE | เวลาที่ตรวจเสร็จ |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้าง |
| `updated_at` | `timestamptz` | DEFAULT now() | วันที่แก้ไข |

### 1.5 ตาราง: `bookings` (งานขนส่ง)
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสงาน |
| `job_number` | `text` | UNIQUE, NOT NULL | e.g. 'JG-2025-00108' |
| `user_id` | `uuid` | REFERENCES users(id) | ลูกค้าผู้ว่าจ้าง |
| `driver_id` | `uuid` | REFERENCES drivers(id) | คนขับที่รับงาน |
| `vehicle_type` | `text` | NOT NULL | ประเภทรถที่เรียก |
| `status` | `text` | NOT NULL | 'draft' \| 'searching' \| 'driver_assigned' \| 'in_transit' \| 'completed' \| 'cancelled' |
| `fare` | `numeric(10,2)` | NOT NULL | ยอดรวมทั้งสิ้น (บาท) |
| `base_fare` | `numeric(10,2)` | DEFAULT 0 | ค่าบริการเริ่มต้น |
| `distance_fare` | `numeric(10,2)` | DEFAULT 0 | ค่าระยะทาง |
| `extra_helper_fee` | `numeric(10,2)` | DEFAULT 0 | ค่าผู้ช่วยยกของ |
| `expressway_fee` | `numeric(10,2)` | DEFAULT 0 | ค่าทางด่วน |
| `discount` | `numeric(10,2)` | DEFAULT 0 | ส่วนลด |
| `driver_earning` | `numeric(10,2)` | DEFAULT 0 | รายได้ที่คนขับจะได้รับ |
| `distance_km` | `numeric(6,2)` | NOT NULL | ระยะทางรวม (กม.) |
| `duration_min` | `integer` | DEFAULT 0 | ระยะเวลาโดยประมาณ (นาที) |
| `payment_method` | `text` | DEFAULT 'cash' | 'cash' \| 'promptpay' \| 'credit_card' |
| `payment_status` | `text` | DEFAULT 'unpaid'| 'unpaid' \| 'paid' \| 'refunded' |
| `sender_name` | `text` | NULLABLE | ชื่อผู้ส่ง |
| `sender_phone` | `text` | NULLABLE | เบอร์ผู้ส่ง |
| `receiver_name` | `text` | NULLABLE | ชื่อผู้รับ |
| `receiver_phone` | `text` | NULLABLE | เบอร์ผู้รับ |
| `cancel_reason` | `text` | NULLABLE | เหตุผลที่ยกเลิก |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้างงาน |
| `updated_at` | `timestamptz` | DEFAULT now() | วันที่แก้ไข |

### 1.6 ตาราง: `booking_locations` (จุดรับ-ส่งสินค้า)
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสตำแหน่ง |
| `booking_id` | `uuid` | REFERENCES bookings(id) ON DELETE CASCADE | รหัสงาน |
| `type` | `text` | NOT NULL | 'pickup' \| 'dropoff' |
| `address` | `text` | NOT NULL | ชื่อสถานที่หรือที่อยู่หลัก |
| `sub_address` | `text` | NULLABLE | รายละเอียดที่อยู่เพิ่มเติม |
| `tag` | `text` | NULLABLE | เช่น 'บ้าน', 'ออฟฟิศ', 'โกดัง' |
| `contact_name` | `text` | NULLABLE | ชื่อผู้ติดต่อประจำจุด |
| `contact_phone` | `text` | NULLABLE | เบอร์ผู้ติดต่อ |
| `note` | `text` | NULLABLE | หมายเหตุจุดรับส่ง |
| `lat` | `numeric(10,7)` | NOT NULL | ละติจูด |
| `lng` | `numeric(10,7)` | NOT NULL | ลองจิจูด |
| `sequence` | `integer` | DEFAULT 0 | ลำดับจุดรับ-ส่ง |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่สร้าง |

### 1.7 ตาราง: `notifications` (ระบบแจ้งเตือน 3 Role 24 รูปแบบ)
| คอลัมน์ | ประเภทข้อมูล | เงื่อนไข | คำอธิบาย |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | รหัสแจ้งเตือน |
| `user_id` | `uuid` | REFERENCES users(id) ON DELETE CASCADE | ผู้รับการแจ้งเตือน |
| `role` | `text` | NOT NULL | 'customer' \| 'driver' \| 'admin' |
| `category` | `text` | NOT NULL | เช่น 'driver_accepted', 'kyc_result' |
| `priority` | `text` | DEFAULT 'normal' | 'low' \| 'normal' \| 'high' \| 'urgent' |
| `title` | `text` | NOT NULL | หัวข้อ |
| `message` | `text` | NOT NULL | ข้อความ |
| `is_read` | `boolean` | DEFAULT false | สถานะอ่านแล้ว |
| `job_id` | `text` | NULLABLE | อ้างอิงรหัสงาน (ถ้ามี) |
| `amount` | `numeric(10,2)` | NULLABLE | จำนวนเงินที่เกี่ยวข้อง (ถ้ามี) |
| `action_label` | `text` | NULLABLE | ข้อความปุ่ม Action |
| `action_target` | `text` | NULLABLE | Screen ID หรือ URL ปลายทาง |
| `data` | `jsonb` | DEFAULT '{}'::jsonb | ข้อมูลเสริม |
| `created_at` | `timestamptz` | DEFAULT now() | วันที่ส่ง |

---

## 2. นโยบายความปลอดภัยของฐานข้อมูล (Row-Level Security Policies)

```sql
-- เปิดใช้งาน RLS บนทุกตารางสำคัญ
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- นโยบาย Users: อ่านได้ทุกคน (สำหรับแสดงชื่อคนขับ/ลูกค้า), อัปเดตเฉพาะบัญชีตนเอง
CREATE POLICY "Users can view active profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- นโยบาย Notifications: ดูและแก้ไขได้เฉพาะเจ้าของการแจ้งเตือน หรือ แอดมิน
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT 
USING (auth.uid() = user_id OR role = 'admin');

-- นโยบาย Bookings: ลูกค้าและคนขับเห็นงานของตนเอง
CREATE POLICY "Users see related bookings" ON public.bookings FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.drivers WHERE id = bookings.driver_id));
```

---

## 3. สัญญาทางเทคนิค API (API Contracts & Request/Response Specification)

ระบบ JUMBO GO ใช้ API Route Handlers ใน Next.js App Router (`/src/app/api/...`) ครอบคลุมทั้ง 3 บทบาท (Customer, Driver, Admin)

### 3.1 Authentication & Profile
- **POST `/api/auth/send-otp`**
  - Input: `{ "phone": string }` หรือ `{ "email": string }`
  - Output: `{ "success": true, "otp": string, "expiresIn": number, "message": string }`
  - Internal: สร้างรหัส 6 หลักภายในระบบสำหรับ Auto-fill ทันที ไม่ส่ง SMS ภายนอก
- **POST `/api/auth/verify-otp`**
  - Input: `{ "phone": string, "otp": string }`
  - Output: `{ "success": true, "user": UserObject, "token": string }`
- **POST `/api/auth/register`**
  - Input: `{ "fullName": string, "phone": string, "email"?: string, "role": "customer" | "driver" }`
  - Output: `{ "success": true, "user": UserObject }`
- **GET `/api/auth/me`**
  - Output: `{ "authenticated": boolean, "user": UserObject | null, "driver"?: DriverObject | null }`
- **POST `/api/auth/logout`**
  - Output: `{ "success": true }`

### 3.2 Customer & Booking Engine
- **GET `/api/locations/search?q=query`**
  - Output: `{ "results": LocationPoint[] }`
- **GET `/api/locations/recent`**
  - Output: `{ "locations": LocationPoint[] }`
- **GET `/api/vehicle-types`**
  - Output: `{ "vehicles": VehicleTypeRecord[] }`
- **POST `/api/pricing/estimate`**
  - Input: `{ "vehicleType": string, "distanceKm": number, "hasHelper"?: boolean, "expressway"?: boolean }`
  - Output: `{ "baseFare": number, "distanceFare": number, "extraHelperFee": number, "expresswayFee": number, "totalFare": number }`
- **POST `/api/bookings`**
  - Input: `{ "pickup": LocationPoint, "dropoff": LocationPoint, "vehicleType": string, "fare": number, "paymentMethod": string }`
  - Output: `{ "success": true, "booking": BookingRecord }`
- **GET `/api/bookings`**
  - Output: `{ "bookings": BookingRecord[] }`
- **GET `/api/bookings/[id]`**
  - Output: `{ "booking": BookingRecord, "driver": DriverRecord | null, "timeline": any[] }`
- **POST `/api/bookings/[id]/cancel`**
  - Input: `{ "reason": string }`
  - Output: `{ "success": true, "status": "cancelled" }`
- **POST `/api/bookings/[id]/rate`**
  - Input: `{ "rating": number, "comment"?: string }`
  - Output: `{ "success": true, "review": any }`

### 3.3 Driver Operations & KYC (10 Steps)
- **GET `/api/driver/profile`** -> `{ "driver": DriverRecord }`
- **POST `/api/driver/availability/online`** -> `{ "isOnline": true }`
- **POST `/api/driver/availability/offline`** -> `{ "isOnline": false }`
- **POST `/api/driver/location`** -> `{ "success": true, "lat": number, "lng": number }`
- **GET `/api/driver/kyc`** -> `{ "kyc": DriverKycRecord }`
- **POST `/api/driver/kyc`** -> บันทึกแบบฟอร์มขั้นตอน KYC 1-10
- **POST `/api/driver/kyc/submit`** -> ยืนยันส่งตรวจสอบ (`status: 'pending'`)
- **GET `/api/driver/jobs`** -> `{ "availableJobs": BookingRecord[] }`
- **POST `/api/driver/jobs/[id]/accept`** -> `{ "success": true, "status": "accepted" }`
- **POST `/api/driver/jobs/[id]/reject`** -> `{ "success": true }`
- **POST `/api/driver/jobs/[id]/status`** -> `{ "success": true, "status": string }`
- **GET `/api/driver/earnings`** -> `{ "summary": { "today": number, "thisWeek": number, "rating": number }, "transactions": any[] }`

### 3.4 Admin Platform Management
- **GET `/api/admin/stats`** -> `{ "activeBookings": number, "onlineDrivers": number, "totalRevenue": number, "pendingKyc": number }`
- **GET `/api/admin/kyc/list`** -> `{ "kycList": DriverKycRecord[] }`
- **POST `/api/admin/kyc/[id]/review`** -> Input: `{ "status": "approved" | "rejected", "rejectionReason"?: string }`
- **GET / PUT `/api/admin/pricing`** -> ปรับแต่งเรทราคาประเภทยานพาหนะ

### 3.5 Notifications
- **GET `/api/notifications?role=customer|driver|admin`** -> `{ "notifications": NotificationRecord[] }`
- **POST `/api/notifications/[id]/read`** -> `{ "success": true }`

---

## 4. สัญญา Auth & ข้อมูลผู้ใช้ (Auth Contract — v1.4.0)

### 4.1 เบอร์โทรศัพท์ E.164 (Register)
Supabase Auth ต้องการเบอร์โทรศัพท์รูปแบบ **E.164** เท่านั้น (มี `+` นำหน้า) → helper `toE164()` ใน `src/app/api/auth/register/route.ts`:
- Input ไทย: `082-345-6789` / `0823456789` → `+66823456789`
- เก็บเบอร์ภาษาไทยเดิม (`082-345-6789`) ลงตาราง `users.phone` และ E.164 ไป Auth

### 4.2 Login by Phone
Auth users (`auth.users`) มี `phone` ว่างเสมอ → เบอร์จริงเก็บใน `users.phone` ระเบียบการค้นใน `src/app/api/auth/login/route.ts`:
1. ค้น `users` ก่อนด้วย `.ilike("phone", %clean%)` (ตัด `-`, `+`, space)
2. fallback: ดึง users จาก Auth แล้วเทียบ digits กับ E.164

### 4.3 ตาราง `driver_kyc` Constraints (migrations)
- **UNIQUE (driver_id)** — `20260924024145_add_unique_driver_id_to_driver_kyc` ทำให้ `upsertKyc({ onConflict: "driver_id" })` ทำงานจริง
- **FK driver_id → drivers.id (ON DELETE CASCADE)** — `20260924031840_add_foreign_key_driver_kyc_to_drivers`
- `reviewKyc(status: "approved")` → set `drivers.is_verified = true`, `driver_kyc.verified_at`; `rejected` → บันทึก `rejection_reason`

---

## 5. API Client Layer Contracts (`src/lib/api.ts`)

- **`getAvailableDrivers(vehicleType?)`**: `drivers.vehicles` เป็น to-one relation (ตอบกลับเป็น **object** ไม่ใช่ array) → normalize เป็น array เสมอใน ฝั่ง client ก่อน `.some()`
- **`getNotifications(role, userId?)`**: ตาราง `notifications` ไม่มีคอลัมน์ role → filter โดย `data.role === role` หรือ `type === 'role_<role>'`
- Error ทั้งหมด throw ขึ้น route layer (ไม่ swallow) เพื่อตอบ HTTP ตามจริง

---

## 6. Testing Contracts (Vitest)

ดูรายละเอียดใน `docs/architecture.md` §5 และ `vitest.config.ts`
- Test script: `npm test` / `npm run test:coverage`
- Coverage thresholds: lines/functions/statements 80%, branches 70% (ผ่านใน v1.4.0)

