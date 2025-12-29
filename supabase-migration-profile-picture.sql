-- Add profile_picture_url column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add show_profile_picture flag to generated_documents table
-- This allows users to toggle profile picture visibility per CV
ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS show_profile_picture BOOLEAN DEFAULT true;

-- Note: Profile pictures will be stored in Supabase Storage bucket 'profile-pictures'
-- Make sure to create this bucket and set up appropriate RLS policies

