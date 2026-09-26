# JUMBO GO — เอกสารข้อกำหนดระบบ API (API Documentation)
**เวอร์ชัน:** 1.4.0  
**ฐานข้อมูล:** Supabase PostgreSQL (14 Tables, RLS Enabled)  
**มาตรฐาน:** ARM-AI Engineering Standard (ARM-AES) & RESTful Specification

---

## 1. การพิสูจน์ตัวตนและการเข้าถึง (Authentication & Headers)

ทุกคำขอ (Request) ที่ต้องการการระบุตัวตนของผู้ใช้หรือคนขับ ต้องส่ง Header ดังนี้:

```http
Authorization: Bearer jumbo_<user_id>
Content-Type: application/json
```

*หมายเหตุ: หากไม่มี Token หรือเป็น Token ที่ไม่ถูกต้อง ระบบจะตอบกลับสถานะ HTTP 401 Unauthorized*

---

## 2. กลุ่ม API สำหรับการเข้าสู่ระบบและสมาชิก (Auth Endpoints)

### 2.1 เข้าสู่ระบบ (Password / Phone Lookup)
* **Endpoint:** `POST /api/auth/login`
* **Request Body:**
  ```json
  {
    "email": "customer@example.com",
    "password": "SecurePassword123"
  }
  ```
  หรือระบุหมายเลขโทรศัพท์:
  ```json
  {
    "phone": "0823456789"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "เข้าสู่ระบบสำเร็จ",
    "user": {
      "id": "a9dce7bb-a9cf-4f21-874a-129b0138fd56",
      "email": "customer@example.com",
      "phone": "082-345-6789",
      "full_name": "สมหญิง ใจเย็น"
    },
    "token": "jumbo_a9dce7bb-a9cf-4f21-874a-129b0138fd56"
  }
  ```

### 2.2 ส่ง OTP (Send OTP)
* **Endpoint:** `POST /api/auth/send-otp`
* **Request Body:**
  ```json
  {
    "phone": "0823456789"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "ส่งรหัส OTP เรียบร้อยแล้ว (Demo: 123456)"
  }
  ```

### 2.3 ยืนยัน OTP (Verify OTP)
* **Endpoint:** `POST /api/auth/verify-otp`
* **Request Body:**
  ```json
  {
    "phone": "0823456789",
    "code": "123456"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": { ... },
    "token": "jumbo_<user_id>"
  }
  ```

---

## 3. กลุ่ม API สำหรับการจองรถและคำนวณราคา (Bookings & Pricing)

### 3.1 ดึงประเภทรถทั้งหมด (Vehicle Types)
* **Endpoint:** `GET /api/vehicle-types`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "vehicleTypes": [
      {
        "id": "pickup",
        "name": "กระบะทั่วไป",
        "capacity_kg": 1500,
        "base_fare": 150,
        "per_km_rate": 12
      },
      {
        "id": "pickup_box",
        "name": "กระบะตู้ทึบ",
        "capacity_kg": 1500,
        "base_fare": 220,
        "per_km_rate": 15
      },
      {
        "id": "truck_6w",
        "name": "6 ล้อ",
        "capacity_kg": 5000,
        "base_fare": 650,
        "per_km_rate": 30
      }
    ]
  }
  ```

### 3.2 คำนวณราคาประเมินล่วงหน้า (Estimate Pricing)
* **Endpoint:** `POST /api/pricing/estimate`
* **Request Body:**
  ```json
  {
    "vehicleType": "pickup_box",
    "distanceKm": 18.2,
    "hasExtraHelper": true,
    "hasExpressway": true
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "breakdown": {
      "baseFare": 220,
      "distanceFare": 273,
      "extraHelperFee": 300,
      "expresswayFee": 50,
      "totalFare": 843
    }
  }
  ```

### 3.3 สร้างการจองรถใหม่ (Create Booking)
* **Endpoint:** `POST /api/bookings`
* **Headers:** `Authorization: Bearer jumbo_<user_id>`
* **Request Body:**
  ```json
  {
    "pickup": {
      "address": "สยามพารากอน",
      "latitude": 13.7462,
      "longitude": 100.5347
    },
    "dropoff": {
      "address": "เมกาบางนา",
      "latitude": 13.6467,
      "longitude": 100.6802
    },
    "vehicleType": "pickup_box",
    "fare": 843,
    "distanceKm": 18.2,
    "senderName": "สมหญิง ใจเย็น",
    "senderPhone": "082-345-6789",
    "receiverName": "ผู้รับปลายทาง",
    "receiverPhone": "081-999-8888"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "สร้างการจองสำเร็จ",
    "jobNumber": "JG-2026-10204",
    "booking": {
      "id": "uuid",
      "status": "searching",
      "fare": 843
    }
  }
  ```

### 3.4 ข้อมูลรายละเอียดการจอง (Get Booking by ID)
* **Endpoint:** `GET /api/bookings/[id]`
* **Headers:** `Authorization: Bearer jumbo_<user_id>`

### 3.5 ยกเลิกการจอง (Cancel Booking)
* **Endpoint:** `POST /api/bookings/[id]/cancel`
* **Headers:** `Authorization: Bearer jumbo_<user_id>`
* **Request Body:**
  ```json
  {
    "reason": "เปลี่ยนเวลาการเดินทาง"
  }
  ```

---

## 4. กลุ่ม API สำหรับคนขับ (Driver Endpoints)

### 4.1 สลับสถานะ ออนไลน์ / ออฟไลน์
* `POST /api/driver/availability/online` (พร้อมรับงาน)
* `POST /api/driver/availability/offline` (พักงาน)
* **Headers:** `Authorization: Bearer jumbo_<driver_user_id>`

### 4.2 ดึงรายการงานที่พร้อมรับในพื้นที่ (Available Jobs)
* **Endpoint:** `GET /api/driver/jobs`
* **Headers:** `Authorization: Bearer jumbo_<driver_user_id>`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "jobs": [
      {
        "id": "booking-uuid",
        "job_number": "JG-2026-10204",
        "vehicle_type": "pickup_box",
        "fare": 843,
        "distance_km": 18.2,
        "distance_from_driver_km": 3.4,
        "booking_locations": [ ... ]
      }
    ]
  }
  ```

