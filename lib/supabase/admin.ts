import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * สร้าง Supabase client ด้วย service_role key
 * ⚠️ ใช้เฉพาะใน server-side เท่านั้น
 * ⚠️ อย่าใช้ใน client-side หรือเปิดเผย service_role key
 * ⚠️ ใช้สำหรับ admin operations เท่านั้น
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
