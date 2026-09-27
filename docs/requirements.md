# JUMBO GO — เอกสารความต้องการของระบบ (Requirements Document)
**เวอร์ชัน:** 1.1.0  
**สถานะ:** อนุมัติ / ดำเนินการสถาปัตยกรรมฐานข้อมูลและพิมพ์เขียว (Database Blueprint Phase)  
**มาตรฐาน:** ARM AI Engineering Standard (ARM-AES) & AEOS v1.0

---

## 1. วัตถุประสงค์ของระบบ (System Goal)
JUMBO GO คือแพลตฟอร์มเรียกรถบรรทุกและขนส่งสินค้าออนดีมานด์ขนาดใหญ่ (Truck On-Demand Logistics Platform) ครอบคลุมการทำงาน 3 กลุ่มผู้ใช้งานหลัก:
1. **ลูกค้า (Customer / Shipper):** ค้นหารถ คำนวณราคาตามระยะทางจริง เลือกรถบรรทุก จองรถ ติดตามสถานะแบบ Real-time และชำระเงิน
2. **คนขับ (Driver / Transporter):** สมัครและผ่านการตรวจเอกสาร KYC 10 ขั้นตอน รับงานขนส่ง นำทาง อัปเดตสถานะการขนส่ง และจัดการรายได้/ถอนเงิน
3. **ผู้ดูแลระบบ (Admin / Dispatcher):** ตรวจสอบและอนุมัติเอกสาร KYC, จัดการผู้ใช้และคนขับ, กำหนดราคาต่อระยะทางและประเภทรถ, ตรวจสอบงานผิดปกติ และควบคุมกระแสการเงิน

---

## 2. การวิเคราะห์ข้อมูลจริงจากหน้า UI (Real UI Data Analysis vs Current DB)

### 2.1 ข้อมูลประเภทรถและการคิดราคา (Vehicles & Pricing)
* **ข้อมูลในหน้า UI (`src/lib/brand.ts`, `src/components/jumbo/screens/admin/pages.tsx`):**
  - **กระบะทั่วไป (pickup):** รับน้ำหนัก 1.5 ตัน, ราคาเริ่มต้น ฿150, ค่าระยะทาง ฿12/กม.
  - **กระบะตู้ทึบ (pickup_box):** รับน้ำหนัก 1.5 ตัน, ราคาเริ่มต้น ฿220, ค่าระยะทาง ฿15/กม.
  - **กระบะคอก (pickup_fence):** รับน้ำหนัก 1.8 ตัน, ราคาเริ่มต้น ฿240, ค่าระยะทาง ฿16/กม.
  - **จัมโบ้ (jumbo):** รับน้ำหนัก 2.5 ตัน, ราคาเริ่มต้น ฿420, ค่าระยะทาง ฿22/กม.
  - **6 ล้อ (truck_6w):** รับน้ำหนัก 5.0 ตัน, ราคาเริ่มต้น ฿650, ค่าระยะทาง ฿30/กม.
* **สถานะใน Supabase ปัจจุบัน:** ยังไม่มีตาราง `vehicle_types` และตาราง `vehicles` เดิมมีเพียงตัวอย่างรถเล็ก (motorcycle/car) ไม่ตรงกับบริบท JUMBO GO
* **สิ่งที่ต้องสร้าง:** ตาราง `vehicle_types` และอัปเดตตาราง `vehicles` พร้อม Foreign Key เชื่อมโยง

### 2.2 ข้อมูลการตรวจสอบและเอกสาร KYC คนขับ 10 ขั้นตอน (Driver Onboarding KYC)
* **ข้อมูลในหน้า UI (`src/components/jumbo/screens/driver/onboarding.tsx`, `AdminKycPage`):**
  - ขั้นที่ 1: ข้อมูลส่วนตัว (ชื่อ-นามสกุล, เบอร์โทร, เบอร์ฉุกเฉิน, ที่อยู่ตามทะเบียนบ้าน/ปัจจุบัน)
  - ขั้นที่ 2: บัตรประชาชน (เลขประจำตัว 13 หลัก, รูปบัตรด้านหน้า, รูปบัตรด้านหลัง, Laser ID)
  - ขั้นที่ 3: ยืนยันใบหน้า (ภาพถ่ายเซลฟี่คู่กับบัตรประชาชน - Liveness Check)
  - ขั้นที่ 4: ใบขับขี่ (ประเภทใบขับขี่สาธารณะ/ส่วนบุคคล, เลขที่, วันหมดอายุ, ภาพถ่ายหน้า-หลัง)
  - ขั้นที่ 5: ข้อมูลรถ (ประเภท, ยี่ห้อ, รุ่น, ปี, สี, ทะเบียน, จังหวัดป้ายทะเบียน)
  - ขั้นที่ 6: เอกสารรถ (สมุดคู่มือจดทะเบียน/หน้าภาษี, พ.ร.บ. คุ้มครองผู้ประสบภัย, ภาพถ่ายหน้ารถและข้างรถ)
  - ขั้นที่ 7: บัญชีธนาคาร (ธนาคาร, เลขที่บัญชี, ชื่อบัญชี, ภาพหน้าสมุดบัญชี)
  - ขั้นที่ 8: ข้อกำหนดและเงื่อนไข (PDPA Consent, ยินยอมตรวจประวัติอาชญากรรม, เงื่อนไขบริการ)
  - ขั้นที่ 9: ตรวจสอบความถูกต้องของข้อมูลทั้งหมด (Summary Review)
  - ขั้นที่ 10: สถานะส่งตรวจสอบ (Pending Approval, Approved, Rejected + Reject Reason)
