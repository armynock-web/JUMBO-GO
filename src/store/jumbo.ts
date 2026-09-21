"use client";

import { create } from "zustand";
import type { VehicleType } from "@/lib/brand";

// All screen IDs in the JUMBO GO blueprint that we expose in the showcase
export type ScreenId =
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
  | "support";

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
  // navigation
  screen: ScreenId;
  history: ScreenId[];
  // booking
  draft: BookingDraft;
  // fake auth
  isAuthenticated: boolean;
  // driver searching progress (0-100)
  searchProgress: number;
  // tracking timeline step (index into JOB_TIMELINE)
  trackingStep: number;
  // actions
  go: (s: ScreenId) => void;
  back: () => void;
  resetFlow: () => void;
  setPickup: (p: LocationPoint) => void;
  setDropoff: (p: LocationPoint) => void;
  setVehicle: (v: VehicleType) => void;
  setPrice: (km: number, price: number) => void;
  setSearchProgress: (n: number) => void;
  setTrackingStep: (n: number) => void;
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
  screen: "splash",
  history: [],
  draft: initialDraft,
  isAuthenticated: false,
  searchProgress: 0,
  trackingStep: 0,

  go: (s) =>
    set((st) => ({
      screen: s,
      history: [...st.history, st.screen].slice(-12),
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

  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({
      isAuthenticated: false,
      screen: "splash",
      history: [],
      draft: { ...initialDraft },
    }),
}));
