import { supabaseServer } from "./server";
import type { Database } from "./types";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type DriverRow = Database["public"]["Tables"]["drivers"]["Row"];
export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleTypeRow =
  Database["public"]["Tables"]["vehicle_types"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingLocationRow =
  Database["public"]["Tables"]["booking_locations"]["Row"];
export type NotificationRow =
  Database["public"]["Tables"]["notifications"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type KycRow = Database["public"]["Tables"]["driver_kyc"]["Row"];
export type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type SavedLocationRow =
  Database["public"]["Tables"]["saved_locations"]["Row"];
export type TransactionRow =
  Database["public"]["Tables"]["transactions"]["Row"];
export type DriverWalletRow =
  Database["public"]["Tables"]["driver_wallet"]["Row"];
export type ProofRow = Database["public"]["Tables"]["delivery_proofs"]["Row"];

export type BookingStatus = BookingRow["status"];
export type PaymentMethod = PaymentRow["method"];

/** Data Access Layer — ใช้ service role ทั้งหมด ตรง schema จริงของ Supabase ไม่มี fake fallback
 *  ทุก method จะ throw error จริงถ้า DB ล้ม เพื่อให้ route layers เป็นตัวจัดการ/ตอบ error */
export const JumboRepository = {
  // ======================= USERS =======================
  async getUsers() {
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getUserById(id: string): Promise<UserRow | null> {
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getUserByPhone(phone: string): Promise<UserRow | null> {
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createUser(user: { id: string; phone?: string; email?: string; first_name?: string; last_name?: string; role?: string }) {
    const { data, error } = await supabaseServer
      .from("users")
      .insert({
        id: user.id,
        phone: user.phone ?? null,
        email: user.email ?? null,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        role: user.role ?? "user",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(
    id: string,
    fields: Partial<Database["public"]["Tables"]["users"]["Update"]>
  ) {
    const { data, error } = await supabaseServer
      .from("users")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ======================= DRIVERS =======================
  async getDrivers() {
    const { data, error } = await supabaseServer
      .from("drivers")
      .select("*, vehicles(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getDriverById(id: string) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .select("*, vehicles(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getDriverByUserId(userId: string) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .select("*, vehicles(*)")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async setDriverOnline(driverId: string, isOnline: boolean) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .update({ is_online: isOnline, updated_at: new Date().toISOString() })
      .eq("id", driverId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDriverLocation(driverId: string, lat: number, lng: number) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .update({
        current_location_lat: lat,
        current_location_lng: lng,
        updated_at: new Date().toISOString(),
      })
      .eq("id", driverId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDriver(
    driverId: string,
    fields: Partial<Database["public"]["Tables"]["drivers"]["Update"]>
  ) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", driverId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ======================= VEHICLES =======================
  async getVehicleTypes() {
    const { data, error } = await supabaseServer
      .from("vehicle_types")
      .select("*")
      .order("base_fare", { ascending: true });
    if (error) throw error;
    return data;
  },

  async getVehicleTypeById(id: string) {
    const { data, error } = await supabaseServer
      .from("vehicle_types")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateVehicleType(
    id: string,
    fields: Partial<Database["public"]["Tables"]["vehicle_types"]["Update"]>
  ) {
    const { data, error } = await supabaseServer
      .from("vehicle_types")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getVehicles() {
    const { data, error } = await supabaseServer
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // ======================= BOOKINGS / JOBS =======================
  async getBookings() {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getBookingsByUser(userId: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getBookingsByDriver(driverId: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  /** งานที่รอคนขับรับ (สถานะ searching) เพื่อแสดงรายการงานว่างให้คนขับ */
  async getAvailableJobs() {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("status", "searching")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  },

  async getBookingById(id: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*, booking_locations(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createBooking(booking: Omit<
    Database["public"]["Tables"]["bookings"]["Insert"],
    "id" | "created_at" | "updated_at"
  >) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .insert(booking)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addBookingLocation(location: Omit<
    Database["public"]["Tables"]["booking_locations"]["Insert"],
    "id" | "created_at"
  >) {
    const { data, error } = await supabaseServer
      .from("booking_locations")
      .insert(location)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateBooking(id: string, fields: Partial<Database["public"]["Tables"]["bookings"]["Update"]>) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    return this.updateBooking(bookingId, { status });
  },

  async assignDriver(bookingId: string, driverId: string) {
    return this.updateBooking(bookingId, { driver_id: driverId, status: "driver_assigned" });
  },

  // ======================= KYC =======================
  async getKycStatus(driverId: string): Promise<KycRow | null> {
    const { data, error } = await supabaseServer
      .from("driver_kyc")
      .select("*")
      .eq("driver_id", driverId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async upsertKyc(driverId: string, fields: Partial<Database["public"]["Tables"]["driver_kyc"]["Update"]>) {
    const { data, error } = await supabaseServer
      .from("driver_kyc")
      .upsert({ driver_id: driverId, ...fields }, { onConflict: "driver_id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** รายการ KYC ทั้งหมดพร้อมข้อมูลคนขับ สำหรับหน้าแอดมิน */
  async getKycList() {
    const { data, error } = await supabaseServer
      .from("driver_kyc")
      .select("*, drivers(first_name, last_name, phone, is_verified, vehicles(*))")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // ======================= SAVED LOCATIONS =======================
  async getSavedLocations(userId: string) {
    const { data, error } = await supabaseServer
      .from("saved_locations")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });
    if (error) throw error;
    return data;
  },

  async searchSavedLocations(query: string) {
    const { data, error } = await supabaseServer
      .from("saved_locations")
      .select("*")
      .ilike("address", `%${query}%`)
      .limit(20);
    if (error) throw error;
    return data;
  },

  // ======================= NOTIFICATIONS =======================
  async getNotificationsByRole(role: "user" | "driver" | "admin") {
    const { data, error } = await supabaseServer
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // role ของผู้รับจะเก็บในฟิลด์ data.role หรือ type prefix role_
    return (data || []).filter((n) => {
      const d = (n.data as Record<string, unknown> | null) || {};
      return d.role === role || n.type === `role_${role}`;
    });
  },

  async getNotificationsByUser(userId: string) {
    const { data, error } = await supabaseServer
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async markNotificationRead(id: string) {
    const { data, error } = await supabaseServer
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createNotification(notification: Omit<
    Database["public"]["Tables"]["notifications"]["Insert"],
    "id" | "created_at"
  >) {
    const { data, error } = await supabaseServer
      .from("notifications")
      .insert(notification)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ======================= REVIEWS =======================
  async addReview(
    bookingId: string,
    userId: string,
    driverId: string,
    rating: number,
    comment?: string
  ) {
    const { data, error } = await supabaseServer
      .from("reviews")
      .insert({
        booking_id: bookingId,
        user_id: userId,
        driver_id: driverId,
        rating,
        comment: comment ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getReviewsByDriver(driverId: string) {
    const { data, error } = await supabaseServer
      .from("reviews")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  // ======================= PAYMENTS / TRANSACTIONS / WALLET =======================
  async getPayments() {
    const { data, error } = await supabaseServer
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTransactionsByDriver(driverId: string) {
    const { data, error } = await supabaseServer
      .from("transactions")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getDriverWallet(driverId: string): Promise<DriverWalletRow | null> {
    const { data, error } = await supabaseServer
      .from("driver_wallet")
      .select("*")
      .eq("driver_id", driverId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // ======================= ADMIN DASHBOARD STATS =======================
  async getAdminStats() {
    const [bookings, drivers, users, kyc, payments, transactions] =
      await Promise.all([
        supabaseServer.from("bookings").select("*"),
        supabaseServer.from("drivers").select("*"),
        supabaseServer.from("users").select("*"),
        supabaseServer.from("driver_kyc").select("*"),
        supabaseServer.from("payments").select("*"),
        supabaseServer.from("transactions").select("*"),
      ]);
    const hasError = [bookings, drivers, users, kyc, payments, transactions].find(
      (r) => r.error
    );
    if (hasError) throw hasError.error;

    const activeBookings = bookings.data?.filter(
      (b) => b.status === "searching" || b.status === "driver_assigned" || b.status === "in_transit"
    ).length ?? 0;
    const onlineDrivers = drivers.data?.filter((d) => d.is_online === true).length ?? 0;
    const totalRevenueToday = payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
    const totalBookingsToday = bookings.data?.length ?? 0;
    const pendingKycCount = kyc.data?.filter((k) => k.status === "pending").length ?? 0;
    const abnormalCancellations = bookings.data?.filter(
      (b) => b.status === "cancelled" && !!b.cancel_reason
    ).length ?? 0;

    return {
      activeBookings,
      onlineDrivers,
      totalRevenueToday,
      totalBookingsToday,
      pendingKycCount,
      abnormalCancellations,
      totalDrivers: drivers.data?.length ?? 0,
      totalUsers: users.data?.length ?? 0,
      approvedDrivers: drivers.data?.filter((d) => d.is_verified === true).length ?? 0,
      totalBookings: bookings.data?.length ?? 0,
      completedBookings: bookings.data?.filter((b) => b.status === "completed").length ?? 0,
      cancelledBookings: bookings.data?.filter((b) => b.status === "cancelled").length ?? 0,
      systemHealth: "operational",
      updatedAt: new Date().toISOString(),
    };
  },
};