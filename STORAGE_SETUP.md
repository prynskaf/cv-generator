# Supabase Storage Setup

To enable PDF storage, you need to create a storage bucket in your Supabase project:

## Steps:

1. Go to your Supabase Dashboard
2. Navigate to Storage section
3. Click "Create a new bucket"
4. Name the bucket: `documents`
5. Set it to **Public** (or Private if you prefer authenticated access)
6. Click "Create bucket"

## Storage Policies (if using Private bucket):

If you created a private bucket, add these policies in the Storage Policies section:

### Allow authenticated users to upload their documents:
```sql
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Allow authenticated users to read their documents:
```sql
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Allow authenticated users to delete their documents:
```sql
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Notes:
- PDFs are stored in the format: `{user_id}/{filename}.pdf`
- If the bucket is public, PDFs will be accessible via public URL
- If private, you'll need to generate signed URLs for access
