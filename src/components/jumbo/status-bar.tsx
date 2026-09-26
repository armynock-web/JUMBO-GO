"use client";

// ในเว็บแอปพลิเคชันเชิงพาณิชย์จริง อุปกรณ์ของผู้ใช้มี Status Bar ของระบบ (iOS/Android) อยู่แล้ว
// จึงไม่ต้องเรนเดอร์ Status Bar จำลอง เพื่อไม่ให้ซ้อนทับและดูเป็นมืออาชีพตามมาตรฐานสากล
export function StatusBar({ dark = false }: { dark?: boolean }) {
  void dark;
  return null;
}
