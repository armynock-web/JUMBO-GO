-- ==============================================================================
-- JUMBO GO - MASTER COMPLETE BACKEND DATABASE SETUP (SUPABASE POSTGRESQL 15+)
-- File: supabase/00_master_complete_setup.sql
-- Version: 2.0.0 (Production Master)
-- Standard: ARM-AES / AEOS v1.0
-- 
-- คำแนะนำการใช้งาน (How to Run):
-- 1. ไปที่ Supabase Dashboard (https://supabase.com/dashboard/project/oqopribnhovxfaxnjoia)
-- 2. ไปที่เมนู "SQL Editor" ด้านซ้ายมือ
-- 3. กด "New Query" แล้ว Copy โค้ดทั้งหมดในไฟล์นี้ไปวาง
-- 4. กดปุ่ม "Run" (หรือกด Ctrl+Enter / Cmd+Enter)
-- 5. สคริปต์นี้เป็นแบบ Idempotent (รันซ้ำได้ปลอดภัย 100% ไม่ทำลายข้อมูลเก่า)
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- เพิ่มคอลัมน์หากตารางเดิมยังไม่มี
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Update constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'driver', 'admin', 'user'));

-- ==============================================================================
-- 2. VEHICLE TYPES TABLE (Master Catalog & Pricing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vehicle_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_th TEXT NOT NULL,
  capacity_ton NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 350.0,
  price_per_km NUMERIC(10, 2) NOT NULL DEFAULT 15.0,
  dimensions TEXT,
  icon_name TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. VEHICLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  plate_number TEXT NOT NULL,
  plate_province TEXT,
  color TEXT,
  inspection_status TEXT DEFAULT 'approved',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe Alter Table
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS plate_province TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS inspection_status TEXT DEFAULT 'approved';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ==============================================================================
-- 4. DRIVERS TABLE (พร้อมพิกัด GPS สด)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  driver_code TEXT UNIQUE,
  phone TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_online BOOLEAN NOT NULL DEFAULT false,
  current_location_lat NUMERIC(10, 7),
  current_location_lng NUMERIC(10, 7),
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  rating_count INTEGER NOT NULL DEFAULT 0,
  total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  bank_name TEXT,
  bank_account_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe Alter Table
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS driver_code TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS current_location_lat NUMERIC(10, 7);
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS current_location_lng NUMERIC(10, 7);
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3, 2) DEFAULT 5.00;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS total_earnings NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS bank_account_number TEXT;

-- ==============================================================================
-- 5. DRIVER KYC TABLE (10 ขั้นตอนการยืนยันตัวตน)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.driver_kyc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  kyc_code TEXT UNIQUE NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 10),
  emergency_contact TEXT,
  emergency_phone TEXT,
  address_current TEXT,
  province TEXT,
  district TEXT,
  id_card_number TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  laser_id TEXT,
  selfie_url TEXT,
  license_number TEXT,
  license_type TEXT,
  license_expiry DATE,
  license_front_url TEXT,
  license_back_url TEXT,
  vehicle_type TEXT,
  vehicle_brand TEXT,
  vehicle_plate TEXT,
  vehicle_province TEXT,
  vehicle_registration_url TEXT,
  compulsory_insurance_url TEXT,
  vehicle_front_url TEXT,
  vehicle_side_url TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  bank_book_url TEXT,
  consent_pdpa BOOLEAN DEFAULT false,
  consent_background_check BOOLEAN DEFAULT false,
  consent_terms BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  reject_reason TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. BOOKINGS TABLE (งานขนส่งหลัก)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  driver_id UUID REFERENCES public.drivers(id),
  vehicle_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'searching',
  fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  base_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  distance_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  extra_helper_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  expressway_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  driver_earning NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  distance_km NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  duration_min INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'promptpay',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  sender_name TEXT,
  sender_phone TEXT,
  receiver_name TEXT,
  receiver_phone TEXT,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe Alter Table for bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS job_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES public.drivers(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS base_fare NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS distance_fare NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_helper_fee NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS expressway_fee NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_earning NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_min INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'promptpay';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS sender_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS sender_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS receiver_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS receiver_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Drop obsolete constraints and create permissive modern constraints
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_vehicle_type_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_vehicle_type_check CHECK (
  vehicle_type IN (
    'pickup', 'pickup_box', 'pickup_fence', 'jumbo', 'truck_6w',
    'PICKUP', 'CLOSED_PICKUP', 'CAGE_PICKUP', 'JUMBO', 'SIX_WHEEL',
    'motorcycle', 'sedan', 'van', 'car'
  )
);

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (
  status IN (
    'draft', 'searching', 'driver_assigned', 'going_to_pickup', 
    'arrived_pickup', 'picked_up', 'in_transit', 'arrived_dropoff', 
    'completed', 'cancelled'
  )
);

-- ==============================================================================
-- 7. BOOKING LOCATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.booking_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'dropoff')),
  address TEXT NOT NULL,
  sub_address TEXT,
  tag TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  note TEXT,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS sub_address TEXT;
ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.booking_locations ADD COLUMN IF NOT EXISTS sequence INTEGER DEFAULT 0;

-- ==============================================================================
-- 8. DRIVER WALLET & TRANSACTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.driver_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.driver_wallet(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(10, 2) NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 9. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'customer',
  category TEXT DEFAULT 'order',
  priority TEXT DEFAULT 'normal',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  job_id TEXT,
  amount NUMERIC(10, 2),
  action_label TEXT,
  action_target TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'order';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS job_id TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2);
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_label TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_target TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;

