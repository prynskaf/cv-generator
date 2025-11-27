'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import TemplateSelector from '@/components/cv/TemplateSelector'
import LivePreview from '@/components/cv/LivePreview'
import AIChat from '@/components/cv/AIChat'
import JobDetailsModal from '@/components/cv/JobDetailsModal'
import { CVData } from '@/lib/pdf-templates/shared/types'

type WorkflowStep = 'template-selection' | 'preview' | 'generation' | 'editing' | 'ready'

export default function CVBuilderPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<WorkflowStep>('template-selection')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [previewData, setPreviewData] = useState<CVData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  })
  const [fullCVData, setFullCVData] = useState<CVData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
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

    const cvData: CVData = {
      full_name: profile?.full_name || 'Your Name',
      email: profile?.email || 'your.email@example.com',
      phone: profile?.phone || '',
      location: profile?.location || '',
      summary: profile?.summary || 'Your professional summary will appear here...',
      profile_picture_url: profile?.profile_picture_url || undefined,
      show_profile_picture: true,
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
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setStep('preview')
  }

  const handleGenerateClick = () => {
    setShowJobModal(true)
  }

  const handleJobDetailsSubmit = async (jobTitle: string, companyName: string, jobDescription: string, showProfilePicture: boolean) => {
    setShowJobModal(false)
    setGenerating(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

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
      setFullCVData(cvData)
      setPreviewData(cvData)
      setDocumentId(result.data?.document_id || result.document_id)
      setStep('editing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleCVUpdate = (updatedCV: CVData) => {
    setFullCVData(updatedCV)
    setPreviewData(updatedCV)
  }

  const handleDownload = async () => {
    if (!documentId || !fullCVData) return

    setExporting(true)
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
      a.download = `cv_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setExporting(false)
    }
  }

  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Builder</h1>
          <p className="text-gray-600">Create a professional CV with AI assistance</p>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Template', 'Preview', 'Generate', 'Edit', 'Download'].map((stepName, idx) => {
              const stepIndex = ['template-selection', 'preview', 'generation', 'editing', 'ready'].indexOf(step)
              const isActive = idx <= stepIndex
              return (
                <div key={idx} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold
                        ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                      `}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{stepName}</span>
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

        {/* Main Content */}
        {step === 'template-selection' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
              previewData={previewData}
            />
          </div>
        )}

        {step === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LivePreview templateId={selectedTemplate} data={previewData} />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep('template-selection')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Back to Templates
                </button>
                <button
                  onClick={handleGenerateClick}
                  disabled={generating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
                >
                  {generating ? 'Generating...' : 'Generate CV & Cover Letter'}
                </button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Select a template that matches your industry</li>
                  <li>• Preview shows your basic info</li>
                  <li>• Full generation will create complete CV</li>
                  <li>• You can edit after generation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {(step === 'editing' || step === 'ready') && fullCVData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Preview */}
            <div className="lg:col-span-2">
              <LivePreview templateId={selectedTemplate} data={fullCVData} />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleDownload}
                  disabled={exporting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
                >
                  {exporting ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>

            {/* AI Chat */}
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

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSubmit={handleJobDetailsSubmit}
      />
    </div>
  )
}

