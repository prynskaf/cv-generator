-- Add updated_at column to generated_documents table
-- This allows tracking when CVs are last modified

ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create a function to automatically update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_generated_documents_updated_at ON generated_documents;
CREATE TRIGGER update_generated_documents_updated_at
    BEFORE UPDATE ON generated_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policy for updating documents (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generated_documents' 
        AND policyname = 'Users can update own documents'
    ) THEN
        CREATE POLICY "Users can update own documents" ON generated_documents
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

