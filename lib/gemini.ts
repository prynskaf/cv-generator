import { GoogleGenAI } from "@google/genai"
import * as mockAI from './mock-ai'
import { optimizeCoverLetter, validateCoverLetter } from './coverLetterOptimizer'
import { cleanCoverLetter } from './coverLetterCleaner'

export interface JobAnalysis {
  keywords: string[]
  required_skills: string[]
  responsibilities: string[]
  missing_skills: string[]
  match_percentage: number
  suggestions: string[]
}

export interface UserProfile {
  full_name: string
  email: string
  phone: string
  location: string
  summary: string
  experiences: Array<{
    company: string
    position: string
    location: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field_of_study: string
    location: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string
  }>
  skills: Array<{
    skill_name: string
    skill_level: string
  }>
  links?: {
    linkedin: string
    github: string
    portfolio: string
  }
  languages?: Array<{
    name: string
    proficiency: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
  }>
  certifications?: Array<{
    name: string
    issuing_organization: string
    issue_date: string | null
    expiry_date: string | null
    credential_id?: string
    credential_url?: string
    description?: string
  }>
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text ?? ""; // fallback to empty string
  } catch (error: any) {
    console.error("Gemini error:", error.message);
    throw error;
  }
}

export async function analyzeJobDescription(
  jobDescription: string,
  userProfile: UserProfile
): Promise<JobAnalysis> {
  const userSkills = userProfile.skills.map(s => `${s.skill_name} (${s.skill_level})`).join(', ')
  
  const prompt = `You are an AI skill relevance engine.
Your job is to compare user skills with job description requirements for any industry.
Use semantic reasoning, industry knowledge, and skill equivalence logic.
Return results in the required JSON format only.
If a job mentions a tool or technology, match it to the closest related skill when possible.
Never include skills that are irrelevant for the job.
Never hallucinate new skills.

Here are the user's skills:
${userSkills}

Here is the job description:
${jobDescription}

Candidate Profile Context:
Name: ${userProfile.full_name}
Summary: ${userProfile.summary}
Experience: ${userProfile.experiences.map(e => `${e.position} at ${e.company}`).join(', ')}

Step 1: Extract all skills mentioned in the job description.
Step 2: Compare them with the user skills using exact + semantic matching.
Step 3: Identify relevant skills (user has and job needs), missing skills (job needs but user lacks), and calculate match score.

Return ONLY a valid JSON object with this structure:
{
  "keywords": ["keyword1", "keyword2"],
  "required_skills": ["skill1", "skill2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "missing_skills": ["missing_skill1", "missing_skill2"],
  "match_percentage": 85,
  "suggestions": ["suggestion1", "suggestion2"]
}

No markdown, no code blocks, just the JSON.`

  try {
    const text = await callGemini(prompt)
    const cleanedResponse = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(cleanedResponse) as JobAnalysis
  } catch (error) {
    console.log('Gemini unavailable, using mock AI')
    return mockAI.analyzeJobDescription(jobDescription, userProfile)
  }
}

