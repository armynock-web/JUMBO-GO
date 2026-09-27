import { NextRequest, NextResponse } from "next/server";
import { haversineKm } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    if (
      !origin ||
      !destination ||
      typeof origin.lat !== "number" ||
      typeof origin.lng !== "number" ||
      typeof destination.lat !== "number" ||
      typeof destination.lng !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid coordinates provided" },
        { status: 400 }
      );
    }

    // Attempt OSRM Driving Routing (100% Free OpenStreetMap Driving Engine)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      const res = await fetch(osrmUrl, {
        headers: {
          "User-Agent": "JumboGoCommercialLogistics/1.0",
        },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
          const durationMinutes = Math.max(5, Math.round(route.duration / 60));
          
          // OSRM coordinates are [lng, lat], Leaflet expects [lat, lng]
          const coordinates: [number, number][] = route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );

          return NextResponse.json({
            success: true,
            distanceKm,
            durationMinutes,
            coordinates,
            source: "osrm_real_road",
          });
        }
      }
    } catch (osrmError) {
      console.warn("OSRM routing network fallback:", osrmError);
    }

    // Fallback: Haversine with standard road winding factor (1.35x)
    const directKm = haversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
    const roadKm = Math.max(2.5, Math.round(directKm * 1.35 * 10) / 10);
    const estMinutes = Math.max(10, Math.round(roadKm * 2.2));

    // Generate 5 intermediate points for visual polyline fallback
    const steps = 6;
    const fallbackCoords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      fallbackCoords.push([
        origin.lat + (destination.lat - origin.lat) * t,
        origin.lng + (destination.lng - origin.lng) * t,
      ]);
    }

    return NextResponse.json({
      success: true,
      distanceKm: roadKm,
      durationMinutes: estMinutes,
      coordinates: fallbackCoords,
      source: "road_curvature_estimation",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
