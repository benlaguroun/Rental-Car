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
      cars: {
        Row: {
          id: number
          created_at: string
          make: string
          model: string
          year: number
          daily_rate: number
          image_url: string
          available: boolean
          category: string
          description: string
        }
        Insert: {
          id?: number
          created_at?: string
          make: string
          model: string
          year: number
          daily_rate: number
          image_url: string
          available?: boolean
          category: string
          description: string
        }
        Update: {
          id?: number
          created_at?: string
          make?: string
          model?: string
          year?: number
          daily_rate?: number
          image_url?: string
          available?: boolean
          category?: string
          description?: string
        }
      }
      bookings: {
        Row: {
          id: number
          created_at: string
          car_id: number
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          car_id: number
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          car_id?: number
          user_id?: string
          start_date?: string
          end_date?: string
          total_price?: number
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          phone: string | null
          address: string | null
          license_number: string | null
        }
        Insert: {
          id: string
          created_at?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          license_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          license_number?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}