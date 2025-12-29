'use client'

import React from 'react'
import { CVData } from '@/lib/pdf-templates/shared/types'
import {
  ModernPreview,
  ProfessionalPreview,
  MinimalistPreview,
  CreativePreview,
  ExecutivePreview,
  TechPreview,
  DesignerPreview,
} from './previews'

interface LivePreviewProps {
  templateId: string
  data: CVData
  className?: string
}

export default function LivePreview({ templateId, data, className = '' }: LivePreviewProps) {
  // Ensure data is always valid - handle both undefined and empty strings
  const safeData: CVData = {
    full_name: (data?.full_name && data.full_name.trim()) || 'Your Name',
    email: (data?.email && data.email.trim()) || 'your.email@example.com',
    phone: data?.phone || '',
    location: data?.location || '',
    summary: (data?.summary && data.summary.trim()) || 'Your professional summary will appear here. This is a preview of how your CV will look with the selected template.',
    profile_picture_url: data?.profile_picture_url,
    show_profile_picture: data?.show_profile_picture !== undefined ? data.show_profile_picture : true,
    experiences: data?.experiences || [],
    education: data?.education || [],
    skills: data?.skills || [],
    projects: data?.projects || [],
    languages: data?.languages || [],
    certifications: data?.certifications || [],
    links: data?.links || {},
  }

  // Render basic preview based on template
  const renderPreview = () => {
    switch (templateId) {
      case 'modern':
        return <ModernPreview data={safeData} />
      case 'professional':
        return <ProfessionalPreview data={safeData} />
      case 'minimalist':
        return <MinimalistPreview data={safeData} />
      case 'creative':
        return <CreativePreview data={safeData} />
      case 'executive':
        return <ExecutivePreview data={safeData} />
      case 'tech':
        return <TechPreview data={safeData} />
      case 'designer':
        return <DesignerPreview data={safeData} />
      default:
        return <ModernPreview data={safeData} />
    }
  }

  // Check if this is being used in a template preview card (no wrapper needed)
  const isTemplatePreview = className?.includes('template-preview-wrapper')
  
  if (isTemplatePreview) {
    // For template cards, render without the wrapper - just the content
    return (
      <div className="bg-white w-full" style={{ padding: '24px', minHeight: '100%' }}>
        {templateId ? renderPreview() : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a template to see preview</p>
          </div>
        )}
      </div>
    )
  }

  // For regular live preview, use the full wrapper
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Live Preview</span>
        <span className="text-xs text-gray-400 capitalize">Template: {templateId || 'modern'}</span>
      </div>
      <div className="p-6 bg-white overflow-y-auto" style={{ minHeight: '600px', maxHeight: '800px' }}>
        {templateId ? renderPreview() : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a template to see preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
