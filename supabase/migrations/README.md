# Supabase Migrations

Single Source of Truth สำหรับการเปลี่ยนแปลง schema ของฐานข้อมูล JUMBO GO

## Workflow

1. **สร้างไฟล์ migration** ใหม่ในโฟลเดอร์นี้ก่อนเสมอ รูปแบบชื่อ:
   `YYYYMMDDHHMMSS_ชื่อ_สั้น_เป็น_ภาษาอังกฤษ.sql`
2. **Review commit** ผ่าน Pull Request เช่นเดียวกับโค้ดอื่น
3. **Apply ขึ้น production** ผ่าน Supabase CLI:
   ```bash
   supabase db push
   ```
   หรือผ่าน MCP `supabase_apply_migration` (ระบุช่ือให้ตรงกับไฟล์)
4. **อัปเดต** ไฟล์นี้ ถ้าชื่อ/ข้อกำหนดเปลี่ยน

## Migrations ทั้งหมด

| เวอร์ชัน | ชื่อ | สถานะ |
| --- | --- | --- |
| 20260922015731 | create_users_table | production |
| 20260922015802 | create_vehicles_table_no_fk | production |
| 20260922015818 | create_drivers_table_retry | production |
| 20260922015839 | create_bookings_table | production |
| 20260922015848 | create_booking_locations_table | production |
| 20260922020034 | create_payments_table | production |
| 20260922020119 | create_reviews_table | production |
| 20260922020141 | create_notifications_table | production |
| 20260922020152 | create_indexes | production |
| 20260922024217 | update_rls_policies_for_admin | production |
| 20260922024431 | create_user_profile_trigger | production |
| 20260922034824 | enable_realtime_for_tables | production |
| 20260922034845 | create_storage_policies_fixed | production |
| 20260922044153 | add_role_column_to_users | production |
| 20260922044200 | update_user_profile_trigger_with_role | production |
| 20260924024145 | add_unique_driver_id_to_driver_kyc | production |
| 20260924031840 | add_foreign_key_driver_kyc_to_drivers | production |