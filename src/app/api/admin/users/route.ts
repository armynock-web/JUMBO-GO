/**
 * API Route สำหรับ Admin Users
 * - GET: ดู users ทั้งหมด
 * - POST: สร้าง user ใหม่ (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { requireRole } from '../../../../lib/auth/server'

export async function GET(request: NextRequest) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (role) {
      query = query.eq('role', role)
    }

    const { data: users, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล users' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: users })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole('admin')
    const supabase = await createClient()

    const body = await request.json()
    const { email, password, first_name, last_name, role } = body

    // Validate input
    if (!email || !password || !first_name || !last_name || !role) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['user', 'driver', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Role ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง user' },
        { status: 500 }
      )
    }

    // Create user profile
    const { data: user, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user!.id,
        email,
        first_name,
        last_name,
        role,
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง user profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: user, message: 'สร้าง user สำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
