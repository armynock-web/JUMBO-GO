"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Step indicator for booking flow (Pickup → Dropoff → Vehicle → Summary → Confirm)
export function StepIndicator({
  current,
  total = 5,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 px-5 py-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <div
            key={i}
            className={cn(
              "flex flex-1 items-center gap-1.5",
              i < total - 1 ? "after:flex-1 after:h-0.5 after:rounded after:bg-line" : "",
              done ? "after:!bg-jumbo" : "",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                done
                  ? "bg-jumbo text-white"
                  : active
                    ? "bg-jumbo text-white ring-4 ring-jumbo-light"
                    : "bg-surface text-ink-muted",
              )}
            >
              {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
