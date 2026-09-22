/**
 * Seed Data Script สำหรับ Supabase
 * ใช้สำหรับเพิ่มข้อมูลเริ่มต้น (initial data) ลงใน database
 *
 * วิธีใช้:
 * npx tsx scripts/seed-supabase.ts
 */

import { createAdminClient } from '../lib/supabase/admin'

const supabase = createAdminClient()

async function seedDatabase() {
  console.log('🌱 เริ่มสร้าง Seed Data สำหรับ JUMBO GO...')

  try {
    // 1. สร้าง Users (ต้องสร้างผ่าน Supabase Auth ก่อน)
    console.log('📝 สร้าง test users...')

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('❌ Error listing users:', usersError)
      return
    }

    // ถ้ายังไม่มี users ให้สร้าง
    if (users.users.length === 0) {
      console.log('👤 สร้าง test user...')
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'test@example.com',
        password: 'password123',
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          first_name: 'ทดสอบ',
          last_name: 'ระบบ',
        },
      })

      if (createError) {
        console.error('❌ Error creating user:', createError)
        return
      }

      console.log('✅ Test user created:', newUser.user?.id)

      // สร้าง profile ใน public.users
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: newUser.user!.id,
          email: newUser.user!.email,
          first_name: 'ทดสอบ',
          last_name: 'ระบบ',
        })

      if (profileError) {
        console.error('❌ Error creating user profile:', profileError)
        return
      }

      console.log('✅ User profile created')
    } else {
      console.log('ℹ️  Users already exist, skipping...')
    }

    // 2. สร้าง Vehicles
    console.log('🚗 สร้าง vehicles...')

    const { data: existingVehicles } = await supabase.from('vehicles').select('id').limit(1)

    if (!existingVehicles || existingVehicles.length === 0) {
      const vehicles = [
        {
          type: 'motorcycle',
          brand: 'Honda',
          model: 'Wave',
          year: 2023,
          plate_number: 'กข 1234',
          color: 'แดง',
          is_active: true,
        },
        {
          type: 'car',
          brand: 'Toyota',
          model: 'Vios',
          year: 2022,
          plate_number: 'กค 5678',
          color: 'ขาว',
          is_active: true,
        },
        {
          type: 'van',
          brand: 'Toyota',
          model: 'Hiace',
          year: 2023,
          plate_number: 'กง 9012',
          color: 'ฟ้า',
          is_active: true,
        },
      ]

      const { error: vehiclesError } = await supabase.from('vehicles').insert(vehicles)

      if (vehiclesError) {
        console.error('❌ Error creating vehicles:', vehiclesError)
        return
      }

      console.log('✅ Vehicles created')
    } else {
      console.log('ℹ️  Vehicles already exist, skipping...')
    }

    // 3. สร้าง Drivers (ต้องมี user ใน Supabase Auth ก่อน)
    console.log('👨‍✈️ สร้าง drivers...')

    const { data: existingDrivers } = await supabase.from('drivers').select('id').limit(1)

    if (!existingDrivers || existingDrivers.length === 0) {
      // สร้าง driver user ก่อน
      const { data: driverUser, error: driverUserError } = await supabase.auth.admin.createUser({
        email: 'driver@example.com',
        password: 'password123',
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          first_name: 'สมชาย',
          last_name: 'ใจดี',
        },
      })

      if (driverUserError) {
        console.error('❌ Error creating driver user:', driverUserError)
        return
      }

      // สร้าง driver profile
      const { data: vehicles } = await supabase.from('vehicles').select('id').limit(1)

      const { error: driverError } = await supabase.from('drivers').insert({
        user_id: driverUser.user!.id,
        phone: '081-234-5678',
        first_name: 'สมชาย',
        last_name: 'ใจดี',
        is_verified: true,
        is_online: true,
        vehicle_id: vehicles?.[0]?.id,
        rating_avg: 4.8,
        rating_count: 320,
        total_earnings: 50000,
      })

      if (driverError) {
        console.error('❌ Error creating driver:', driverError)
        return
      }

      console.log('✅ Driver created')
    } else {
      console.log('ℹ️  Drivers already exist, skipping...')
    }

    console.log('✅ Seed Data สร้างเสร็จสิ้น!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

seedDatabase()
