"use client";

import { create } from "zustand";
import type { VehicleType } from "@/lib/brand";

export type Mode = "user" | "driver" | "admin";

// All screen IDs across the 3 actors in the JUMBO GO blueprint
export type ScreenId =
  // User screens U01-U18
  | "splash"
  | "onboarding"
  | "login"
  | "register"
  | "verify-otp"
  | "home"
  | "pickup"
  | "dropoff"
  | "vehicle-type"
  | "summary"
  | "confirm"
  | "searching"
  | "driver-found"
  | "tracking"
  | "completed"
  | "jobs"
  | "job-detail" // U16 /jobs/[jobId]
  | "notifications"
  | "profile"
  | "support"
  // Driver screens D01-D18
  | "driver-register"
  | "driver-login"
  | "driver-onboarding" // stepper shell (D03-D12)
  | "driver-onboarding-status" // D13
  | "driver-dashboard" // D14
  | "driver-jobs" // D15
  | "driver-job-detail" // D16 /driver/jobs/[jobId]
  | "driver-earnings" // D17
  | "driver-history" // D18
  | "driver-profile" // D19
  // Admin screens A01-A15
  | "admin-login" // A01
  | "admin-dashboard" // A02
  | "admin-users" // A03
  | "admin-drivers" // A04
  | "admin-driver-detail" // A05 /admin/drivers/[id]
  | "admin-kyc" // A06
  | "admin-vehicles" // A08
  | "admin-jobs" // A09
  | "admin-job-detail" // A10 /admin/jobs/[id]
  | "admin-pricing" // A11
  | "admin-payments" // A12
  | "admin-reports" // A13
  | "admin-notifications" // A14
  | "admin-settings"; // A15

export type LocationPoint = {
  address: string;
  sub?: string;
  note?: string;
  latitude: number;
  longitude: number;
  tag?: string;
};

export type BookingDraft = {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  vehicleType: VehicleType | null;
  distanceKm: number | null;
  estimatedPrice: number | null;
  waitFee: number;
  expresswayFee: number;
  activeBookingId?: string | null;
  activeJobNumber?: string | null;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  hasHelper: boolean;
  hasExpressway: boolean;
  scheduleTime: string;
  routeCoordinates: [number, number][];
  durationMinutes: number;
};

type JumboState = {
  mode: Mode;
  screen: ScreenId;
  history: ScreenId[];
  draft: BookingDraft;
  isAuthenticated: boolean;
  searchProgress: number;
  trackingStep: number;
  // driver onboarding step (1-10)
  kycStep: number;
  kycSubmitted: boolean;
  driverOnline: boolean;
  isAdminAuthenticated: boolean;
  // actions
  setMode: (m: Mode) => void;
  go: (s: ScreenId) => void;
  back: () => void;
  resetFlow: () => void;
  setPickup: (p: LocationPoint) => void;
  setDropoff: (p: LocationPoint) => void;
  setVehicle: (v: VehicleType) => void;
  setPrice: (km: number, price: number) => void;
  updateDraft: (fields: Partial<BookingDraft>) => void;
  setActiveBooking: (id: string, jobNumber: string) => void;
  setSearchProgress: (n: number) => void;
  setTrackingStep: (n: number) => void;
  setKycStep: (n: number) => void;
  submitKyc: () => void;
  toggleDriverOnline: () => void;
  setAdminAuthenticated: (val: boolean) => void;
  login: () => void;
  logout: () => void;
};

const initialDraft: BookingDraft = {
  pickup: {
    address: "สยามพารากอน (จุดรับสินค้า)",
    sub: "991 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ",
    latitude: 13.7462,
    longitude: 100.5347,
  },
  dropoff: {
    address: "เมกาบางนา (จุดส่งสินค้า)",
    sub: "39 หมู่ 6 ถ.บางนา-ตราด กม.8 บางพลี สมุทรปราการ",
    latitude: 13.6467,
    longitude: 100.6802,
  },
  vehicleType: "JUMBO",
  distanceKm: 18.2,
  estimatedPrice: 619,
  waitFee: 0,
  expresswayFee: 50,
  senderName: "สมหญิง ใจเย็น",
  senderPhone: "082-345-6789",
  receiverName: "ผู้รับสินค้าปลายทาง",
  receiverPhone: "081-999-8888",
  hasHelper: false,
  hasExpressway: true,
  scheduleTime: "immediate",
  routeCoordinates: [],
  durationMinutes: 32,
};

export const useJumbo = create<JumboState>((set) => ({
  mode: "user",
  screen: "home",
  history: [],
  draft: initialDraft,
  isAuthenticated: true,
  searchProgress: 0,
  trackingStep: 0,
  kycStep: 1,
  kycSubmitted: false,
  driverOnline: false,
  isAdminAuthenticated: false,

  setMode: (m) =>
    set((st) => ({
      mode: m,
      screen:
        m === "user"
          ? "home"
          : m === "driver"
            ? "driver-dashboard"
            : st.isAdminAuthenticated
              ? "admin-dashboard"
              : "admin-login",
      history: [],
      draft: { ...initialDraft },
      kycStep: 1,
      kycSubmitted: false,
      driverOnline: false,
    })),

  go: (s) =>
    set((st) => ({
      screen: s,
      history: [...st.history, st.screen].slice(-16),
    })),
  back: () =>
    set((st) => {
      const hist = [...st.history];
      const prev = hist.pop();
      return { screen: prev ?? "home", history: hist };
    }),
  resetFlow: () =>
    set({ draft: { ...initialDraft }, searchProgress: 0, trackingStep: 0 }),

  setPickup: (p) => set((st) => ({ draft: { ...st.draft, pickup: p } })),
  setDropoff: (p) => set((st) => ({ draft: { ...st.draft, dropoff: p } })),
  setVehicle: (v) => set((st) => ({ draft: { ...st.draft, vehicleType: v } })),
  setPrice: (km, price) =>
    set((st) => ({
      draft: { ...st.draft, distanceKm: km, estimatedPrice: price },
    })),
  updateDraft: (fields) =>
    set((st) => ({
      draft: { ...st.draft, ...fields },
    })),
  setActiveBooking: (id, jobNumber) =>
    set((st) => ({
      draft: { ...st.draft, activeBookingId: id, activeJobNumber: jobNumber },
    })),
  setSearchProgress: (n) => set({ searchProgress: n }),
  setTrackingStep: (n) => set({ trackingStep: n }),
  setKycStep: (n) => set({ kycStep: Math.max(1, Math.min(10, n)) }),
  submitKyc: () => set({ kycSubmitted: true }),
  toggleDriverOnline: () => set((st) => ({ driverOnline: !st.driverOnline })),
  setAdminAuthenticated: (val) => set({ isAdminAuthenticated: val }),

  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set((st) => ({
      isAuthenticated: false,
      isAdminAuthenticated: false,
      screen:
        st.mode === "admin"
          ? "admin-login"
          : st.mode === "driver"
            ? "driver-login"
            : "home",
      history: [],
      draft: { ...initialDraft },
      kycStep: 1,
      kycSubmitted: false,
      driverOnline: false,
    })),
}));
