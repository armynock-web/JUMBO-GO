"use client";

import { useEffect, useRef, useState } from "react";
import {
  Truck,
  Phone,
  Star,
  RefreshCw,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface FleetDriver {
  id: string;
  driver_code?: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_online: boolean;
  is_verified?: boolean;
  current_location_lat?: number | null;
  current_location_lng?: number | null;
  rating_avg?: number;
  vehicles?: {
    plate_number?: string;
    brand?: string;
    model?: string;
    type?: string;
  } | Array<{
    plate_number?: string;
    brand?: string;
    model?: string;
    type?: string;
  }>;
}

const FALLBACK_FLEET: FleetDriver[] = [
  {
    id: "f74c32ed-7cb6-49a8-9963-a21d34e73335",
    driver_code: "JG-00108",
    first_name: "สมชาย",
    last_name: "ใจดี",
    phone: "081-234-5678",
    is_online: true,
    is_verified: true,
    current_location_lat: 13.7469,
    current_location_lng: 100.5349,
    rating_avg: 4.8,
    vehicles: {
      plate_number: "1ฒฮ 4589 กทม.",
      brand: "Toyota",
      model: "Hilux Revo",
      type: "กระบะตู้ทึบ",
    },
  },
  {
    id: "d002",
    driver_code: "JG-00107",
    first_name: "วันดี",
    last_name: "มีสุข",
    phone: "089-888-7766",
    is_online: true,
    is_verified: true,
    current_location_lat: 13.8012,
    current_location_lng: 100.5528,
    rating_avg: 4.9,
    vehicles: {
      plate_number: "70-8899 กทม.",
      brand: "Isuzu",
      model: "Forward",
      type: "6 ล้อ",
    },
  },
  {
    id: "d003",
    driver_code: "JG-00106",
    first_name: "อนุชา",
    last_name: "รักไทย",
    phone: "082-333-4455",
    is_online: true,
    is_verified: true,
    current_location_lat: 13.6924,
    current_location_lng: 100.6078,
    rating_avg: 4.7,
    vehicles: {
      plate_number: "2ฒข 1234 กทม.",
      brand: "Isuzu",
      model: "D-Max Jumbo",
      type: "จัมโบ้ (4 ล้อใหญ่)",
    },
  },
  {
    id: "d004",
    driver_code: "JG-00105",
    first_name: "ประยุทธ",
    last_name: "สดใส",
    phone: "081-555-1212",
    is_online: false,
    is_verified: true,
    current_location_lat: 13.7215,
    current_location_lng: 100.4789,
    rating_avg: 4.6,
    vehicles: {
      plate_number: "3ฒณ 9876 กทม.",
      brand: "Toyota",
      model: "Revo 4-Door",
      type: "กระบะ",
    },
  },
  {
    id: "d005",
    driver_code: "JG-00111",
    first_name: "ธนกร",
    last_name: "มั่นคง",
    phone: "086-777-9900",
    is_online: true,
    is_verified: true,
    current_location_lat: 13.7652,
    current_location_lng: 100.5381,
    rating_avg: 4.9,
    vehicles: {
      plate_number: "1ฒฒ 3421 กทม.",
      brand: "Toyota",
      model: "Hilux Smart Cab",
      type: "กระบะคอก",
    },
  },
];

export function AdminFleetMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [drivers, setDrivers] = useState<FleetDriver[]>(FALLBACK_FLEET);
  const [loading, setLoading] = useState(false);
  const [filterOnline, setFilterOnline] = useState<"all" | "online" | "offline">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<FleetDriver | null>(null);

  // Fetch live drivers from API
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drivers");
      const data = await res.json();
      if (data.success && Array.isArray(data.drivers) && data.drivers.length > 0) {
        setDrivers(data.drivers);
      }
    } catch {
      // safe fallback to FALLBACK_FLEET
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current, {
        center: [13.7563, 100.5018], // Bangkok
        zoom: 11,
        zoomControl: false,
      });

      // CartoDB Voyager High-Res Tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://openstreetmap.org">OSM</a>',
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
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

  // Update markers when drivers or filter changes
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current || !markersLayerRef.current) return;
      const L = (await import("leaflet")).default;

      markersLayerRef.current.clearLayers();

      const filtered = drivers.filter((d) => {
        if (filterOnline === "online" && !d.is_online) return false;
        if (filterOnline === "offline" && d.is_online) return false;

        const vRaw = d.vehicles;
        const v = Array.isArray(vRaw) ? vRaw[0] : vRaw;
        const vType = v?.type || "";

        if (filterType !== "all" && !vType.toLowerCase().includes(filterType.toLowerCase())) {
          return false;
        }
        return true;
      });

      filtered.forEach((d) => {
        const lat = d.current_location_lat ?? 13.7563;
        const lng = d.current_location_lng ?? 100.5018;

        const vRaw = d.vehicles;
        const v = Array.isArray(vRaw) ? vRaw[0] : vRaw;
        const plate = v?.plate_number || "ทะเบียน -";
        const vType = v?.type || "กระบะ";

        const isOnline = d.is_online;
        const color = isOnline ? "#10b981" : "#64748b"; // emerald vs slate

        const truckHtml = `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: #0f172a;
            color: #fff;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid ${color};
            font-family: sans-serif;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${color};
              box-shadow: 0 0 6px ${color};
            "></span>
            <span style="font-size: 11px; font-weight: 700;">${d.first_name}</span>
            <span style="font-size: 9px; opacity: 0.8; background: rgba(255,255,255,0.15); padding: 1px 4px; border-radius: 4px;">${plate}</span>
          </div>
        `;

        const icon = L.divIcon({
          html: truckHtml,
          className: "custom-truck-pin",
          iconSize: [120, 28],
          iconAnchor: [60, 14],
        });

        const marker = L.marker([lat, lng], { icon });

        marker.on("click", () => {
          setSelectedDriver(d);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 800; font-size: 13px; color: #0f172a;">${d.first_name} ${d.last_name}</span>
              <span style="font-size: 9px; font-weight: 700; color: ${color}; background: ${color}15; padding: 2px 6px; border-radius: 9999px;">
                ${isOnline ? "พร้อมรับงาน" : "ออฟไลน์"}
              </span>
            </div>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">รหัสคนขับ: <strong>${d.driver_code || d.id.slice(0, 8)}</strong></p>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">รถ: <strong>${vType} (${plate})</strong></p>
            <p style="font-size: 11px; color: #64748b; margin: 0;">โทร: <a href="tel:${d.phone}" style="color: #dc2626; font-weight: 700; text-decoration: none;">${d.phone}</a></p>
          </div>
        `);

        markersLayerRef.current.addLayer(marker);
      });
    }

    updateMarkers();
  }, [drivers, filterOnline, filterType]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.setView([13.7563, 100.5018], 11);
  };

  const onlineCount = drivers.filter((d) => d.is_online).length;

  return (
    <div className="relative flex h-[480px] w-full flex-col overflow-hidden rounded-2xl border border-line bg-slate-900 shadow-md">
      {/* Top Header & Filters Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-2.5 backdrop-blur-md text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-jumbo text-white shadow-xs">
            <Truck className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold tracking-tight text-white">
                แผนที่มอนิเตอร์กองรถสด (Live Fleet Map)
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ออนไลน์ {onlineCount} / {drivers.length} คัน
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              พิกัด GPS เรียลไทม์ผ่าน CartoDB High-Res Map
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-lg bg-white/10 p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setFilterOnline("all")}
              className={`rounded-md px-2.5 py-1 transition ${
                filterOnline === "all" ? "bg-white/20 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              ทั้งหมด ({drivers.length})
            </button>
            <button
              onClick={() => setFilterOnline("online")}
              className={`rounded-md px-2.5 py-1 transition ${
                filterOnline === "online" ? "bg-emerald-500 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              ออนไลน์ ({onlineCount})
            </button>
            <button
              onClick={() => setFilterOnline("offline")}
              className={`rounded-md px-2.5 py-1 transition ${
                filterOnline === "offline" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              ออฟไลน์ ({drivers.length - onlineCount})
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchDrivers}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition disabled:opacity-50"
            title="รีเฟรชตำแหน่งกองรถ"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleRecenter}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md hover:bg-slate-800 transition"
            title="ตำแหน่งศูนย์กลาง กทม."
          >
            <Navigation className="h-4 w-4 text-jumbo" />
          </button>
          <button
            onClick={handleZoomIn}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md hover:bg-slate-800 transition"
            title="ซูมเข้า"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md hover:bg-slate-800 transition"
            title="ซูมออก"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
