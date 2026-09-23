/**
 * API Route สำหรับ Admin Drivers
 * - GET: ดู drivers ทั้งหมด
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { requireRole } from '../../../../lib/auth/server'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const isVerified = searchParams.get('is_verified')
    const isOnline = searchParams.get('is_online')

    let query = supabase
      .from('drivers')
      .select('*, users(*), vehicles(*)')
      .order('created_at', { ascending: false })

    if (isVerified === 'true') {
      query = query.eq('is_verified', true)
    } else if (isVerified === 'false') {
      query = query.eq('is_verified', false)
    }

    if (isOnline === 'true') {
      query = query.eq('is_online', true)
    } else if (isOnline === 'false') {
      query = query.eq('is_online', false)
    }

    const { data: drivers, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล drivers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: drivers })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
