import { CVData } from '@/lib/pdf-templates/shared/types'
import { JobAnalysis } from '@/lib/gemini'

export interface GeneratedDocument {
  id: string
  job_title: string
  company_name: string | null
  job_description: string
  cv_content: CVData
  cover_letter_content: string
  template_id: string
  pdf_url: string | null
  analysis: JobAnalysis | null
  created_at: string
}

export interface GeneratedDocResponse {
  document_id: string
  analysis: JobAnalysis
  cv_content: CVData
  cover_letter: string
}

