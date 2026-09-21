"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import { StepIndicator } from "../step-indicator";
import { RECENT_LOCATIONS } from "@/lib/brand";
import {
  ChevronLeft,
  Search,
  Navigation,
  MapPin,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export function DropoffScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const setDropoff = useJumbo((s) => s.setDropoff);
  const draft = useJumbo((s) => s.draft);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filtered = RECENT_LOCATIONS.filter(
    (l) =>
      l.address !== draft.pickup?.address &&
      (query
        ? (l.name + l.address + l.sub)
            .toLowerCase()
            .includes(query.toLowerCase())
        : true),
  );

  const select = (loc: (typeof RECENT_LOCATIONS)[number]) => {
    if (draft.pickup && draft.pickup.address === loc.address) {
      setError("จุดส่งต้องไม่เหมือนจุดรับ กรุณาเลือกสถานที่อื่น");
      return;
    }
    setError(null);
    setDropoff({
      address: loc.address,
      sub: loc.sub,
      latitude: loc.lat,
      longitude: loc.lng,
      tag: loc.tag,
    });
    go("vehicle-type");
  };

  const pickCurrent = () => {
    if (draft.pickup && draft.pickup.latitude === 13.7563) {
      setError("จุดส่งต้องไม่เหมือนจุดรับ");
      return;
    }
    setError(null);
    setDropoff({
      address: "ตำแหน่งปัจจุบันของคุณ",
      sub: "GPS",
      latitude: 13.7234,
      longitude: 100.5345,
      tag: "GPS",
    });
    go("vehicle-type");
  };

  return (
    <div className="relative flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex items-center justify-between px-3 py-1">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          ขั้นที่ 2 จาก 5
        </span>
        <div className="w-9" />
      </div>
      <StepIndicator current={2} />

      <div className="px-5 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink">ส่งที่ไหน?</h1>
        <p className="-mt-1 text-[12px] text-ink-muted">
          ระบุจุดส่งสินค้า จุดส่งต้องไม่เหมือนจุดรับ
        </p>
      </div>

      {/* current pickup reminder */}
      <div className="mx-5 mb-2 flex items-center gap-2 rounded-xl bg-surface px-3 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-jumbo">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] text-ink-muted">จุดรับ</p>
          <p className="truncate text-[12px] font-semibold text-ink">
            {draft.pickup?.address ?? "—"}
          </p>
        </div>
      </div>

      {/* search */}
      <div className="px-5 py-2">
        <div className="flex items-center rounded-xl border-2 border-jumbo bg-white px-3">
          <Search className="h-4 w-4 text-jumbo" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสถานที่ส่ง"
            className="ml-2 flex-1 bg-transparent py-3 text-[14px] outline-none placeholder:text-ink-muted/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full p-1"
              aria-label="ล้าง"
            >
              <X className="h-4 w-4 text-ink-muted" />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={pickCurrent}
        className="mx-5 mb-2 flex items-center gap-3 rounded-xl bg-jumbo-light p-3 text-left"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jumbo text-white">
          <Navigation className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-jumbo">
            ใช้ตำแหน่งปัจจุบัน
          </p>
          <p className="text-[11px] text-ink-muted">
            ระบบจะปักหมุดจาก GPS ของคุณ
          </p>
        </div>
      </button>

      {/* map preview with route */}
      <div className="relative mx-5 mb-2 h-36 overflow-hidden rounded-2xl border border-line">
        <div className="bg-grid absolute inset-0 bg-surface" />
        <svg
          viewBox="0 0 300 140"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M0 50 L300 60" stroke="#fff" strokeWidth="8" />
          <path d="M100 0 L120 140" stroke="#fff" strokeWidth="6" />
          <path
            d="M50 30 Q160 70 250 110"
            stroke="#ED1C24"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6 4"
          />
          {/* pickup pin */}
          <g transform="translate(50 30)">
            <circle r="6" fill="#16A34A" />
            <circle r="2" fill="#fff" />
          </g>
          {/* dropoff pin */}
          <g transform="translate(250 110)">
            <circle r="18" fill="#ED1C2422" className="animate-jumbo-pulse" />
            <path
              d="M0 -10 L6 -2 L0 8 L-6 -2 Z"
              fill="#ED1C24"
              transform="translate(0 -2)"
            />
          </g>
        </svg>
        <div className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink shadow">
          เส้นทางเบื้องต้น
        </div>
      </div>

      {error && (
        <div className="mx-5 mb-2 flex items-center gap-2 rounded-lg bg-jumbo-light px-3 py-2 text-[12px] text-jumbo-dark">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* recent list */}
      <div className="flex-1 overflow-y-auto px-5 pb-3 scrollbar-hide">
        <p className="mb-2 text-[12px] font-bold text-ink-muted">
          {query ? "ผลการค้นหา" : "สถานที่ล่าสุด"}
        </p>
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface p-6 text-center">
              <p className="text-[13px] text-ink-muted">
                ไม่พบสถานที่ที่ต้องการ
              </p>
            </div>
          ) : (
            filtered.map((loc) => {
              const selected = draft.dropoff?.address === loc.address;
              return (
                <button
                  key={loc.name}
                  onClick={() => select(loc)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-jumbo bg-jumbo-light"
                      : "border-line bg-white active:bg-surface"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo-light">
                    <MapPin className="h-4 w-4 text-jumbo" />
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      {loc.name} • {loc.tag}
                    </p>
                    <p className="truncate text-[11px] text-ink-muted">
                      {loc.address}
                    </p>
                  </div>
                  {selected && (
                    <Check className="h-5 w-5 text-jumbo" strokeWidth={3} />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() => (draft.dropoff ? go("vehicle-type") : pickCurrent())}
          disabled={!draft.dropoff}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98] disabled:opacity-50"
        >
          ยืนยันจุดส่งและดำเนินการต่อ
        </button>
      </div>
    </div>
  );
}
