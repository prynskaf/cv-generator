'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateCoverLetterDocx, generateCoverLetterTxt } from '@/lib/coverLetterGenerator'
import { createClient } from '@/lib/supabase/client'
import type { GeneratedDocument } from '@/types/dashboard'

interface DocumentCardProps {
  doc: GeneratedDocument
  onExport: (documentId: string) => Promise<void>
  onDelete: (documentId: string) => Promise<void>
  exporting: string | null
  setExporting: (id: string | null) => void
}

export default function DocumentCard({ doc, onExport, onDelete, exporting, setExporting }: DocumentCardProps) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const supabase = createClient()

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    
    // Check if same day
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
    
    if (isToday) {
      const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      if (diffHours < 1) {
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        if (diffMinutes < 1) return 'Just now'
        return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
      }
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    }
    
    // Check if yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.getDate() === yesterday.getDate() &&
                       date.getMonth() === yesterday.getMonth() &&
                       date.getFullYear() === yesterday.getFullYear()
    
    if (isYesterday) return 'Yesterday'
    
    // Calculate days difference
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const downloadCoverLetter = async (format: 'txt' | 'docx' = 'docx') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email, phone, location')
      .eq('id', user.id)
      .single()

    const coverLetterData = {
      applicantName: profile?.full_name || 'Your Name',
      applicantEmail: profile?.email || '',
      applicantPhone: profile?.phone || '',
      applicantAddress: profile?.location || '',
      companyName: doc.company_name || 'Company Name',
      hiringManagerName: undefined,
      jobTitle: doc.job_title,
      coverLetterContent: doc.cover_letter_content
    }

    if (format === 'docx') {
      const blob = await generateCoverLetterDocx(coverLetterData)
      const element = document.createElement('a')
      element.href = URL.createObjectURL(blob)
      element.download = `cover_letter_${doc.job_title.replace(/\s+/g, '_')}_${Date.now()}.docx`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else {
      const content = await generateCoverLetterTxt(coverLetterData)
      const element = document.createElement('a')
      const file = new Blob([content], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `cover_letter_${doc.job_title.replace(/\s+/g, '_')}_${Date.now()}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
    setOpenDropdown(false)
  }

  return (
    <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50 hover:border-blue-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                {doc.job_title}
              </h3>
              {doc.company_name && (
                <p className="text-gray-600 font-medium truncate">{doc.company_name}</p>
              )}
            </div>
          </div>
        </div>
        {doc.analysis && (
          <div className={`ml-4 px-3 py-1.5 rounded-lg border text-center ${getMatchColor(doc.analysis.match_percentage)}`}>
            <div className="text-2xl font-bold">{doc.analysis.match_percentage}%</div>
            <div className="text-xs font-medium">Match</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(doc.created_at)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-gray-600 capitalize">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          {doc.template_id || 'modern'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onExport(doc.id)}
          disabled={exporting === doc.id}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting === doc.id ? 'Exporting...' : 'CV PDF'}
        </button>
        <div className="relative flex-1">
          <button 
            onClick={() => setOpenDropdown(!openDropdown)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Cover Letter
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
              <button
                onClick={() => downloadCoverLetter('docx')}
                className="w-full text-left px-4 py-2.5 hover:bg-purple-50 flex items-center gap-2 rounded-t-lg transition text-sm"
              >
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                Word (.docx)
              </button>
              <button
                onClick={() => downloadCoverLetter('txt')}
                className="w-full text-left px-4 py-2.5 hover:bg-purple-50 flex items-center gap-2 rounded-b-lg transition text-sm"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                Text (.txt)
              </button>
            </div>
          )}
        </div>
        <Link
          href={`/cv-edit/${doc.id}`}
          className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
        <button
          onClick={() => onDelete(doc.id)}
          className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}

