# CV & Cover Letter Generator

An AI-powered web application that helps users generate job-tailored CVs and cover letters. Built with Next.js, Supabase, and OpenAI.

## Features

- **User Authentication** - Secure signup/login with Supabase Auth
- **Profile Management** - Store professional background, experience, skills, and education
- **AI Job Analysis** - Analyzes job descriptions and extracts keywords, requirements, and responsibilities
- **Tailored CV Generation** - AI rewrites your CV content to match job requirements
- **Cover Letter Generation** - Creates personalized cover letters for each application
- **Multiple Templates** - Choose from 3 professional CV templates (Modern, Professional, Minimalist)
- **PDF Export** - Generate and download professional PDFs
- **Version History** - Track all generated documents in your dashboard
- **Storage Integration** - Store PDFs in Supabase Storage

## Tech Stack

- **Frontend:** Next.js 15 + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** OpenAI GPT-4
- **PDF Generation:** Puppeteer
- **File Storage:** Supabase Storage
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
cd cv-generator
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon/public key
4. Go to SQL Editor and run the schema from \`supabase-schema.sql\`

### 3. Set Up Supabase Storage

Follow the instructions in \`STORAGE_SETUP.md\` to create the storage bucket for PDFs.

### 4. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
cv-generator/
├── app/
│   ├── api/
│   │   ├── generate/       # AI generation endpoint
│   │   └── export/         # PDF export endpoint
│   ├── dashboard/          # Main dashboard page
│   ├── profile/            # User profile management
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── page.tsx            # Landing page
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── middleware.ts   # Auth middleware
│   ├── templates/
│   │   ├── modern.ts       # Modern CV template
│   │   ├── professional.ts # Professional CV template
│   │   ├── minimalist.ts   # Minimalist CV template
│   │   └── index.ts        # Template exports
│   └── openai.ts           # OpenAI service functions
├── middleware.ts           # Next.js middleware for auth
├── supabase-schema.sql     # Database schema
└── STORAGE_SETUP.md        # Storage setup guide
\`\`\`

## Database Schema

The application uses the following tables:

- \`user_profiles\` - User personal information
- \`experiences\` - Work experience entries
- \`education\` - Education history
- \`skills\` - User skills
- \`generated_documents\` - Generated CVs and cover letters

All tables have Row Level Security (RLS) enabled for data protection.

## Usage Flow

1. **Sign Up** - Create an account
2. **Complete Profile** - Add your experience, education, and skills
3. **Generate CV** - Paste a job description and let AI create a tailored CV
4. **Choose Template** - Select from 3 professional designs
5. **Export PDF** - Download your customized CV and cover letter
6. **Track History** - View all generated documents in your dashboard

## API Endpoints

### POST /api/generate
Analyzes job description and generates tailored CV and cover letter.

**Request Body:**
\`\`\`json
{
  "job_description": "string",
  "job_title": "string",
  "company_name": "string (optional)"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "document_id": "uuid",
  "analysis": {...},
  "cv_content": {...},
  "cover_letter": "string"
}
\`\`\`

### POST /api/export
Exports a generated document to PDF.

**Request Body:**
\`\`\`json
{
  "document_id": "uuid",
  "template_id": "modern|professional|minimalist"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "pdf_url": "string",
  "fileName": "string"
}
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note:** For Puppeteer to work on Vercel, you may need to use a Chromium layer or switch to a serverless-friendly PDF library like \`@react-pdf/renderer\` or \`pdfmake\`.

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Your Supabase anon/public key |
| \`OPENAI_API_KEY\` | Your OpenAI API key (keep secret, server-side only) |

## Future Enhancements

- Payment integration with Stripe
- Free tier limitations (1 CV + 1 cover letter)
- Pay-per-use credits system
- Monthly subscription plans
- DOCX export format
- More CV templates
- LinkedIn profile import
- ATS compatibility checker
- Skill gap analysis

## Troubleshooting

### Puppeteer Issues on Vercel
Puppeteer may not work on Vercel's serverless functions. Consider:
- Using \`chrome-aws-lambda\` package
- Switching to \`@react-pdf/renderer\`
- Using an external PDF generation service

### Supabase RLS Errors
Ensure all RLS policies are correctly applied. Check the \`supabase-schema.sql\` file.

### OpenAI Rate Limits
If you hit rate limits, implement request queuing or upgrade your OpenAI plan.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
