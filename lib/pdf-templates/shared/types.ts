export interface CVData {
  full_name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  experiences?: Array<{
    company: string
    position: string
    location: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string
  }>
  education?: Array<{
    institution: string
    degree: string
    field_of_study: string
    location: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string
  }>
  skills?: Array<{
    skill_name: string
    skill_level: string
    skill_category?: string
  }>
  languages?: Array<{
    name: string
    proficiency: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies?: string[]
  }>
  links?: {
    linkedin?: string
    github?: string
    portfolio?: string
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || typeof dateStr !== 'string') return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export function splitIntoBullets(text: string | null | undefined): string[] {
  if (!text || typeof text !== 'string') return []
  
  const bulletPatterns = [/[•\-\*]\s+/g, /\n+/g]
  let lines = [text.trim()]
  
  for (const pattern of bulletPatterns) {
    lines = lines.flatMap(line => {
      if (!line || typeof line !== 'string') return []
      return line.split(pattern).filter(l => l && typeof l === 'string' && l.trim().length > 0)
    })
  }
  
  return lines.filter(line => line && typeof line === 'string' && line.trim().length > 0)
}

export function groupSkillsByCategory(skills: CVData['skills']): Record<string, string[]> {
  if (!skills || skills.length === 0) return {}
  
  const grouped: Record<string, string[]> = {}
  
  skills.forEach(skill => {
    if (!skill || !skill.skill_name) return
    const category = skill.skill_category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(skill.skill_name)
  })
  
  return grouped
}

export function sanitizeCVData(data: any): CVData {
  const sanitized: CVData = {
    full_name: data?.full_name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    location: data?.location || '',
    summary: data?.summary || '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    links: {
      linkedin: '',
      github: '',
      portfolio: '',
    },
  }

  if (Array.isArray(data?.experiences)) {
    sanitized.experiences = data.experiences
      .filter((exp: any) => exp && exp.position && exp.company)
      .map((exp: any) => ({
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || null,
        is_current: exp.is_current || false,
        description: exp.description || '',
      }))
  }

  if (Array.isArray(data?.education)) {
    sanitized.education = data.education
      .filter((edu: any) => edu && edu.degree && edu.institution)
      .map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        location: edu.location || '',
        start_date: edu.start_date || '',
        end_date: edu.end_date || null,
        is_current: edu.is_current || false,
        description: edu.description || '',
      }))
  }

  if (Array.isArray(data?.skills)) {
    sanitized.skills = data.skills
      .filter((skill: any) => skill && skill.skill_name)
      .map((skill: any) => ({
        skill_name: skill.skill_name || '',
        skill_level: skill.skill_level || '',
        skill_category: skill.skill_category || undefined,
      }))
  }

  if (Array.isArray(data?.languages)) {
    sanitized.languages = data.languages
      .filter((lang: any) => lang && lang.name)
      .map((lang: any) => ({
        name: lang.name || '',
        proficiency: lang.proficiency || '',
      }))
  }

  if (Array.isArray(data?.projects)) {
    sanitized.projects = data.projects
      .filter((proj: any) => proj && proj.name)
      .map((proj: any) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      }))
  }

  if (data?.links && typeof data.links === 'object') {
    sanitized.links = {
      linkedin: data.links.linkedin || '',
      github: data.links.github || '',
      portfolio: data.links.portfolio || '',
    }
  }

  return sanitized
}
