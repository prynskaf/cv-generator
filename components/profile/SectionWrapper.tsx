'use client'

import { ReactNode } from 'react'

interface SectionWrapperProps {
  title: string
  icon: ReactNode
  addButtonLabel: string
  onAdd: () => void
  isEmpty: boolean
  emptyStateIcon?: ReactNode
  emptyStateTitle?: string
  emptyStateDescription?: string
  children: ReactNode
}

export default function SectionWrapper({
  title,
  icon,
  addButtonLabel,
  onAdd,
  isEmpty,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  children,
}: SectionWrapperProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {addButtonLabel}
        </button>
      </div>
      
      {isEmpty ? (
        <div className="text-center py-12">
          {emptyStateIcon || (
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          )}
          <p className="mt-4 text-gray-500">{emptyStateTitle || `No ${title.toLowerCase()} added yet.`}</p>
          <p className="text-gray-400 text-sm">{emptyStateDescription || `Click "${addButtonLabel}" to get started!`}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

