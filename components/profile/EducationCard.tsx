'use client'

import { useState } from 'react'
import type { Education } from '@/types/profile'

interface EducationCardProps {
  education: Education
  index: number
  onSave: (index: number) => void
  onDelete: (index: number) => void
  onChange: (index: number, field: keyof Education, value: string | boolean | null) => void
}

export default function EducationCard({ education, index, onSave, onDelete, onChange }: EducationCardProps) {
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
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">{education.degree || 'New Degree'}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{education.institution || 'Institution'} • {education.field_of_study || 'Field of Study'}</p>
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
        <div className="p-4 sm:p-6 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
              <input
                type="text"
                value={education.institution}
                onChange={(e) => onChange(index, 'institution', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="University name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
              <input
                type="text"
                value={education.degree}
                onChange={(e) => onChange(index, 'degree', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={education.field_of_study}
                onChange={(e) => onChange(index, 'field_of_study', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Computer Science, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={education.location}
                onChange={(e) => onChange(index, 'location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={education.start_date}
                onChange={(e) => onChange(index, 'start_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={education.end_date || ''}
                disabled={education.is_current}
                onChange={(e) => onChange(index, 'end_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center pt-7">
              <input
                type="checkbox"
                checked={education.is_current}
                onChange={(e) => {
                  onChange(index, 'is_current', e.target.checked)
                  if (e.target.checked) onChange(index, 'end_date', null)
                }}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">Currently Enrolled</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={education.description}
              onChange={(e) => onChange(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Achievements, honors, relevant coursework..."
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
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
