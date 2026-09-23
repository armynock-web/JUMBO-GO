import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = {
      activeBookings: 18,
      onlineDrivers: 42,
      totalRevenueToday: 38450.0,
      totalBookingsToday: 142,
      pendingKycCount: 14,
      abnormalCancellations: 2,
      systemHealth: "operational",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
