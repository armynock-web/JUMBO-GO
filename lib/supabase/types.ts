/**
 * Database Schema Types สำหรับ JUMBO GO
 * ใช้สำหรับ TypeScript type safety
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          phone: string
          first_name: string
          last_name: string
          avatar_url: string | null
          id_card_url: string | null
          license_url: string | null
          vehicle_id: string | null
          is_verified: boolean
          is_online: boolean
          current_location_lat: number | null
          current_location_lng: number | null
          rating_avg: number
          rating_count: number
          total_earnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          id_card_url?: string | null
          license_url?: string | null
          vehicle_id?: string | null
          is_verified?: boolean
          is_online?: boolean
          current_location_lat?: number | null
          current_location_lng?: number | null
          rating_avg?: number
          rating_count?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          id_card_url?: string | null
          license_url?: string | null
          vehicle_id?: string | null
          is_verified?: boolean
          is_online?: boolean
          current_location_lat?: number | null
          current_location_lng?: number | null
          rating_avg?: number
          rating_count?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          driver_id: string | null
          type: 'motorcycle' | 'car' | 'van'
          brand: string | null
          model: string | null
          year: number | null
          plate_number: string | null
          color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id?: string | null
          type: 'motorcycle' | 'car' | 'van'
          brand?: string | null
          model?: string | null
          year?: number | null
          plate_number?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string | null
          type?: 'motorcycle' | 'car' | 'van'
          brand?: string | null
          model?: string | null
          year?: number | null
          plate_number?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          driver_id: string | null
          vehicle_type: 'motorcycle' | 'car' | 'van'
          status: 'pending' | 'searching' | 'accepted' | 'picked_up' | 'completed' | 'cancelled'
          fare: number | null
          distance_km: number | null
          duration_min: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          driver_id?: string | null
          vehicle_type: 'motorcycle' | 'car' | 'van'
          status?: 'pending' | 'searching' | 'accepted' | 'picked_up' | 'completed' | 'cancelled'
          fare?: number | null
          distance_km?: number | null
          duration_min?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          driver_id?: string | null
          vehicle_type?: 'motorcycle' | 'car' | 'van'
          status?: 'pending' | 'searching' | 'accepted' | 'picked_up' | 'completed' | 'cancelled'
          fare?: number | null
          distance_km?: number | null
          duration_min?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_locations: {
        Row: {
          id: string
          booking_id: string
          type: 'pickup' | 'dropoff'
          address: string
          lat: number
          lng: number
          sequence: number
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          type: 'pickup' | 'dropoff'
          address: string
          lat: number
          lng: number
          sequence?: number
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          type?: 'pickup' | 'dropoff'
          address?: string
          lat?: number
          lng?: number
          sequence?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          method: 'cash' | 'card' | 'promptpay'
          status: 'pending' | 'paid' | 'failed' | 'refunded'
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          method: 'cash' | 'card' | 'promptpay'
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          method?: 'cash' | 'card' | 'promptpay'
          status?: 'pending' | 'paid' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          driver_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          driver_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          driver_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'booking' | 'payment' | 'system'
          title: string
          message: string
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'booking' | 'payment' | 'system'
          title: string
          message: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'booking' | 'payment' | 'system'
          title?: string
          message?: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
      }
    }
  }
}
