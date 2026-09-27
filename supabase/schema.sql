-- ==============================================================================
-- JUMBO GO - Comprehensive Supabase Database Schema (PostgreSQL 15+)
-- Version: 1.1.0
-- Standards: ARM-AES / AEOS v1.0
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. VEHICLE TYPES (Catalog & Pricing Rules)
CREATE TABLE IF NOT EXISTS public.vehicle_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- 'pickup', 'pickup_box', 'pickup_fence', 'jumbo', 'truck_6w'
  name_th TEXT NOT NULL,     -- 'กระบะ', 'กระบะตู้ทึบ', 'กระบะคอก', 'จัมโบ้', '6 ล้อ'
  capacity_ton NUMERIC(4, 2) NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  price_per_km NUMERIC(10, 2) NOT NULL,
  dimensions TEXT,
  icon_name TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'pickup', 'pickup_box', 'pickup_fence', 'jumbo', 'truck_6w'
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

-- 4. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  driver_code TEXT UNIQUE, -- e.g. 'JG-00108'
  phone TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  id_card_url TEXT,
  license_url TEXT,
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

-- 5. DRIVER KYC (10-Step Onboarding & Verification)
CREATE TABLE IF NOT EXISTS public.driver_kyc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  kyc_code TEXT UNIQUE NOT NULL, -- 'KYC-1024'
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 10),
  -- Step 1: Personal
  emergency_contact TEXT,
  emergency_phone TEXT,
  address_current TEXT,
  province TEXT,
  district TEXT,
  -- Step 2: Citizen ID
  id_card_number TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  laser_id TEXT,
  -- Step 3: Facial Verification
  selfie_url TEXT,
  -- Step 4: Driving License
  license_number TEXT,
  license_type TEXT,
  license_expiry DATE,
  license_front_url TEXT,
  license_back_url TEXT,
  -- Step 5 & 6: Vehicle Details & Docs
  vehicle_type TEXT,
  vehicle_brand TEXT,
  vehicle_plate TEXT,
  vehicle_province TEXT,
  vehicle_registration_url TEXT,
  compulsory_insurance_url TEXT,
  vehicle_front_url TEXT,
  vehicle_side_url TEXT,
  -- Step 7: Bank Details
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  bank_book_url TEXT,
  -- Step 8: Consent
  consent_pdpa BOOLEAN DEFAULT false,
  consent_background_check BOOLEAN DEFAULT false,
  consent_terms BOOLEAN DEFAULT false,
  -- Step 9 & 10: Review & Decision
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  reject_reason TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BOOKINGS (Jobs)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT UNIQUE, -- 'JG-2025-00108'
  user_id UUID NOT NULL REFERENCES public.users(id),
  driver_id UUID REFERENCES public.drivers(id),
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
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'promptpay', 'credit_card', 'wallet')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'pending')),
  sender_name TEXT,
  sender_phone TEXT,
  receiver_name TEXT,
  receiver_phone TEXT,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. BOOKING LOCATIONS (Pickups & Dropoffs)
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

-- 8. JOB TIMELINE (Audit Trail for Real-Time Tracking)
CREATE TABLE IF NOT EXISTS public.job_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  status_key TEXT NOT NULL,
  title_th TEXT NOT NULL,
  description_th TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_number TEXT UNIQUE NOT NULL, -- e.g. 'TXN-5021'
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('job_fare', 'driver_payout', 'toll_refund', 'bonus', 'commission_fee')),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  bank_name TEXT,
  bank_account TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  driver_id UUID NOT NULL REFERENCES public.drivers(id),
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 1.0 AND 5.0),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. NOTIFICATIONS (3 Roles - Customer, Driver, Admin)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
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

-- 12. SAVED LOCATIONS (User Favorites)
CREATE TABLE IF NOT EXISTS public.saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  sub_address TEXT,
  tag TEXT NOT NULL, -- 'บ้าน', 'ออฟฟิศ', 'โกดัง', 'โรงงาน'
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON public.drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_is_online ON public.drivers(is_online);
CREATE INDEX IF NOT EXISTS idx_driver_kyc_status ON public.driver_kyc(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_locations_booking_id ON public.booking_locations(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_role ON public.notifications(user_id, role, is_read);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalogs
CREATE POLICY "Public can view vehicle types" ON public.vehicle_types FOR SELECT USING (true);
CREATE POLICY "Public can view active vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Users can view driver profiles" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Users can view user directory" ON public.users FOR SELECT USING (true);
CREATE POLICY "All users can view public settings" ON public.system_settings FOR SELECT USING (true);

-- Authenticated User policies
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Users can manage own bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Users can view booking locations" ON public.booking_locations FOR SELECT USING (true);
CREATE POLICY "Users can view job timeline" ON public.job_timeline FOR SELECT USING (true);
CREATE POLICY "Users can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can view transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Users can view payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Users can view driver kyc" ON public.driver_kyc FOR SELECT USING (true);
CREATE POLICY "Users can view saved locations" ON public.saved_locations FOR SELECT USING (true);
