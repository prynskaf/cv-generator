# Quick Start Guide

## Step-by-Step Setup

### 1. Install Dependencies
\`\`\`bash
cd cv-generator
npm install
\`\`\`

### 2. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the database to be ready (takes ~2 minutes)

### 3. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste into the SQL Editor and click **Run**
4. Verify all tables are created in the **Table Editor**

### 4. Set Up Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name: `documents`
4. Make it **Public** (or follow STORAGE_SETUP.md for private setup)
5. Click **Create bucket**

### 5. Get Your API Keys

1. In Supabase, go to **Project Settings** > **API**
2. Copy these values:
   - Project URL
   - `anon` `public` key

### 6. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and save it securely

### 7. Configure Environment Variables

Create `.env.local` in the project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-key-here
\`\`\`

### 8. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

### 9. Test the Application

1. Click **Sign Up** and create an account
2. Go to **My Profile** and add:
   - Personal information
   - At least one work experience
   - At least one education entry
   - A few skills
3. Return to **Dashboard**
4. Click **Generate New CV**
5. Fill in:
   - Job Title
   - Job Description (paste a real one for best results)
6. Click **Generate CV & Cover Letter**
7. Wait for AI to analyze and generate (~30 seconds)
8. Click **Download PDF**

## Common Issues

### Port Already in Use
If port 3000 is taken:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Supabase Connection Error
- Verify your `.env.local` has the correct URL and key
- Check that Supabase project is active (not paused)

### OpenAI API Error
- Verify your API key is valid
- Check you have credits in your OpenAI account
- Ensure the key has permission for GPT-4

## Next Steps

- Customize CV templates in `lib/templates/`
- Modify AI prompts in `lib/openai.ts`
- Add more features from the roadmap
- Deploy to Vercel

## Need Help?

Check the main README.md for detailed documentation or open an issue on GitHub.
