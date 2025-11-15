import { GoogleGenAI } from "@google/genai"
import * as mockAI from './mock-ai'

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

1. **Experience Section - MUST GENERATE DETAILED BULLET POINTS:**
   - For EACH work experience, create 4-6 bullet points with:
     * Quantifiable achievements (numbers, percentages, metrics)
     * Technical responsibilities using job description keywords
     * Leadership and collaboration examples
     * Problem-solving accomplishments
     * Technologies and tools used
   - Use action verbs: Led, Developed, Implemented, Optimized, Increased, Reduced
   - Include specific metrics: "Improved performance by 40%", "Managed team of 5", "Reduced costs by $50k"
   - EVEN IF the user's description is short or empty, YOU MUST generate realistic, detailed achievements based on their job title and company
   - Separate bullet points with \\n in the description field

2. **Education Section - ENHANCE:**
   - Add relevant coursework, honors, achievements
   - Include GPA if strong
   - Add 1-2 bullet points about projects or learnings

3. **Summary - OPTIMIZE:**
   - Tailor to match job requirements
   - Highlight years of experience and key skills
   - Include 2-3 major career achievements

4. **Skills - CATEGORIZE:**
   - Group by category (Programming, Frameworks, Tools, etc.)
   - Include skill_level and skill_category
   - Prioritize skills relevant to the job

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

**IMPORTANT:**
- Return COMPLETE JSON with ALL fields: full_name, email, phone, location, summary, experiences, education, skills, languages, projects, links
- DO NOT remove existing data, only enhance it
- For experiences/education, put multiple bullet points in "description" field separated by \\n
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
  const profileDetails = `
Name: ${userProfile.full_name}
Email: ${userProfile.email}
Phone: ${userProfile.phone}
Summary: ${userProfile.summary}
Skills: ${userProfile.skills.map(s => s.skill_name).join(', ')}
Recent Experience: ${userProfile.experiences[0]?.position} at ${userProfile.experiences[0]?.company}
${userProfile.languages && userProfile.languages.length > 0 ? `Languages: ${userProfile.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}` : ''}
${userProfile.projects && userProfile.projects.length > 0 ? `Notable Projects: ${userProfile.projects.map(p => p.name).join(', ')}` : ''}
${userProfile.links?.linkedin ? `LinkedIn: ${userProfile.links.linkedin}` : ''}
${userProfile.links?.github ? `GitHub: ${userProfile.links.github}` : ''}
${userProfile.links?.portfolio ? `Portfolio: ${userProfile.links.portfolio}` : ''}
  `.trim()

  const prompt = `Write a professional cover letter for the following job application.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Candidate Profile:
${profileDetails}

Job Match Analysis:
Match Percentage: ${analysis.match_percentage}%
Key Skills Match: ${analysis.required_skills.join(', ')}

Please write a compelling cover letter that:
1. Shows enthusiasm for the role and company
2. Highlights relevant experience and skills
3. Addresses key job requirements
4. Demonstrates value the candidate can bring
5. Maintains a professional yet personable tone
6. Is 3-4 paragraphs long
7. If the candidate has relevant projects or languages, mention them when appropriate
8. If portfolio/GitHub links are available, subtly reference online work when relevant

Return just the cover letter text, no additional formatting or markdown.`

  try {
    return await callGemini(prompt)
  } catch (error) {
    console.log('Gemini unavailable, using mock AI')
    return mockAI.generateCoverLetter(jobDescription, userProfile, analysis, jobTitle, companyName)
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
