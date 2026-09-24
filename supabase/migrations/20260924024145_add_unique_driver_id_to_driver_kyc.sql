-- JUMBO GO — Migration: add_unique_driver_id_to_driver_kyc
-- เวอร์ชัน: 20260924024145
-- เหตุผล: ขัดขวางการ upsert ซ้ำตาม driver_id (driver 1 คน 1 แถว KYC เท่านั้น)
-- ทำให้ JumboRepository.upsertKyc ด้วย onConflict: "driver_id" ทำงานได้จริง

-- เช็คก่อนว่ายังไม่มี constraint เดิม (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'driver_kyc_driver_id_key'
      AND conrelid = 'driver_kyc'::regclass
  ) THEN
    ALTER TABLE driver_kyc ADD CONSTRAINT driver_kyc_driver_id_key UNIQUE (driver_id);
  END IF;
END $$;

-- หมายเหตุ: ไฟล์นี้ถูก apply ไปยัง production แล้วผ่าน Supabase CLI/MCP
-- ใช้เป็น Single Source of Truth สำหรับ migrations ใน repository