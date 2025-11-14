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
    })
    return response.text
  } catch (error: any) {
    console.error('Gemini error:', error.message)
    throw error
  }
}

export async function analyzeJobDescription(
  jobDescription: string,
  userProfile: UserProfile
): Promise<JobAnalysis> {
  const prompt = `Analyze the following job description and compare it with the candidate's profile.

Job Description:
${jobDescription}

Candidate Profile:
Name: ${userProfile.full_name}
Summary: ${userProfile.summary}
Skills: ${userProfile.skills.map(s => `${s.skill_name} (${s.skill_level})`).join(', ')}
Experience: ${userProfile.experiences.map(e => `${e.position} at ${e.company}`).join(', ')}

Please analyze and provide:
1. Key keywords from the job description
2. Required skills mentioned in the job
3. Main responsibilities
4. Skills the candidate is missing
5. Match percentage (0-100)
6. Suggestions for improvement

Return ONLY a valid JSON object with keys: keywords, required_skills, responsibilities, missing_skills, match_percentage, suggestions. No markdown, no code blocks, just the JSON.`

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
  const prompt = `Create a tailored CV content for the following job application.

Job Description:
${jobDescription}

Candidate Profile:
${JSON.stringify(userProfile, null, 2)}

Job Analysis:
${JSON.stringify(analysis, null, 2)}

Please generate optimized CV content that:
1. Emphasizes relevant experience and skills for this job
2. Uses keywords from the job description
3. Rewrites experience descriptions to match job responsibilities
4. Highlights achievements relevant to the role
5. Ensures ATS-friendly formatting
6. **IMPORTANT**: Include ALL sections from the candidate profile:
   - Personal information (full_name, email, phone, location, summary)
   - Work experiences (all entries)
   - Education (all entries)
   - Skills (all entries)
   - Links (linkedin, github, portfolio) - if provided
   - Languages (all entries with proficiency levels) - if provided
   - Projects (all entries with technologies) - if provided

Return ONLY a valid JSON object with the EXACT SAME STRUCTURE as the candidate profile but with optimized content. Include all fields even if they are empty. No markdown, no code blocks, just the JSON.`

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
