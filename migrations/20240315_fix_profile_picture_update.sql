-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_profile_picture;

-- Create the function with correct parameters
CREATE OR REPLACE FUNCTION update_profile_picture(
  p_user_id UUID,
  p_storage_path TEXT,
  p_file_name TEXT,
  p_content_type TEXT,
  p_size_bytes BIGINT,
  p_avatar_url TEXT
)
RETURNS void AS $$
BEGIN
  -- Update the profiles table with the new avatar URL
  UPDATE profiles 
  SET 
    avatar = p_avatar_url,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Insert a record into profile_pictures table
  INSERT INTO profile_pictures (
    user_id,
    storage_path,
    file_name,
    content_type,
    size_bytes,
    avatar_url,
    created_at
  ) VALUES (
    p_user_id,
    p_storage_path,
    p_file_name,
    p_content_type,
    p_size_bytes,
    p_avatar_url,
    NOW()
  );
END;
$$ LANGUAGE plpgsql; 