export async function generateTailoredCV(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis
): Promise<any> {
  const prompt = `You are an expert professional CV writer with 15 years of experience. Create a tailored, optimized CV for this job application.

**Job Description:**
${jobDescription}

**Candidate's Current Profile:**
${JSON.stringify(userProfile, null, 2)}

**Job Analysis:**
${JSON.stringify(analysis, null, 2)}

**YOUR CRITICAL TASK:**
Generate an optimized CV with the EXACT same JSON structure, but with enhanced, detailed content.

**MANDATORY REQUIREMENTS:**

1. **Experience Section - CONCISE BULLET POINTS:**
   - For EACH work experience, create ONLY 1-3 bullet points (maximum 3)
   - Each bullet point must be SHORT and CONCISE (one sentence, maximum 15-20 words)
   - Focus on key achievements with quantifiable results (numbers, percentages)
   - Use action verbs: Led, Developed, Implemented, Optimized, Increased, Reduced
   - Include specific metrics: "Improved performance by 40%", "Reduced costs by $50k"
   - Keep sentences brief and impactful - no long, complex sentences
   - Separate bullet points with \\n in the description field
   - Example format: "Developed React components improving user engagement by 30%." (short, one sentence)

2. **Education Section - ENHANCE:**
   - Add relevant coursework, honors, achievements
   - Include GPA if strong
   - Add 1-2 bullet points about projects or learnings

3. **Summary - OPTIMIZE:**
   - Tailor to match job requirements
   - Highlight years of experience and key skills
   - Include 2-3 major career achievements

4. **Skills - CRITICAL FILTERING:**
   - ONLY include skills that:
     * The user ACTUALLY HAS in their profile (check userProfile.skills array)
     * Are RELEVANT to the job description (match job requirements)
   - DO NOT add any skills the user doesn't have - only use skills from userProfile.skills
   - Filter to show only skills that match or are closely related to job requirements
   - Group by category (Programming, Frameworks, Tools, etc.)
   - Include skill_level and skill_category from the user's original skills
   - Prioritize skills that are both in user's profile AND mentioned in job description
   - If a skill is in job description but NOT in user's profile, DO NOT include it

**EXAMPLE EXPERIENCE OUTPUT:**
{
  "experiences": [
    {
      "company": "BeCode",
      "position": "Junior Web Developer Trainee",
      "location": "Brussels",
      "start_date": "2023-05-01",
      "end_date": "2023-11-01",
      "is_current": false,
      "description": "Developed 5+ full-stack web applications using React, Node.js, and MongoDB, serving 1000+ users\\nImplemented responsive UI/UX designs improving mobile user engagement by 35%\\nCollaborated with team of 4 developers using Git version control and Agile methodologies\\nBuilt RESTful APIs and integrated third-party services including Stripe and Auth0\\nConducted code reviews and pair programming sessions, improving code quality by 25%\\nOptimized database queries reducing page load time by 40%"
    }
  ]
}

5. **Projects - SHORT DESCRIPTIONS:**
   - Keep project descriptions to ONE LINE only (maximum 15-20 words)
   - Be concise and impactful - no long paragraphs
   - Focus on what was built and key technology used
   - Example: "Built AI-powered email assistant using React and OpenAI API." (short, one line)

**IMPORTANT:**
- Return COMPLETE JSON with ALL fields: full_name, email, phone, location, summary, experiences, education, skills, languages, projects, certifications, links
- DO NOT remove existing data, only enhance it
- For experiences/education, put 1-3 bullet points in "description" field separated by \\n (each bullet is one short sentence)
- For projects, keep description to one short line
- Skills: ONLY include skills from userProfile.skills that match the job description
- Include certifications if the user has any - these are important credentials that should be highlighted
- Be specific, quantifiable, and realistic based on the candidate's actual background
- Use job description keywords naturally throughout

Return ONLY valid JSON, no markdown, no code blocks.`

  try {
    const text = await callGemini(prompt)
    const cleanedResponse = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(cleanedResponse)
  } catch (error) {
    console.log('Gemini unavailable, using mock AI')
    return mockAI.generateTailoredCV(jobDescription, userProfile, analysis)
  }
}
export async function generateCoverLetter(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis,
  jobTitle: string,
  companyName: string
): Promise<string> {
  const certificationsText = userProfile.certifications && userProfile.certifications.length > 0
    ? `Certifications: ${userProfile.certifications.map(cert => 
        `${cert.name} from ${cert.issuing_organization}${cert.issue_date ? ` (${cert.issue_date})` : ''}`
      ).join(', ')}`
    : ''

  const profileDetails = `
Name: ${userProfile.full_name}
Email: ${userProfile.email}
Phone: ${userProfile.phone}
Summary: ${userProfile.summary}
Skills: ${userProfile.skills.map(s => s.skill_name).join(', ')}
Recent Experience: ${userProfile.experiences[0]?.position} at ${userProfile.experiences[0]?.company}
${userProfile.languages && userProfile.languages.length > 0 ? `Languages: ${userProfile.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}` : ''}
${userProfile.projects && userProfile.projects.length > 0 ? `Notable Projects: ${userProfile.projects.map(p => p.name).join(', ')}` : ''}
${certificationsText}
${userProfile.links?.linkedin ? `LinkedIn: ${userProfile.links.linkedin}` : ''}
${userProfile.links?.github ? `GitHub: ${userProfile.links.github}` : ''}
${userProfile.links?.portfolio ? `Portfolio: ${userProfile.links.portfolio}` : ''}
  `.trim()

  const prompt = `You are an expert cover letter writer. Write a professional, optimized cover letter for this job application.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Candidate Profile:
${profileDetails}

Job Match Analysis:
Match Percentage: ${analysis.match_percentage}%
Key Skills Match: ${analysis.required_skills.join(', ')}

CRITICAL REQUIREMENTS - FOLLOW THESE STRICTLY:

1. **LENGTH & STRUCTURE:**
   - Write exactly 3-4 paragraphs (no more, no less)
   - Target 250-350 words total (be concise and impactful)
   - Each paragraph should be 60-90 words
   - Opening paragraph: Express interest and key value proposition
   - Middle paragraph(s): Highlight relevant experience and achievements
   - Closing paragraph: Reiterate enthusiasm and call to action

2. **WORD OPTIMIZATION - AVOID REPETITION:**
   - DO NOT repeat the same words or phrases multiple times
   - Use varied vocabulary and synonyms throughout
   - Avoid repeating job title, company name, or key skills more than once per paragraph
   - Use different action verbs (led, developed, implemented, optimized, achieved, delivered, etc.)
   - Vary sentence structure and length for readability

3. **CONTENT REQUIREMENTS:**
   - Show genuine enthusiasm for the role and company (mention specific company values/mission if known)
   - Highlight 2-3 most relevant experiences with quantifiable achievements
   - Address top 3-4 key job requirements from the job description
   - Demonstrate unique value the candidate brings
   - If candidate has relevant certifications, mention 1-2 most relevant ones naturally
   - If candidate has notable projects, mention 1 most impressive project briefly
   - If portfolio/GitHub available, subtly reference it once

4. **TONE & STYLE:**
   - Professional yet personable and authentic
   - Confident but not arrogant
   - Specific and concrete (use numbers/metrics when possible)
   - Active voice preferred
   - Clear and concise - every sentence should add value

5. **QUALITY CHECKS:**
   - No filler words or generic phrases
   - No repetition of ideas or statements
   - Each paragraph should have a distinct purpose
   - Smooth transitions between paragraphs
   - Strong opening hook and compelling closing

EXAMPLE STRUCTURE:
Paragraph 1 (60-80 words): Opening with enthusiasm, mention role, and key value proposition
Paragraph 2 (80-100 words): Highlight relevant experience with specific achievements and metrics
Paragraph 3 (80-100 words): Address job requirements and demonstrate fit
Paragraph 4 (60-70 words): Closing with enthusiasm and call to action

CRITICAL - DO NOT INCLUDE:
- NO "Dear Hiring Manager," or any greeting
- NO "Sincerely," or any closing
- NO signature or name at the end
- NO date, address, or contact information
- NO headers or formatting

Return ONLY the body paragraphs of the cover letter. Start directly with the first paragraph content. The letter will be formatted automatically with proper headers and signatures.`

  try {
    let coverLetter = await callGemini(prompt)
    
    // Step 1: Comprehensive cleaning - remove all greetings, signatures, headers
    coverLetter = cleanCoverLetter(coverLetter)
    
    // Step 2: Remove markdown formatting
    coverLetter = coverLetter.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/\*/g, '')
    
    // Step 3: Optimize the cover letter (length, duplicates, etc.)
    coverLetter = optimizeCoverLetter(coverLetter, {
      maxWords: 350,
      minWords: 200,
      maxParagraphs: 4,
      removeDuplicates: true,
    })
    
    // Step 4: Final cleaning pass to ensure no greetings/signatures slipped through
    coverLetter = cleanCoverLetter(coverLetter)
    
    // Step 5: Validate and log issues
    const validation = validateCoverLetter(coverLetter)
    if (!validation.isValid) {
      console.warn('Cover letter validation issues:', validation.issues)
    }
    
    return coverLetter
  } catch (error) {
    console.log('Gemini unavailable, using mock AI')
    let mockLetter = await mockAI.generateCoverLetter(jobDescription, userProfile, analysis, jobTitle, companyName)
    // Clean and optimize mock letter too
    mockLetter = cleanCoverLetter(mockLetter)
    return optimizeCoverLetter(mockLetter, {
      maxWords: 350,
      minWords: 200,
      maxParagraphs: 4,
      removeDuplicates: true,
    })
  }
}

