/**
 * JUMBO GO - Request Auth Helpers
 * - parse ผู้ใช้จาก Authorization: Bearer jumbo_<userId>
 * - resolve driver id จริงจาก token (ผ่าน user_id ของตาราง drivers)
 * มาตรฐาน: ARM-AES — ใช้ตัวตนจริงจาก request ไม่ hardcode
 */
import { NextRequest } from "next/server";
import { JumboRepository } from "./supabase/repository";

export function getTokenUserId(req: NextRequest): string | null {
  const header = req.headers.get("authorization") || "";
  const bearer = header.replace(/^Bearer\s+/i, "");
  const token = bearer || req.nextUrl.searchParams.get("token") || "";
  if (token.startsWith("jumbo_")) return token.slice(6);
  return null;
}

/**
 * หา driver id จาก request:
 * 1. token (Bearer jumbo_<userId>) -> ค้น drivers.user_id
 * 2. explicit driverId (query / body) — ใช้แทนได้เฉ�พาะกรณีส่งมาด้วย
 * คืน null ถ้าไม่มีตัวตนจริง (route ควรตอบ 401/422 แทนการ fake)
 */
export async function resolveDriverId(
  req: NextRequest,
  explicitId?: string | null
): Promise<string | null> {
  const tokenUserId = getTokenUserId(req);
  if (tokenUserId) {
    const driver = await JumboRepository.getDriverByUserId(tokenUserId);
    if (driver) return driver.id;
    // token เป็น driver id โดยตรงได้ (เช่น seed ใช้ id=user_id)
    const direct = await JumboRepository.getDriverById(tokenUserId);
    if (direct) return direct.id;
  }
  if (explicitId) {
    const driver = await JumboRepository.getDriverById(explicitId);
    if (driver) return driver.id;
  }
  return null;
}