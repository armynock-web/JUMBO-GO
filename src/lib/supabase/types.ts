export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      booking_locations: {
        Row: {
          address: string
          booking_id: string | null
          created_at: string | null
          id: string
          lat: number
          lng: number
          sequence: number
          type: string
        }
        Insert: {
          address: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          lat: number
          lng: number
          sequence?: number
          type: string
        }
        Update: {
          address?: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          lat?: number
          lng?: number
          sequence?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_locations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          base_fare: number | null
          cancel_reason: string | null
          created_at: string | null
          distance_fare: number | null
          distance_km: number | null
          driver_id: string | null
          duration_min: number | null
          expressway_fee: number | null
          extra_helper_fee: number | null
          fare: number | null
          id: string
          job_number: string | null
          receiver_name: string | null
          receiver_note: string | null
          receiver_phone: string | null
          sender_name: string | null
          sender_note: string | null
          sender_phone: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          vehicle_type: string
        }
        Insert: {
          base_fare?: number | null
          cancel_reason?: string | null
          created_at?: string | null
          distance_fare?: number | null
          distance_km?: number | null
          driver_id?: string | null
          duration_min?: number | null
          expressway_fee?: number | null
          extra_helper_fee?: number | null
          fare?: number | null
          id?: string
          job_number?: string | null
          receiver_name?: string | null
          receiver_note?: string | null
          receiver_phone?: string | null
          sender_name?: string | null
          sender_note?: string | null
          sender_phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_type: string
        }
        Update: {
          base_fare?: number | null
          cancel_reason?: string | null
          created_at?: string | null
          distance_fare?: number | null
          distance_km?: number | null
          driver_id?: string | null
          duration_min?: number | null
          expressway_fee?: number | null
          extra_helper_fee?: number | null
          fare?: number | null
          id?: string
          job_number?: string | null
          receiver_name?: string | null
          receiver_note?: string | null
          receiver_phone?: string | null
          sender_name?: string | null
          sender_note?: string | null
          sender_phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_proofs: {
        Row: {
          booking_id: string
          captured_at: string | null
          driver_id: string
          id: string
          note: string | null
          photo_url: string
          proof_type: string
        }
        Insert: {
          booking_id: string
          captured_at?: string | null
          driver_id: string
          id?: string
          note?: string | null
          photo_url: string
          proof_type: string
        }
        Update: {
          booking_id?: string
          captured_at?: string | null
          driver_id?: string
          id?: string
          note?: string | null
          photo_url?: string
          proof_type?: string
        }
        Relationships: []
      }
      driver_kyc: {
        Row: {
          act_insurance_image_url: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          created_at: string | null
          driver_id: string
          driving_license_image_url: string | null
          driving_license_number: string | null
          id: string
          id_card_image_url: string | null
          id_card_number: string | null
          rejection_reason: string | null
          status: string | null
          step_completed: number | null
          updated_at: string | null
          vehicle_registration_image_url: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          act_insurance_image_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          driver_id: string
          driving_license_image_url?: string | null
          driving_license_number?: string | null
          id?: string
          id_card_image_url?: string | null
          id_card_number?: string | null
          rejection_reason?: string | null
          status?: string | null
          step_completed?: number | null
          updated_at?: string | null
          vehicle_registration_image_url?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          act_insurance_image_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          driver_id?: string
          driving_license_image_url?: string | null
          driving_license_number?: string | null
          id?: string
          id_card_image_url?: string | null
          id_card_number?: string | null
          rejection_reason?: string | null
          status?: string | null
          step_completed?: number | null
          updated_at?: string | null
          vehicle_registration_image_url?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      driver_wallet: {
        Row: {
          balance: number | null
          credit_limit: number | null
          driver_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          credit_limit?: number | null
          driver_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          credit_limit?: number | null
          driver_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_location_lat: number | null
          current_location_lng: number | null
          first_name: string
          id: string
          id_card_url: string | null
          is_online: boolean | null
          is_verified: boolean | null
          last_name: string
          license_url: string | null
          phone: string
          rating_avg: number | null
          rating_count: number | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          first_name: string
          id?: string
          id_card_url?: string | null
          is_online?: boolean | null
          is_verified?: boolean | null
          last_name: string
          license_url?: string | null
          phone: string
          rating_avg?: number | null
          rating_count?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          first_name?: string
          id?: string
          id_card_url?: string | null
          is_online?: boolean | null
          is_verified?: boolean | null
          last_name?: string
          license_url?: string | null
          phone?: string
          rating_avg?: number | null
          rating_count?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          id: string
          method: string
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          method: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          id?: string
          method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_locations: {
        Row: {
          address: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string
          lat: number
          lng: number
          user_id: string
        }
        Insert: {
          address: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          lat: number
          lng: number
          user_id: string
        }
        Update: {
          address?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          lat?: number
          lng?: number
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_types: {
        Row: {
          base_distance_km: number | null
          base_fare: number
          capacity_kg: number
          category: string
          created_at: string | null
          description: string | null
          dimension_text: string | null
          id: string
          is_active: boolean | null
          name: string
          popular: boolean | null
          price_per_km: number
        }
        Insert: {
          base_distance_km?: number | null
          base_fare: number
          capacity_kg: number
          category: string
          created_at?: string | null
          description?: string | null
          dimension_text?: string | null
          id: string
          is_active?: boolean | null
          name: string
          popular?: boolean | null
          price_per_km: number
        }
        Update: {
          base_distance_km?: number | null
          base_fare?: number
          capacity_kg?: number
          category?: string
          created_at?: string | null
          description?: string | null
          dimension_text?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          popular?: boolean | null
          price_per_km?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          color: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          is_active: boolean | null
          model: string | null
          plate_number: string | null
          type: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          color?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number?: string | null
          type: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          color?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number?: string | null
          type?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}