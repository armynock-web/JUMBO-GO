/**
 * Create Admin User Script
 * ใช้สำหรับสร้าง admin user
 *
 * วิธีใช้:
 * npx tsx scripts/create-admin.ts
 */

import 'dotenv/config'
import { createAdminClient } from '../lib/supabase/admin'

async function createAdminUser() {
  console.log('🔐 เริ่มสร้าง Admin User...\n')

  const supabase = createAdminClient()

  const adminEmail = 'admin@jumbogo.com'
  const adminPassword = 'Admin@123456' // ⚠️ เปลี่ยนรหัสผ่านหลังใช้งาน
  const adminFirstName = 'Admin'
  const adminLastName = 'System'

  // Check if admin user already exists
  const { data: existingUser } = await supabase.auth.admin.listUsers()
  const adminExists = existingUser.users.find(u => u.email === adminEmail)

  if (adminExists) {
    console.log('✅ Admin user มีอยู่แล้ว')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   ID: ${adminExists.id}`)
    return
  }

  // Create admin user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      first_name: adminFirstName,
      last_name: adminLastName,
      role: 'admin',
    },
  })

  if (createError) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้าง admin user:', createError.message)
    return
  }

  console.log('✅ Admin user สร้างสำเร็จ')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
  console.log(`   ID: ${newUser.user.id}`)
  console.log('\n⚠️ หมายเหตุ: กรุณาเปลี่ยนรหัสผ่านหลังใช้งาน!')
}

createAdminUser()
