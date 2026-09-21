"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable avatar component using SVG icons (no emoji per blueprint rule)
export function JumboAvatar({
  name,
  size = "md",
  className,
  icon: Icon = User,
}: {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ElementType;
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  const initials = name
    ? name
        .split(" ")
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join("")
    : null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-jumbo text-white",
        sizes[size],
        className,
      )}
    >
      {initials ? (
        <span className="font-bold text-white">{initials}</span>
      ) : (
        <Icon className={iconSizes[size]} strokeWidth={2.5} />
      )}
    </div>
  );
}

// Avatar with initial letter (for driver/customer avatars)
export function JumboAvatarInitial({
  initial,
  size = "md",
  className,
  bg = "bg-jumbo",
}: {
  initial: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  bg?: string;
}) {
  const sizes = {
    sm: "h-8 w-8 text-[12px]",
    md: "h-12 w-12 text-[16px]",
    lg: "h-16 w-16 text-[22px]",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white",
        sizes[size],
        bg,
        className,
      )}
    >
      {initial.charAt(0).toUpperCase()}
    </div>
  );
}
