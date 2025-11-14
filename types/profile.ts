// Shared TypeScript interfaces for the CV Generator app

export interface Experience {
  id?: string
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
}

export interface Education {
  id?: string
  institution: string
  degree: string
  field_of_study: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
}

export interface Skill {
  id?: string
  skill_name: string
  skill_level: string
  skill_category?: string
}

export interface Links {
  id?: string
  user_id?: string
  linkedin: string
  github: string
  portfolio: string
  other_links?: any[]
}

export interface Language {
  id?: string
  user_id?: string
  name: string
  proficiency: string
}

export interface Project {
  id?: string
  user_id?: string
  name: string
  description: string
  technologies?: string[]
}

export interface UserProfile {
  id?: string
  full_name: string
  email: string
  phone: string
  location: string
  summary: string
  date_of_birth?: string
  professional_summary?: string
}

export interface GeneratedDocument {
  id: string
  user_id: string
  job_title: string
  company_name: string
  job_description: string
  cv_content: any
  cover_letter_content: string
  template_id: string
  pdf_url?: string
  analysis?: any
  created_at: string
}
