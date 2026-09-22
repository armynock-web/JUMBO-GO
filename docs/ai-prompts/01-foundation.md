# 01-foundation.md

## Phase 1: Foundation (พื้นฐาน)

### วัตถุประสงค์
ตั้งค่าพื้นฐานของระบบเพื่อให้พร้อมสำหรับการพัฒนา

### งานที่ต้องทำ

#### 1.1 ติดตั้ง Dependencies
- [ ] ติดตั้ง @supabase/supabase-js
- [ ] ติดตั้ง @supabase/ssr
- [ ] ติดตั้ง dependencies อื่นๆ ที่จำเป็น

#### 1.2 ตั้งค่า Environment Variables
- [ ] สร้าง .env.example
- [ ] ตั้งค่า NEXT_PUBLIC_SUPABASE_URL
- [ ] ตั้งค่า NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] ตั้งค่า SUPABASE_SERVICE_ROLE_KEY
- [ ] ตรวจสอบ .gitignore

#### 1.3 สร้าง Supabase Client
- [ ] สร้าง lib/supabase/client.ts (client-side)
- [ ] สร้าง lib/supabase/server.ts (server-side)
- [ ] สร้าง lib/supabase/admin.ts (admin/server-role)

#### 1.4 สร้าง Database Schema
- [ ] ออกแบบ tables สำหรับ users, drivers, bookings, payments, reviews
- [ ] สร้าง migration ด้วย Supabase MCP
- [ ] ตั้งค่า RLS policies
- [ ] สร้าง indexes ที่จำเป็น

#### 1.5 ตั้งค่า Supabase Auth
- [ ] เปิดใช้งาน Email/Password authentication
- [ ] ตั้งค่า custom claims สำหรับ roles (user, driver, admin)
- [ ] สร้าง trigger สำหรับ user creation

#### 1.6 สร้าง Documentation
- [ ] สร้าง docs/SCREEN-INVENTORY.md
- [ ] สร้าง docs/DESIGN-SYSTEM.md
- [ ] สร้าง docs/DATABASE-SCHEMA.md
- [ ] สร้าง docs/API-CONTRACT.md

### การตรวจสอบ
- [ ] รัน `npm run lint` - ผ่าน
- [ ] รัน `npx tsc --noEmit` - ผ่าน
- [ ] ตรวจสอบว่า Supabase client ทำงานได้
- [ ] ตรวจสอบว่า database schema ถูกต้อง

### ถัดไป
ไปยัง Phase 2: Authentication
