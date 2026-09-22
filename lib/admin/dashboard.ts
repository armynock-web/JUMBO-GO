/**
 * Admin Dashboard Utilities
 * ใช้สำหรับจัดการระบบในฝั่ง admin
 */

import { createAdminClient } from '../supabase/admin'

/**
 * ดูสถิติของระบบ
 */
export async function getSystemStats() {
  const supabase = createAdminClient()

  const [
    { count: userCount },
    { count: driverCount },
    { count: bookingCount },
    { count: vehicleCount },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('drivers').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('vehicles').select('*', { count: 'exact', head: true }),
  ])

  return {
    users: userCount || 0,
    drivers: driverCount || 0,
    bookings: bookingCount || 0,
    vehicles: vehicleCount || 0,
  }
}

/**
 * ดู users ทั้งหมด
 */
export async function getAllUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

/**
 * ดู drivers ทั้งหมด
 */
export async function getAllDrivers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('drivers')
    .select('*, vehicles(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

/**
 * ดู bookings ทั้งหมด
 */
export async function getAllBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_locations(*), users(*), drivers(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

/**
 * อัปเดต user role
 */
export async function updateUserRole(userId: string, role: 'user' | 'driver' | 'admin') {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * อัปเดต driver verification status
 */
export async function updateDriverVerification(driverId: string, isVerified: boolean) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('drivers')
    .update({ is_verified: isVerified })
    .eq('id', driverId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * ลบ user
 */
export async function deleteUser(userId: string) {
  const supabase = createAdminClient()
  
  // Delete from public.users
  const { error: userError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (userError) {
    throw userError
  }

  // Delete from auth.users
  const { error: authError } = await supabase.auth.admin.deleteUser(userId)

  if (authError) {
    throw authError
  }

  return { success: true }
}
