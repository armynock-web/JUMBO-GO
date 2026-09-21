"use client";

import { useMemo, useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import {
  ALL_NOTIFICATIONS,
  CATEGORY_GROUPS,
  CATEGORY_META,
  PRIORITY_META,
  getNotificationsByRole,
  countUnread,
  type NotificationRole,
} from "@/lib/notifications";
import {
  Bell,
  Settings,
  Check,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Navigation,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Wallet,
  AlertTriangle,
  FileText,
  Pencil,
  Clock,
  Banknote,
  ShieldCheck,
  Megaphone,
  AlertOctagon,
  MessageSquareWarning,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  UserCheck,
  Navigation,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Wallet,
  AlertTriangle,
  Bell,
  FileText,
  Pencil,
  Clock,
  Banknote,
  ShieldCheck,
  Megaphone,
  AlertOctagon,
  MessageSquareWarning,
  ShieldAlert,
};

export function NotificationsScreen() {
  const mode = useJumbo((s) => s.mode);
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);

  // Map UI mode -> notification role
  const role: NotificationRole =
    mode === "driver" ? "driver" : mode === "admin" ? "admin" : "customer";

  // In user mode, bottom nav handles navigation. In driver/admin, show back button.
  const showBack = mode !== "user";

  const allForRole = useMemo(() => getNotificationsByRole(role), [role]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("all"); // 'all' | group.key

  const unreadCount = useMemo(
    () => allForRole.filter((n) => n.unread && !readIds.has(n.id)).length,
    [allForRole, readIds],
  );

  const groups = CATEGORY_GROUPS[role];

  const filtered = useMemo(() => {
    if (filter === "all") return allForRole;
    const g = groups.find((x) => x.key === filter);
    if (!g) return allForRole;
    return allForRole.filter((n) => g.categories.includes(n.category));
  }, [allForRole, filter, groups]);

  const markAllRead = () => {
    setReadIds(new Set(allForRole.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  // Role title + subtitle
  const meta = {
    customer: { title: "การแจ้งเตือน", sub: "อัปเดตสถานะงานและการเงิน" },
    driver: { title: "การแจ้งเตือน Driver", sub: "งานใหม่ รายได้ และประกาศระบบ" },
    admin: { title: "การแจ้งเตือนระบบ", sub: "เหตุการณ์ที่ต้องตรวจสอบ" },
  }[role];

  // Unread first, then sort by priority (urgent > high > normal > low)
  const sorted = useMemo(() => {
    const order: Record<string, number> = {
      urgent: 0,
      high: 1,
      normal: 2,
      low: 3,
    };
    return [...filtered].sort((a, b) => {
      const aRead = readIds.has(a.id) || !a.unread;
      const bRead = readIds.has(b.id) || !b.unread;
      if (aRead !== bRead) return aRead ? 1 : -1;
      return order[a.priority] - order[b.priority];
    });
  }, [filtered, readIds]);

  const unreadList = sorted.filter((n) => n.unread && !readIds.has(n.id));
  const readList = sorted.filter((n) => !(n.unread && !readIds.has(n.id)));

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="bg-white px-5 pb-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={back}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
                aria-label="ย้อนกลับ"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-[20px] font-extrabold text-ink">{meta.title}</h1>
              <p className="-mt-1 text-[12px] text-ink-muted">{meta.sub}</p>
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
            aria-label="ตั้งค่า"
          >
            <Settings className="h-4 w-4 text-ink" />
          </button>
        </div>

        {/* summary bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-xl bg-jumbo-light px-3 py-2">
            <p className="text-[10px] font-medium text-jumbo-dark">ยังไม่อ่าน</p>
            <p className="text-[16px] font-extrabold text-jumbo">
              {unreadCount} รายการ
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-surface px-3 py-2">
            <p className="text-[10px] font-medium text-ink-muted">ทั้งหมด</p>
            <p className="text-[16px] font-extrabold text-ink">
              {allForRole.length} รายการ
            </p>
          </div>
        </div>
      </div>

      {/* filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white px-5 pb-3 scrollbar-hide">
        <FilterChip
          label="ทั้งหมด"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {groups.map((g) => (
          <FilterChip
            key={g.key}
            label={g.label}
            active={filter === g.key}
            onClick={() => setFilter(g.key)}
          />
        ))}
        <button
          onClick={markAllRead}
          className="ml-auto flex flex-shrink-0 items-center gap-1 text-[11px] font-bold text-jumbo"
        >
          <Check className="h-3.5 w-3.5" /> อ่านทั้งหมด
        </button>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        {sorted.length === 0 ? (
          <EmptyState role={role} />
        ) : (
          <>
            {unreadList.length > 0 && (
              <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-jumbo">
                ใหม่ ({unreadList.length})
              </p>
            )}
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {unreadList.map((n) => (
                  <NotificationCard
                    key={n.id}
                    n={n}
                    isRead={false}
                    onAction={() => {
                      markRead(n.id);
                      if (n.action?.target) go(n.action.target as never);
                    }}
                    onMarkRead={() => markRead(n.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {readList.length > 0 && (
              <>
                <p className="mb-1.5 mt-3 px-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  อ่านแล้ว ({readList.length})
                </p>
                <div className="flex flex-col gap-2">
                  {readList.map((n) => (
                    <NotificationCard
                      key={n.id}
                      n={n}
                      isRead={true}
                      onAction={() => {
                        if (n.action?.target) go(n.action.target as never);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition ${
        active ? "bg-jumbo text-white" : "bg-surface text-ink-muted"
      }`}
    >
      {label}
    </button>
  );
}

function NotificationCard({
  n,
  isRead,
  onAction,
  onMarkRead,
}: {
  n: (typeof ALL_NOTIFICATIONS)[number];
  isRead: boolean;
  onAction?: () => void;
  onMarkRead?: () => void;
}) {
  const meta = CATEGORY_META[n.category];
  const prio = PRIORITY_META[n.priority];
  const Icon = ICON_MAP[meta.icon] ?? Bell;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-start gap-3 rounded-2xl border p-3 ${
        isRead
          ? "border-line bg-white"
          : n.priority === "urgent"
            ? "border-jumbo bg-jumbo-light"
            : "border-amber-200 bg-amber-50"
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${meta.bg} text-white`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-bold leading-tight text-ink">
            {n.title}
          </p>
          {!isRead && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-jumbo" />
          )}
        </div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">
          {n.body}
        </p>

        {/* meta row */}
        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
          <span
            className={`rounded-full px-2 py-0.5 font-bold ${prio.bg} ${prio.color}`}
          >
            {prio.label}
          </span>
          {n.jobId && (
            <span className="text-ink-muted">
              {n.jobId}
            </span>
          )}
          {n.amount !== undefined && (
            <span className="font-bold text-jumbo">
              ฿{n.amount.toLocaleString()}
            </span>
          )}
          <span className="text-ink-muted">{n.time}</span>
        </div>

        {/* action */}
        {n.action && (
          <button
            onClick={onAction}
            className="mt-2 flex items-center gap-1 rounded-lg bg-jumbo px-3 py-1.5 text-[11px] font-bold text-white"
          >
            {n.action.label}
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* swipe-to-read indicator */}
      {!isRead && onMarkRead && (
        <button
          onClick={onMarkRead}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80"
          aria-label="ทำเครื่องหมายว่าอ่านแล้ว"
        >
          <Check className="h-3 w-3 text-jumbo" strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );
}

function EmptyState({ role }: { role: NotificationRole }) {
  const msg = {
    customer: "ยังไม่มีการแจ้งเตือน คุณจะได้รับแจ้งเมื่อมีคนขับรับงานหรือสถานะเปลี่ยน",
    driver: "ยังไม่มีการแจ้งเตือน เปิดรับงานเพื่อรับงานใหม่ใกล้ตัว",
    admin: "ไม่มีเหตุการณ์ผิดปกติ ระบบทำงานปกติ",
  }[role];
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
      <Bell className="mx-auto h-8 w-8 text-ink-muted" />
      <p className="mt-2 text-[13px] text-ink-muted">{msg}</p>
    </div>
  );
}
