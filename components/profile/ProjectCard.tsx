'use client'

import { useState } from 'react'
import type { Project } from '@/types/profile'

interface ProjectCardProps {
  project: Project
  index: number
  onSave: (index: number) => void
  onDelete: (index: number) => void
  onChange: (index: number, field: keyof Project, value: string | string[]) => void
}

export default function ProjectCard({ project, index, onSave, onDelete, onChange }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0)
  const [techInput, setTechInput] = useState('')

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(prev => !prev)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(index)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(index)
  }

  const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      const technologies = project.technologies || []
      onChange(index, 'technologies', [...technologies, techInput.trim()])
      setTechInput('')
    }
  }

  const removeTechnology = (techIndex: number) => {
    const technologies = project.technologies || []
    onChange(index, 'technologies', technologies.filter((_, i) => i !== techIndex))
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition bg-white">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 transition"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">{project.name || 'New Project'}</h3>
          <p className="text-xs text-gray-600 truncate">{project.description || 'Description'}</p>
        </div>
        <div className="ml-2 p-1 rounded-lg hover:bg-white/50 transition flex-shrink-0">
          <svg 
            className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-3 sm:space-y-4">
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => {
                  e.stopPropagation()
                  onChange(index, 'name', e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., E-commerce Platform"
              />
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={project.description || ''}
                onChange={(e) => {
                  e.stopPropagation()
                  onChange(index, 'description', e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                rows={4}
                placeholder="Describe your project, your role, and key achievements..."
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Technologies Used</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTechnology}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Type technology and press Enter (e.g., React, Node.js)"
              />
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTechnology(techIndex)
                        }}
                        className="ml-1 hover:bg-teal-200 rounded-full p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-xs sm:text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-xs sm:text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
