import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

Return the response in JSON format with keys: keywords, required_skills, responsibilities, missing_skills, match_percentage, suggestions`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert HR analyst and career advisor. Analyze job descriptions and candidate profiles, providing detailed insights in JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const result = JSON.parse(completion.choices[0].message.content || '{}')
  return result as JobAnalysis
}

export async function generateTailoredCV(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis
): Promise<any> {
  const prompt = `You are an expert CV writer. Create a tailored, optimized CV for this job application.

**Job Description:**
${jobDescription}

**Candidate's Current Profile:**
${JSON.stringify(userProfile, null, 2)}

**Job Analysis:**
${JSON.stringify(analysis, null, 2)}

**YOUR TASK:**
Generate an optimized CV with the EXACT same structure as the candidate profile, but with enhanced, detailed content.

**CRITICAL REQUIREMENTS:**

1. **Experience Section - MUST INCLUDE:**
   - For EACH work experience, generate 4-6 detailed bullet points describing:
     * Key achievements with quantifiable results (numbers, percentages, metrics)
     * Technical responsibilities using keywords from the job description
     * Leadership/collaboration examples
     * Problem-solving accomplishments
     * Technologies/tools used
   - Use action verbs: Led, Developed, Implemented, Optimized, Designed, etc.
   - Include metrics: "Increased performance by 40%", "Reduced costs by $50k", "Managed team of 5"
   - Match bullet points to the job requirements
   - Even if the candidate provided minimal description, YOU MUST generate detailed, realistic achievements based on their role title and company

2. **Education Section - ENHANCE:**
   - Add relevant coursework if applicable
   - Include GPA if strong (>3.5)
   - Mention honors, awards, relevant projects
   - Add 1-2 bullet points about key learnings or achievements during education

3. **Summary - OPTIMIZE:**
   - Tailor summary to match the job description
   - Highlight years of experience
   - Mention key skills relevant to the role
   - Include 2-3 major achievements

4. **Skills - PRIORITIZE:**
   - List most relevant skills first
   - Group by category (Programming, Frameworks, Tools, etc.)
   - Include skill_level (Proficient, Expert, Intermediate)
   - Add skill_category for grouping

5. **Projects - DETAIL:**
   - If user has projects, enhance descriptions
   - Add impact/results
   - List technologies used

**EXAMPLE EXPERIENCE FORMAT:**
{
  "experiences": [
    {
      "company": "Company Name",
      "position": "Role Title",
      "location": "City, Country",
      "start_date": "2023-01-01",
      "end_date": "2024-05-01",
      "is_current": false,
      "description": "Led development of microservices architecture serving 100k+ users, improving system performance by 45%\\nImplemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes\\nMentored 3 junior developers and conducted code reviews to maintain quality standards\\nDesigned and built RESTful APIs using Node.js and Express, handling 1M+ requests/day\\nCollaborated with cross-functional teams to deliver features 20% faster than planned"
    }
  ]
}

**IMPORTANT:** 
- Return the FULL profile structure with ALL sections (full_name, email, phone, location, summary, experiences, education, skills, languages, projects, links)
- DO NOT remove any existing data, only enhance it
- For experiences and education, the "description" field should contain multiple bullet points separated by \\n
- Be specific, quantifiable, and relevant to the job description
- Use the candidate's actual background to create realistic, believable achievements

Return ONLY valid JSON matching this structure.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert professional CV writer with 15 years of experience. You specialize in creating ATS-optimized, achievement-focused CVs that get interviews. You ALWAYS generate detailed bullet points for each role, with quantifiable achievements and relevant keywords.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}

export async function generateCoverLetter(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis,
  jobTitle: string,
  companyName: string
): Promise<string> {
  const prompt = `Write a professional cover letter for the following job application.

Job Title: ${jobTitle}
Company: ${companyName}

Job Description:
${jobDescription}

Candidate Profile:
Name: ${userProfile.full_name}
Summary: ${userProfile.summary}
Skills: ${userProfile.skills.map(s => s.skill_name).join(', ')}
Recent Experience: ${userProfile.experiences[0]?.position} at ${userProfile.experiences[0]?.company}

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

Return just the cover letter text, no JSON formatting.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert cover letter writer who creates compelling, personalized cover letters that get interviews.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
  })

  return completion.choices[0].message.content || ''
}
