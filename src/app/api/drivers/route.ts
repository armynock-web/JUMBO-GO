/**
 * API Route สำหรับ Drivers
 * - PATCH: อัปเดต driver status และ location
 * - GET: ดู drivers ที่ออนไลน์
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/server'

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const body = await request.json()
    const { is_online, current_location_lat, current_location_lng } = body

    // Get driver profile
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (driverError || !driver) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูล driver' },
        { status: 404 }
      )
    }

    // Update driver status and location
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        is_online: is_online !== undefined ? is_online : driver.is_online,
        current_location_lat: current_location_lat !== undefined ? current_location_lat : driver.current_location_lat,
        current_location_lng: current_location_lng !== undefined ? current_location_lng : driver.current_location_lng,
      })
      .eq('id', driver.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัปเดต driver' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: updatedDriver, message: 'อัปเดต driver สำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const isOnline = searchParams.get('is_online')

    let query = supabase
      .from('drivers')
      .select('*, vehicles(*)')
      .eq('is_verified', true)

    if (isOnline === 'true') {
      query = query.eq('is_online', true)
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