-- ==============================================================================
-- 10. REVIEWS & AUDIT LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 11. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_drivers_online_coords ON public.drivers(is_online, current_location_lat, current_location_lng);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_booking_locations_booking_id ON public.booking_locations(booking_id);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can read all users" ON public.users;
CREATE POLICY "Users can read all users" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
CREATE POLICY "Users can manage own profile" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Vehicle Types policies
DROP POLICY IF EXISTS "Vehicle types read access" ON public.vehicle_types;
CREATE POLICY "Vehicle types read access" ON public.vehicle_types FOR SELECT USING (true);

-- Vehicles policies
DROP POLICY IF EXISTS "Vehicles read access" ON public.vehicles;
CREATE POLICY "Vehicles read access" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vehicles full access" ON public.vehicles;
CREATE POLICY "Vehicles full access" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

-- Drivers policies
DROP POLICY IF EXISTS "Drivers public read" ON public.drivers;
CREATE POLICY "Drivers public read" ON public.drivers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Drivers full access" ON public.drivers;
CREATE POLICY "Drivers full access" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

-- Bookings policies
DROP POLICY IF EXISTS "Bookings read policy" ON public.bookings;
CREATE POLICY "Bookings read policy" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Bookings insert policy" ON public.bookings;
CREATE POLICY "Bookings insert policy" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Bookings update policy" ON public.bookings;
CREATE POLICY "Bookings update policy" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);

-- Booking Locations policies
DROP POLICY IF EXISTS "Booking locations read policy" ON public.booking_locations;
CREATE POLICY "Booking locations read policy" ON public.booking_locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Booking locations write policy" ON public.booking_locations;
CREATE POLICY "Booking locations write policy" ON public.booking_locations FOR ALL USING (true) WITH CHECK (true);

-- Notifications policies
DROP POLICY IF EXISTS "Notifications access policy" ON public.notifications;
CREATE POLICY "Notifications access policy" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 13. REALTIME PUBLICATION
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- ==============================================================================
-- 14. SEED INITIAL ESSENTIAL DATA (Vehicle Types & Sample Online Drivers)
-- ==============================================================================
INSERT INTO public.vehicle_types (code, name_th, capacity_ton, base_price, price_per_km, dimensions, icon_name, description)
VALUES 
  ('pickup', 'กระบะ', 1.0, 350.00, 15.00, '2.1 x 1.7 x 0.4 ม.', 'Truck', 'เหมาะสำหรับขนของทั่วไป มอเตอร์ไซค์ เครื่องใช้ไฟฟ้า'),
  ('pickup_box', 'กระบะตู้ทึบ', 1.0, 450.00, 18.00, '2.1 x 1.7 x 1.9 ม.', 'Box', 'กันฝน กันแดด 100% เหมาะสำหรับเฟอร์นิเจอร์ กล่องพัสดุ'),
  ('pickup_fence', 'กระบะคอก', 1.5, 420.00, 17.00, '2.1 x 1.7 x 1.8 ม.', 'Layers', 'จุของได้สูง เหมาะสำหรับพืชผลการเกษตร ท่อ เหล็ก ก่อสร้าง'),
  ('jumbo', 'จัมโบ้', 2.0, 650.00, 22.00, '3.2 x 1.8 x 2.0 ม.', 'Container', 'จุได้มากกว่ากระบะทั่วไป 2 เท่า ขนย้ายบ้าน ย้ายหอพัก'),
  ('truck_6w', '6 ล้อ', 5.0, 1200.00, 35.00, '5.5 x 2.2 x 2.2 ม.', 'Archive', 'งานขนย้ายสำนักงาน เครื่องจักรอุตสาหกรรม สินค้าพาเลท')
ON CONFLICT (code) DO UPDATE SET
  name_th = EXCLUDED.name_th,
  base_price = EXCLUDED.base_price,
  price_per_km = EXCLUDED.price_per_km;

-- สร้าง Demo Driver Users & Active Online Drivers สำหรับทดสอบระบบจริง
INSERT INTO public.users (id, email, phone, first_name, last_name, role, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'driver1@jumbogo.com', '0811111111', 'สมชาย', 'สายลุย', 'driver', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'driver2@jumbogo.com', '0822222222', 'วิชัย', 'ใจเย็น', 'driver', 'active'),
  ('00000000-0000-0000-0000-000000000003', 'admin@jumbogo.com', '0899999999', 'แอดมิน', 'จัมโบ้โก', 'admin', 'active')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role;

INSERT INTO public.vehicles (id, driver_id, type, brand, model, year, plate_number, plate_province, color)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'pickup', 'Toyota', 'Hilux Revo', 2022, '1ฒผ-1234', 'กรุงเทพมหานคร', 'ขาว'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'pickup_box', 'Isuzu', 'D-Max', 2023, '2กข-5678', 'กรุงเทพมหานคร', 'บรอนซ์เงิน')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.drivers (id, user_id, driver_code, phone, first_name, last_name, vehicle_id, is_verified, is_online, current_location_lat, current_location_lng, rating_avg, rating_count)
VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'JG-00101', '0811111111', 'สมชาย', 'สายลุย', '00000000-0000-0000-0000-000000000101', true, true, 13.7563, 100.5018, 4.95, 142),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000002', 'JG-00102', '0822222222', 'วิชัย', 'ใจเย็น', '00000000-0000-0000-0000-000000000102', true, true, 13.7225, 100.5289, 4.88, 98)
ON CONFLICT (id) DO UPDATE SET
  is_online = EXCLUDED.is_online,
  current_location_lat = EXCLUDED.current_location_lat,
  current_location_lng = EXCLUDED.current_location_lng;

-- สำเร็จ!
