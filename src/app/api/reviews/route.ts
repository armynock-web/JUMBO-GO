/**
 * API Route สำหรับ Reviews
 * - POST: สร้าง review ใหม่
 * - GET: ดู reviews ของ user ปัจจุบัน หรือ driver ที่เฉพาะเจาะจง
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { requireAuth } from '../../../lib/auth/server'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const body = await request.json()
    const { booking_id, rating, comment } = body

    // Validate input
    if (!booking_id || !rating) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'คะแนนต้องอยู่ระหว่าง 1-5' },
        { status: 400 }
      )
    }

    // Check if booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, drivers(*)')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'ไม่พบ booking หรือไม่มีสิทธิ์รีวิว' },
        { status: 404 }
      )
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'สามารถรีวิวได้เฉพาะ booking ที่เสร็จสิ้นแล้ว' },
        { status: 400 }
      )
    }

    // Check if review already exists for this booking
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', booking_id)
      .single()

    if (existingReview && !existingError) {
      return NextResponse.json(
        { error: 'คุณได้รีวิว booking นี้ไปแล้ว' },
        { status: 400 }
      )
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id,
        user_id: user.id,
        driver_id: booking.driver_id,
        rating,
        comment: comment || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง review' },
        { status: 500 }
      )
    }

    // Update driver rating
    const { data: driverReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('driver_id', booking.driver_id)

    if (driverReviews) {
      const totalRating = driverReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = totalRating / driverReviews.length

      await supabase
        .from('drivers')
        .update({
          rating_avg: avgRating,
          rating_count: driverReviews.length,
        })
        .eq('id', booking.driver_id)
    }

    return NextResponse.json(
      { data: review, message: 'สร้าง review สำเร็จ' },
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
    const driverId = searchParams.get('driver_id')

    let query = supabase
      .from('reviews')
      .select('*, bookings(*), drivers(*)')
      .order('created_at', { ascending: false })

    if (driverId) {
      // View reviews for specific driver
      query = query.eq('driver_id', driverId)
    } else {
      // View own reviews
      query = query.eq('user_id', user.id)
    }

    const { data: reviews, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: reviews })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
