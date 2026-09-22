/**
 * Server-side Auth Utilities
 * ใช้สำหรับจัดการ authentication ใน server-side
 */

import { createClient } from '../supabase/server'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(role: 'user' | 'driver' | 'admin') {
  const user = await requireAuth()
  
  // Get user role from database
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== role) {
    throw new Error('Forbidden: Insufficient permissions')
  }

  return user
}
