// =====================================================
// Supabase Database Types
// =====================================================
// Auto-generated types from database schema
// Update this file after schema changes
// =====================================================

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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          marketing_consent: boolean
          sms_consent: boolean
          loyalty_points: number
          lifetime_value: number
          square_customer_id: string | null
          brevo_contact_id: number | null
          referral_code: string | null
          referred_by_code: string | null
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          marketing_consent?: boolean
          sms_consent?: boolean
          loyalty_points?: number
          lifetime_value?: number
          square_customer_id?: string | null
          brevo_contact_id?: number | null
          referral_code?: string | null
          referred_by_code?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          marketing_consent?: boolean
          sms_consent?: boolean
          loyalty_points?: number
          lifetime_value?: number
          square_customer_id?: string | null
          brevo_contact_id?: number | null
          referral_code?: string | null
          referred_by_code?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          square_order_id: string
          square_payment_id: string | null
          status: string
          total_amount: number
          subtotal_amount: number
          shipping_amount: number
          discount_amount: number
          tax_amount: number
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          shipping_address: Json
          tracking_number: string | null
          carrier: string | null
          shipped_at: string | null
          delivered_at: string | null
          points_earned: number
          points_used: number
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id?: string | null
          square_order_id: string
          square_payment_id?: string | null
          status?: string
          total_amount: number
          subtotal_amount: number
          shipping_amount?: number
          discount_amount?: number
          tax_amount?: number
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address: Json
          tracking_number?: string | null
          carrier?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          points_earned?: number
          points_used?: number
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string | null
          square_order_id?: string
          square_payment_id?: string | null
          status?: string
          total_amount?: number
          subtotal_amount?: number
          shipping_amount?: number
          discount_amount?: number
          tax_amount?: number
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address?: Json
          tracking_number?: string | null
          carrier?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          points_earned?: number
          points_used?: number
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          square_catalog_object_id: string | null
          square_variation_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          square_catalog_object_id?: string | null
          square_variation_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          square_catalog_object_id?: string | null
          square_variation_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string
          status: string
          frequency: string
          base_price: number
          discount_percentage: number
          discounted_price: number
          next_shipment_date: string | null
          last_shipment_date: string | null
          total_shipments: number
          square_customer_id: string | null
          payment_method_id: string | null
          created_at: string
          updated_at: string
          paused_at: string | null
          cancelled_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          product_name: string
          status?: string
          frequency: string
          base_price: number
          discount_percentage?: number
          next_shipment_date?: string | null
          last_shipment_date?: string | null
          total_shipments?: number
          square_customer_id?: string | null
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
          paused_at?: string | null
          cancelled_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          product_name?: string
          status?: string
          frequency?: string
          base_price?: number
          discount_percentage?: number
          next_shipment_date?: string | null
          last_shipment_date?: string | null
          total_shipments?: number
          square_customer_id?: string | null
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
          paused_at?: string | null
          cancelled_at?: string | null
          metadata?: Json
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          user_id: string
          points_change: number
          reason: string
          description: string | null
          order_id: string | null
          referral_id: string | null
          balance_after: number
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          points_change: number
          reason: string
          description?: string | null
          order_id?: string | null
          referral_id?: string | null
          balance_after: number
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          points_change?: number
          reason?: string
          description?: string | null
          order_id?: string | null
          referral_id?: string | null
          balance_after?: number
          created_at?: string
          metadata?: Json
        }
      }
      loyalty_coupons: {
        Row: {
          id: string
          user_id: string
          code: string
          discount_type: string
          discount_value: number
          points_redeemed: number
          status: string
          used_at: string | null
          used_in_order_id: string | null
          expires_at: string
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          discount_type?: string
          discount_value: number
          points_redeemed: number
          status?: string
          used_at?: string | null
          used_in_order_id?: string | null
          expires_at: string
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          points_redeemed?: number
          status?: string
          used_at?: string | null
          used_in_order_id?: string | null
          expires_at?: string
          created_at?: string
          metadata?: Json
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_user_id: string
          referrer_code: string
          referee_email: string
          referee_user_id: string | null
          status: string
          referrer_points_awarded: number
          referee_points_awarded: number
          first_order_id: string | null
          created_at: string
          completed_at: string | null
          rewarded_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          referrer_user_id: string
          referrer_code: string
          referee_email: string
          referee_user_id?: string | null
          status?: string
          referrer_points_awarded?: number
          referee_points_awarded?: number
          first_order_id?: string | null
          created_at?: string
          completed_at?: string | null
          rewarded_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          referrer_user_id?: string
          referrer_code?: string
          referee_email?: string
          referee_user_id?: string | null
          status?: string
          referrer_points_awarded?: number
          referee_points_awarded?: number
          first_order_id?: string | null
          created_at?: string
          completed_at?: string | null
          rewarded_at?: string | null
          metadata?: Json
        }
      }
      digital_products: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          file_url: string | null
          file_size: number | null
          thumbnail_url: string | null
          requires_purchase: boolean
          linked_product_id: string | null
          is_free: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          file_url?: string | null
          file_size?: number | null
          thumbnail_url?: string | null
          requires_purchase?: boolean
          linked_product_id?: string | null
          is_free?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          file_url?: string | null
          file_size?: number | null
          thumbnail_url?: string | null
          requires_purchase?: boolean
          linked_product_id?: string | null
          is_free?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      user_digital_access: {
        Row: {
          id: string
          user_id: string
          digital_product_id: string
          granted_at: string
          granted_by: string
          order_id: string | null
          first_accessed_at: string | null
          last_accessed_at: string | null
          access_count: number
        }
        Insert: {
          id?: string
          user_id: string
          digital_product_id: string
          granted_at?: string
          granted_by: string
          order_id?: string | null
          first_accessed_at?: string | null
          last_accessed_at?: string | null
          access_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          digital_product_id?: string
          granted_at?: string
          granted_by?: string
          order_id?: string | null
          first_accessed_at?: string | null
          last_accessed_at?: string | null
          access_count?: number
        }
      }
      admin_users: {
        Row: {
          id: string
          role: string
          permissions: Json
          is_active: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
          metadata: Json
        }
        Insert: {
          id: string
          role?: string
          permissions?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          role?: string
          permissions?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          metadata?: Json
        }
      }
      sync_logs: {
        Row: {
          id: string
          service: string
          sync_type: string
          direction: string
          status: string
          entity_id: string | null
          local_id: string | null
          error_message: string | null
          error_details: Json | null
          duration_ms: number | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          service: string
          sync_type: string
          direction: string
          status: string
          entity_id?: string | null
          local_id?: string | null
          error_message?: string | null
          error_details?: Json | null
          duration_ms?: number | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          service?: string
          sync_type?: string
          direction?: string
          status?: string
          entity_id?: string | null
          local_id?: string | null
          error_message?: string | null
          error_details?: Json | null
          duration_ms?: number | null
          created_at?: string
          metadata?: Json
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
