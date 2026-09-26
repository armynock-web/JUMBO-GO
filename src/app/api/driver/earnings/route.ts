import { NextRequest, NextResponse } from "next/server";
import { JumboRepository } from "@/lib/supabase/repository";
import { resolveDriverId } from "@/lib/request-auth";

export async function GET(req: NextRequest) {
  try {
    const driverId = await resolveDriverId(
      req,
      req.nextUrl.searchParams.get("driverId")
    );
    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบตัวตนคนขับ กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const [driver, transactions, wallet] = await Promise.all([
      JumboRepository.getDriverById(driverId),
      JumboRepository.getTransactionsByDriver(driverId),
      JumboRepository.getDriverWallet(driverId),
    ]);

    if (!driver) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลคนขับ" },
        { status: 404 }
      );
    }

    // สรุปจำนวนเงินจาก transactions จริง (ถ้ายังไม่มีข้อมูล = 0 ตามจริง)
    const totalLifetime = transactions.reduce(
      (sum, t) => sum + Number(t.amount ?? 0),
      0
    );

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    const today = transactions
      .filter((t) => {
        const d = t.created_at ? new Date(t.created_at) : null;
        return d && d >= startOfToday;
      })
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0);

    const thisWeek = transactions
      .filter((t) => {
        const d = t.created_at ? new Date(t.created_at) : null;
        return d && d >= weekAgo;
      })
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0);

    const summary = {
      driverId,
      today,
      thisWeek,
      totalLifetime: Number(driver.total_earnings ?? totalLifetime),
      completedJobsToday: 0,
      rating: driver.rating_avg ?? null,
      ratingCount: driver.rating_count ?? 0,
      balance: wallet?.balance ?? 0,
      creditLimit: wallet?.credit_limit ?? 0,
    };

    return NextResponse.json({
      success: true,
      summary,
      transactions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}