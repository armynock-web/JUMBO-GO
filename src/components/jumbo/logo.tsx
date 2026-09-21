"use client";

import { cn } from "@/lib/utils";

// JUMBO GO logo: black "G" with a red arrow cutting through, + wordmark
// "JUMBO" black + "GO" white in red rounded box. Matches the brand image.
export function JumboLogo({
  className,
  showWord = true,
  size = 120,
}: {
  className?: string;
  showWord?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="JUMBO GO logo"
      >
        {/* Black rounded square background */}
        <rect x="6" y="6" width="108" height="108" rx="24" fill="#111111" />
        {/* The "G" shape - black on black bg so we use white-ish outline via the arrow */}
        <path
          d="M82 36 C72 28 60 24 48 26 C30 29 16 43 14 60 C12 77 22 92 38 98 C54 104 72 100 82 90 L82 70 L56 70"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Red arrow cutting through the G to the right */}
        <g>
          <path
            d="M58 60 L98 60"
            stroke="#ED1C24"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M86 48 L100 60 L86 72"
            stroke="#ED1C24"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
      {showWord && (
        <div className="flex items-center gap-1.5 -mt-1">
          <span
            className="font-extrabold italic tracking-tight text-ink"
            style={{ fontSize: size * 0.28, lineHeight: 1 }}
          >
            JUMBO
          </span>
          <span
            className="font-extrabold italic tracking-tight text-white px-2 py-0.5 rounded-md"
            style={{
              fontSize: size * 0.28,
              lineHeight: 1,
              background: "#ED1C24",
            }}
          >
            GO
          </span>
        </div>
      )}
    </div>
  );
}

// Compact horizontal lockup (logo + word) for header
export function JumboLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width="34" height="34" viewBox="0 0 120 120" aria-hidden>
        <rect x="6" y="6" width="108" height="108" rx="24" fill="#FFFFFF" />
        <path
          d="M82 36 C72 28 60 24 48 26 C30 29 16 43 14 60 C12 77 22 92 38 98 C54 104 72 100 82 90 L82 70 L56 70"
          stroke="#111111"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M58 60 L98 60"
          stroke="#ED1C24"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M86 48 L100 60 L86 72"
          stroke="#ED1C24"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="flex items-center gap-1">
        <span className="font-extrabold italic tracking-tight text-ink text-xl leading-none">
          JUMBO
        </span>
        <span className="font-extrabold italic tracking-tight text-white px-1.5 py-0.5 rounded text-xl leading-none bg-jumbo">
          GO
        </span>
      </div>
    </div>
  );
}
