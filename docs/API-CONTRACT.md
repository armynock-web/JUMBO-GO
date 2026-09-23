# JUMBO GO - API Contract

## วันที่: 23 กันยายน 2026

---

## บทนำ (Introduction)

เอกสารนี้อธิบาย API endpoints ทั้งหมดของ JUMBO GO ระบบจองยานพาหนะและบริการส่งมอบ

### Base URL
```
http://localhost:3000/api
```

### Authentication
ทุก API endpoints ต้องการ authentication ยกเว้นที่ระบุไว้

### Headers
```
Content-Type: application/json
Authorization: Bearer {session_token}
```

---

## Authentication

### วิธีการ Authentication
1. **Email/Password**: ใช้ Supabase Auth
2. **Google OAuth**: ใช้ Supabase Auth

### การตรวจสอบ Role
- `user`: ลูกค้าทั่วไป
- `driver`: คนขับ
- `admin`: ผู้ดูแลระบบ

---

## Bookings API

### POST /api/bookings
สร้าง booking ใหม่

**Authentication:** Required  
**Allowed Roles:** user

**Request Body:**
```json
{
  "vehicle_type": "motorcycle",
  "pickup_address": "123 ถนนสุขุมวิท",
  "pickup_lat": 13.7563,
  "pickup_lng": 100.5018,
  "dropoff_address": "456 ถนนสีลม",
  "dropoff_lat": 13.7284,
  "dropoff_lng": 100.5765
}
```

**Validation Rules:**
- `vehicle_type`: ต้องเป็น motorcycle, car, หรือ van
- `pickup_address`, `dropoff_address`: ต้องไม่ว่าง
- `pickup_lat`, `pickup_lng`, `dropoff_lat`, `dropoff_lng`: ต้องเป็นตัวเลข

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "vehicle_type": "motorcycle",
    "status": "pending",
    "created_at": "2026-09-23T10:00:00Z"
  },
  "message": "สร้าง booking สำเร็จ"
}
```

**Error Response (400):**
```json
{
  "error": "ข้อมูลไม่ครบถ้วน"
}
```

**Database Tables:** bookings, booking_locations  
**Realtime Side Effects:** Emit booking_created event

---

### GET /api/bookings
ดู bookings ของ user ปัจจุบัน

**Authentication:** Required  
**Allowed Roles:** user

**Query Parameters:**
- `status` (optional): pending, searching, accepted, picked_up, completed, cancelled

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "vehicle_type": "motorcycle",
      "status": "completed",
      "fare": 150.00,
      "booking_locations": [...]
    }
  ]
}
```

**Database Tables:** bookings, booking_locations

---

## Drivers API

### PATCH /api/drivers
อัปเดต driver status และ location

**Authentication:** Required  
**Allowed Roles:** driver

**Request Body:**
```json
{
  "is_online": true,
  "current_location_lat": 13.7563,
  "current_location_lng": 100.5018
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "is_online": true,
    "current_location_lat": 13.7563,
    "current_location_lng": 100.5018
  },
  "message": "อัปเดต driver สำเร็จ"
}
```

**Database Tables:** drivers  
**Realtime Side Effects:** Emit driver_location_updated event

---

### GET /api/drivers
ดู drivers ที่ออนไลน์

**Authentication:** Not Required (Public)

**Query Parameters:**
- `is_online` (optional): true, false

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "is_online": true,
      "is_verified": true,
      "rating_avg": 4.8,
      "vehicles": [...]
    }
  ]
}
```

**Database Tables:** drivers, vehicles

---

## Payments API

### POST /api/payments
สร้าง payment ใหม่

**Authentication:** Required  
**Allowed Roles:** user

**Request Body:**
```json
{
  "booking_id": "uuid",
  "amount": 150.00,
  "method": "promptpay",
  "transaction_id": "TXN123456"
}
```

**Validation Rules:**
- `booking_id`: ต้องมีอยู่จริง
- `amount`: ต้องเป็นตัวเลข > 0
- `method`: ต้องเป็น cash, card, หรือ promptpay

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "booking_id": "uuid",
    "amount": 150.00,
    "method": "promptpay",
    "status": "pending"
  },
  "message": "สร้าง payment สำเร็จ"
}
```

