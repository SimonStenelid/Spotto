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
  updateProfile: (updates: Partial<{ username: string, avatar: string }>) => Promise<void>;
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
      
      set({
        authState: 'SIGNED_IN',
        user: {
          id: currentUser.id,
          email: currentUser.email!,
          username: profile?.username || currentUser.email!.split('@')[0],
          avatar: profile?.avatar,
          bookmarks: profile?.bookmarks || [],
          visitedPlaces: profile?.visited_places || [],
        },
        profile,
      });
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
      
      set({
        authState: 'SIGNED_IN',
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: profile?.username || data.user.email!.split('@')[0],
          avatar: profile?.avatar,
          bookmarks: profile?.bookmarks || [],
          visitedPlaces: profile?.visited_places || [],
        },
        profile,
      });
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
      
      set({
        authState: 'SIGNED_IN',
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: email.split('@')[0],
          avatar: profile?.avatar,
          bookmarks: profile?.bookmarks || [],
          visitedPlaces: profile?.visited_places || [],
        },
        profile: profile || {
          id: data.user.id,
          username: email.split('@')[0],
          bookmarks: [],
          visited_places: [],
        },
      });
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
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Get updated profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      set({
        user: {
          ...user,
          ...updates,
        },
        profile,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));