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
  | "driver-earnings" // D16
  | "driver-history" // D17
  | "driver-profile" // D18
  // Admin screens A01-A11
  | "admin-login" // A01
  | "admin-dashboard" // A02
  | "admin-users" // A03
  | "admin-drivers" // A04
  | "admin-kyc" // A05
  | "admin-vehicles" // A06
  | "admin-jobs" // A07
  | "admin-pricing" // A08
  | "admin-payments" // A09
  | "admin-reports" // A10
  | "admin-settings"; // A11

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
  // actions
  setMode: (m: Mode) => void;
  go: (s: ScreenId) => void;
  back: () => void;
  resetFlow: () => void;
  setPickup: (p: LocationPoint) => void;
  setDropoff: (p: LocationPoint) => void;
  setVehicle: (v: VehicleType) => void;
  setPrice: (km: number, price: number) => void;
  setSearchProgress: (n: number) => void;
  setTrackingStep: (n: number) => void;
  setKycStep: (n: number) => void;
  submitKyc: () => void;
  toggleDriverOnline: () => void;
  login: () => void;
  logout: () => void;
};

const initialDraft: BookingDraft = {
  pickup: null,
  dropoff: null,
  vehicleType: null,
  distanceKm: null,
  estimatedPrice: null,
  waitFee: 0,
  expresswayFee: 0,
};

export const useJumbo = create<JumboState>((set) => ({
  mode: "user",
  screen: "splash",
  history: [],
  draft: initialDraft,
  isAuthenticated: false,
  searchProgress: 0,
  trackingStep: 0,
  kycStep: 1,
  kycSubmitted: false,
  driverOnline: false,

  setMode: (m) =>
    set({
      mode: m,
      screen:
        m === "user"
          ? "splash"
          : m === "driver"
            ? "driver-register"
            : "admin-login",
      history: [],
      draft: { ...initialDraft },
      kycStep: 1,
      kycSubmitted: false,
      driverOnline: false,
    }),

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
  setSearchProgress: (n) => set({ searchProgress: n }),
  setTrackingStep: (n) => set({ trackingStep: n }),
  setKycStep: (n) => set({ kycStep: Math.max(1, Math.min(10, n)) }),
  submitKyc: () => set({ kycSubmitted: true }),
  toggleDriverOnline: () => set((st) => ({ driverOnline: !st.driverOnline })),

  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({
      isAuthenticated: false,
      screen: "splash",
      history: [],
      draft: { ...initialDraft },
      kycStep: 1,
      kycSubmitted: false,
      driverOnline: false,
    }),
}));
