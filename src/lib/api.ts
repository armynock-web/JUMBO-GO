/**
 * JUMBO GO - API Client Layer (Server-side Supabase Wrapper)
 *
 * ให้บริการ:
 * 1. การสร้าง Booking (พร้อม Locations จุดรับ-ส่ง)
 * 2. การดึงและติดตามสถานะงานของคนขับ (Driver Job Status)
 * 3. การอัปเดตตำแหน่ง GPS ของคนขับ
 * 4. Realtime Subscription ติดตามตำแหน่งคนขับและสถานะงาน
 *
 * มาตรฐาน: ARM-AES / AEOS v1.0
 * - Data Operation ใช้ service role (`supabaseServer`) เท่านั้น ตรง schema จริง
 * - ไม่มี fake fallback / ไม่ swallow error ทุก error ถูก throw ให้ผู้เรียกเห็น
 * - Realtime subscription ใช้ client anon สำหรับฝั่ง browser
 */

import { supabaseServer } from "./supabase/server";
import { supabase } from "./supabase/client";
import type { Database } from "./supabase/types";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
type VehicleTypeRow = Database["public"]["Tables"]["vehicle_types"]["Row"];
type DriverRow = Database["public"]["Tables"]["drivers"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export interface CreateBookingParams {
  userId: string;
  vehicleType: string;
  pickup: {
    address: string;
    subAddress?: string;
    contactName?: string;
    contactPhone?: string;
    lat: number;
    lng: number;
    note?: string;
  };
  dropoff: {
    address: string;
    subAddress?: string;
    contactName?: string;
    contactPhone?: string;
    lat: number;
    lng: number;
    note?: string;
  };
  fare: number;
  baseFare?: number;
  distanceFare?: number;
  extraHelperFee?: number;
  expresswayFee?: number;
  distanceKm: number;
  paymentMethod?: string;
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
}

export interface DriverLocationUpdate {
  driverId: string;
  lat: number;
  lng: number;
}

export type NotificationRole = "user" | "driver" | "admin";

export const api = {
  // =========================================================================
  // 1. BOOKING MANAGEMENT
  // =========================================================================

  /**
   * สร้างรายการจองรถใหม่ (Create Booking)
   * บันทึกข้อมูลลงตาราง bookings และ booking_locations (จุดรับและจุดส่ง)
   */
  async createBooking(params: CreateBookingParams): Promise<BookingRow> {
    const jobNumber = `JG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingPayload: Database["public"]["Tables"]["bookings"]["Insert"] = {
      user_id: params.userId,
      vehicle_type: params.vehicleType,
      status: "searching",
      fare: params.fare,
      distance_km: params.distanceKm,
      job_number: jobNumber,
    };

    if (params.baseFare !== undefined) bookingPayload.base_fare = params.baseFare;
    if (params.distanceFare !== undefined) bookingPayload.distance_fare = params.distanceFare;
    if (params.extraHelperFee !== undefined) bookingPayload.extra_helper_fee = params.extraHelperFee;
    if (params.expresswayFee !== undefined) bookingPayload.expressway_fee = params.expresswayFee;
    if (params.senderName || params.pickup.contactName) bookingPayload.sender_name = params.senderName || params.pickup.contactName;
    if (params.senderPhone || params.pickup.contactPhone) bookingPayload.sender_phone = params.senderPhone || params.pickup.contactPhone;
    if (params.receiverName || params.dropoff.contactName) bookingPayload.receiver_name = params.receiverName || params.dropoff.contactName;
    if (params.receiverPhone || params.dropoff.contactPhone) bookingPayload.receiver_phone = params.receiverPhone || params.dropoff.contactPhone;

    const { data: booking, error: bookingError } = await supabaseServer
      .from("bookings")
      .insert(bookingPayload)
      .select()
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error("ไม่สามารถสร้างใบจองได้");

    const locationsToInsert = [
      {
        booking_id: booking.id,
        type: "pickup",
        address: params.pickup.address,
        lat: params.pickup.lat,
        lng: params.pickup.lng,
        sequence: 0,
      },
      {
        booking_id: booking.id,
        type: "dropoff",
        address: params.dropoff.address,
        lat: params.dropoff.lat,
        lng: params.dropoff.lng,
        sequence: 1,
      },
    ];

    const { error: locError } = await supabaseServer
      .from("booking_locations")
      .insert(locationsToInsert);

    if (locError) throw locError;

    return booking;
  },

  /**
   * ดึงรายละเอียดของ Booking พร้อมจุดรับ-ส่งและคนขับ
   */
  async getBookingDetail(bookingId: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select(`
        *,
        booking_locations(*),
        drivers(
          id,
          first_name,
          last_name,
          phone,
          avatar_url,
          rating_avg,
          current_location_lat,
          current_location_lng,
          vehicles(
            plate_number,
            brand,
            model,
            color
          )
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  // =========================================================================
  // 2. DRIVER JOB MANAGEMENT & STATUS
  // =========================================================================

  /**
   * ดึงสถานะงานปัจจุบันของคนขับ (Driver Active Job Status)
   */
  async getDriverActiveJob(driverId: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select(`
        *,
        booking_locations(*)
      `)
      .eq("driver_id", driverId)
      .in("status", [
        "driver_assigned",
        "going_to_pickup",
        "arrived_pickup",
        "picked_up",
        "in_transit",
        "arrived_dropoff",
      ])
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * ค้นหาและดึงรายชื่อคนขับที่พร้อมรับงานพร้อมรถและพิกัด
   */
  async getAvailableDrivers(vehicleType?: string) {
    const query = supabaseServer
      .from("drivers")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        avatar_url,
        is_online,
        current_location_lat,
        current_location_lng,
        rating_avg,
        rating_count,
        vehicles (
          id,
          type,
          brand,
          model,
          plate_number,
          color,
          is_active
        )
      `)
      .eq("is_online", true);

    const { data, error } = await query;
    if (error) throw error;

    const drivers = data || [];
    if (!vehicleType) return drivers;

    const vTypeLower = vehicleType.toLowerCase();
    // DriverRow ใช้เฉพาะกรณี any — ตัว select ได้ตัด field ออกไปแล้ว
    return drivers.filter((d: any) => {
      const vehicles: Array<{ type: string | null }> = d?.vehicles || [];
      return (
        vehicles.length === 0 ||
        vehicles.some((v) => (v?.type ?? "").toLowerCase() === vTypeLower)
      );
    });
  },

  /**
   * ดึงรายการงานที่รอรับสำหรับคนขับ (Available Jobs)
   */
  async getAvailableJobsForDriver() {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select(`
        *,
        booking_locations(*)
      `)
      .eq("status", "searching")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * คนขับรับงาน (Accept Job)
   */
  async acceptJob(bookingId: string, driverId: string): Promise<BookingRow> {
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({
        driver_id: driverId,
        status: "driver_assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("status", "searching")
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * คนขับอัปเดตสถานะงาน
   */
  async updateJobStatus(bookingId: string, status: string): Promise<BookingRow> {
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // =========================================================================
  // 3. REALTIME GPS LOCATION UPDATES
  // =========================================================================

  /**
   * อัปเดตตำแหน่งพิกัด GPS สดของคนขับลงตาราง drivers
   */
  async updateDriverLocation({ driverId, lat, lng }: DriverLocationUpdate) {
    const { data, error } = await supabaseServer
      .from("drivers")
      .update({
        current_location_lat: lat,
        current_location_lng: lng,
        updated_at: new Date().toISOString(),
      })
      .eq("id", driverId)
      .select("id, current_location_lat, current_location_lng, is_online")
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error(`ไม่พบคนขับ id=${driverId}`);
    return data;
  },

  /**
   * สลับสถานะ ออนไลน์ / ออฟไลน์ ของคนขับ
   */
  async toggleDriverOnline(driverId: string, isOnline: boolean): Promise<DriverRow> {
    const { data, error } = await supabaseServer
      .from("drivers")
      .update({
        is_online: isOnline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", driverId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // =========================================================================
  // 4. REALTIME SUBSCRIPTIONS (WebSockets via Supabase Realtime)
  // =========================================================================

  /**
   * ติดตามตำแหน่ง GPS ของคนขับแบบ Realtime สำหรับหน้า Tracking ของลูกค้า
   */
  subscribeToDriverLocation(driverId: string, onUpdate: (coords: { lat: number; lng: number }) => void) {
    const channel = supabase
      .channel(`driver_location_${driverId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "drivers",
          filter: `id=eq.${driverId}`,
        },
        (payload) => {
          const newRecord = payload.new as unknown as { current_location_lat?: number | null; current_location_lng?: number | null };
          if (newRecord?.current_location_lat && newRecord?.current_location_lng) {
            onUpdate({
              lat: Number(newRecord.current_location_lat),
              lng: Number(newRecord.current_location_lng),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * ติดตามการเปลี่ยนสถานะของ Booking แบบ Realtime
   */
  subscribeToBookingStatus(bookingId: string, onStatusChange: (booking: BookingRow) => void) {
    const channel = supabase
      .channel(`booking_status_${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          onStatusChange(payload.new as BookingRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // =========================================================================
  // 5. NOTIFICATIONS
  // =========================================================================

  /**
   * ดึงรายการแจ้งเตือนตาม Role
   * remarks: ตาราง notifications ไม่มีคอลัมน์ role — ใช้ field data.role หรือ type prefix `role_`
   */
  async getNotifications(roleParam: "user" | "driver" | "admin" = "user", userId?: string): Promise<NotificationRow[]> {
    let query = supabaseServer
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).filter((n) => {
      const d = (n.data as Record<string, unknown> | null) || {};
      return d.role === roleParam || n.type === `role_${roleParam}`;
    });
  },

  /**
   * ทำเครื่องหมายแจ้งเตือนว่าอ่านแล้ว
   */
  async markNotificationRead(notificationId: string): Promise<NotificationRow> {
    const { data, error } = await supabaseServer
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // =========================================================================
  // 6. MASTER CATALOG & USER PROFILES
  // =========================================================================

  /**
   * ดึงรายการประเภทยานพาหนะและอัตราค่าบริการที่ใช้งานอยู่ (เรียงตาม base_fare)
   */
  async getVehicleTypes(): Promise<VehicleTypeRow[]> {
    const { data, error } = await supabaseServer
      .from("vehicle_types")
      .select("*")
      .eq("is_active", true)
      .order("base_fare", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};