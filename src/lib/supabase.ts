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
  // First, get the current user
  const { user: currentUser } = await getCurrentUser();
  console.log('getPlaces - Current user:', currentUser?.id); // Debug log
  
  if (!currentUser) {
    console.log('getPlaces - No user, returning preview data');
    // If no user is logged in, return preview data
    let query = supabase.from('places_preview').select('*');
    if (moods && moods.length > 0) {
      query = query.containedBy('moods', moods);
    }
    const { data, error } = await query;
    return { data, error };
  }

  // Check user's membership status
  const { data: membership, error: membershipError } = await supabase
    .from('Membership')
    .select('membership')
    .eq('id', currentUser.id)
    .single();

  console.log('getPlaces - Membership query:', {
    userId: currentUser.id,
    membership,
    error: membershipError
  });

  if (membershipError) {
    console.error('getPlaces - Membership error:', membershipError);
    // If there's an error getting membership, default to preview
    let query = supabase.from('places_preview').select('*');
    if (moods && moods.length > 0) {
      query = query.containedBy('moods', moods);
    }
    const { data, error } = await query;
    return { data, error };
  }

  // If user has paid membership, query the full places table
  if (membership?.membership === 'paid') {
    console.log('getPlaces - User has paid membership, returning full data');
    let query = supabase.from('places').select('*');
    if (moods && moods.length > 0) {
      query = query.containedBy('moods', moods);
    }
    const { data, error } = await query;
    return { data, error };
  }

  // Otherwise, return preview data
  console.log('getPlaces - User has free membership, returning preview data');
  let query = supabase.from('places_preview').select('*');
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
    // Validate input
    if (!userId) throw new Error('User ID is required');
    if (!file) throw new Error('File is required');

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed.');
    }

    console.log('Starting avatar update for user:', userId);

    // Delete existing avatar if any
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (listError) {
      console.error('Error listing existing files:', listError);
      throw listError;
    }

    if (existingFiles?.length) {
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(existingFiles.map(file => `${userId}/${file.name}`));

      if (deleteError) {
        console.error('Error deleting existing files:', deleteError);
        throw deleteError;
      }
    }

    // Upload image
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
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

    if (!publicUrl) {
      throw new Error('Failed to get public URL');
    }

    // Update both profile_pictures and profiles tables
    const { error: updateError } = await supabase.rpc('update_profile_picture', {
      p_user_id: userId,
      p_storage_path: filePath,
      p_file_name: file.name,
      p_content_type: file.type,
      p_size_bytes: file.size.toString(),
      p_avatar_url: publicUrl
    });

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // If update fails, clean up the uploaded file
      await supabase.storage
        .from('avatars')
        .remove([filePath]);
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