# 🚛 JUMBO GO — ขนส่งแน่นเปีย โตแล้วไว

แพลตฟอร์มบริการขนส่ง (Lalamove-style) สร้างด้วย **Next.js 16 + Supabase (PostgreSQL + Realtime)** ตามมาตรฐาน [ARM-AI Engineering Standard (ARM-AES)](https://github.com/armynock-web/JUMBO-GO)

## Tech Stack

- **Next.js 16.1.1** (App Router, Server Actions-friendly) — React 19, TypeScript 5
- **Supabase** — PostgreSQL, Auth, Realtime WebSockets, Storage (14 ตาราง live)
- **Tailwind CSS 4 + Shadcn UI** + Radix UI
- **Zustand + TanStack Query + React Hook Form**

## เริ่มต้นใช้งาน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. สร้างไฟล์ environment จาก template
cp .env.example .env.local
#   แล้วกรอกค่า Supabase URL / anon key / service role key / Google OAuth

# 3. รัน dev server
npm run dev
```

## ทดสอบ

```bash
# รัน test suite ทั้งหมด (130 tests / 14 ไฟล์ ครอบ unit + integration + route tests)
npm test

# รันพร้อมรายงาน coverage (threshold: lines/functions/statements 80%, branches 70%)
npm run test:coverage
```

> Tests บางส่วน (integration/route) ติดต่อฐานข้อมูล Supabase จริง — ต้องมี `.env.local` ถูก config

## โครงสร้างหลัก

```
src/
├── app/api/          # API Routes (Auth, Bookings, Driver, Admin, Pricing, Notifications)
├── lib/
│   ├── api.ts        # API Client Layer (server-side Supabase wrapper)
│   ├── pricing.ts    # Pricing Engine (ฟังก์ชันบริสุทธิ์)
│   ├── request-auth.ts
│   └── supabase/     # server.ts / client.ts / repository.ts (Data Access Layer)
supabase/
└── migrations/       # Single Source of Truth สำหรับ schema ที่ apply แล้ว
tests/
├── unit/             # ฟังก์ชันบริสุทธิ์ + error-path unit tests
├── integration/      # เชื่อม Supabase จริง (api-client, repository)
└── routes/           # API route handlers (auth, pricing)
```

## Deployment

- Vercel (ดู `vercel.json`) — ติดตั้ง env ทั้ง 5 ตัวจาก `.env.local` ลง Vercel Project Settings
- Database: Supabase Cloud — schema ทั้งหมดบันทึกใน `supabase/migrations/`

## เอกสาร

- `docs/requirements.md` — ความต้องการระบบ
- `docs/architecture.md` — สถาปัตยกรรม
- `docs/technical-spec.md` — spec ทางเทคนิค
- `docs/CHANGELOG.md` / `VERSION.md` — ประวัติเวอร์ชัน