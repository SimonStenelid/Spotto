import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

// Supabase configuration
// These environment variables will need to be set after connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Place data helpers
export const getPlaces = async (moods?: string[]) => {
  let query = supabase.from('places').select('*');
  
  if (moods && moods.length > 0) {
    query = query.containedBy('moods', moods);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getPlaceById = async (id: string) => {
  const { data, error } = await supabase
    .from('places')
    .select(`
      *,
      reviews (*)
    `)
    .eq('id', id)
    .single();
  
  return { data, error };
};

// User profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

export const updateAvatar = async (userId: string, file: File) => {
  try {
    // Delete existing avatar if any
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (existingFiles?.length) {
      await Promise.all(
        existingFiles.map(file => 
          supabase.storage
            .from('avatars')
            .remove([`${userId}/${file.name}`])
        )
      );
    }

    // Upload image
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Store metadata in profile_pictures table
    const { error: metadataError } = await supabase
      .from('profile_pictures')
      .upsert({
        user_id: userId,
        storage_path: filePath,
        file_name: file.name,
        content_type: file.type,
        size_bytes: file.size,
      });

    if (metadataError) {
      console.error('Metadata error:', metadataError);
      throw metadataError;
    }
    
    // Update profile avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar: publicUrl })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }
    
    return { publicUrl };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return { error };
  }
};

// Bookmark helpers
export const addBookmark = async (userId: string, placeId: string) => {
  const { data: profile, error: fetchError } = await getProfile(userId);
  if (fetchError) return { error: fetchError };
  
  const bookmarks = [...(profile.bookmarks || []), placeId];
  
  const { error } = await supabase
    .from('profiles')
    .update({ bookmarks })
    .eq('id', userId);
  
  return { error };
};

export const removeBookmark = async (userId: string, placeId: string) => {
  const { data: profile, error: fetchError } = await getProfile(userId);
  if (fetchError) return { error: fetchError };
  
  const bookmarks = (profile.bookmarks || []).filter((id: string) => id !== placeId);
  
  const { error } = await supabase
    .from('profiles')
    .update({ bookmarks })
    .eq('id', userId);
  
  return { error };
};

export const getBookmarkedPlaces = async (userId: string) => {
  const { data: profile, error: fetchError } = await getProfile(userId);
  if (fetchError) return { error: fetchError };
  
  if (!profile.bookmarks?.length) return { data: [] };
  
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .in('id', profile.bookmarks);
  
  return { data, error };
};