export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      places: {
        Row: {
          ai_summary: string | null
          category: Database["public"]["Enums"]["place_category"]
          created_at: string | null
          description: string | null
          features: string[] | null
          formatted_address: string | null
          google_place_id: string | null
          id: string
          instagram_handle: string | null
          last_summary_generated: string | null
          location: Json | null
          name: string
          neighborhood: string | null
          opening_hours: Json | null
          phone: string | null
          photos: string[] | null
          price_level: number | null
          rating: number | null
          types: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          ai_summary?: string | null
          category: Database["public"]["Enums"]["place_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          formatted_address?: string | null
          google_place_id?: string | null
          id?: string
          instagram_handle?: string | null
          last_summary_generated?: string | null
          location?: Json | null
          name: string
          neighborhood?: string | null
          opening_hours?: Json | null
          phone?: string | null
          photos?: string[] | null
          price_level?: number | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          ai_summary?: string | null
          category?: Database["public"]["Enums"]["place_category"]
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          formatted_address?: string | null
          google_place_id?: string | null
          id?: string
          instagram_handle?: string | null
          last_summary_generated?: string | null
          location?: Json | null
          name?: string
          neighborhood?: string | null
          opening_hours?: Json | null
          phone?: string | null
          photos?: string[] | null
          price_level?: number | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profile_pictures: {
        Row: {
          content_type: string
          created_at: string
          file_name: string
          id: string
          size_bytes: number
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          file_name: string
          id?: string
          size_bytes: number
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          file_name?: string
          id?: string
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bookmarks: string[] | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
          username: string
          visited_places: string[] | null
        }
        Insert: {
          avatar?: string | null
          bookmarks?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          username: string
          visited_places?: string[] | null
        }
        Update: {
          avatar?: string | null
          bookmarks?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          username?: string
          visited_places?: string[] | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          place_id: string
          rating: number
          reactions: Json | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          place_id: string
          rating: number
          reactions?: Json | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          place_id?: string
          rating?: number
          reactions?: Json | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          }
        ]
      }
      summary_generation_errors: {
        Row: {
          attempted_at: string
          created_at: string
          error_message: string
          id: string
          place_id: string
        }
        Insert: {
          attempted_at?: string
          created_at?: string
          error_message: string
          id?: string
          place_id: string
        }
        Update: {
          attempted_at?: string
          created_at?: string
          error_message?: string
          id?: string
          place_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summary_generation_errors_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          }
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
      place_category:
        | "cafe"
        | "restaurant"
        | "bar"
        | "cultural"
        | "activity"
        | "shopping"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}