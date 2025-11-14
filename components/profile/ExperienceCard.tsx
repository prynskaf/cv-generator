'use client'

import { useState } from 'react'
import type { Experience } from '@/types/profile'

interface ExperienceCardProps {
  experience: Experience
  index: number
  onSave: (index: number) => void
  onDelete: (index: number) => void
  onChange: (index: number, field: keyof Experience, value: string | boolean | null) => void
}

export default function ExperienceCard({ experience, index, onSave, onDelete, onChange }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(index)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(index)
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition bg-white">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{experience.position || 'New Position'}</h3>
          <p className="text-sm text-gray-600">{experience.company || 'Company'} • {experience.location || 'Location'}</p>
        </div>
        <div className="ml-4 p-2 rounded-lg hover:bg-white/50 transition">
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
        <div className="p-6 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => onChange(index, 'company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={experience.position}
                onChange={(e) => onChange(index, 'position', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={experience.location}
                onChange={(e) => onChange(index, 'location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={experience.start_date}
                onChange={(e) => onChange(index, 'start_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={experience.end_date || ''}
                disabled={experience.is_current}
                onChange={(e) => onChange(index, 'end_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center pt-7">
              <input
                type="checkbox"
                checked={experience.is_current}
                onChange={(e) => {
                  onChange(index, 'is_current', e.target.checked)
                  if (e.target.checked) onChange(index, 'end_date', null)
                }}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">Current Position</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={experience.description}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
