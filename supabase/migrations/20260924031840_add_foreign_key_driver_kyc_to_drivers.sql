-- JUMBO GO — Migration: add_foreign_key_driver_kyc_to_drivers
-- เวอร์ชัน: 20260924031840
-- เหตุผล: สร้างการอ้างอิงจริงระหว่าง driver_kyc.driver_id -> drivers.id
-- เพื่อให้ RLS/พอร์ทัลแอดมินจัด join ได้ และป้องกัน orphan rows

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'driver_kyc_driver_id_fkey'
      AND conrelid = 'driver_kyc'::regclass
  ) THEN
    ALTER TABLE driver_kyc
      ADD CONSTRAINT driver_kyc_driver_id_fkey
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- หมายเหตุ: apply ไปยัง production แล้ว ผ่าน Supabase CLI/MCP
-- ใช้เป็น Single Source of Truth สำหรับ migrations ใน repository