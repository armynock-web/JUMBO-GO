import { NextRequest, NextResponse } from "next/server";
import { getTokenUserId } from "@/lib/request-auth";
import { JumboRepository } from "@/lib/supabase/repository";

export async function GET(req: NextRequest) {
  try {
    const query = (req.nextUrl.searchParams.get("q") || "").trim();
    const userId = getTokenUserId(req);

    // ค้นจาก saved_locations ของผู้ใช้ (ถ้าล็อกอิน) + ตำแหน่งจริงที่เคยใช้ใน booking
    const [saved, bookings] = await Promise.all([
      userId ? JumboRepository.getSavedLocations(userId) : Promise.resolve([]),
      userId ? JumboRepository.getBookingsByUser(userId) : Promise.resolve([]),
    ]);

    const bookingLocations = bookings
      .flatMap((b) =>
        (b.booking_locations || []).map((loc) => ({
          id: `booking_${loc.id}`,
          name: loc.address,
          address: loc.address,
          lat: loc.lat,
          lng: loc.lng,
          tag: loc.type === "pickup" ? "จุดรับ" : "จุดส่ง",
        }))
      )
      .filter(
        (loc, idx, arr) =>
          arr.findIndex((l) => l.address === loc.address) === idx
      );

    const results = [
      ...saved.map((s) => ({
        id: `saved_${s.id}`,
        name: s.label ?? s.address,
        address: s.address,
        sub: "",
        lat: s.lat,
        lng: s.lng,
        tag: s.label ?? "ที่บันทึก",
      })),
      ...bookingLocations,
    ];

    const filtered = query
      ? results.filter(
          (l) =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.address.toLowerCase().includes(query.toLowerCase())
        )
      : results;

    return NextResponse.json({
      success: true,
      results: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}