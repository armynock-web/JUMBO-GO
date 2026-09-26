"use client";

import { useEffect, useRef, useState } from "react";
import { useJumbo } from "@/store/jumbo";
import {
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export function RealMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);
  const driversLayerRef = useRef<any>(null);

  const draft = useJumbo((s) => s.draft);
  const setPickup = useJumbo((s) => s.setPickup);
  const setDropoff = useJumbo((s) => s.setDropoff);
  const updateDraft = useJumbo((s) => s.updateDraft);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      // Fix default marker icon issues in Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Default center: Bangkok
      const initialLat = draft.pickup?.latitude ?? 13.7563;
      const initialLng = draft.pickup?.longitude ?? 100.5018;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false,
      });

      // High-resolution, professional CartoDB Voyager Tile Layer (100% Free, no credit card)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      driversLayerRef.current = L.layerGroup().addTo(map);

      if (isMounted) setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Fetch OSRM Road Route when Pickup or Dropoff changes
  useEffect(() => {
    if (!draft.pickup || !draft.dropoff) return;

    let isMounted = true;
    async function calculateRoadRoute() {
      setRouteLoading(true);
      try {
        const res = await fetch("/api/routing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: {
              lat: draft.pickup!.latitude,
              lng: draft.pickup!.longitude,
            },
            destination: {
              lat: draft.dropoff!.latitude,
              lng: draft.dropoff!.longitude,
            },
          }),
        });

        const data = await res.json();
        if (isMounted && data.success) {
          updateDraft({
            distanceKm: data.distanceKm,
            durationMinutes: data.durationMinutes,
            routeCoordinates: data.coordinates,
          });
        }
      } catch (err) {
        console.error("Failed to calculate real road route:", err);
      } finally {
        if (isMounted) setRouteLoading(false);
      }
    }

    calculateRoadRoute();

    return () => {
      isMounted = false;
    };
  }, [
    draft.pickup?.latitude,
    draft.pickup?.longitude,
    draft.dropoff?.latitude,
    draft.dropoff?.longitude,
  ]);

  // 3. Render Markers & Polyline on the Leaflet Map
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    void (async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      // Custom Pickup Icon (Green Badge)
      const pickupIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
            <div style="background:#16a34a; color:#fff; font-weight:800; font-size:11px; padding:3px 8px; border-radius:999px; box-shadow:0 4px 12px rgba(0,0,0,0.25); white-space:nowrap; border:2px solid #fff; display:flex; align-items:center; gap:4px;">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#fff;"></span>
              จุดรับ [A]
            </div>
            <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid #16a34a; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [0, 0],
      });

      // Custom Dropoff Icon (JUMBO Red Badge)
      const dropoffIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%);">
            <div style="background:#ed1c24; color:#fff; font-weight:800; font-size:11px; padding:3px 8px; border-radius:999px; box-shadow:0 4px 12px rgba(237,28,36,0.35); white-space:nowrap; border:2px solid #fff; display:flex; align-items:center; gap:4px;">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#fff;"></span>
              จุดส่ง [B]
            </div>
            <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid #ed1c24; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [0, 0],
      });

      // Update / Create Pickup Marker
      if (draft.pickup) {
        const pPos: [number, number] = [
          draft.pickup.latitude,
          draft.pickup.longitude,
        ];
        if (!pickupMarkerRef.current) {
          pickupMarkerRef.current = L.marker(pPos, {
            icon: pickupIcon,
            draggable: true,
          }).addTo(map);

          pickupMarkerRef.current.on("dragend", async (e: any) => {
            const newPos = e.target.getLatLng();
            try {
              const revRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${newPos.lat}&lon=${newPos.lng}&format=json&accept-language=th`,
                {
                  headers: {
                    "User-Agent": "JumboGoCommercialLogistics/1.0",
                  },
                }
              );
              const revData = await revRes.json();
              setPickup({
                address:
                  revData.display_name?.split(",")[0] || "ตำแหน่งที่ลากปักหมุด",
                sub: revData.display_name || "",
                latitude: newPos.lat,
                longitude: newPos.lng,
              });
            } catch {
              setPickup({
                address: "ตำแหน่งที่ลากปักหมุด",
                sub: `${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}`,
                latitude: newPos.lat,
                longitude: newPos.lng,
              });
            }
          });
        } else {
          pickupMarkerRef.current.setLatLng(pPos);
        }
      }

      // Update / Create Dropoff Marker
      if (draft.dropoff) {
        const dPos: [number, number] = [
          draft.dropoff.latitude,
          draft.dropoff.longitude,
        ];
        if (!dropoffMarkerRef.current) {
          dropoffMarkerRef.current = L.marker(dPos, {
            icon: dropoffIcon,
            draggable: true,
          }).addTo(map);

          dropoffMarkerRef.current.on("dragend", async (e: any) => {
            const newPos = e.target.getLatLng();
            try {
              const revRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${newPos.lat}&lon=${newPos.lng}&format=json&accept-language=th`,
                {
                  headers: {
                    "User-Agent": "JumboGoCommercialLogistics/1.0",
                  },
                }
              );
              const revData = await revRes.json();
              setDropoff({
                address:
                  revData.display_name?.split(",")[0] || "ตำแหน่งที่ลากปักหมุด",
                sub: revData.display_name || "",
                latitude: newPos.lat,
                longitude: newPos.lng,
              });
            } catch {
              setDropoff({
                address: "ตำแหน่งที่ลากปักหมุด",
                sub: `${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}`,
                latitude: newPos.lat,
                longitude: newPos.lng,
              });
            }
          });
        } else {
          dropoffMarkerRef.current.setLatLng(dPos);
        }
      }

      // Render Real Road Polyline
      if (draft.routeCoordinates && draft.routeCoordinates.length > 0) {
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
        }

        // Draw shadow glow first
        const routeGlow = L.polyline(draft.routeCoordinates, {
          color: "#ed1c24",
          weight: 8,
          opacity: 0.25,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Draw main road polyline
        const mainPolyline = L.polyline(draft.routeCoordinates, {
          color: "#ed1c24",
          weight: 4.5,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        routePolylineRef.current = L.featureGroup([routeGlow, mainPolyline]).addTo(map);

        // Auto-fit bounds with comfortable padding
        map.fitBounds(mainPolyline.getBounds(), {
          padding: [50, 50],
          maxZoom: 15,
        });
      }

      // Render simulated nearby live drivers
      if (driversLayerRef.current) {
        driversLayerRef.current.clearLayers();
        const baseLat = draft.pickup?.latitude ?? 13.7563;
        const baseLng = draft.pickup?.longitude ?? 100.5018;

        const liveFleet = [
          { dLat: 0.012, dLng: -0.015, plate: "1ฒข-4892", type: "กระบะตู้ทึบ" },
          { dLat: -0.018, dLng: 0.022, plate: "70-1284", type: "6 ล้อ" },
          { dLat: 0.025, dLng: 0.018, plate: "3ฒณ-9102", type: "จัมโบ้ 4 ล้อ" },
          { dLat: -0.009, dLng: -0.024, plate: "2ฒง-5531", type: "กระบะคอก" },
        ];

        liveFleet.forEach((f) => {
          const truckIcon = L.divIcon({
            className: "truck-marker",
            html: `
              <div style="background:#0f172a; border:2px solid #fbbf24; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(0,0,0,0.3); transform:translate(-50%, -50%);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
            `,
            iconSize: [0, 0],
          });

          L.marker([baseLat + f.dLat, baseLng + f.dLng], { icon: truckIcon })
            .bindTooltip(`${f.type} (${f.plate}) • ว่างพร้อมรับ`, {
              direction: "top",
              offset: [0, -16],
            })
            .addTo(driversLayerRef.current);
        });
      }
    })();
  }, [
    mapLoaded,
    draft.pickup?.latitude,
    draft.pickup?.longitude,
    draft.dropoff?.latitude,
    draft.dropoff?.longitude,
    draft.routeCoordinates,
  ]);

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();
  const fitBounds = () => {
    if (routePolylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), {
        padding: [50, 50],
      });
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100 select-none">
      {/* 1. Leaflet Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* 2. Top Route Statistics Badge (Commercial Fleet Status) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jumbo/10 text-jumbo">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                เส้นทางถนนจริง (OSRM)
              </span>
              {routeLoading && (
                <span className="h-2 w-2 rounded-full bg-jumbo animate-ping" />
              )}
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[18px] font-black tracking-tight text-slate-900">
                {draft.distanceKm ?? 18.2} <span className="text-[13px] font-semibold text-slate-500">กม.</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-600">
                <Clock className="h-3.5 w-3.5" />
                ประมาณ {draft.durationMinutes ?? 32} นาที
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-[12px] font-semibold text-slate-700 shadow-md backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>รถว่างพร้อมส่ง 4 คันในรัศมี</span>
        </div>
      </div>

      {/* 3. Floating Map Controls (Right Side) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <button
            onClick={zoomIn}
            className="flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100 transition border-b border-slate-100"
            aria-label="ซูมเข้า"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={zoomOut}
            className="flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100 transition"
            aria-label="ซูมออก"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={fitBounds}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-100 transition"
          aria-label="จัดตำแหน่งเส้นทาง"
          title="จัดตำแหน่งเส้นทาง"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* 4. Bottom Helper Notice */}
      <div className="absolute bottom-4 right-4 z-10 rounded-xl bg-slate-900/85 px-3 py-1.5 text-[11px] font-medium text-white shadow-md backdrop-blur-md">
        💡 คุณสามารถคลิกลากหมุด [A] หรือ [B] เพื่อปรับตำแหน่งที่แน่นอนบนถนนได้
      </div>
    </div>
  );
}
