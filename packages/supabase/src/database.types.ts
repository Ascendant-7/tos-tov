export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      destinations: {
        Row: {
          avg_rating: number | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          duration_max: number | null
          duration_min: number | null
          id: string
          is_hidden_gem: boolean | null
          is_trending: boolean | null
          location_name: string | null
          name: string
          province: string
        }
        Insert: {
          avg_rating?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_max?: number | null
          duration_min?: number | null
          id?: string
          is_hidden_gem?: boolean | null
          is_trending?: boolean | null
          location_name?: string | null
          name: string
          province: string
        }
        Update: {
          avg_rating?: number | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_max?: number | null
          duration_min?: number | null
          id?: string
          is_hidden_gem?: boolean | null
          is_trending?: boolean | null
          location_name?: string | null
          name?: string
          province?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          destination_id: string | null
          id: string
          rating: number | null
        }
        Insert: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          rating?: number | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string | null;
          day_number: number;
          id: string;
          title: string | null;
          trip_id: string;
        };
        Insert: {
          created_at?: string | null;
          day_number: number;
          id?: string;
          title?: string | null;
          trip_id: string;
        };
        Update: {
          created_at?: string | null;
          day_number?: number;
          id?: string;
          title?: string | null;
          trip_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "itinerary_days_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      itinerary_items: {
        Row: {
          category: string | null;
          cost: string | null;
          created_at: string | null;
          day_id: string;
          duration: string | null;
          id: string;
          notes: string | null;
          position: number | null;
          time: string;
          title: string;
        };
        Insert: {
          category?: string | null;
          cost?: string | null;
          created_at?: string | null;
          day_id: string;
          duration?: string | null;
          id?: string;
          notes?: string | null;
          position?: number | null;
          time: string;
          title: string;
        };
        Update: {
          category?: string | null;
          cost?: string | null;
          created_at?: string | null;
          day_id?: string;
          duration?: string | null;
          id?: string;
          notes?: string | null;
          position?: number | null;
          time?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "itinerary_items_day_id_fkey";
            columns: ["day_id"];
            isOneToOne: false;
            referencedRelation: "itinerary_days";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      user: {
        Row: {
          created_at: string;
          id: number;
          username: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          username?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
