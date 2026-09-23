import { supabase } from "./client";
import { supabaseServer } from "./server";
import type { Database } from "./types";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type DriverRow = Database["public"]["Tables"]["drivers"]["Row"];
export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleTypeRow = Database["public"]["Tables"]["vehicle_types"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export const JumboRepository = {
  // === USERS ===
  async getUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async getUserByPhone(phone: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();
    if (error) return null;
    return data;
  },

  // === DRIVERS ===
  async getDrivers() {
    const { data, error } = await supabase
      .from("drivers")
      .select("*, vehicles(*)")
      .order("rating_avg", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getDriverById(id: string) {
    const { data, error } = await supabase
      .from("drivers")
      .select("*, vehicles(*)")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async setDriverOnline(driverId: string, isOnline: boolean) {
    const { data, error } = await supabase
      .from("drivers")
      .update({ is_online: isOnline, updated_at: new Date().toISOString() })
      .eq("id", driverId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // === VEHICLES ===
  async getVehicleTypes() {
    const { data, error } = await supabaseServer
      .from("vehicle_types")
      .select("*")
      .order("base_fare", { ascending: true });
    if (error) {
      // Fallback in case table uses base_price
      const { data: d2 } = await supabaseServer
        .from("vehicle_types")
        .select("*");
      return d2 || [];
    }
    return data || [];
  },

  async getVehicles() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // === BOOKINGS / JOBS ===
  async getBookingsByUser(userId: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async createBooking(booking: any) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .insert(booking)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // === KYC ===
  async getKycStatus(driverId: string) {
    const { data, error } = await supabase
      .from("driver_kyc")
      .select("*")
      .eq("driver_id", driverId)
      .single();
    if (error) return null;
    return data;
  },

  // === SAVED LOCATIONS ===
  async getSavedLocations(userId: string) {
    const { data, error } = await supabase
      .from("saved_locations")
      .select("*")
      .eq("user_id", userId);
    if (error) return [];
    return data || [];
  },


  // === BOOKINGS / JOBS ===
  async getBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, booking_locations(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getBookingById(id: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async updateBookingStatus(
    bookingId: string,
    status: Database["public"]["Tables"]["bookings"]["Row"]["status"]
  ) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // === NOTIFICATIONS ===
  async getNotificationsByRole(role: "customer" | "driver" | "admin") {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("role", role)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async markNotificationRead(id: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // === REVIEWS ===
  async addReview(
    bookingId: string,
    userId: string,
    driverId: string,
    rating: number,
    comment?: string
  ) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        booking_id: bookingId,
        user_id: userId,
        driver_id: driverId,
        rating,
        comment,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
