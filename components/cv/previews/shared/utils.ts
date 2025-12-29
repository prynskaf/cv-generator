import { CVData } from '@/lib/pdf-templates/shared/types'

// Helper function to format dates
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// Group skills by category
export function groupSkillsByCategory(skills: CVData['skills']): Record<string, string[]> {
  const skillsByCategory: Record<string, string[]> = {}
  skills?.forEach(skill => {
    const category = skill.skill_category || 'Other'
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = []
    }
    skillsByCategory[category].push(skill.skill_name)
  })
  return skillsByCategory
}

