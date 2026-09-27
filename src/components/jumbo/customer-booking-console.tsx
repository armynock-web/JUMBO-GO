"use client";

import { useEffect, useState } from "react";
import { useJumbo, type LocationPoint } from "@/store/jumbo";
import { VEHICLES, type VehicleType } from "@/lib/brand";
import { PromotionBannerCarousel } from "./promotion-banner-carousel";
import {
  MapPin,
  Truck,
  User,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowUpDown,
  Sparkles,
  Loader2,
  Tag,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MultiDropPoint {
  id: string;
  address: string;
  sub?: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
}

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

  // Multi-Drop list (default has Dropoff [B])
  const [dropPoints, setDropPoints] = useState<MultiDropPoint[]>([
    {
      id: "drop-1",
      address: draft.dropoff?.address || "เมกาบางนา (จุดส่งสินค้า)",
      sub: draft.dropoff?.sub || "39 หมู่ 6 ถ.บางนา-ตราด กม.8 บางพลี สมุทรปราการ",
      latitude: draft.dropoff?.latitude || 13.6467,
      longitude: draft.dropoff?.longitude || 100.6802,
      contactName: draft.receiverName || "ผู้รับสินค้าปลายทาง",
      contactPhone: draft.receiverPhone || "081-999-8888",
    },
  ]);

  // Active Drop Search Index
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);
  const [dropQuery, setDropQuery] = useState("");
  const [dropResults, setDropResults] = useState<any[]>([]);
  const [dropSearching, setDropSearching] = useState(false);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    title: string;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  // Scheduling states
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">(
    "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

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

  // Debounced search for Active Drop Point
  useEffect(() => {
    if (!dropQuery || dropQuery.length < 2 || activeDropIndex === null) {
      setDropResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setDropSearching(true);
      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(dropQuery)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setDropResults(data.results);
        }
      } catch (err) {
        console.error("Dropoff search error:", err);
      } finally {
        setDropSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [dropQuery, activeDropIndex]);

  // Sync draft pickup changes
  useEffect(() => {
    if (draft.pickup?.address && draft.pickup.address !== pickupQuery) {
      setPickupQuery(draft.pickup.address);
    }
  }, [draft.pickup?.address]);

  // Recalculate dynamic fare from server pricing engine
  useEffect(() => {
    if (!draft.vehicleType) return;

    let isMounted = true;
    async function calculateServerFare() {
      setPricingLoading(true);
      try {
        // Multi-drop adds 80 THB per additional stop
        const extraStopsCount = Math.max(0, dropPoints.length - 1);
        const extraStopsFare = extraStopsCount * 80;

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
          const baseEstimated = data.totalFare + extraStopsFare;
          setPrice(draft.distanceKm ?? 18.2, baseEstimated);
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
    dropPoints.length,
    setPrice,
  ]);

  // Location selection handlers
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

  const selectDropLocation = (item: any, index: number) => {
    const updated = [...dropPoints];
    updated[index] = {
      ...updated[index],
      address: item.name,
      sub: item.sub || item.address,
      latitude: item.lat,
      longitude: item.lng,
    };
    setDropPoints(updated);

    // Update primary dropoff in store
    if (index === 0) {
      setDropoff({
        address: item.name,
        sub: item.sub || item.address,
        latitude: item.lat,
        longitude: item.lng,
      });
    }

    setActiveDropIndex(null);
    setDropQuery("");
  };

  // Add stop handler (up to 5 stops)
  const addDropPoint = () => {
    if (dropPoints.length >= 5) return;
    const newPoint: MultiDropPoint = {
      id: `drop-${Date.now()}`,
      address: "",
      sub: "",
      latitude: 13.7563,
      longitude: 100.5018,
      contactName: "",
      contactPhone: "",
    };
    setDropPoints([...dropPoints, newPoint]);
  };

  // Remove stop handler
  const removeDropPoint = (index: number) => {
    if (dropPoints.length <= 1) return;
    const updated = dropPoints.filter((_, i) => i !== index);
    setDropPoints(updated);
    if (index === 0 && updated.length > 0) {
      setDropoff({
        address: updated[0].address,
        sub: updated[0].sub,
        latitude: updated[0].latitude,
        longitude: updated[0].longitude,
      });
    }
  };

  // Update contact info for a drop point
  const updateDropContact = (
    index: number,
    field: "contactName" | "contactPhone",
    value: string
  ) => {
    const updated = [...dropPoints];
    updated[index][field] = value;
    setDropPoints(updated);
    if (index === 0) {
      if (field === "contactName") updateDraft({ receiverName: value });
      if (field === "contactPhone") updateDraft({ receiverPhone: value });
    }
  };

  // Swap pickup and first dropoff
  const swapLocations = () => {
    if (!draft.pickup || dropPoints.length === 0) return;
    const firstDrop = dropPoints[0];
    const oldPickup = draft.pickup;

    setPickup({
      address: firstDrop.address,
      sub: firstDrop.sub,
      latitude: firstDrop.latitude,
      longitude: firstDrop.longitude,
    });
    setPickupQuery(firstDrop.address);

    const updated = [...dropPoints];
    updated[0] = {
      ...firstDrop,
      address: oldPickup.address,
      sub: oldPickup.sub,
      latitude: oldPickup.latitude,
      longitude: oldPickup.longitude,
    };
    setDropPoints(updated);
    setDropoff(oldPickup);
  };

  // Promo code engine
  const handleApplyPromoCode = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    setPromoError("");

    if (!code) {
      setPromoError("กรุณากรอกรหัสโปรโมชั่น");
      return;
    }

    if (code === "JUMBOFIRST") {
      setAppliedPromo({
        code: "JUMBOFIRST",
        discount: 150,
        title: "ส่วนลดลูกค้าใหม่",
      });
      setPromoCodeInput("JUMBOFIRST");
    } else if (code === "JUMBOPRO") {
      const discount = Math.round((draft.estimatedPrice ?? 600) * 0.1);
      setAppliedPromo({
        code: "JUMBOPRO",
        discount: Math.min(200, discount),
        title: "ส่วนลด 10% ลูกค้าประจำ",
      });
      setPromoCodeInput("JUMBOPRO");
    } else if (code === "FREESHIP") {
      setAppliedPromo({
        code: "FREESHIP",
        discount: 100,
        title: "ส่วนลดค่าบริการพิเศษ",
      });
      setPromoCodeInput("FREESHIP");
    } else {
      setPromoError("รหัสโปรโมชั่นไม่ถูกต้อง หรือหมดอายุแล้ว");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
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

  // Calculate final price with discount
  const rawFare = draft.estimatedPrice ?? 619;
  const discountVal = appliedPromo ? appliedPromo.discount : 0;
  const finalFare = Math.max(100, rawFare - discountVal);

  // Submit booking to Supabase
  const handleBookingSubmit = async () => {
    if (!draft.pickup || dropPoints.length === 0 || !draft.vehicleType) return;

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
          dropoff: {
            address: dropPoints[0].address,
            sub: dropPoints[0].sub,
            latitude: dropPoints[0].latitude,
            longitude: dropPoints[0].longitude,
          },
          vehicleType: draft.vehicleType,
          fare: finalFare,
          distanceKm: draft.distanceKm ?? 18.2,
          expresswayFee: draft.hasExpressway ? 50 : 0,
          senderName: draft.senderName || "ผู้ส่งสินค้า",
          senderPhone: draft.senderPhone || "082-345-6789",
          receiverName: dropPoints[0].contactName || "ผู้รับสินค้าปลายทาง",
          receiverPhone: dropPoints[0].contactPhone || "081-999-8888",
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking.id, data.booking.job_number);
      }
      go("searching");
    } catch (err) {
      console.error("Booking submission error:", err);
      go("searching");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-hidden text-slate-800 font-sans">
      {/* 1. Header Booking Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-[16px] font-black text-slate-900 tracking-tight">
            เรียกรถขนส่งออนดีมานด์
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-jumbo bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5 text-jumbo" />
          <span>การันตีราคาแน่นอน</span>
        </div>
      </div>

      {/* 2. Scrollable Booking Form */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5 scrollbar-thin">
        {/* === PROMOTION BANNER CAROUSEL === */}
        <PromotionBannerCarousel
          onApplyPromoCode={(code) => handleApplyPromoCode(code)}
        />

        {/* === SECTION 1: DELIVERY TIMING TOGGLE === */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5">
          <div className="flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
            <button
              onClick={() => setScheduleType("immediate")}
              className={`flex-1 rounded-lg py-2 text-[12px] font-extrabold transition flex items-center justify-center gap-1.5 ${
                scheduleType === "immediate"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>ส่งด่วนทันที (10-20 นาที)</span>
            </button>
            <button
              onClick={() => setScheduleType("scheduled")}
              className={`flex-1 rounded-lg py-2 text-[12px] font-extrabold transition flex items-center justify-center gap-1.5 ${
                scheduleType === "scheduled"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>นัดหมายเวลาล่วงหน้า</span>
            </button>
          </div>

          {/* Scheduled Date/Time Inputs */}
          {scheduleType === "scheduled" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2.5 grid grid-cols-2 gap-2 pt-1"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  วันที่ต้องการเข้ารับ
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-800 outline-none focus:border-jumbo"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  เวลาเข้ารับสินค้า
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-800 outline-none focus:border-jumbo"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* === SECTION 2: PICKUP & MULTI-DROP DESTINATIONS === */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          {/* Pickup Point [A] */}
          <div className="relative">
            <div className="flex items-start gap-3">
              <div className="mt-2 flex flex-col items-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-xs">
                  A
                </span>
                <div className="h-10 w-0.5 border-l-2 border-dashed border-slate-300 my-1" />
              </div>

              <div className="flex-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  จุดรับสินค้า (ต้นทาง)
                </label>

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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-[13px] font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {pickupSearching && (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />
                  )}
                </div>

                {/* Pickup Contact Information */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-[11px]">
                    <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={draft.senderName}
                      onChange={(e) =>
                        updateDraft({ senderName: e.target.value })
                      }
                      placeholder="ชื่อผู้ส่ง"
                      className="w-full bg-transparent font-medium outline-none text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-[11px]">
                    <Phone className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <input
                      type="tel"
                      value={draft.senderPhone}
                      onChange={(e) =>
                        updateDraft({ senderPhone: e.target.value })
                      }
                      placeholder="เบอร์โทรผู้ส่ง"
                      className="w-full bg-transparent font-medium outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Pickup Dropdown Results */}
                {showPickupDropdown && pickupResults.length > 0 && (
                  <div className="absolute top-16 left-0 right-0 z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
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
            </div>

            {/* Swap Button */}
            <div className="absolute top-8 right-0 z-10">
              <button
                onClick={swapLocations}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 transition"
                title="สลับจุดรับ-จุดส่ง"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Multi-Drop Destinations List */}
          {dropPoints.map((dp, idx) => {
            const letter = String.fromCharCode(66 + idx); // B, C, D...
            const isFirst = idx === 0;

            return (
              <div key={dp.id} className="relative pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-2 flex flex-col items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jumbo text-[11px] font-black text-white shadow-xs">
                      {letter}
                    </span>
                    {idx < dropPoints.length - 1 && (
                      <div className="h-10 w-0.5 border-l-2 border-dashed border-slate-300 my-1" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {isFirst ? "จุดส่งสินค้า (ปลายทาง)" : `จุดแวะส่งที่ ${idx + 1}`}
                      </label>
                      {!isFirst && (
                        <button
                          onClick={() => removeDropPoint(idx)}
                          className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>ลบจุดแวะ</span>
                        </button>
                      )}
                    </div>

                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={
                          activeDropIndex === idx ? dropQuery : dp.address
                        }
                        onChange={(e) => {
                          setActiveDropIndex(idx);
                          setDropQuery(e.target.value);
                        }}
                        onFocus={() => {
                          setActiveDropIndex(idx);
                          setDropQuery(dp.address);
                        }}
                        placeholder={`พิมพ์ค้นหาจุดส่ง ${letter}`}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-[13px] font-bold text-slate-900 outline-none transition focus:border-jumbo focus:bg-white focus:ring-2 focus:ring-jumbo/20"
                      />
                      {dropSearching && activeDropIndex === idx && (
                        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />
                      )}
                    </div>

                    {/* Contact Details for this Destination */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-[11px]">
                        <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={dp.contactName}
                          onChange={(e) =>
                            updateDropContact(idx, "contactName", e.target.value)
                          }
                          placeholder="ชื่อผู้รับ"
                          className="w-full bg-transparent font-medium outline-none text-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-[11px]">
                        <Phone className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <input
                          type="tel"
                          value={dp.contactPhone}
                          onChange={(e) =>
                            updateDropContact(idx, "contactPhone", e.target.value)
                          }
                          placeholder="เบอร์โทรผู้รับ"
                          className="w-full bg-transparent font-medium outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Dropdown for this Drop point */}
                    {activeDropIndex === idx && dropResults.length > 0 && (
                      <div className="absolute top-16 left-0 right-0 z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                        {dropResults.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => selectDropLocation(item, idx)}
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
            );
          })}

          {/* Add Stop Button (Multi-Drop) */}
          {dropPoints.length < 5 && (
            <button
              onClick={addDropPoint}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-[12px] font-bold text-slate-700 hover:border-jumbo hover:text-jumbo hover:bg-red-50/20 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มจุดแวะส่งสินค้า (Multi-Drop ส่งได้สูงสุด 5 จุด)</span>
            </button>
          )}
        </div>

        {/* === SECTION 3: REAL VEHICLE FLEET SELECTION === */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-600">
              เลือกรถจริงตามประเภทงาน
            </h3>
            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              มีรถพร้อมวิ่ง 24 ชม.
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
                      ? "border-jumbo bg-red-50/30 shadow-xs"
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

                  {/* Starting Price */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-400 block">เริ่มต้น</span>
                    <span className="text-[16px] font-black text-jumbo">
                      ฿{v.basePrice}
                    </span>
                    {active && (
                      <div className="mt-0.5 flex items-center justify-end text-jumbo">
                        <CheckCircle2 className="h-4 w-4 fill-jumbo text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === SECTION 4: EXTRA SERVICES === */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-600">
            บริการเสริม
          </h4>

          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer hover:border-slate-300 transition">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.hasHelper}
                  onChange={(e) => updateDraft({ hasHelper: e.target.checked })}
                  className="h-4 w-4 rounded accent-jumbo"
                />
                <div>
                  <span className="text-[12px] font-bold text-slate-800 block">
                    คนขับช่วยยกสินค้า
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ช่วยยกและขนย้ายขึ้น-ลงจากตัวรถ
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
                    เลี่ยงรถติด ส่งถึงปลายทางไวกว่า
                  </span>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-900">+฿50</span>
            </label>
          </div>
        </div>

        {/* === SECTION 5: PROMO CODE REDEMPTION === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-jumbo" />
            <h4 className="text-[12px] font-extrabold uppercase tracking-wider text-slate-700">
              รหัสโปรโมชั่น / ส่วนลด
            </h4>
          </div>

          {appliedPromo ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-[12px]">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="font-extrabold text-emerald-800">
                    {appliedPromo.code} — {appliedPromo.title}
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    ลดทันที -฿{appliedPromo.discount}
                  </p>
                </div>
              </div>
              <button
                onClick={removePromoCode}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
                aria-label="Remove code"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="กรอกรหัสโค้ด เช่น JUMBOFIRST"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-bold uppercase text-slate-900 outline-none focus:border-jumbo focus:bg-white"
              />
              <button
                onClick={() => handleApplyPromoCode()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-slate-800 active:scale-95"
              >
                ใช้โค้ด
              </button>
            </div>
          )}

          {promoError && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {promoError}
            </p>
          )}
        </div>
      </div>

      {/* 3. Bottom Sticky Action & Price Breakdown Panel */}
      <div className="border-t border-slate-200 bg-white p-4 shadow-xl flex-shrink-0">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ยอดรวมสุทธิ (รวมภาษี)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[26px] font-black tracking-tight text-slate-950">
                ฿{finalFare}
              </span>
              {appliedPromo && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700">
                  ประหยัด ฿{appliedPromo.discount}
                </span>
              )}
              {pricingLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-jumbo" />
              )}
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span>
              ระยะทางถนนจริง <strong>{draft.distanceKm ?? 18.2} กม.</strong>
            </span>
            {dropPoints.length > 1 && (
              <span className="block text-[10px] text-emerald-600 font-bold">
                ({dropPoints.length} จุดแวะส่ง)
              </span>
            )}
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
