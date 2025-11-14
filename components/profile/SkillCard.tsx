'use client'

import { useState } from 'react'
import type { Skill } from '@/types/profile'

interface SkillCardProps {
  skill: Skill
  index: number
  onSave: (index: number) => void
  onDelete: (index: number) => void
  onChange: (index: number, field: keyof Skill, value: string) => void
}

export default function SkillCard({ skill, index, onSave, onDelete, onChange }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition bg-white">
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{skill.skill_name || 'New Skill'}</h3>
          <p className="text-xs text-gray-600">{skill.skill_level || 'Level'}</p>
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
        <div className="p-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Name</label>
              <input
                type="text"
                value={skill.skill_name}
                onChange={(e) => {
                  e.stopPropagation()
                  onChange(index, 'skill_name', e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., JavaScript, Python"
              />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Proficiency Level</label>
              <select
                value={skill.skill_level}
                onChange={(e) => {
                  e.stopPropagation()
                  onChange(index, 'skill_level', e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
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
