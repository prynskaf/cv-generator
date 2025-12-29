# Quick Fix for Profile Picture Storage Error

If you're getting the error: **"new row violates row-level security policy"**, follow these steps:

## Quick Solution (Choose One)

### Option 1: Make Bucket Public (Easiest - 2 minutes)

1. Go to Supabase Dashboard > Storage
2. Click on the `profile-pictures` bucket (or create it if it doesn't exist)
3. Go to **Settings** tab
4. Toggle **Public bucket** to **ON**
5. Click **Save**
6. Try uploading again!

### Option 2: Set Up RLS Policies (More Secure - 5 minutes)

1. **Create the bucket** (if it doesn't exist):
   - Go to Supabase Dashboard > Storage
   - Click "Create a new bucket"
   - Name: `profile-pictures`
   - Leave it as **Private**

2. **Run the SQL policies**:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase-storage-policies-profile-pictures.sql`
   - Click **Run**
   - You should see "Success. No rows returned"

3. **Verify policies were created**:
   - Go to Storage > profile-pictures > Policies
   - You should see 4 policies listed

4. Try uploading again!

## Troubleshooting

### Still getting errors?

1. **Check bucket name**: Must be exactly `profile-pictures` (with hyphen, lowercase)
2. **Check bucket exists**: Go to Storage and verify the bucket is there
3. **Check policies**: If using Private bucket, verify all 4 policies exist
4. **Try Public bucket**: Switch to Public temporarily to test if it's a policy issue

### Common Issues

- **Bucket doesn't exist**: Create it first in Storage
- **Wrong bucket name**: Must match exactly `profile-pictures`
- **Policies not applied**: Run the SQL file again
- **Bucket is Private but no policies**: Either add policies or make it Public

## File Path Structure

Files are stored as: `{user_id}/{timestamp}.{ext}`
Example: `123e4567-e89b-12d3-a456-426614174000/1699123456789.jpg`

This ensures each user can only access their own files when using RLS policies.

