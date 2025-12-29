# Fix: Updated_at Column Error

## 🐛 Problem
When clicking "Save" after editing a CV, the error occurred:
```
Could not find the 'updated_at' column of 'generated_documents' in the schema cache
```

## ✅ Solution

### 1. **Immediate Fix** (Applied)
- Removed `updated_at` from the update query in `/app/api/cv/update/route.ts`
- The table doesn't have this column, so we removed the reference

### 2. **Database Migration** (Optional - For Future)
Created migration file: `supabase-migration-add-updated-at.sql`

This migration:
- Adds `updated_at` column to `generated_documents` table
- Creates automatic trigger to update `updated_at` on row updates
- Adds RLS policy for UPDATE operations

## 📋 To Apply Migration (Optional)

If you want to track when CVs are updated, run this SQL in your Supabase SQL editor:

```sql
-- Add updated_at column
ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_generated_documents_updated_at ON generated_documents;
CREATE TRIGGER update_generated_documents_updated_at
    BEFORE UPDATE ON generated_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add UPDATE RLS policy
CREATE POLICY "Users can update own documents" ON generated_documents
  FOR UPDATE USING (auth.uid() = user_id);
```

## ✅ Status
- ✅ Immediate fix applied - Save should work now
- ✅ Migration file created for future use
- ✅ RLS policy included in migration

**The save functionality should now work without errors!** 🎉

