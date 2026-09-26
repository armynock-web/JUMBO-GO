"use client";

import { useEffect, useState, useRef } from "react";
import { useJumbo, type LocationPoint } from "@/store/jumbo";
import { VEHICLES, formatTHB, type VehicleType } from "@/lib/brand";
import {
  MapPin,
  Search,
  Truck,
  User,
  Phone,
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUpDown,
  Sparkles,
  Loader2,
  Info,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomerBookingConsole() {
  const draft = useJumbo((s) => s.draft);
  const setPickup = useJumbo((s) => s.setPickup);
  const setDropoff = useJumbo((s) => s.setDropoff);
  const setVehicle = useJumbo((s) => s.setVehicle);
  const setPrice = useJumbo((s) => s.setPrice);
  const updateDraft = useJumbo((s) => s.updateDraft);
  const setActiveBooking = useJumbo((s) => s.setActiveBooking);
  const go = useJumbo((s) => s.go);

  // Search states for Pickup [A]
  const [pickupQuery, setPickupQuery] = useState(draft.pickup?.address || "");
  const [pickupResults, setPickupResults] = useState<any[]>([]);
  const [pickupSearching, setPickupSearching] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);

  // Search states for Dropoff [B]
  const [dropoffQuery, setDropoffQuery] = useState(draft.dropoff?.address || "");
  const [dropoffResults, setDropoffResults] = useState<any[]>([]);
  const [dropoffSearching, setDropoffSearching] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

  // Form expansion states
  const [showSenderDetails, setShowSenderDetails] = useState(false);
  const [showReceiverDetails, setShowReceiverDetails] = useState(false);

  // Submitting
  const [submitting, setSubmitting] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Debounced search for Pickup
  useEffect(() => {
    if (!pickupQuery || pickupQuery.length < 2) {
      setPickupResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setPickupSearching(true);
      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(pickupQuery)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setPickupResults(data.results);
        }
      } catch (err) {
        console.error("Pickup search error:", err);
      } finally {
        setPickupSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [pickupQuery]);

  // Debounced search for Dropoff
  useEffect(() => {
    if (!dropoffQuery || dropoffQuery.length < 2) {
      setDropoffResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setDropoffSearching(true);
      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(dropoffQuery)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setDropoffResults(data.results);
        }
      } catch (err) {
        console.error("Dropoff search error:", err);
      } finally {
        setDropoffSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [dropoffQuery]);

  // Keep query inputs in sync when draft is changed via map pin drag
  useEffect(() => {
    if (draft.pickup?.address && draft.pickup.address !== pickupQuery) {
      setPickupQuery(draft.pickup.address);
    }
  }, [draft.pickup?.address]);

  useEffect(() => {
    if (draft.dropoff?.address && draft.dropoff.address !== dropoffQuery) {
      setDropoffQuery(draft.dropoff.address);
    }
  }, [draft.dropoff?.address]);

  // Recalculate dynamic fare from server pricing engine whenever distance, vehicle, or options change
  useEffect(() => {
    if (!draft.vehicleType) return;

    let isMounted = true;
    async function calculateServerFare() {
      setPricingLoading(true);
      try {
        const res = await fetch("/api/pricing/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleType: draft.vehicleType,
            distanceKm: draft.distanceKm ?? 18.2,
            hasHelper: draft.hasHelper,
            expressway: draft.hasExpressway,
          }),
        });

        const data = await res.json();
        if (isMounted && data.success) {
          setPrice(draft.distanceKm ?? 18.2, data.totalFare);
        }
      } catch (err) {
        console.error("Pricing estimation failed:", err);
      } finally {
        if (isMounted) setPricingLoading(false);
      }
    }

    calculateServerFare();

    return () => {
      isMounted = false;
    };
  }, [
    draft.vehicleType,
    draft.distanceKm,
    draft.hasHelper,
    draft.hasExpressway,
  ]);

  // Handle location selection
  const selectPickupLocation = (item: any) => {
    setPickup({
      address: item.name,
      sub: item.sub || item.address,
      latitude: item.lat,
      longitude: item.lng,
      tag: item.tag,
    });
    setPickupQuery(item.name);
    setShowPickupDropdown(false);
  };

  const selectDropoffLocation = (item: any) => {
    setDropoff({
      address: item.name,
      sub: item.sub || item.address,
      latitude: item.lat,
      longitude: item.lng,
      tag: item.tag,
    });
    setDropoffQuery(item.name);
    setShowDropoffDropdown(false);
  };

  // Swap locations button
  const swapLocations = () => {
    const temp = draft.pickup;
    if (draft.dropoff) setPickup(draft.dropoff);
    if (temp) setDropoff(temp);
  };

  // Vehicle specifications metadata
  const VEHICLE_SPECS: Record<
    VehicleType,
    { dimensions: string; payload: string; bestFor: string; img: string }
  > = {
    PICKUP: {
      dimensions: "1.6 × 2.1 × 0.9 ม.",
      payload: "1,000 กก.",
      bestFor: "ของทรงสูง ย้ายหอพักทั่วไป",
      img: "/images/vehicles/pickup.jpg",
    },
    CLOSED_PICKUP: {
      dimensions: "1.7 × 2.2 × 1.8 ม.",
      payload: "1,500 กก.",
      bestFor: "ตู้ทึบกันฝน สินค้ากล่อง เฟอร์นิเจอร์",
      img: "/images/vehicles/box.jpg",
    },
    CAGE_PICKUP: {
      dimensions: "1.7 × 2.2 × 2.1 ม.",
      payload: "1,800 กก.",
      bestFor: "คอกสูง ขนพืชผล วัสดุ ย้ายบ้าน",
      img: "/images/vehicles/cage.jpg",
    },
    JUMBO: {
      dimensions: "1.8 × 3.1 × 2.0 ม.",
      payload: "2,500 กก.",
      bestFor: "กระบะใหญ่จุพิเศษ ไม่ติดเวลาวิ่ง",
      img: "/images/vehicles/jumbo.jpg",
    },
    SIX_WHEEL: {
      dimensions: "2.3 × 6.5 × 2.3 ม.",
      payload: "5,000 กก.",
      bestFor: "งานโรงงาน ขนส่งอุตสาหกรรม",
      img: "/images/vehicles/six-wheel.jpg",
    },
  };

  // Submit booking to Supabase
  const handleBookingSubmit = async () => {
    if (!draft.pickup || !draft.dropoff || !draft.vehicleType) return;

    setSubmitting(true);
    try {
      const token =
        (typeof window !== "undefined" &&
          localStorage.getItem("jumbo_token")) ||
        "jumbo_a9dce7bb-a9cf-4f21-874a-129b0138fd56";

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup: draft.pickup,
          dropoff: draft.dropoff,
          vehicleType: draft.vehicleType,
          fare: draft.estimatedPrice ?? 619,
          distanceKm: draft.distanceKm ?? 18.2,
          expresswayFee: draft.hasExpressway ? 50 : 0,
          senderName: draft.senderName || "ผู้ส่งสินค้า",
          senderPhone: draft.senderPhone || "082-345-6789",
          receiverName: draft.receiverName || "ผู้รับสินค้าปลายทาง",
          receiverPhone: draft.receiverPhone || "081-999-8888",
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking.id, data.booking.job_number);
        go("searching");
      } else {
        go("searching");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      go("searching");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-hidden text-slate-800">
      {/* 1. Header Booking Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 bg-slate-50/70 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
            เรียกรถส่งของออนดีมานด์
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-jumbo bg-jumbo/10 px-2.5 py-1 rounded-full">
          <span>ยืนยันราคาแน่นอน</span>
        </div>
      </div>

      {/* 2. Scrollable Booking Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
        {/* === SECTION 1: PICKUP & DROPOFF LOCATIONS === */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="relative flex flex-col gap-3">
            {/* Pickup Input [A] */}
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="mt-2.5 flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-xs">
                    A
                  </span>
                  <div className="h-10 w-0.5 border-l-2 border-dashed border-slate-300 my-1" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      จุดรับสินค้า
                    </label>
                    <button
                      onClick={() => setShowSenderDetails(!showSenderDetails)}
                      className="text-[11px] font-semibold text-jumbo hover:underline flex items-center gap-0.5"
                    >
                      {showSenderDetails ? "ย่อข้อมูลผู้ส่ง" : "+ เพิ่มผู้ติดต่อ"}
                    </button>
                  </div>

                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={pickupQuery}
                      onChange={(e) => {
                        setPickupQuery(e.target.value);
                        setShowPickupDropdown(true);
                      }}
                      onFocus={() => setShowPickupDropdown(true)}
                      placeholder="พิมพ์ค้นหาจุดรับ หรือปักหมุดบนแผนที่"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-[13px] font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                    {pickupSearching && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />
                    )}
                  </div>

                  {/* Pickup Contact Form */}
                  <AnimatePresence>
                    {showSenderDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 grid grid-cols-2 gap-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px]">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={draft.senderName}
                            onChange={(e) =>
                              updateDraft({ senderName: e.target.value })
                            }
                            placeholder="ชื่อผู้ส่ง"
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px]">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="tel"
                            value={draft.senderPhone}
                            onChange={(e) =>
                              updateDraft({ senderPhone: e.target.value })
                            }
                            placeholder="เบอร์โทรผู้ส่ง"
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Pickup Dropdown Results */}
              {showPickupDropdown && pickupResults.length > 0 && (
                <div className="absolute top-16 left-9 right-0 z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {pickupResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectPickupLocation(item)}
                      className="flex cursor-pointer items-start gap-2.5 border-b border-slate-50 px-3 py-2.5 hover:bg-emerald-50/60 transition"
                    >
                      <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[13px] font-bold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.sub || item.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="absolute top-[48px] right-2 z-10">
              <button
                onClick={swapLocations}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 transition"
                title="สลับจุดรับ-จุดส่ง"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Dropoff Input [B] */}
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="mt-2.5 flex flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jumbo text-[11px] font-black text-white shadow-xs">
                    B
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      จุดส่งสินค้า
                    </label>
                    <button
                      onClick={() =>
                        setShowReceiverDetails(!showReceiverDetails)
                      }
                      className="text-[11px] font-semibold text-jumbo hover:underline flex items-center gap-0.5"
                    >
                      {showReceiverDetails
                        ? "ย่อข้อมูลผู้รับ"
                        : "+ เพิ่มผู้ติดต่อ"}
                    </button>
                  </div>

                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={dropoffQuery}
                      onChange={(e) => {
                        setDropoffQuery(e.target.value);
                        setShowDropoffDropdown(true);
                      }}
                      onFocus={() => setShowDropoffDropdown(true)}
                      placeholder="พิมพ์ค้นหาจุดส่ง หรือปักหมุดบนแผนที่"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-[13px] font-medium text-slate-900 outline-none transition focus:border-jumbo focus:bg-white focus:ring-2 focus:ring-jumbo/20"
                    />
                    {dropoffSearching && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />
                    )}
                  </div>

                  {/* Dropoff Contact Form */}
                  <AnimatePresence>
                    {showReceiverDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 grid grid-cols-2 gap-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px]">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={draft.receiverName}
                            onChange={(e) =>
                              updateDraft({ receiverName: e.target.value })
                            }
                            placeholder="ชื่อผู้รับ"
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px]">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="tel"
                            value={draft.receiverPhone}
                            onChange={(e) =>
                              updateDraft({ receiverPhone: e.target.value })
                            }
                            placeholder="เบอร์โทรผู้รับ"
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dropoff Dropdown Results */}
              {showDropoffDropdown && dropoffResults.length > 0 && (
                <div className="absolute top-16 left-9 right-0 z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                  {dropoffResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectDropoffLocation(item)}
                      className="flex cursor-pointer items-start gap-2.5 border-b border-slate-50 px-3 py-2.5 hover:bg-jumbo/5 transition"
                    >
                      <MapPin className="h-4 w-4 text-jumbo flex-shrink-0 mt-0.5" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[13px] font-bold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.sub || item.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === SECTION 2: REAL VEHICLE FLEET SELECTION === */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-600">
              เลือกรถจริงตามประเภทงาน
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              มีรถพร้อมให้บริการ
            </span>
          </div>

          <div className="space-y-2">
            {VEHICLES.map((v) => {
              const active = draft.vehicleType === v.type;
              const spec = VEHICLE_SPECS[v.type];

              return (
                <div
                  key={v.type}
                  onClick={() => setVehicle(v.type)}
                  className={`relative flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-3 transition ${
                    active
                      ? "border-jumbo bg-red-50/30 shadow-sm"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Real Vehicle Photo */}
                  <div className="relative flex h-16 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
                    <img
                      src={spec.img}
                      alt={v.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Vehicle Specs */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-black text-slate-900 truncate">
                        {v.name}
                      </h4>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {spec.payload}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      ขนาด: <strong>{spec.dimensions}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {spec.bestFor}
                    </p>
                  </div>

                  {/* Starting Price & Checkbox */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] text-slate-400 block">เริ่มต้น</span>
                    <span className="text-[16px] font-black text-jumbo">
                      ฿{v.basePrice}
                    </span>
                    {active && (
                      <div className="mt-1 flex items-center justify-end text-jumbo">
                        <CheckCircle2 className="h-4 w-4 fill-jumbo text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === SECTION 3: SCHEDULE & EXTRA SERVICES === */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-600">
            บริการเสริม & เวลาเข้ารับ
          </h4>

          {/* Schedule Toggle */}
          <div className="flex rounded-xl bg-white p-1 border border-slate-200">
            <button
              onClick={() => updateDraft({ scheduleTime: "immediate" })}
              className={`flex-1 rounded-lg py-1.5 text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${
                draft.scheduleTime === "immediate"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              ด่วนทันที (10-20 นาที)
            </button>
            <button
              onClick={() => updateDraft({ scheduleTime: "scheduled" })}
              className={`flex-1 rounded-lg py-1.5 text-[12px] font-bold transition flex items-center justify-center gap-1.5 ${
                draft.scheduleTime === "scheduled"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              จองล่วงหน้า
            </button>
          </div>

          {/* Add-on Checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer hover:border-slate-300 transition">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.hasHelper}
                  onChange={(e) =>
                    updateDraft({ hasHelper: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-jumbo"
                />
                <div>
                  <span className="text-[12px] font-bold text-slate-800 block">
                    คนขับช่วยยกสินค้า
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ช่วยขนย้ายขึ้น-ลงจากตัวรถ
                  </span>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-900">+฿150</span>
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer hover:border-slate-300 transition">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.hasExpressway}
                  onChange={(e) =>
                    updateDraft({ hasExpressway: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-jumbo"
                />
                <div>
                  <span className="text-[12px] font-bold text-slate-800 block">
                    ขึ้นทางด่วนพิเศษ
                  </span>
                  <span className="text-[10px] text-slate-500">
                    เลี่ยงรถติด ส่งถึงไวกว่า
                  </span>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-900">+฿50</span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Bottom Sticky Action & Price Breakdown Panel */}
      <div className="border-t border-slate-200 bg-white p-4 shadow-xl flex-shrink-0">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ยอดรวมสุทธิ (รวมภาษี)
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[24px] font-black tracking-tight text-slate-950">
                ฿{draft.estimatedPrice ?? 619}
              </span>
              {pricingLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-jumbo" />
              )}
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span>ระยะทางถนนจริง <strong>{draft.distanceKm ?? 18.2} กม.</strong></span>
          </div>
        </div>

        <button
          onClick={handleBookingSubmit}
          disabled={submitting}
          className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-jumbo-dark active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>กำลังส่งข้อมูลเข้าสู่ระบบ...</span>
            </>
          ) : (
            <>
              <Truck className="h-5 w-5" />
              <span>เรียกรถทันที (Book Now)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
