"use client";

import { Home, ClipboardList, Bell, User, MessageSquare } from "lucide-react";
import { useJumbo, type ScreenId } from "@/store/jumbo";
import { cn } from "@/lib/utils";

const NAV_ITEMS: {
  key: string;
  label: string;
  icon: React.ElementType;
  screen: ScreenId;
}[] = [
  { key: "home", label: "หน้าหลัก", icon: Home, screen: "home" },
  { key: "jobs", label: "ประวัติงาน", icon: ClipboardList, screen: "jobs" },
  { key: "chat", label: "แชท", icon: MessageSquare, screen: "support" },
  { key: "notifications", label: "แจ้งเตือน", icon: Bell, screen: "notifications" },
  { key: "profile", label: "บัญชีของฉัน", icon: User, screen: "profile" },
];

export function BottomNav() {
  const screen = useJumbo((s) => s.screen);
  const go = useJumbo((s) => s.go);

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 backdrop-blur-md">
      <div className="flex items-stretch justify-between px-1.5 pb-2 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const active = screen === item.screen;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => go(item.screen)}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition active:scale-95"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-jumbo" : "text-ink-muted",
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-colors",
                  active ? "text-jumbo" : "text-ink-muted",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS home indicator */}
      <div className="mx-auto mb-1 h-1 w-28 rounded-full bg-ink/30" />
    </nav>
  );
}
