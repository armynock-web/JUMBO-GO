/**
 * API Route สำหรับ Admin Users (by ID)
 * - PATCH: อัปเดต user
 * - DELETE: ลบ user
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
    const { role, is_verified } = body

    // Validate role
    if (role && !['user', 'driver', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Role ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Update user
    const { data: user, error } = await supabase
      .from('users')
      .update({
        role: role || undefined,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดต user' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: user, message: 'อัปเดต user สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(params.id)

    if (authError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการลบ user' },
        { status: 500 }
      )
    }

    // Delete user profile (cascade should handle this, but just in case)
    await supabase.from('users').delete().eq('id', params.id)

    return NextResponse.json(
      { message: 'ลบ user สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
