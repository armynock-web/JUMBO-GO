/**
 * API Route สำหรับ Bookings
 * - POST: สร้าง booking ใหม่
 * - GET: ดู bookings ของ user ปัจจุบัน
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/server'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const body = await request.json()
    const { vehicle_type, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng } = body

    // Validate input
    if (!vehicle_type || !pickup_address || !pickup_lat || !pickup_lng || !dropoff_address || !dropoff_lat || !dropoff_lng) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      )
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        vehicle_type,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง booking' },
        { status: 500 }
      )
    }

    // Create pickup location
    const { error: pickupError } = await supabase
      .from('booking_locations')
      .insert({
        booking_id: booking.id,
        type: 'pickup',
        address: pickup_address,
        lat: pickup_lat,
        lng: pickup_lng,
        sequence: 0,
      })

    if (pickupError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการบันทึกจุดรับ' },
        { status: 500 }
      )
    }

    // Create dropoff location
    const { error: dropoffError } = await supabase
      .from('booking_locations')
      .insert({
        booking_id: booking.id,
        type: 'dropoff',
        address: dropoff_address,
        lat: dropoff_lat,
        lng: dropoff_lng,
        sequence: 1,
      })

    if (dropoffError) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการบันทึกจุดส่ง' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: booking, message: 'สร้าง booking สำเร็จ' },
      { status: 201 }
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
    const user = await requireAuth()
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select('*, booking_locations(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: bookings })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
