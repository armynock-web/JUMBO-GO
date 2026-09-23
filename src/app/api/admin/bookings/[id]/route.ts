/**
 * API Route สำหรับ Admin Bookings (by ID)
 * - PATCH: อัปเดต booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import { requireRole } from '../../../../../lib/auth/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    const body = await request.json()
    const { status, driver_id } = body

    // Validate status
    if (status && !['pending', 'searching', 'accepted', 'picked_up', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Status ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Update booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: status || undefined,
        driver_id: driver_id || undefined,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดต booking' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: booking, message: 'อัปเดต booking สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