### 4.3 คนขับกดรับงาน (Accept Job)
* **Endpoint:** `POST /api/driver/jobs/[id]/accept`
* **Headers:** `Authorization: Bearer jumbo_<driver_user_id>`

### 4.4 คนขับอัปเดตสถานะงาน (Update Job Status)
* **Endpoint:** `POST /api/driver/jobs/[id]/status`
* **Headers:** `Authorization: Bearer jumbo_<driver_user_id>`
* **Request Body:**
  ```json
  {
    "status": "in_transit"
  }
  ```
  *(สถานะที่รองรับ: `accepted` ➔ `picking_up` ➔ `in_transit` ➔ `completed`)*

### 4.5 แนบหลักฐานการส่งมอบสินค้า (Proof of Delivery)
* **Endpoint:** `POST /api/driver/jobs/[id]/proof`
* **Request Body:**
  ```json
  {
    "photoUrl": "https://storage.jumbogo.co/proofs/10204.jpg",
    "proofType": "dropoff_receipt",
    "note": "ส่งมอบสินค้าครบถ้วน ผู้รับเซ็นรับเรียบร้อย"
  }
  ```

### 4.6 สรุปรายได้และกระเป๋าเงินคนขับ (Driver Earnings)
* **Endpoint:** `GET /api/driver/earnings`
* **Headers:** `Authorization: Bearer jumbo_<driver_user_id>`

---

## 5. กลุ่ม API สำหรับผู้ดูแลระบบ (Admin Endpoints)

### 5.1 ตรวจสอบเอกสาร KYC คนขับ (List & Review KYC)
* **ดึงรายการรอตรวจ:** `GET /api/admin/kyc/list`
* **อนุมัติ/ปฏิเสธ KYC:** `POST /api/admin/kyc/[id]/review`
  * **Request Body:**
    ```json
    {
      "status": "approved"
    }
    ```
    หรือ
    ```json
    {
      "status": "rejected",
      "rejectionReason": "ภาพถ่ายบัตรประชาชนไม่ชัดเจน กรุณาถ่ายใหม่"
    }
    ```

### 5.2 ข้อมูลสถิติรวมของระบบ (Admin Stats)
* **Endpoint:** `GET /api/admin/stats`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "stats": {
      "totalUsers": 1420,
      "totalDrivers": 248,
      "activeJobs": 34,
      "todayRevenue": 84520,
      "pendingKyc": 12
    }
  }
  ```

### 5.3 กำหนดอัตราค่าบริการ (Pricing Rules)
* **ดึงอัตราปัจจุบัน:** `GET /api/admin/pricing`
* **แก้ไขอัตราบริการ:** `PUT /api/admin/pricing`
