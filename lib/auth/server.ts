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
  
  // TODO: Implement role checking after adding role column to users table
  // For now, just return the user
  return user
}