export interface ExtractedCVData {
  fullName: string
  email: string
  phone: string
  location: string
  dateOfBirth: string
  professionalSummary: string
  links: {
    linkedin: string
    github: string
    portfolio: string
    otherLinks: string[]
  }
  languages: Array<{
    name: string
    proficiency: string
  }>
  experience: Array<{
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    currentPosition: boolean
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    fieldOfStudy: string
    location: string
    startDate: string
    endDate: string
    currentlyEnrolled: boolean
    description: string
  }>
  skills: Array<{
    category: string
    name: string
    proficiencyLevel: "Beginner" | "Intermediate" | "Advanced"
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
  }>
}

export async function extractCVData(cvText: string): Promise<ExtractedCVData> {
  const prompt = `Extract all information from the following CV/Resume text and convert it into structured JSON format.

CV Text:
${cvText}

You must extract and return ONLY a valid JSON object that follows this EXACT schema:

{
  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",
  "dateOfBirth": "",
  "professionalSummary": "",
  "links": {
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "otherLinks": []
  },
  "languages": [
    {
      "name": "",
      "proficiency": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "currentPosition": false,
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "fieldOfStudy": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "currentlyEnrolled": false,
      "description": ""
    }
  ],
  "skills": [
    {
      "category": "",
      "name": "",
      "proficiencyLevel": "Beginner | Intermediate | Advanced"
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ]
}

IMPORTANT INSTRUCTIONS:
- Extract ALL available information from the CV
- If a field is not found, use an empty string "" for strings, false for booleans, or [] for arrays
- For dates, use YYYY-MM-DD format when possible, or leave empty if not clear
- For skills, try to categorize them (e.g., "Programming Languages", "Frameworks", "Tools", "Soft Skills")
- For proficiency levels, infer from context or use "Intermediate" as default
- Return ONLY the JSON object, no markdown, no code blocks, no explanations`

  try {
    const text = await callGemini(prompt)
    const cleanedResponse = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(cleanedResponse) as ExtractedCVData
  } catch (error) {
    console.error('CV extraction failed, using mock AI fallback:', error)
    return mockAI.extractCVData(cvText)
  }
}
