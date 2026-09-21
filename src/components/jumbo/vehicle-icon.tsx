"use client";

import type { VehicleType } from "@/lib/brand";
import { cn } from "@/lib/utils";

// Simple line-art truck illustrations in white (for dark backgrounds) or dark (for light backgrounds)
export function VehicleIcon({
  type,
  className,
  color = "#111111",
}: {
  type: VehicleType;
  className?: string;
  color?: string;
}) {
  const stroke = color;
  const fill = "none";
  const sw = 2.2;

  switch (type) {
    case "PICKUP":
      // pickup truck: cab + open bed
      return (
        <svg
          viewBox="0 0 64 40"
          className={className}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 28 L4 22 L20 22 L22 16 L34 16 L36 22 L46 22 L46 28 Z" />
          <path d="M46 28 L46 22 L56 22 L60 28 L60 32 L46 32 Z" />
          <path d="M4 28 L60 28" />
          <circle cx="16" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="50" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="16" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="50" cy="32" r="2" fill="#fff" stroke="none" />
        </svg>
      );
    case "CLOSED_PICKUP":
      // closed pickup: cab + closed box
      return (
        <svg
          viewBox="0 0 64 40"
          className={className}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 28 L4 22 L20 22 L22 16 L34 16 L36 22 L46 22 L46 28 Z" />
          <path d="M46 28 L46 14 L58 14 L58 28 Z" />
          <path d="M4 28 L58 28" />
          <line x1="52" y1="14" x2="52" y2="28" />
          <circle cx="16" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="50" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="16" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="50" cy="32" r="2" fill="#fff" stroke="none" />
        </svg>
      );
    case "CAGE_PICKUP":
      // cage pickup: cab + cage rails
      return (
        <svg
          viewBox="0 0 64 40"
          className={className}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 28 L4 22 L20 22 L22 16 L34 16 L36 22 L46 22 L46 28 Z" />
          <path d="M46 28 L46 14 L58 14 L58 28 Z" />
          <path d="M4 28 L60 28" />
          {/* cage bars */}
          <line x1="50" y1="14" x2="50" y2="28" />
          <line x1="54" y1="14" x2="54" y2="28" />
          <line x1="46" y1="20" x2="58" y2="20" />
          <circle cx="16" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="50" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="16" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="50" cy="32" r="2" fill="#fff" stroke="none" />
        </svg>
      );
    case "JUMBO":
      // bigger truck: cab + long box
      return (
        <svg
          viewBox="0 0 72 40"
          className={className}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 30 L4 22 L18 22 L20 16 L30 16 L32 22 L42 22 L42 30 Z" />
          <path d="M42 30 L42 12 L66 12 L66 30 Z" />
          <path d="M4 30 L66 30" />
          <line x1="54" y1="12" x2="54" y2="30" />
          <circle cx="14" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="34" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="58" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="14" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="34" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="58" cy="32" r="2" fill="#fff" stroke="none" />
        </svg>
      );
    case "SIX_WHEEL":
      // 6 wheel truck: bigger
      return (
        <svg
          viewBox="0 0 76 40"
          className={className}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 30 L4 22 L16 22 L18 16 L26 16 L28 22 L38 22 L38 30 Z" />
          <path d="M38 30 L38 10 L70 10 L70 30 Z" />
          <path d="M4 30 L70 30" />
          <line x1="49" y1="10" x2="49" y2="30" />
          <line x1="59" y1="10" x2="59" y2="30" />
          <circle cx="12" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="30" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="46" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="62" cy="32" r="5" fill={stroke} stroke="none" />
          <circle cx="12" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="30" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="46" cy="32" r="2" fill="#fff" stroke="none" />
          <circle cx="62" cy="32" r="2" fill="#fff" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

// Big illustrated truck used on hero / promo
export function HeroTruck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* cargo box */}
      <rect
        x="60"
        y="30"
        width="110"
        height="42"
        rx="4"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="2"
      />
      <line x1="115" y1="30" x2="115" y2="72" stroke="#111111" strokeWidth="1.5" />
      <line x1="140" y1="30" x2="140" y2="72" stroke="#111111" strokeWidth="1.5" />
      {/* cab */}
      <path
        d="M10 72 L10 56 L26 56 L32 42 L52 42 L58 56 L60 56 L60 72 Z"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="34"
        y="46"
        width="18"
        height="10"
        rx="1.5"
        fill="#ED1C24"
        stroke="#111111"
        strokeWidth="1.5"
      />
      {/* bumper */}
      <rect x="8" y="68" width="54" height="6" rx="2" fill="#111111" />
      {/* wheels */}
      <circle cx="32" cy="76" r="9" fill="#111111" />
      <circle cx="32" cy="76" r="4" fill="#FFFFFF" />
      <circle cx="92" cy="76" r="9" fill="#111111" />
      <circle cx="92" cy="76" r="4" fill="#FFFFFF" />
      <circle cx="142" cy="76" r="9" fill="#111111" />
      <circle cx="142" cy="76" r="4" fill="#FFFFFF" />
      <circle cx="170" cy="76" r="9" fill="#111111" />
      <circle cx="170" cy="76" r="4" fill="#FFFFFF" />
    </svg>
  );
}
