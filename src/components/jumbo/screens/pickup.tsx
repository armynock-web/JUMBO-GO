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
  Map,
} from "lucide-react";

export function PickupScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const setPickup = useJumbo((s) => s.setPickup);
  const draft = useJumbo((s) => s.draft);
  const [query, setQuery] = useState("");

  const filtered = RECENT_LOCATIONS.filter((l) =>
    query
      ? (l.name + l.address + l.sub)
          .toLowerCase()
          .includes(query.toLowerCase())
      : true,
  );

  const select = (loc: (typeof RECENT_LOCATIONS)[number]) => {
    setPickup({
      address: loc.address,
      sub: loc.sub,
      latitude: loc.lat,
      longitude: loc.lng,
      tag: loc.tag,
    });
    go("dropoff");
  };

  const pickCurrent = () => {
    setPickup({
      address: "ตำแหน่งปัจจุบันของคุณ",
      sub: "GPS",
      latitude: 13.7563,
      longitude: 100.5018,
      tag: "GPS",
    });
    go("dropoff");
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
          ขั้นที่ 1 จาก 5
        </span>
        <div className="w-9" />
      </div>
      <StepIndicator current={1} />

      <div className="px-5 pb-2">
        <h1 className="text-[22px] font-extrabold text-ink">
          รับของที่ไหน?
        </h1>
        <p className="-mt-1 text-[12px] text-ink-muted">
          ระบุจุดรับสินค้า ค้นหาสถานที่ หรือใช้ตำแหน่งปัจจุบัน
        </p>
      </div>

      {/* search */}
      <div className="px-5 py-2">
        <div className="flex items-center rounded-xl border-2 border-jumbo bg-white px-3">
          <Search className="h-4 w-4 text-jumbo" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสถานที่ เช่น บ้าน ออฟฟิศ"
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

      {/* use current location */}
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

      {/* map preview */}
      <div className="relative mx-5 mb-2 h-32 overflow-hidden rounded-2xl border border-line">
        <div className="bg-grid absolute inset-0 bg-surface" />
        <svg
          viewBox="0 0 300 130"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* fake roads */}
          <path d="M0 50 L300 60" stroke="#fff" strokeWidth="8" />
          <path d="M0 90 L300 100" stroke="#fff" strokeWidth="6" />
          <path d="M100 0 L120 130" stroke="#fff" strokeWidth="6" />
          <path d="M220 0 L200 130" stroke="#fff" strokeWidth="5" />
          {/* pin */}
          <g transform="translate(150 65)">
            <circle r="18" fill="#ED1C2422" className="animate-jumbo-pulse" />
            <circle r="8" fill="#ED1C24" />
            <circle r="3" fill="#fff" />
          </g>
        </svg>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink shadow">
          <Map className="h-3 w-3 text-jumbo" />
          เลือกจุดบนแผนที่
        </div>
      </div>

      {/* recent list */}
      <div className="flex-1 overflow-y-auto px-5 pb-3 scrollbar-hide">
        <p className="mb-2 text-[12px] font-bold text-ink-muted">
          {query ? "ผลการค้นหา" : "สถานที่ล่าสุด"}
        </p>
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface p-6 text-center">
              <p className="text-[13px] text-ink-muted">
                ไม่พบสถานที่ “{query}”
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">
                ลองค้นหาคำอื่น หรือใช้ตำแหน่งปัจจุบัน
              </p>
            </div>
          ) : (
            filtered.map((loc) => {
              const selected = draft.pickup?.address === loc.address;
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

      {/* bottom CTA */}
      <div className="border-t border-line bg-white p-3">
        <button
          onClick={() =>
            draft.pickup ? go("dropoff") : pickCurrent()
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
        >
          {draft.pickup ? (
            <>
              ยืนยันจุดรับ <ChevronLeft className="h-5 w-5 rotate-180" />
            </>
          ) : (
            "ใช้ตำแหน่งปัจจุบันและดำเนินการต่อ"
          )}
        </button>
      </div>
    </div>
  );
}