* **สถานะใน Supabase ปัจจุบัน:** ยังไม่มีตาราง `driver_kyc` มีเพียงฟิลด์เบื้องต้น `id_card_url`, `license_url` ในตาราง `drivers`
* **สิ่งที่ต้องสร้าง:** ตาราง `driver_kyc` ครบทั้ง 10 ขั้นตอน พร้อมสถานะตรวจสอบและการบันทึก Signed URL

### 2.3 ข้อมูลงานขนส่ง, เส้นทาง และประวัติสถานะ (Jobs & Timeline)
* **ข้อมูลในหน้า UI (`src/store/jumbo.ts`, `src/lib/brand.ts`):**
  - รหัสงาน: e.g. `JG-2025-00108`, `JG-2025-00107`, `JG-2025-00106`
  - เส้นทาง: จุดรับ (ที่อยู่, ละติจูด, ลองจิจูด, โน้ต, แท็กสถานที่ เช่น 'บ้าน', 'ออฟฟิศ', 'โกดัง') → จุดส่ง
  - รายละเอียดผู้ติดต่อ: ชื่อและเบอร์โทรผู้ส่ง และผู้รับ
  - รายละเอียดค่าบริการ: ค่าบริการพื้นฐาน, ค่าตามระยะทาง, ค่าช่วยยกของ, ค่าทางด่วน, ส่วนลด, ยอดสุทธิ
  - ส่วนแบ่งรายได้: รายได้คนขับ (Driver Earnings), ค่าคอมมิชชันแพลตฟอร์ม (Platform Fee)
  - Timeline สถานะงาน: ค้นหาคนขับ → รับงานแล้ว → กำลังไปรับ → ถึงจุดรับ → รับสินค้าแล้ว → ระหว่างจัดส่ง → ถึงจุดส่ง → ส่งมอบสำเร็จ
* **สถานะใน Supabase ปัจจุบัน:** มีตาราง `bookings` และ `booking_locations` แต่ยังขาดฟิลด์โครงสร้างค่าบริการ ค่าทางด่วน ค่าช่วยยก และตาราง `job_timeline`
* **สิ่งที่ต้องสร้าง:** ขยายตาราง `bookings` ให้รองรับโครงสร้างต้นทุนจริง และสร้างตาราง `job_timeline`

### 2.4 ระบบการแจ้งเตือน 3 กลุ่มบทบาท (Multi-Role Notification System)
* **ข้อมูลในหน้า UI (`src/lib/notifications.ts`):**
  - ฝั่งลูกค้า (Customer): 10 หมวดหมู่ (driver_accepted, driver_going_to_pickup, arrived_pickup, picked_up, in_transit, arrived_dropoff, job_completed, driver_cancelled, payment_due, action_required)
  - ฝั่งคนขับ (Driver): 9 หมวดหมู่ (new_job_nearby, job_details, customer_cancelled, job_modified, accept_deadline_warning, earnings, kyc_result, doc_expiring, system_announcement)
  - ฝั่งแอดมิน (Admin): 5 หมวดหมู่ (abnormal_cancellation, complaint, stale_job, payment_issue, admin_action_required)
  - ระดับความสำคัญ (Priority): low, normal, high, urgent
  - ข้อมูลประกอบ: jobId, amount, action_label, action_target
* **สถานะใน Supabase ปัจจุบัน:** ตาราง `notifications` เดิมมีเพียงฟิลด์พื้นฐาน (user_id, title, message)
* **สิ่งที่ต้องสร้าง:** อัปเดต/ขยายตาราง `notifications` ให้รองรับ `role`, `category`, `priority`, `action_label`, `action_target`, `amount`, `job_id`

### 2.5 ธุรกรรมการเงินและการโอนเงิน (Financial & Payout Transactions)
* **ข้อมูลในหน้า UI (`AdminPaymentsPage`, `DriverEarningsScreen`):**
  - รหัสธุรกรรม: e.g. `TXN-5021`, `TXN-5020`, `TXN-5019`
  - ประเภท: ค่ารอบงานขนส่ง (job_fare), การโอนเงินเข้าบัญชีคนขับ (driver_payout), คืนเงินค่าทางด่วน (toll_refund), โบนัส (bonus)
  - สถานะ: รอดำเนินการ (pending), สำเร็จ (completed), ล้มเหลว (failed)
* **สถานะใน Supabase ปัจจุบัน:** ตาราง `payments` มีเพียงการชำระเงินของลูกค้า แต่ยังขาดการจัดการรอบโอนเงินให้คนขับ (Driver Payouts)
* **สิ่งที่ต้องสร้าง:** สร้างตาราง `transactions` หรือขยาย `payments` ให้ครอบคลุมทุก flow ทางการเงิน

---

## 3. เกณฑ์การยอมรับ (Acceptance Criteria)
1. มีพิมพ์เขียวทางสถาปัตยกรรม (`docs/architecture.md`) และสเปคทางเทคนิค (`docs/technical-spec.md`) ที่ระบุ ERD, DDL และ API Contracts อย่างชัดเจน
2. มีสคริปต์ SQL ครบถ้วนสำหรับ Supabase (`supabase/schema.sql` และ `supabase/seed.sql`) พร้อม RLS (Row Level Security)
3. มี TypeScript SDK Client (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`) และ Typed Schema Data Access Layer
4. รันการทดสอบและ Seed ข้อมูลตัวจริง (สมชาย ใจดี, วันดี มีสุข, รถบรรทุก JUMBO, งาน JG-00108, การแจ้งเตือน) ลงในระบบ Supabase สำเร็จ
5. แอปพลิเคชัน Next.js ต้อง Compile ผ่าน 100% ปราศจาก Type Error
