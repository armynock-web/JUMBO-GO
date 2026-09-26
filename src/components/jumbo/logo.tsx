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
      <img
        src="/images/brand/logo.jpg"
        alt="JUMBO GO Logo"
        width={size}
        height={size}
        className="rounded-2xl object-contain shadow-sm"
      />
      {showWord && (
        <div className="flex items-center gap-1.5 -mt-0.5">
          <span
            className="font-extrabold italic tracking-tight text-ink"
            style={{ fontSize: size * 0.24, lineHeight: 1 }}
          >
            JUMBO
          </span>
          <span
            className="font-extrabold italic tracking-tight text-white px-2 py-0.5 rounded-md"
            style={{
              fontSize: size * 0.24,
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
      <img
        src="/images/brand/app-icon.jpg"
        alt="JUMBO GO"
        className="h-8 w-8 rounded-lg object-contain shadow-xs"
      />
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
