/**
 * API Route สำหรับ Notifications
 * - GET: ดู notifications ของ user ปัจจุบัน
 * - POST: สร้าง notification ใหม่ (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { requireAuth, requireRole } from '../../../lib/auth/server'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const isRead = searchParams.get('is_read')

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (isRead === 'true') {
      query = query.eq('is_read', true)
    } else if (isRead === 'false') {
      query = query.eq('is_read', false)
    }

    const { data: notifications, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: notifications })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole('admin')
    const supabase = await createClient()

    const body = await request.json()
    const { user_id, type, title, message, data } = body

    // Validate input
    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['booking', 'payment', 'system'].includes(type)) {
      return NextResponse.json(
        { error: 'ประเภท notification ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type,
        title,
        message,
        data: data || null,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง notification' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: notification, message: 'สร้าง notification สำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
