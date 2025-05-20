import { Database } from './supabase';

export interface Place {
  id: string;
  name: string;
  description: string;
  formatted_address: string;
  location: {
    lat: number;
    lng: number;
  };
  category: Database['public']['Enums']['place_category'];
  types: string[];
  price_level: number | null;
  rating: number | null;
  opening_hours?: {
    weekday_text: string[];
  };
  images: string[];
  reactions: Record<string, number>;
  reviews: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    text: string;
    createdAt: string;
  }[];
  ai_summary?: string;
  google_place_id: string | null;
  neighborhood: string | null;
  opening_hours_text?: string[];
  website: string | null;
  phone: string | null;
  instagram_handle: string | null;
  photos: string[] | null;
  features: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating: number;
  createdAt: string;
  reactions: {
    [key: string]: number; // emoji: count
  };
}

export type Mood = 
  | '🍰 Cute Cafes'
  | '🌇 Sunset Spots'
  | '🖼️ Aesthetic Museums'
  | '🛍️ Indie Shops'
  | '🍜 Hidden Food Gems'
  | '🌳 Nature Escapes'
  | '📸 Instagram Spots'
  | '✨ Hidden Gems';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface User {
  id: string;
  email: string | null;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  bookmarks: string[] | null;
  visitedPlaces: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface MapSettings {
  center: [number, number]; // [latitude, longitude]
  zoom: number;
}

export type AuthState = 'SIGNED_OUT' | 'SIGNED_IN' | 'LOADING';

export type { Database };