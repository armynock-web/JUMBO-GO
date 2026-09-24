import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";

// ============================================================
// Mock client Supabase (ฝั่ง browser) สำหรับทดสอบ Realtime
// Subscription logic ของ api.subscribeToDriverLocation /
// subscribeToBookingStatus โดยไม่ต้องเชื่อม WebSocket จริง
// ============================================================

type subscriptionCallback = (payload: {
  eventType: "UPDATE";
  new: Record<string, unknown>;
}) => void;

const h = vi.hoisted(() => {
  const listeners = new Map<string, subscriptionCallback[]>();
  const removeChannelCalls: RealtimeChannel[] = [];
  const channelNames: string[] = [];

  const createFakeChannel = (name: string): RealtimeChannel => {
    const ch = {
      name,
      on: vi.fn((_event: string, opts: unknown, callback: subscriptionCallback) => {
        const key = (opts as { filter?: string }).filter ?? "";
        listeners.set(key, [...(listeners.get(key) ?? []), callback]);
        return ch;
      }),
      subscribe: vi.fn(() => ch),
    } as unknown as RealtimeChannel;
    return ch;
  };

  return {
    listeners,
    removeChannelCalls,
    channelNames,
    createFakeChannel,
  };
});

const fakeRemoveChannel = vi.fn((channel: RealtimeChannel) => {
  h.removeChannelCalls.push(channel);
  return Promise.resolve("ok");
});

vi.mock("@/lib/supabase/client", () => {
  const mockChannel = vi.fn((name: string) => {
    h.channelNames.push(name);
    return h.createFakeChannel(name);
  });
  const mockRemoveChannel = vi.fn((channel: RealtimeChannel) => {
    h.removeChannelCalls.push(channel);
    return Promise.resolve("ok");
  });
  return {
    supabase: {
      channel: mockChannel,
      removeChannel: mockRemoveChannel,
    } as unknown as SupabaseClient,
  };
});

// import ต้องอยู่หลัง vi.mock
import { api } from "@/lib/api";

describe("api.subscribeToDriverLocation", () => {
  beforeEach(() => {
    h.listeners.clear();
    h.channelNames.length = 0;
    h.removeChannelCalls.length = 0;
    fakeRemoveChannel.mockClear();
  });

  it("subscribes to driver UPDATE channel and invokes onUpdate with coords", () => {
    const onUpdate = vi.fn();
    const unsubscribe = api.subscribeToDriverLocation("driver-1", onUpdate);

    expect(h.channelNames).toContain("driver_location_driver-1");
    expect(onUpdate).not.toHaveBeenCalled();

    const key = "id=eq.driver-1";
    const cb = h.listeners.get(key)?.[0];
    expect(cb).toBeDefined();
    cb?.({
      eventType: "UPDATE",
      new: { current_location_lat: 13.5, current_location_lng: 100.9 },
    });
    expect(onUpdate).toHaveBeenCalledWith({ lat: 13.5, lng: 100.9 });
  });

  it("ignores payloads without lat/lng and returns unsubscribe that removes channel", () => {
    const onUpdate = vi.fn();
    const unsubscribe = api.subscribeToDriverLocation("driver-lost", onUpdate);

    const key = "id=eq.driver-lost";
    const cb = h.listeners.get(key)?.[0];
    cb?.({ eventType: "UPDATE", new: {} });
    cb?.({ eventType: "UPDATE", new: { current_location_lat: 0, current_location_lng: 100 } });
    expect(onUpdate).not.toHaveBeenCalled();

    unsubscribe();
    expect(h.removeChannelCalls).toHaveLength(1);
  });
});

describe("api.subscribeToBookingStatus", () => {
  beforeEach(() => {
    h.listeners.clear();
    h.channelNames.length = 0;
    h.removeChannelCalls.length = 0;
  });

  it("subscribes to booking UPDATE channel and forwards new row", () => {
    const onStatusChange = vi.fn();
    const unsubscribe = api.subscribeToBookingStatus("booking-9", onStatusChange);

    expect(h.channelNames).toContain("booking_status_booking-9");

    const key = "id=eq.booking-9";
    const cb = h.listeners.get(key)?.[0];
    expect(cb).toBeDefined();
    cb?.({
      eventType: "UPDATE",
      new: { id: "booking-9", status: "in_transit" },
    });
    expect(onStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "booking-9", status: "in_transit" })
    );

    unsubscribe();
    expect(
      (h.removeChannelCalls[0] as unknown as { name?: string } | undefined)?.name
    ).toBe("booking_status_booking-9");
  });
});