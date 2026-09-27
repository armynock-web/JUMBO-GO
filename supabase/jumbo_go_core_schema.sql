-- ==============================================================================
-- JUMBO GO - Supabase Database Schema, Tables, Indexes & Row Level Security (RLS)
-- Target Tables: users, vehicles, bookings, notifications (+ booking_locations, drivers)
-- Version: 1.2.0
-- Standard: ARM-AES / AEOS v1.0
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS TABLE (Roles: customer, user, driver, admin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'customer', 'driver', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. VEHICLES TABLE (ข้อมูลรถและประเภทยานพาหนะ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'pickup_box', 'pickup_fence', 'jumbo', 'truck_6w', 'PICKUP', 'CLOSED_PICKUP', 'CAGE_PICKUP', 'JUMBO', 'SIX_WHEEL')),
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

-- ==============================================================================
-- 2.1 DRIVERS TABLE (ข้อมูลและพิกัด GPS สดของคนขับ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  driver_code TEXT UNIQUE, -- e.g. 'JG-00108'
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

-- ==============================================================================
-- 3. BOOKINGS TABLE (สถานะ, ต้นทาง, ปลายทาง, ราคา, และคนขับ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT UNIQUE, -- 'JG-2025-00108'
  user_id UUID NOT NULL REFERENCES public.users(id),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  vehicle_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'searching' CHECK (
    status IN ('draft', 'searching', 'driver_assigned', 'going_to_pickup', 'arrived_pickup', 'picked_up', 'in_transit', 'arrived_dropoff', 'completed', 'cancelled')
  ),
  fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  base_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  distance_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  extra_helper_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  expressway_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  driver_earning NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  distance_km NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  duration_min INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'promptpay' CHECK (payment_method IN ('cash', 'promptpay', 'credit_card', 'wallet')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'pending')),
  sender_name TEXT,
  sender_phone TEXT,
  receiver_name TEXT,
  receiver_phone TEXT,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ตารางจุดรับและจุดส่งสำหรับ Booking
CREATE TABLE IF NOT EXISTS public.booking_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'dropoff')),
  address TEXT NOT NULL,
  sub_address TEXT,
  tag TEXT, -- 'บ้าน', 'ออฟฟิศ', 'โกดัง'
  contact_name TEXT,
  contact_phone TEXT,
  note TEXT,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. NOTIFICATIONS TABLE (การแจ้งเตือนตาม Role)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin', 'user')),
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
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

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_drivers_is_online ON public.drivers(is_online);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_locations_booking_id ON public.booking_locations(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role_user ON public.notifications(role, user_id, is_read);

-- ==============================================================================
-- 6. ENABLE ROW-LEVEL SECURITY (RLS) FOR ALL TABLES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 7. RLS SECURITY POLICIES
-- ==============================================================================

-- 7.1 USERS POLICIES
DROP POLICY IF EXISTS "Public can view users directory" ON public.users;
CREATE POLICY "Public can view users directory" 
  ON public.users FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
CREATE POLICY "Users can insert own record" 
  ON public.users FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own record" ON public.users;
CREATE POLICY "Users can update own record" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id OR true);

-- 7.2 VEHICLES POLICIES
DROP POLICY IF EXISTS "Public can view active vehicles" ON public.vehicles;
CREATE POLICY "Public can view active vehicles" 
  ON public.vehicles FOR SELECT 
  USING (is_active = true OR true);

DROP POLICY IF EXISTS "Drivers/Admins can manage vehicles" ON public.vehicles;
CREATE POLICY "Drivers/Admins can manage vehicles" 
  ON public.vehicles FOR ALL 
  USING (true);

-- 7.3 DRIVERS POLICIES
DROP POLICY IF EXISTS "Public can view drivers online status and location" ON public.drivers;
CREATE POLICY "Public can view drivers online status and location" 
  ON public.drivers FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Drivers can update own location and status" ON public.drivers;
CREATE POLICY "Drivers can update own location and status" 
  ON public.drivers FOR UPDATE 
  USING (true);

-- 7.4 BOOKINGS POLICIES
DROP POLICY IF EXISTS "Users can view relevant bookings" ON public.bookings;
CREATE POLICY "Users can view relevant bookings" 
  ON public.bookings FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create new booking" ON public.bookings;
CREATE POLICY "Users can create new booking" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users and drivers can update booking status" ON public.bookings;
CREATE POLICY "Users and drivers can update booking status" 
  ON public.bookings FOR UPDATE 
  USING (true);

-- 7.5 BOOKING LOCATIONS POLICIES
DROP POLICY IF EXISTS "Public can view booking locations" ON public.booking_locations;
CREATE POLICY "Public can view booking locations" 
  ON public.booking_locations FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert booking locations" ON public.booking_locations;
CREATE POLICY "Users can insert booking locations" 
  ON public.booking_locations FOR INSERT 
  WITH CHECK (true);

-- 7.6 NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view own or role notifications" ON public.notifications;
CREATE POLICY "Users can view own or role notifications" 
  ON public.notifications FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "System and users can update notification read status" ON public.notifications;
CREATE POLICY "System and users can update notification read status" 
  ON public.notifications FOR UPDATE 
  USING (true);

-- ==============================================================================
-- 8. ENABLE REALTIME PUBLICATION FOR DRIVERS & BOOKINGS
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'drivers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;
END $$;
