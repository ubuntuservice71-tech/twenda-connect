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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      appeals: {
        Row: {
          appellant_id: string
          cancellation_id: string
          id: string
          reason: string
          status: string
        }
        Insert: {
          appellant_id: string
          cancellation_id: string
          id?: string
          reason: string
          status?: string
        }
        Update: {
          appellant_id?: string
          cancellation_id?: string
          id?: string
          reason?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appeals_cancellation_id_fkey"
            columns: ["cancellation_id"]
            isOneToOne: false
            referencedRelation: "cancellation_events"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      cancellation_events: {
        Row: {
          actor_id: string
          created_at: string
          fee_minor: number | null
          id: string
          reason: string
          ride_id: string
          safety_exception: boolean
        }
        Insert: {
          actor_id: string
          created_at?: string
          fee_minor?: number | null
          id?: string
          reason: string
          ride_id: string
          safety_exception?: boolean
        }
        Update: {
          actor_id?: string
          created_at?: string
          fee_minor?: number | null
          id?: string
          reason?: string
          ride_id?: string
          safety_exception?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cancellation_events_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          active: boolean
          country_code: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          province: string
        }
        Insert: {
          active?: boolean
          country_code?: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          province: string
        }
        Update: {
          active?: boolean
          country_code?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          province?: string
        }
        Relationships: []
      }
      driver_applications: {
        Row: {
          created_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          driver_id: string
          id: string
          kind: string
          status: string
          storage_path: string | null
        }
        Insert: {
          driver_id: string
          id?: string
          kind: string
          status?: string
          storage_path?: string | null
        }
        Update: {
          driver_id?: string
          id?: string
          kind?: string
          status?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_applications"
            referencedColumns: ["user_id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          absence_fee_minor: number | null
          cancellation_fee_minor: number | null
          commission_bps: number
          free_cancel_minutes: number
          id: boolean
          no_show_minutes: number
        }
        Insert: {
          absence_fee_minor?: number | null
          cancellation_fee_minor?: number | null
          commission_bps?: number
          free_cancel_minutes?: number
          id?: boolean
          no_show_minutes?: number
        }
        Update: {
          absence_fee_minor?: number | null
          cancellation_fee_minor?: number | null
          commission_bps?: number
          free_cancel_minutes?: number
          id?: boolean
          no_show_minutes?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          user_id?: string
        }
        Relationships: []
      }
      ride_offers: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          offered_by: string
          price_minor: number
          ride_id: string
          status: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          offered_by: string
          price_minor: number
          ride_id: string
          status?: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          offered_by?: string
          price_minor?: number
          ride_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_offers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_applications"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ride_offers_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          agreed_fare_minor: number | null
          created_at: string
          destination: string
          driver_id: string | null
          id: string
          origin: string
          passenger_id: string
          status: string
          vehicle_kind: string
        }
        Insert: {
          agreed_fare_minor?: number | null
          created_at?: string
          destination: string
          driver_id?: string | null
          id?: string
          origin: string
          passenger_id: string
          status?: string
          vehicle_kind: string
        }
        Update: {
          agreed_fare_minor?: number | null
          created_at?: string
          destination?: string
          driver_id?: string | null
          id?: string
          origin?: string
          passenger_id?: string
          status?: string
          vehicle_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_applications"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          driver_id: string
          id: string
          kind: string
          plate: string
        }
        Insert: {
          driver_id: string
          id?: string
          kind: string
          plate: string
        }
        Update: {
          driver_id?: string
          id?: string
          kind?: string
          plate?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_applications"
            referencedColumns: ["user_id"]
          },
        ]
      }
      wallet_entries: {
        Row: {
          amount_minor: number
          created_at: string
          driver_id: string
          id: string
          idempotency_key: string
          kind: string
          ride_id: string | null
        }
        Insert: {
          amount_minor: number
          created_at?: string
          driver_id: string
          id?: string
          idempotency_key: string
          kind: string
          ride_id?: string | null
        }
        Update: {
          amount_minor?: number
          created_at?: string
          driver_id?: string
          id?: string
          idempotency_key?: string
          kind?: string
          ride_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_entries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "wallet_entries_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          currency: string
          driver_id: string
        }
        Insert: {
          currency?: string
          driver_id: string
        }
        Update: {
          currency?: string
          driver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "driver_applications"
            referencedColumns: ["user_id"]
          },
        ]
      }
      zones: {
        Row: {
          active: boolean
          city_id: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          city_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          city_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
