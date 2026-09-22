/**
 * Verification Code Utilities
 * ใช้สำหรับจัดการรหัสยืนยันตัวตน (แทน OTP ที่ส่งไปทาง SMS)
 */

import { createClient } from '../supabase/client'

/**
 * สร้างรหัสยืนยัน 6 หลัก
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * บันทึกรหัสยืนยันลงใน database
 */
export async function saveVerificationCode(userId: string, code: string) {
  const supabase = createClient()
  
  // TODO: สร้าง table verification_codes หรือใช้ user metadata
  // ชั่วคราวใช้ user metadata
  const { error } = await supabase.auth.updateUser({
    data: {
      verification_code: code,
      verification_code_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 นาที
    },
  })

  if (error) {
    throw error
  }
}

/**
 * ตรวจสอบรหัสยืนยัน
 */
export async function verifyCode(userId: string, code: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const storedCode = user.user_metadata.verification_code
  const expiresAt = user.user_metadata.verification_code_expires_at

  if (!storedCode || !expiresAt) {
    return false
  }

  // ตรวจสอบว่าหมดอายุหรือยัง
  if (new Date() > new Date(expiresAt)) {
    return false
  }

  // ตรวจสอบรหัส
  return storedCode === code
}

/**
 * ส่งรหัสยืนยันใหม่
 */
export async function resendVerificationCode(userId: string): Promise<string> {
  const code = generateVerificationCode()
  await saveVerificationCode(userId, code)
  return code
}
