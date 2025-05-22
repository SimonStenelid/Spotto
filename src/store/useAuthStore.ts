import { create } from 'zustand';
import { supabase, signInWithEmail, signUpWithEmail, signOut as supabaseSignOut, getCurrentUser } from '../lib/supabase';
import type { AuthState, User } from '../types';

interface AuthStore {
  authState: AuthState;
  user: User | null;
  profile: any | null;
  membership: 'paid' | 'free' | null;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateUser: (user: User) => void;
  updateUserBookmarks: (bookmarks: string[]) => void;
  upgradeToPaid: () => Promise<void>;
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
  membership: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    console.log('=== Auth Store Initialize Start ===');
    try {
      set({ isLoading: true, error: null });
      
      // Get current session
      const { user: currentUser, error: userError } = await getCurrentUser();
      console.log('Current user session:', {
        userId: currentUser?.id,
        email: currentUser?.email,
        isAuthenticated: !!currentUser
      });
      
      if (userError) {
        console.error('Session error:', userError);
        throw userError;
      }
      
      if (!currentUser) {
        console.log('No active session, signing out');
        set({ authState: 'SIGNED_OUT', user: null, profile: null, membership: null });
        return;
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      console.log('Profile data:', {
        hasProfile: !!profile,
        profileId: profile?.id
      });

      // Get membership status with explicit error handling
      const { data: membershipData, error: membershipError } = await supabase
        .from('Membership')
        .select('membership')
        .eq('id', currentUser.id)
        .single();

      if (membershipError) {
        console.error('Membership error:', membershipError);
        // Don't throw, just log the error and default to free
      }

      console.log('Membership query:', {
        userId: currentUser.id,
        membershipData,
        error: membershipError
      });
      
      if (profile) {
        const membership = membershipData?.membership || 'free';
        console.log('Setting final auth state:', {
          authState: 'SIGNED_IN',
          userId: currentUser.id,
          membership,
          hasMembershipData: !!membershipData
        });
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, currentUser.email!),
          profile,
          membership
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
      console.log('=== Auth Store Initialize End ===');
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

      // Get membership status
      const { data: membershipData } = await supabase
        .from('Membership')
        .select('membership')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, data.user.email!),
          profile,
          membership: membershipData?.membership || 'free'
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
      if (error) {
        // If user is already registered, throw a specific error
        if (error.message.includes('already registered')) {
          throw new Error('User already registered');
        }
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user data returned after sign up');
      }

      // Create initial profile if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.email?.split('@')[0], // Default username from email
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            bookmarks: [],
            visited_places: []
          });

        if (profileError) throw profileError;
      }

      // Wait a short moment for the database trigger to create the membership record
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now get the created profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Get membership status
      const { data: membershipData } = await supabase
        .from('Membership')
        .select('membership')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        set({
          authState: 'SIGNED_IN',
          user: mapProfileToUser(profile, data.user.email!),
          profile,
          membership: membershipData?.membership || 'free'
        });
      }

      // Initialize the auth state since we're now signed in
      await get().initialize();
    } catch (error) {
      console.error('Signup error:', error);
      set({ error: (error as Error).message });
      throw error;
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
        membership: null
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
      throw error;
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
        bookmarks,
      },
    });
  },

  upgradeToPaid: async () => {
    const { user } = get();
    if (!user) return;

    try {
      // Update local state immediately for better UX
      set({ membership: 'paid' });
      
      // Verify with backend by re-initializing
      await get().initialize();
    } catch (error) {
      console.error('Error upgrading membership:', error);
      // Revert local state if backend fails
      set({ membership: 'free' });
    }
  },
}));