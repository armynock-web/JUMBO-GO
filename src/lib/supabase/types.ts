export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "driver" | "admin" | "user";
export type UserStatus = "active" | "suspended" | "pending";

export type VehicleTypeCode =
  | "pickup"
  | "pickup_box"
  | "pickup_fence"
  | "jumbo"
  | "truck_6w";

export type JobStatus =
  | "draft"
  | "searching"
  | "driver_assigned"
  | "going_to_pickup"
  | "arrived_pickup"
  | "picked_up"
  | "in_transit"
  | "arrived_dropoff"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "promptpay" | "credit_card" | "wallet";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "pending";
export type KycStatus = "draft" | "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          first_name?: string;
          last_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          updated_at?: string;
        };
      };
      vehicle_types: {
        Row: {
          id: string;
          code: VehicleTypeCode;
          name_th: string;
          capacity_ton: number;
          base_price: number;
          price_per_km: number;
          dimensions: string | null;
          icon_name: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: VehicleTypeCode;
          name_th: string;
          capacity_ton: number;
          base_price: number;
          price_per_km: number;
          dimensions?: string | null;
          icon_name?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: VehicleTypeCode;
          name_th?: string;
          capacity_ton?: number;
          base_price?: number;
          price_per_km?: number;
          dimensions?: string | null;
          icon_name?: string | null;
          description?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          driver_code: string | null;
          phone: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          id_card_url: string | null;
          license_url: string | null;
          vehicle_id: string | null;
          is_verified: boolean;
          is_online: boolean;
          current_location_lat: number | null;
          current_location_lng: number | null;
          rating_avg: number;
          rating_count: number;
          total_earnings: number;
          bank_name: string | null;
          bank_account_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          driver_code?: string | null;
          phone: string;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          id_card_url?: string | null;
          license_url?: string | null;
          vehicle_id?: string | null;
          is_verified?: boolean;
          is_online?: boolean;
          current_location_lat?: number | null;
          current_location_lng?: number | null;
          rating_avg?: number;
          rating_count?: number;
          total_earnings?: number;
          bank_name?: string | null;
          bank_account_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["drivers"]["Insert"]>;
      };
      driver_kyc: {
        Row: {
          id: string;
          driver_id: string;
          kyc_code: string;
          current_step: number;
          emergency_contact: string | null;
          emergency_phone: string | null;
          address_current: string | null;
          province: string | null;
          district: string | null;
          id_card_number: string | null;
          id_card_front_url: string | null;
          id_card_back_url: string | null;
          laser_id: string | null;
          selfie_url: string | null;
          license_number: string | null;
          license_type: string | null;
          license_expiry: string | null;
          license_front_url: string | null;
          license_back_url: string | null;
          vehicle_type: string | null;
          vehicle_brand: string | null;
          vehicle_plate: string | null;
          vehicle_province: string | null;
          vehicle_registration_url: string | null;
          compulsory_insurance_url: string | null;
          vehicle_front_url: string | null;
          vehicle_side_url: string | null;
          bank_name: string | null;
          bank_account_number: string | null;
          bank_account_name: string | null;
          bank_book_url: string | null;
          consent_pdpa: boolean;
          consent_background_check: boolean;
          consent_terms: boolean;
          status: KycStatus;
          reject_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["driver_kyc"]["Row"]> & {
          driver_id: string;
          kyc_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_kyc"]["Row"]>;
      };
      vehicles: {
        Row: {
          id: string;
          driver_id: string | null;
          type: string;
          brand: string;
          model: string;
          year: number | null;
          plate_number: string;
          plate_province: string | null;
          color: string | null;
          inspection_status: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vehicles"]["Row"]> & {
          type: string;
          brand: string;
          model: string;
          plate_number: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
      };
      bookings: {
        Row: {
          id: string;
          job_number: string | null;
          user_id: string;
          driver_id: string | null;
          vehicle_type: string;
          status: JobStatus;
          fare: number;
          base_fare: number;
          distance_fare: number;
          extra_helper_fee: number;
          expressway_fee: number;
          discount: number;
          driver_earning: number;
          distance_km: number;
          duration_min: number;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          sender_name: string | null;
          sender_phone: string | null;
          receiver_name: string | null;
          receiver_phone: string | null;
          cancel_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> & {
          user_id: string;
          vehicle_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
      };
      booking_locations: {
        Row: {
          id: string;
          booking_id: string;
          type: "pickup" | "dropoff";
          address: string;
          sub_address: string | null;
          tag: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          note: string | null;
          lat: number;
          lng: number;
          sequence: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_locations"]["Row"]> & {
          booking_id: string;
          type: "pickup" | "dropoff";
          address: string;
          lat: number;
          lng: number;
        };
        Update: Partial<Database["public"]["Tables"]["booking_locations"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          role: "customer" | "driver" | "admin";
          category: string;
          priority: "low" | "normal" | "high" | "urgent";
          title: string;
          message: string;
          is_read: boolean;
          job_id: string | null;
          amount: number | null;
          action_label: string | null;
          action_target: string | null;
          data: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          role: "customer" | "driver" | "admin";
          title: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          booking_id: string | null;
          amount: number;
          method: string;
          status: string;
          transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          amount: number;
          method: string;
          status: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      transactions: {
        Row: {
          id: string;
          txn_number: string;
          driver_id: string | null;
          user_id: string | null;
          booking_id: string | null;
          type: "job_fare" | "driver_payout" | "toll_refund" | "bonus" | "commission_fee";
          amount: number;
          status: "pending" | "processing" | "completed" | "failed";
          bank_name: string | null;
          bank_account: string | null;
          failure_reason: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["transactions"]["Row"]> & {
          txn_number: string;
          type: "job_fare" | "driver_payout" | "toll_refund" | "bonus" | "commission_fee";
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          driver_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          user_id: string;
          driver_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      saved_locations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string;
          sub_address: string | null;
          tag: string;
          lat: number;
          lng: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["saved_locations"]["Row"]> & {
          user_id: string;
          name: string;
          address: string;
          tag: string;
          lat: number;
          lng: number;
        };
        Update: Partial<Database["public"]["Tables"]["saved_locations"]["Row"]>;
      };
    };
  };
}
