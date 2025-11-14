import { modernTemplate } from './modern'
import { professionalTemplate } from './professional'
import { minimalistTemplate } from './minimalist'

export const templates = {
  modern: modernTemplate,
  professional: professionalTemplate,
  minimalist: minimalistTemplate,
}

export function getTemplate(templateId: string, data: any): string {
  const template = templates[templateId as keyof typeof templates] || templates.modern
  return template(data)
}
