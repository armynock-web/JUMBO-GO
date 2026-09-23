/**
 * API Route สำหรับ Notifications (by ID)
 * - PATCH: อัปเดต notification เป็น read
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { requireAuth } from '../../../../lib/auth/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const body = await request.json()
    const { is_read } = body

    // Check if notification belongs to user
    const { data: notification, error: checkError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !notification) {
      return NextResponse.json(
        { error: 'ไม่พบ notification หรือไม่มีสิทธิ์แก้ไข' },
        { status: 404 }
      )
    }

    // Update notification
    const { data: updatedNotification, error } = await supabase
      .from('notifications')
      .update({
        is_read: is_read !== undefined ? is_read : notification.is_read,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดต notification' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: updatedNotification, message: 'อัปเดต notification สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
