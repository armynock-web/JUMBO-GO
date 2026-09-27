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

    // Real-world Thai Geocoding via OpenStreetMap Nominatim (100% Free, no credit card)
    let onlineResults: Array<{
      id: string;
      name: string;
      address: string;
      sub: string;
      lat: number;
      lng: number;
      tag: string;
    }> = [];

    if (query && query.length >= 2) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&countrycodes=th&format=json&addressdetails=1&limit=6`;
        const res = await fetch(nomUrl, {
          headers: {
            "User-Agent": "JumboGoCommercialLogistics/1.0 (contact@jumbogo.local)",
            "Accept-Language": "th,en;q=0.9",
          },
          signal: AbortSignal.timeout(3500),
        });

        if (res.ok) {
          const nomData = await res.json();
          if (Array.isArray(nomData)) {
            onlineResults = nomData.map((item: any) => {
              const displayName = item.display_name || "";
              const parts = displayName.split(",").map((p: string) => p.trim());
              const title = parts[0] || item.name || query;
              const subDetails = parts.slice(1, 4).join(", ");

              return {
                id: `osm_${item.place_id}`,
                name: title,
                address: displayName,
                sub: subDetails,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                tag: item.type === "administrative" ? "ย่าน/เขต" : "สถานที่",
              };
            });
          }
        }
      } catch (nomErr) {
        // Graceful fallback if offline or timeout
        console.warn("Nominatim geocoding network fallback:", nomErr);
      }
    }

    // Merge: saved/history first, then OSM search results without duplicates
    const combined = [...filtered];
    for (const item of onlineResults) {
      if (!combined.some((c) => Math.abs(c.lat - item.lat) < 0.0005 && Math.abs(c.lng - item.lng) < 0.0005)) {
        combined.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      results: combined,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}