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
  return {
    keywords: ['leadership', 'project management', 'team collaboration', 'strategic planning'],
    required_skills: userProfile.skills.map(s => s.skill_name).slice(0, 5),
    responsibilities: [
      'Lead cross-functional teams',
      'Manage project timelines and deliverables',
      'Collaborate with stakeholders'
    ],
    missing_skills: ['public speaking', 'data analytics'],
    match_percentage: 85,
    suggestions: [
      'Emphasize your team leadership experience',
      'Highlight specific project outcomes',
      'Mention any relevant certifications'
    ]
  }
}

export async function generateTailoredCV(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis
): Promise<any> {
  const tailoredProfile = JSON.parse(JSON.stringify(userProfile))
  
  if (tailoredProfile.experiences.length > 0) {
    tailoredProfile.experiences[0].description = 
      `Led cross-functional teams to deliver high-impact projects. ${tailoredProfile.experiences[0].description || ''} Demonstrated strong ${analysis.keywords.join(', ')} skills.`
  }
  
  tailoredProfile.summary = `Results-driven professional with expertise in ${analysis.required_skills.join(', ')}. ${userProfile.summary || ''}`
  
  return tailoredProfile
}

export async function generateCoverLetter(
  jobDescription: string,
  userProfile: UserProfile,
  analysis: JobAnalysis,
  jobTitle: string,
  companyName: string
): Promise<string> {
  // Return ONLY body paragraphs - no greetings, no signatures (these are added by the formatter)
  return `I am writing to express my strong interest in the ${jobTitle} position${companyName ? ` at ${companyName}` : ''}. With a ${analysis.match_percentage}% match to your requirements and proven expertise in ${analysis.required_skills.slice(0, 3).join(', ')}, I am confident I would be a valuable addition to your team.

In my current role as ${userProfile.experiences[0]?.position || 'a professional'} at ${userProfile.experiences[0]?.company || 'my current company'}, I have successfully ${analysis.responsibilities[0]?.toLowerCase() || 'delivered exceptional results'}. My experience aligns perfectly with your needs, particularly in areas such as ${analysis.keywords.slice(0, 3).join(', ')}.

I am particularly excited about this opportunity because it allows me to leverage my skills in ${userProfile.skills.slice(0, 2).map(s => s.skill_name).join(' and ')} while contributing to ${companyName || 'your organization'}'s continued success. I am eager to bring my passion for excellence and proven track record to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my background, skills, and enthusiasm can contribute to ${companyName || 'your organization'}'s goals.`
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
  const lines = cvText.split('\n')
  const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/)
  const phoneMatch = cvText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  
  return {
    fullName: lines[0]?.trim() || "John Doe",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location: "",
    dateOfBirth: "",
    professionalSummary: cvText.substring(0, 200) + "...",
    links: {
      linkedin: "",
      github: "",
      portfolio: "",
      otherLinks: []
    },
    languages: [
      {
        name: "English",
        proficiency: "Native"
      }
    ],
    experience: [
      {
        company: "Sample Company",
        position: "Professional",
        location: "",
        startDate: "2020-01-01",
        endDate: "",
        currentPosition: true,
        description: "Extracted from CV text. Please review and update."
      }
    ],
    education: [
      {
        institution: "University",
        degree: "Bachelor's Degree",
        fieldOfStudy: "",
        location: "",
        startDate: "2015-01-01",
        endDate: "2019-01-01",
        currentlyEnrolled: false,
        description: ""
      }
    ],
    skills: [
      {
        category: "General",
        name: "Communication",
        proficiencyLevel: "Intermediate"
      },
      {
        category: "General",
        name: "Problem Solving",
        proficiencyLevel: "Intermediate"
      }
    ],
    projects: []
  }
}