**Database Tables:** payments, bookings

---

### GET /api/payments
ดู payments ของ user ปัจจุบัน

**Authentication:** Required  
**Allowed Roles:** user

**Query Parameters:**
- `status` (optional): pending, paid, failed, refunded

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "amount": 150.00,
      "method": "promptpay",
      "status": "paid",
      "bookings": {...}
    }
  ]
}
```

**Database Tables:** payments, bookings

---

## Reviews API

### POST /api/reviews
สร้าง review ใหม่

**Authentication:** Required  
**Allowed Roles:** user

**Request Body:**
```json
{
  "booking_id": "uuid",
  "rating": 5,
  "comment": "บริการดีมาก"
}
```

**Validation Rules:**
- `booking_id`: ต้องมีอยู่จริงและเป็นของ user
- `rating`: ต้องอยู่ระหว่าง 1-5
- booking ต้องมี status = completed
- ไม่อนุญาต review ซ้ำ booking เดียวกัน

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "booking_id": "uuid",
    "user_id": "uuid",
    "driver_id": "uuid",
    "rating": 5,
    "comment": "บริการดีมาก"
  },
  "message": "สร้าง review สำเร็จ"
}
```

**Database Tables:** reviews, bookings, drivers  
**Side Effects:** อัปเดต driver rating อัตโนมัติ

---

### GET /api/reviews
ดู reviews ของ user ปัจจุบัน หรือ driver ที่เฉพาะเจาะจง

**Authentication:** Required  
**Allowed Roles:** user, driver

**Query Parameters:**
- `driver_id` (optional): ID ของ driver ที่ต้องการดู reviews

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "user_id": "uuid",
      "driver_id": "uuid",
      "rating": 5,
      "comment": "บริการดีมาก",
      "bookings": {...},
      "drivers": {...}
    }
  ]
}
```

**Database Tables:** reviews, bookings, drivers

---

## Notifications API

### GET /api/notifications
ดู notifications ของ user ปัจจุบัน

**Authentication:** Required  
**Allowed Roles:** user, driver, admin

**Query Parameters:**
- `is_read` (optional): true, false

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "booking",
      "title": "Booking สำเร็จ",
      "message": "คุณได้รับ driver แล้ว",
      "is_read": false,
      "created_at": "2026-09-23T10:00:00Z"
    }
  ]
}
```

**Database Tables:** notifications

---

### POST /api/notifications
สร้าง notification ใหม่ (admin only)

**Authentication:** Required  
**Allowed Roles:** admin

**Request Body:**
```json
{
  "user_id": "uuid",
  "type": "system",
  "title": "แจ้งเตือนจากระบบ",
  "message": "ระบบจะปิดปรับปรุงในวันพรุ่งนี้",
  "data": { "maintenance_date": "2026-09-24" }
}
```

**Validation Rules:**
- `type`: ต้องเป็น booking, payment, หรือ system

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "type": "system",
    "title": "แจ้งเตือนจากระบบ",
    "message": "ระบบจะปิดปรับปรุงในวันพรุ่งนี้",
    "is_read": false
  },
  "message": "สร้าง notification สำเร็จ"
}
```

**Database Tables:** notifications

---

### PATCH /api/notifications/{id}
อัปเดต notification เป็น read

**Authentication:** Required  
**Allowed Roles:** user, driver, admin

**Request Body:**
```json
{
  "is_read": true
}
```

**Authorization Behavior:** user_id ต้องเป็นของ user ปัจจุบัน

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "is_read": true
  },
  "message": "อัปเดต notification สำเร็จ"
}
```

**Database Tables:** notifications

---

## Admin API

### GET /api/admin/users
ดู users ทั้งหมด

**Authentication:** Required  
**Allowed Roles:** admin

**Query Parameters:**
- `role` (optional): user, driver, admin

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "ทดสอบ",
      "last_name": "ระบบ",
      "role": "user"
    }
  ]
}
```

**Database Tables:** users

---

### POST /api/admin/users
สร้าง user ใหม่ (admin only)

**Authentication:** Required  
**Allowed Roles:** admin

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123",
  "first_name": "สมชาย",
  "last_name": "ใจดี",
  "role": "driver"
}
```

