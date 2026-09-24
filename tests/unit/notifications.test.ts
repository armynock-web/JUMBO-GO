import { describe, it, expect } from "vitest";
import {
  CUSTOMER_NOTIFICATIONS,
  DRIVER_NOTIFICATIONS,
  ADMIN_NOTIFICATIONS,
  ALL_NOTIFICATIONS,
  getNotificationsByRole,
  countUnread,
  CATEGORY_GROUPS,
  CATEGORY_META,
  PRIORITY_META,
  type NotificationRole,
  type NotificationCategory,
  type NotificationPriority,
} from "@/lib/notifications";

describe("notification dataset structure", () => {
  it("has 10 customer, 9 driver, 5 admin notifications", () => {
    expect(CUSTOMER_NOTIFICATIONS).toHaveLength(10);
    expect(DRIVER_NOTIFICATIONS).toHaveLength(9);
    expect(ADMIN_NOTIFICATIONS).toHaveLength(5);
    expect(ALL_NOTIFICATIONS).toHaveLength(24);
  });

  it("every notification has valid role, priority, category, title and body", () => {
    const roles = new Set<NotificationRole>(["customer", "driver", "admin"]);
    const priorities = new Set<NotificationPriority>(["low", "normal", "high", "urgent"]);
    for (const n of ALL_NOTIFICATIONS) {
      expect(roles.has(n.role)).toBe(true);
      expect(priorities.has(n.priority)).toBe(true);
      expect(n.title).toBeTruthy();
      expect(n.body).toBeTruthy();
      expect(n.id).toBeTruthy();
      expect(typeof n.unread).toBe("boolean");
    }
  });

  it("amount is present only for money-related categories", () => {
    const moneyCategories = new Set<NotificationCategory>([
      "job_completed",
      "payment_due",
      "new_job_nearby",
      "job_details",
      "earnings",
      "payment_issue",
    ]);
    for (const n of ALL_NOTIFICATIONS) {
      if (moneyCategories.has(n.category)) {
        expect(n.amount).toBeGreaterThan(0);
      } else {
        expect(n.amount).toBeUndefined();
      }
    }
  });
});

describe("getNotificationsByRole / countUnread", () => {
  it("returns role-scoped notifications only", () => {
    expect(getNotificationsByRole("customer")).toHaveLength(10);
    expect(getNotificationsByRole("driver")).toHaveLength(9);
    expect(getNotificationsByRole("admin")).toHaveLength(5);
    for (const n of getNotificationsByRole("driver")) {
      expect(n.role).toBe("driver");
    }
  });

  it("countUnread counts only unread within role", () => {
    const unreadDriver = countUnread("driver");
    expect(unreadDriver).toBe(
      DRIVER_NOTIFICATIONS.filter((n) => n.unread).length
    );
    expect(unreadDriver).toBeGreaterThan(0);
    expect(countUnread("admin")).toBe(ADMIN_NOTIFICATIONS.filter((n) => n.unread).length);
  });
});

describe("CATEGORY_GROUPS / CATEGORY_META / PRIORITY_META", () => {
  it("all categories classified in groups and have metadata", () => {
    const groupedCategories = new Set<NotificationCategory>();
    for (const role of Object.keys(CATEGORY_GROUPS) as NotificationRole[]) {
      for (const group of CATEGORY_GROUPS[role]) {
        for (const cat of group.categories) {
          groupedCategories.add(cat);
          expect(CATEGORY_META[cat]).toBeDefined();
        }
      }
    }
    const allCategories = new Set(ALL_NOTIFICATIONS.map((n) => n.category));
    expect(groupedCategories).toEqual(allCategories);
  });

  it("customer job_status group includes arrival stages", () => {
    const customerGroups = CATEGORY_GROUPS.customer;
    const jobStatus = customerGroups.find((g) => g.key === "job_status");
    expect(jobStatus?.categories).toContain("arrived_pickup");
    expect(jobStatus?.categories).toContain("job_completed");
  });

  it("priority meta has labels for all priorities", () => {
    for (const p of Object.keys(PRIORITY_META) as NotificationPriority[]) {
      expect(PRIORITY_META[p].label).toBeTruthy();
      expect(PRIORITY_META[p].color).toContain("text-");
    }
  });
});