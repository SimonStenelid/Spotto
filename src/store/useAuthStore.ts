import { create } from 'zustand';
import { supabase, signInWithEmail, signUpWithEmail, signOut as supabaseSignOut, getCurrentUser } from '../lib/supabase';
import type { AuthState, User } from '../types';

interface AuthStore {
  authState: AuthState;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateUser: (user: User) => void;
  updateUserBookmarks: (bookmarks: string[]) => void;
}

function mapProfileToUser(profile: any, email: string): User {
  return {
    id: profile.id,
    email: email,
    username: profile.username,
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: profile.avatar,
    phone: profile.phone,
    city: profile.city,
    postalCode: profile.postal_code,
    country: profile.country,
    bookmarks: profile.bookmarks || [],
    visitedPlaces: profile.visited_places || [],
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authState: 'LOADING',
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current session
      const { user: currentUser, error: userError } = await getCurrentUser();
      if (userError) throw userError;
      
      if (!currentUser) {
        set({ authState: 'SIGNED_OUT', user: null, profile: null });
        return;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profile) {
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, currentUser.email!),
          profile,
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('No user data returned after sign in');
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, data.user.email!),
          profile,
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await signUpWithEmail(email, password);
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('No user data returned after sign up');
      }

      // Get or create profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, data.user.email!),
          profile,
        });
      }
    } catch (error) {
      // If the error is about duplicate profile, we can ignore it as the profile was created by the trigger
      if (error instanceof Error && !error.message.includes('duplicate key value')) {
        set({ error: (error as Error).message });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabaseSignOut();
      if (error) throw error;
      
      set({
        authState: 'SIGNED_OUT',
        user: null,
        profile: null,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true, error: null });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          avatar: updates.avatar,
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          city: updates.city,
          postal_code: updates.postalCode,
          country: updates.country,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (profile) {
        const updatedUser = mapProfileToUser(profile, user.email!);
        set({
          user: updatedUser,
          profile,
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (user) => {
    set({ user });
  },

  updateUserBookmarks: (bookmarks) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        bookmarks
      }
    });
  }
}));