**Validation Rules:**
- `role`: ต้องเป็น user, driver, หรือ admin

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "first_name": "สมชาย",
    "last_name": "ใจดี",
    "role": "driver"
  },
  "message": "สร้าง user สำเร็จ"
}
```

**Database Tables:** users (auth.users)

---

### PATCH /api/admin/users/{id}
อัปเดต user

**Authentication:** Required  
**Allowed Roles:** admin

**Request Body:**
```json
{
  "role": "admin"
}
```

**Validation Rules:**
- `role`: ต้องเป็น user, driver, หรือ admin

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "role": "admin"
  },
  "message": "อัปเดต user สำเร็จ"
}
```

**Database Tables:** users

---

### DELETE /api/admin/users/{id}
ลบ user

**Authentication:** Required  
**Allowed Roles:** admin

**Success Response (200):**
```json
{
  "message": "ลบ user สำเร็จ"
}
```

**Database Tables:** users (auth.users)

---

### GET /api/admin/drivers
ดู drivers ทั้งหมด

**Authentication:** Required  
**Allowed Roles:** admin

**Query Parameters:**
- `is_verified` (optional): true, false
- `is_online` (optional): true, false

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "first_name": "สมชาย",
      "last_name": "ใจดี",
      "is_verified": true,
      "is_online": true,
      "rating_avg": 4.8,
      "users": {...},
      "vehicles": {...}
    }
  ]
}
```

**Database Tables:** drivers, users, vehicles

---

### PATCH /api/admin/drivers/{id}
อัปเดต driver

**Authentication:** Required  
**Allowed Roles:** admin

**Request Body:**
```json
{
  "is_verified": true,
  "is_online": false
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "is_verified": true,
    "is_online": false
  },
  "message": "อัปเดต driver สำเร็จ"
}
```

**Database Tables:** drivers

---

### GET /api/admin/bookings
ดู bookings ทั้งหมด

**Authentication:** Required  
**Allowed Roles:** admin

**Query Parameters:**
- `status` (optional): pending, searching, accepted, picked_up, completed, cancelled

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "driver_id": "uuid",
      "vehicle_type": "motorcycle",
      "status": "completed",
      "users": {...},
      "drivers": {...},
      "booking_locations": [...]
    }
  ]
}
```

**Database Tables:** bookings, users, drivers, booking_locations

---

### PATCH /api/admin/bookings/{id}
อัปเดต booking

**Authentication:** Required  
**Allowed Roles:** admin

**Request Body:**
```json
{
  "status": "completed",
  "driver_id": "uuid"
}
```

**Validation Rules:**
- `status`: ต้องเป็น pending, searching, accepted, picked_up, completed, หรือ cancelled

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "driver_id": "uuid"
  },
  "message": "อัปเดต booking สำเร็จ"
}
```

**Database Tables:** bookings

---

### GET /api/admin/stats
ดูสถิติของระบบ

**Authentication:** Required  
**Allowed Roles:** admin

**Success Response (200):**
```json
{
  "data": {
    "total_users": 100,
    "total_drivers": 50,
    "total_bookings": 200,
    "total_revenue": 15000.00
  }
}
```

**Database Tables:** users, drivers, bookings, payments

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "ข้อมูลไม่ครบถ้วน"
}
```

### 401 Unauthorized
```json
{
  "error": "ต้องการ authentication"
}
```

### 403 Forbidden
```json
{
  "error": "ไม่มีสิทธิ์เข้าถึง"
}
```

### 404 Not Found
```json
{
  "error": "ไม่พบข้อมูล"
}
```

### 500 Internal Server Error
```json
{
  "error": "เกิดข้อผิดพลาด"
}
```

---

## Rate Limiting
ยังไม่ได้ตั้งค่า

---

## Idempotency
- POST endpoints: ไม่ idempotent
- GET endpoints: idempotent
- PATCH endpoints: idempotent
- DELETE endpoints: idempotent

---

## การเชื่อมต่อ Realtime
- bookings table: เปิดใช้งาน Realtime
- drivers table: เปิดใช้งาน Realtime
- notifications table: เปิดใช้งาน Realtime

---

**ผู้เขียน:** Devin AI  
**วันที่:** 23 กันยายน 2026  
**เวอร์ชั่น:** 1.0.0
