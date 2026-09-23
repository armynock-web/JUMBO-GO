import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const driverId =
      req.nextUrl.searchParams.get("driverId") ||
      "33333333-3333-3333-3333-333333333001";

    const summary = {
      driverId,
      today: 1250.0,
      thisWeek: 5400.0,
      totalLifetime: 38400.0,
      completedJobsToday: 3,
      rating: 4.8,
      acceptanceRate: "96%",
      completionRate: "99%",
      bank: {
        name: "กสิกรไทย",
        account: "123-4-56789-0",
      },
    };

    const transactions = [
      {
        id: "TXN-5021",
        date: "23 ก.ย. 2568 (วันนี้)",
        amount: 1250.0,
        type: "payout",
        status: "completed",
        bank: "กสิกรไทย ***5678",
      },
      {
        id: "TXN-5020",
        date: "20 ก.ย. 2568",
        amount: 5400.0,
        type: "payout",
        status: "completed",
        bank: "กสิกรไทย ***5678",
      },
    ];

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
