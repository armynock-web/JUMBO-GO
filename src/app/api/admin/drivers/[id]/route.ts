/**
 * API Route สำหรับ Admin Drivers (by ID)
 * - PATCH: อัปเดต driver
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
    const { is_verified, is_online } = body

    // Update driver
    const { data: driver, error } = await supabase
      .from('drivers')
      .update({
        is_verified: is_verified !== undefined ? is_verified : undefined,
        is_online: is_online !== undefined ? is_online : undefined,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดต driver' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: driver, message: 'อัปเดต driver สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
