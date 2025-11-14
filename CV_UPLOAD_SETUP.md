# CV Upload Feature Setup Instructions

## Database Migration Required

You need to run the database migration to add support for the new fields (links, languages, projects).

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Run the Migration**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy and paste the contents of `supabase-migration-cv-upload.sql`
   - Click "Run" to execute the migration

3. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see these new tables:
     - `links`
     - `languages`
     - `projects`
   - The `user_profiles` table should have new columns:
     - `date_of_birth`
     - `professional_summary`
   - The `skills` table should have new column:
     - `skill_category`

## How to Use the CV Upload Feature

1. **Navigate to Profile Page**
   - Go to http://localhost:3000/profile
   - You'll see a new "Upload Your CV" section at the top

2. **Upload Your CV**
   - Click "Choose PDF or Word file"
   - Select your CV file (PDF, DOC, or DOCX)
   - Click "Upload & Extract"

3. **AI Extraction Process**
   - The system will extract text from your CV
   - Gemini AI will parse and structure the data
   - Your profile will be automatically filled with:
     - Personal information
     - Work experience
     - Education
     - Skills (with categories)
     - Languages
     - Projects
     - Social links (LinkedIn, GitHub, Portfolio)

4. **Review and Edit**
   - After upload completes, the page will refresh
   - Review all extracted information
   - Make any necessary corrections
   - Save changes

## Supported Data Fields

The AI extraction supports:

- **Personal Info**: Full name, email, phone, location, date of birth, professional summary
- **Links**: LinkedIn, GitHub, Portfolio, Other links
- **Languages**: Language name and proficiency level
- **Experience**: Company, position, location, dates, description
- **Education**: Institution, degree, field of study, location, dates, description
- **Skills**: Skill name, category, proficiency level (Beginner/Intermediate/Advanced)
- **Projects**: Project name, description, technologies used

## Troubleshooting

### Error: "Could not find the table 'links'"
- You haven't run the migration yet
- Follow the "Database Migration Required" steps above

### Error: "Failed to extract CV data"
- The CV file might be corrupted or empty
- Try a different CV file
- Ensure the CV has readable text (not just images)

### Error: "Gemini API unavailable"
- Check your `GEMINI_API_KEY` in `.env.local`
- The system will automatically retry
- If Gemini is overloaded, try again in a few minutes

### Extraction Quality Issues
- Ensure your CV is well-formatted
- Use standard section headings (Experience, Education, Skills, etc.)
- Clear dates in standard formats (e.g., Jan 2020 - Dec 2022)
- Bullet points for descriptions work best

## Technical Details

### File Processing Flow
1. User uploads PDF/DOCX file
2. Backend extracts raw text using `pdf-parse` or `mammoth`
3. Text is sent to Gemini AI with structured JSON schema
4. AI returns parsed data matching the schema
5. Backend saves data to Supabase tables
6. Frontend refreshes to show extracted data

### API Endpoint
- **URL**: `/api/upload-cv`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: FormData with 'file' field
- **Response**: JSON with success/error message

### Security
- Authentication required (must be logged in)
- File type validation (only PDF, DOC, DOCX)
- RLS policies ensure users can only modify their own data
- File content is extracted server-side, not stored permanently
