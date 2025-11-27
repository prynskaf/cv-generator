'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TemplateSelector from './TemplateSelector'
import LivePreview from './LivePreview'
import AIChat from './AIChat'
import { CVData } from '@/lib/pdf-templates/shared/types'

type WorkflowStep = 'template' | 'job-info' | 'preview' | 'editing' | 'ready'

interface CVBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (documentId: string) => void
}

export default function CVBuilderModal({ isOpen, onClose, onComplete }: CVBuilderModalProps) {
  const supabase = createClient()
  
  const [step, setStep] = useState<WorkflowStep>('template')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [previewData, setPreviewData] = useState<CVData>({
    full_name: 'Your Name',
    email: 'your.email@example.com',
    phone: '',
    location: '',
    summary: 'Your professional summary will appear here. This is a preview of how your CV will look with the selected template.',
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    links: {},
  })
  const [fullCVData, setFullCVData] = useState<CVData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)
  
  // Job description form
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [showProfilePicture, setShowProfilePicture] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadUserProfile()
    }
  }, [isOpen])

  const loadUserProfile = async () => {
    setIsLoadingProfile(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoadingProfile(false)
      return
    }

    // Load all user data
    const [profileRes, expRes, eduRes, skillsRes, linksRes, langRes, projRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('skills').select('*').eq('user_id', user.id),
      supabase.from('links').select('*').eq('user_id', user.id).single(),
      supabase.from('languages').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id),
    ])

    const profile = profileRes.data
    const experiences = expRes.data || []
    const education = eduRes.data || []
    const skills = skillsRes.data || []
    const links = linksRes.data || { linkedin: '', github: '', portfolio: '' }
    const languages = langRes.data || []
    const projects = projRes.data || []

    // Always set preview data, even if profile is empty
    const cvData: CVData = {
      full_name: profile?.full_name || 'Your Name',
      email: profile?.email || 'your.email@example.com',
      phone: profile?.phone || '',
      location: profile?.location || '',
      summary: profile?.summary || 'Your professional summary will appear here...',
      profile_picture_url: profile?.profile_picture_url || undefined,
      show_profile_picture: showProfilePicture,
      experiences: experiences.map(exp => ({
        company: exp.company,
        position: exp.position,
        location: exp.location || '',
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current,
        description: exp.description || '',
      })),
      education: education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field_of_study: edu.field_of_study || '',
        location: edu.location || '',
        start_date: edu.start_date,
        end_date: edu.end_date,
        is_current: edu.is_current,
        description: edu.description || '',
      })),
      skills: skills.map(skill => ({
        skill_name: skill.skill_name,
        skill_level: skill.skill_level || '',
        skill_category: skill.skill_category,
      })),
      projects: projects.map(proj => ({
        name: proj.name,
        description: proj.description || '',
        technologies: proj.technologies || [],
      })),
      languages: languages.map(lang => ({
        name: lang.name,
        proficiency: lang.proficiency || '',
      })),
      links: {
        linkedin: links?.linkedin || '',
        github: links?.github || '',
        portfolio: links?.portfolio || '',
      },
    }
    setPreviewData(cvData)
    setIsLoadingProfile(false)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setStep('preview')
  }

  const handleGenerate = async () => {
    if (!jobTitle || !jobDescription) {
      alert('Please fill in job title and description')
      return
    }

    setGenerating(true)
    setStep('preview')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName,
          show_profile_picture: showProfilePicture,
          template_id: selectedTemplate,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Generation failed')
      }

      const cvData = result.data?.cv_content || result.cv_content
      // Ensure profile picture settings are preserved
      const updatedCVData = {
        ...cvData,
        show_profile_picture: showProfilePicture,
        profile_picture_url: previewData.profile_picture_url || cvData.profile_picture_url,
      }
      setFullCVData(updatedCVData)
      setPreviewData(updatedCVData)
      setDocumentId(result.data?.document_id || result.document_id)
      setStep('editing')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Generation failed')
      setStep('job-info')
    } finally {
      setGenerating(false)
    }
  }

  const handleCVUpdate = async (updatedCV: CVData) => {
    // Preserve profile picture settings
    const preservedCV = {
      ...updatedCV,
      profile_picture_url: updatedCV.profile_picture_url || previewData.profile_picture_url,
      show_profile_picture: updatedCV.show_profile_picture !== undefined 
        ? updatedCV.show_profile_picture 
        : showProfilePicture,
    }
    setFullCVData(preservedCV)
    setPreviewData(preservedCV)
    
    // Update document in database if documentId exists
    if (documentId) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('generated_documents')
            .update({
              cv_content: preservedCV,
            })
            .eq('id', documentId)
            .eq('user_id', user.id)
        }
      } catch (error) {
        console.error('Error updating document:', error)
        // Silent fail - don't interrupt user experience
      }
    }
  }

  const handleDownload = async () => {
    if (!documentId) return

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          template_id: selectedTemplate,
        }),
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cv_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      onComplete(documentId)
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Download failed')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          <div className="bg-white">
            {/* Header / Navbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">CV Builder</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {['Template', 'Preview', 'Job Info', 'Generate', 'Download'].map((stepName, idx) => {
                  const steps = ['template', 'preview', 'job-info', 'editing', 'ready']
                  const stepIndex = steps.indexOf(step)
                  const isActive = idx <= stepIndex
                  return (
                    <div key={idx} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                            ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                          `}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">{stepName}</span>
                      </div>
                      {idx < 4 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {isLoadingProfile && step === 'template' && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                  </div>
                </div>
              )}
              
              {!isLoadingProfile && step === 'template' && (
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleTemplateSelect}
                  previewData={previewData}
                />
              )}

              {step === 'preview' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Preview Your CV</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Template: <span className="font-semibold capitalize text-blue-600">{selectedTemplate}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setStep('template')}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition bg-white"
                      >
                        Change Template
                      </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-2">
                      <LivePreview templateId={selectedTemplate} data={previewData} />
                    </div>
                  </div>
                  <div className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setStep('template')}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      ← Back to Templates
                    </button>
                    <button
                      onClick={() => setStep('job-info')}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                    >
                      Continue to Job Info →
                    </button>
                  </div>
                </div>
              )}

              {step === 'job-info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Tech Corp"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        id="showProfilePicture"
                        checked={showProfilePicture}
                        onChange={(e) => setShowProfilePicture(e.target.checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <label htmlFor="showProfilePicture" className="text-sm text-gray-700">
                        Include profile picture in CV
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep('preview')}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={!jobTitle || !jobDescription || generating}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
                      >
                        {generating ? 'Generating...' : 'Generate CV'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <LivePreview templateId={selectedTemplate} data={previewData} />
                  </div>
                </div>
              )}

              {(step === 'editing' || step === 'ready') && fullCVData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <LivePreview templateId={selectedTemplate} data={fullCVData} />
                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={handleDownload}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="h-[600px]">
                      <AIChat
                        currentCV={fullCVData}
                        templateId={selectedTemplate}
                        onCVUpdate={handleCVUpdate}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

