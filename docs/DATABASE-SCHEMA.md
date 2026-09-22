# JUMBO GO - Database Schema

## ภาพรวม (Overview)

ใช้ Supabase PostgreSQL เป็นฐานข้อมูลหลัก พร้อม RLS (Row Level Security) สำหรับความปลอดภัย

## Tables

### 1. users
ตารางสำหรับผู้ใช้ทั่วไป (Customers)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key (จาก Supabase Auth) |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| first_name | TEXT | ชื่อจริง |
| last_name | TEXT | นามสกุล |
| avatar_url | TEXT | URL รูปโปรไฟล์ |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดตล่าสุด |

### 2. drivers
ตารางสำหรับคนขับ

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key ไปยัง auth.users |
| phone | TEXT | Phone number |
| first_name | TEXT | ชื่อจริง |
| last_name | TEXT | นามสกุล |
| avatar_url | TEXT | URL รูปโปรไฟล์ |
| id_card_url | TEXT | URL รูปบัตรประชาชน (KYC) |
| license_url | TEXT | URL ใบขับขี่ (KYC) |
| vehicle_id | UUID | Foreign Key ไปยัง vehicles |
| is_verified | BOOLEAN | สถานะการยืนยันตัวตน |
| is_online | BOOLEAN | สถานะออนไลน์ |
| current_location_lat | DECIMAL | พิกัดละติจูดปัจจุบัน |
| current_location_lng | DECIMAL | พิกัดลองจิจูดปัจจุบัน |
| rating_avg | DECIMAL | คะแนนเฉลี่ย |
| rating_count | INTEGER | จำนวนรีวิว |
| total_earnings | DECIMAL | รายได้รวม |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดตล่าสุด |

### 3. vehicles
ตารางสำหรับยานพาหนะ

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| driver_id | UUID | Foreign Key ไปยัง drivers |
| type | TEXT | ประเภท (motorcycle, car, van) |
| brand | TEXT | ยี่ห้อ |
| model | TEXT | รุ่น |
| year | INTEGER | ปี |
| plate_number | TEXT | ทะเบียนรถ |
| color | TEXT | สี |
| is_active | BOOLEAN | สถานะใช้งาน |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดตล่าสุด |

### 4. bookings
ตารางสำหรับการจอง

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key ไปยัง auth.users |
| driver_id | UUID | Foreign Key ไปยัง drivers (nullable) |
| vehicle_type | TEXT | ประเภทยานพาหนะที่ต้องการ |
| status | TEXT | สถานะ (pending, searching, accepted, picked_up, completed, cancelled) |
| fare | DECIMAL | ค่าโดยสาร |
| distance_km | DECIMAL | ระยะทาง (กิโลเมตร) |
| duration_min | INTEGER | เวลาโดยสาร (นาที) |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดตล่าสุด |

### 5. booking_locations
ตารางสำหรับตำแหน่งรับ/ส่ง

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| booking_id | UUID | Foreign Key ไปยัง bookings |
| type | TEXT | ประเภท (pickup, dropoff) |
| address | TEXT | ที่อยู่ |
| lat | DECIMAL | พิกัดละติจูด |
| lng | DECIMAL | พิกัดลองจิจูด |
| sequence | INTEGER | ลำดับ |
| created_at | TIMESTAMPTZ | วันที่สร้าง |

### 6. payments
ตารางสำหรับการชำระเงิน

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| booking_id | UUID | Foreign Key ไปยัง bookings |
| amount | DECIMAL | จำนวนเงิน |
| method | TEXT | วิธีชำระ (cash, card, promptpay) |
| status | TEXT | สถานะ (pending, paid, failed, refunded) |
| transaction_id | TEXT | ID การทำธุรกรรม |
| created_at | TIMESTAMPTZ | วันที่สร้าง |
| updated_at | TIMESTAMPTZ | วันที่อัปเดตล่าสุด |

### 7. reviews
ตารางสำหรับรีวิว

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| booking_id | UUID | Foreign Key ไปยัง bookings |
| user_id | UUID | Foreign Key ไปยัง auth.users |
| driver_id | UUID | Foreign Key ไปยัง drivers |
| rating | INTEGER | คะแนน (1-5) |
| comment | TEXT | ความคิดเห็น |
| created_at | TIMESTAMPTZ | วันที่สร้าง |

### 8. notifications
ตารางสำหรับการแจ้งเตือน

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key ไปยัง auth.users |
| type | TEXT | ประเภท (booking, payment, system) |
| title | TEXT | หัวข้อ |
| message | TEXT | ข้อความ |
| is_read | BOOLEAN | สถานะอ่านแล้ว |
| data | JSONB | ข้อมูลเพิ่มเติม |
| created_at | TIMESTAMPTZ | วันที่สร้าง |

## RLS Policies (Row Level Security)

### users
- ผู้ใช้สามารถดูข้อมูลตัวเองเท่านั้น
- ผู้ใช้สามารถแก้ไขข้อมูลตัวเองเท่านั้น

### drivers
- คนขับสามารถดูข้อมูลตัวเองเท่านั้น
- คนขับสามารถแก้ไขข้อมูลตัวเองเท่านั้น
- Admin สามารถดูและแก้ไขข้อมูลคนขับทั้งหมด

### bookings
- ผู้ใช้สามารถดู bookings ของตัวเองเท่านั้น
- คนขับสามารถดู bookings ที่ได้รับมอบหมาย
- Admin สามารถดู bookings ทั้งหมด

### payments
- ผู้ใช้สามารถดู payments ของตัวเองเท่านั้น
- คนขับสามารถดู payments ที่เกี่ยวข้องกับ bookings ของตัวเอง
- Admin สามารถดู payments ทั้งหมด

## Indexes

- bookings(user_id, created_at)
- bookings(driver_id, status)
- drivers(is_online, current_location_lat, current_location_lng)
- booking_locations(booking_id)
