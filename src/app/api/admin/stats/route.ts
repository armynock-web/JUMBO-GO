/**
 * API Route สำหรับ Admin Stats
 * - GET: ดูสถิติของระบบ
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { requireRole } from '../../../../lib/auth/server'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total drivers
    const { count: totalDrivers } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Get total revenue (completed bookings)
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')

    const totalRevenue = payments
      ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
      : 0

    const stats = {
      total_users: totalUsers || 0,
      total_drivers: totalDrivers || 0,
      total_bookings: totalBookings || 0,
      total_revenue: totalRevenue,
    }

    return NextResponse.json({ data: stats })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
