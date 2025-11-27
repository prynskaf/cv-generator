'use client'

import { useState } from 'react'
import { CVData } from '@/lib/pdf-templates/shared/types'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  color: string
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    thumbnail: '🎨',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and formal style',
    thumbnail: '💼',
    color: 'from-gray-700 to-gray-800',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant',
    thumbnail: '✨',
    color: 'from-gray-400 to-gray-500',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful and expressive',
    thumbnail: '🎭',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Executive-level sophistication',
    thumbnail: '👔',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern tech industry focus',
    thumbnail: '💻',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Visual and portfolio-style',
    thumbnail: '🎨',
    color: 'from-pink-500 to-rose-600',
  },
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
  previewData: CVData
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, previewData }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your CV Template</h3>
        <p className="text-sm text-gray-600">Select a template to see a live preview of your CV</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            className={`
              relative cursor-pointer rounded-xl border-2 transition-all duration-200 bg-white
              ${selectedTemplate === template.id
                ? 'border-blue-500 shadow-xl scale-105 ring-4 ring-blue-100'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
              }
            `}
          >
            {/* Template Thumbnail */}
            <div className={`
              aspect-[3/4] rounded-t-xl bg-gradient-to-br ${template.color}
              flex items-center justify-center text-6xl relative overflow-hidden
              ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}
            `}>
              <div className="absolute inset-0 bg-black/5"></div>
              <span className="relative z-10">{template.thumbnail}</span>
            </div>

            {/* Template Info */}
            <div className="p-4 bg-white rounded-b-xl">
              <h4 className={`font-semibold text-sm mb-1 ${
                selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {template.name}
              </h4>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>

            {/* Selected Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Preview Info */}
      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Selected:</strong> {templates.find(t => t.id === selectedTemplate)?.name} template
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Your CV preview will update automatically as you make changes
          </p>
        </div>
      )}
    </div>
  )
}

