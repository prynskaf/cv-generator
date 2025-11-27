# Profile Picture Integration Setup

This document describes the profile picture feature that has been integrated into the CV Generator platform.

## Database Migration

Run the following SQL migration to add profile picture support:

```sql
-- Run this in your Supabase SQL Editor
-- File: supabase-migration-profile-picture.sql

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS show_profile_picture BOOLEAN DEFAULT true;
```

## Supabase Storage Setup

1. **Create Storage Bucket:**
   - Go to Supabase Dashboard > Storage
   - Click "Create a new bucket"
   - Name: `profile-pictures`
   - Set to **Public** (or Private with proper RLS policies)

2. **Storage Policies:**

**Option A: Private Bucket with RLS (Recommended for Security)**

Run the SQL file `supabase-storage-policies-profile-pictures.sql` in your Supabase SQL Editor, OR copy the policies below:

```sql
-- Policy: Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload own profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to read their own profile pictures
CREATE POLICY "Users can read own profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Option B: Public Bucket (Easier but Less Secure)**

1. Set the bucket to **Public** in Supabase Dashboard > Storage > profile-pictures > Settings
2. No RLS policies needed
3. Files will be accessible via public URLs

**Note:** If you're getting RLS errors, make sure:
- The bucket exists and is named exactly `profile-pictures`
- The RLS policies are created (if using Private bucket)
- The bucket is set to Public (if using Public bucket)

## Features

### 1. Profile Picture Upload
- Users can upload profile pictures (PNG, JPG, WebP)
- Maximum file size: 5MB
- Images are stored in Supabase Storage
- Automatic resizing/cropping handled client-side before upload

### 2. Template-Specific Integration

Each CV template has specific profile picture rules:

- **Modern Clean**: Circle, 80-120px, top-left or top-center
- **Corporate Professional**: Rounded rectangle, medium size, right-aligned in header
- **Tech Minimal**: Small circle, subtle placement

### 3. Show/Hide Toggle
- Users can toggle profile picture visibility per CV generation
- Toggle available in the dashboard when generating a new CV
- Default: Enabled (true)

### 4. API Endpoints

#### POST `/api/upload-profile-picture`
Uploads a profile picture for the authenticated user.

**Request:**
- FormData with `file` field
- File types: PNG, JPG, WebP
- Max size: 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://..."
  },
  "message": "Profile picture uploaded successfully!"
}
```

#### DELETE `/api/upload-profile-picture`
Removes the user's profile picture.

**Response:**
```json
{
  "success": true,
  "message": "Profile picture removed successfully!"
}
```

## Usage

1. **Upload Profile Picture:**
   - Go to "My Profile" page
   - Use the "Profile Picture" section
   - Click "Choose Image" and select a file
   - Image will be uploaded automatically

2. **Generate CV with Profile Picture:**
   - Go to Dashboard
   - Click "Generate New CV"
   - Fill in job details
   - Toggle "Show Profile Picture" checkbox (enabled by default)
   - Generate CV

3. **Remove Profile Picture:**
   - Go to "My Profile" page
   - Hover over the profile picture
   - Click the red X button to remove

## Technical Details

- Profile pictures are stored in Supabase Storage bucket: `profile-pictures`
- File path format: `profile-pictures/{user_id}/{timestamp}.{ext}`
- Profile picture URL is stored in `user_profiles.profile_picture_url`
- The `show_profile_picture` flag in `generated_documents` controls visibility per CV
- PDF templates automatically render profile pictures based on template-specific styles

## Notes

- Profile pictures are never modified (no facial feature alterations)
- Only resizing/cropping for layout purposes
- Images are optimized for CV display while maintaining quality
- All templates respect the `show_profile_picture` flag

