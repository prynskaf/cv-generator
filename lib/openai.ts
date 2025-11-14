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

Return the response in JSON format with the same structure as the candidate profile but with optimized content.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert CV writer specializing in creating ATS-optimized, job-tailored CVs that highlight relevant experience and skills.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
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
