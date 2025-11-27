'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  const [showJobModal, setShowJobModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [coverLetterContent, setCoverLetterContent] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  // Debug: Log step changes
  useEffect(() => {
    console.log('Step changed to:', step, { generating, hasFullCVData: !!fullCVData, error })
  }, [step, generating, fullCVData, error])

  // Safety: Ensure step is always valid
  useEffect(() => {
    if (!generating && step !== 'template-selection' && step !== 'preview' && step !== 'editing' && step !== 'ready' && step !== 'generation') {
      console.warn('Invalid step state detected, resetting to preview:', step)
      setStep('preview')
    }
  }, [step, generating])

  // Debug: Track modal state
  useEffect(() => {
    console.log('Modal state changed:', { showJobModal, step, generating })
  }, [showJobModal, step, generating])

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Load all user data
    const [profileRes, expRes, eduRes, skillsRes, linksRes, langRes, projRes, certRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
      supabase.from('skills').select('*').eq('user_id', user.id),
      supabase.from('links').select('*').eq('user_id', user.id).single(),
      supabase.from('languages').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id),
      supabase.from('certifications').select('*').eq('user_id', user.id).order('issue_date', { ascending: false }),
    ])

    const profile = profileRes.data
    const experiences = expRes.data || []
    const education = eduRes.data || []
    const skills = skillsRes.data || []
    const links = linksRes.data || { linkedin: '', github: '', portfolio: '' }
    const languages = langRes.data || []
    const projects = projRes.data || []
    const certifications = certRes.data || []

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
      certifications: certifications.map(cert => ({
        name: cert.name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date,
        credential_id: cert.credential_id,
        credential_url: cert.credential_url,
        description: cert.description,
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

  const handleGenerateClick = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    try {
      console.log('Generate button clicked, opening job modal', { 
        currentStep: step, 
        generating, 
        showJobModal 
      })
      setShowJobModal(true)
      console.log('Modal state set to true')
    } catch (err) {
      console.error('Error opening modal:', err)
      setError('Failed to open job details form. Please try again.')
    }
  }

  const handleJobDetailsSubmit = async (jobTitle: string, companyName: string, jobDescription: string, showProfilePicture: boolean) => {
    console.log('Job details submitted:', { jobTitle, companyName, jobDescription: jobDescription.substring(0, 50) + '...' })
    setShowJobModal(false)
    setGenerating(true)
    setError(null)
    // Store job details for later use
    setJobTitle(jobTitle)
    setCompanyName(companyName)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let response: Response
      let result: any

      try {
        response = await fetch('/api/generate', {
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

        try {
          result = await response.json()
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError)
          throw new Error('Invalid response from server. Please try again.')
        }

        console.log('API Response:', { ok: response.ok, result })

        if (!response.ok || !result.success) {
          const errorMsg = result.error || result.message || 'Generation failed'
          console.error('API Error:', result)
          throw new Error(errorMsg)
        }
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          throw fetchError
        }
        console.error('Network error:', fetchError)
        throw new Error('Network error. Please check your connection and try again.')
      }

      // Handle response structure: { success: true, data: { cv_content, document_id, cover_letter, ... } }
      const cvData = result.data?.cv_content
      const docId = result.data?.document_id
      const coverLetter = result.data?.cover_letter || result.cover_letter

      console.log('Response data check:', { 
        hasData: !!result.data, 
        hasCvContent: !!cvData, 
        hasDocId: !!docId,
        hasCoverLetter: !!coverLetter,
        dataKeys: result.data ? Object.keys(result.data) : [],
        resultKeys: Object.keys(result)
      })

      if (!cvData) {
        console.error('Invalid response structure:', result)
        throw new Error('No CV data received from server. The response was invalid. Please try again.')
      }

      if (!docId) {
        console.warn('No document ID received, but CV data is present')
      }

      console.log('CV generated successfully, document ID:', docId)
      setFullCVData(cvData)
      setPreviewData(cvData)
      setDocumentId(docId)
      setCoverLetterContent(coverLetter || null)
      setStep('editing')
      setError(null) // Clear any previous errors
      setGenerating(false) // IMPORTANT: Reset generating state
    } catch (err) {
      console.error('Generation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Generation failed. Please try again.'
      setError(errorMessage)
      setStep('preview') // Go back to preview on error
    } finally {
      setGenerating(false) // Always reset generating state
    }
  }

  const handleCVUpdate = (updatedCV: CVData) => {
    setFullCVData(updatedCV)
    setPreviewData(updatedCV)
  }

  const handleDownloadCV = async () => {
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
      const fileName = `CV_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Redirect to dashboard after successful download
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadCoverLetter = async () => {
    if (!documentId || !coverLetterContent) {
      setError('Cover letter not available')
      return
    }

    setExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, email, phone, location')
        .eq('id', user.id)
        .single()

      const { generateCoverLetterDocx } = await import('@/lib/coverLetterGenerator')
      
      const coverLetterData = {
        applicantName: profile?.full_name || 'Your Name',
        applicantEmail: profile?.email || '',
        applicantPhone: profile?.phone || '',
        applicantAddress: profile?.location || '',
        companyName: companyName || 'Company Name',
        hiringManagerName: undefined,
        jobTitle: jobTitle,
        coverLetterContent: coverLetterContent
      }

      const blob = await generateCoverLetterDocx(coverLetterData)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const fileName = `Cover_Letter_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.docx`
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Redirect to dashboard after successful download
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover letter download failed')
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadBoth = async () => {
    if (!documentId || !fullCVData) return

    setExporting(true)
    try {
      // Download CV first
      const cvResponse = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: documentId,
          template_id: selectedTemplate,
        }),
      })

      if (!cvResponse.ok) {
        throw new Error('CV export failed')
      }

      const cvBlob = await cvResponse.blob()
      const cvUrl = window.URL.createObjectURL(cvBlob)
      const cvLink = document.createElement('a')
      cvLink.href = cvUrl
      cvLink.download = `CV_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      document.body.appendChild(cvLink)
      cvLink.click()
      document.body.removeChild(cvLink)
      window.URL.revokeObjectURL(cvUrl)

      // Small delay to allow first download to start
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Then download cover letter if available
      if (coverLetterContent) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, email, phone, location')
            .eq('id', user.id)
            .single()

          const { generateCoverLetterDocx } = await import('@/lib/coverLetterGenerator')
          
          const coverLetterData = {
            applicantName: profile?.full_name || 'Your Name',
            applicantEmail: profile?.email || '',
            applicantPhone: profile?.phone || '',
            applicantAddress: profile?.location || '',
            companyName: companyName || 'Company Name',
            hiringManagerName: undefined,
            jobTitle: jobTitle,
            coverLetterContent: coverLetterContent
          }

          const coverLetterBlob = await generateCoverLetterDocx(coverLetterData)
          const coverLetterUrl = window.URL.createObjectURL(coverLetterBlob)
          const coverLetterLink = document.createElement('a')
          coverLetterLink.href = coverLetterUrl
          coverLetterLink.download = `Cover_Letter_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.docx`
          document.body.appendChild(coverLetterLink)
          coverLetterLink.click()
          document.body.removeChild(coverLetterLink)
          window.URL.revokeObjectURL(coverLetterUrl)
        }
      }
      
      // Redirect to dashboard after successful download
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500) // Slightly longer delay to allow both downloads to start
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setExporting(false)
    }
  }

  const handleViewInDashboard = () => {
    router.push('/dashboard')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CV Generator
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

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

        {step === 'preview' && !generating && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${showJobModal ? 'opacity-50 pointer-events-none' : ''}`}>
            {error && (
              <div className="lg:col-span-3 mb-4 bg-red-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Error</h3>
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="lg:col-span-2">
              <LivePreview templateId={selectedTemplate} data={previewData} />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep('template-selection')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={showJobModal}
                >
                  Back to Templates
                </button>
                <button
                  onClick={(e) => handleGenerateClick(e)}
                  disabled={generating || showJobModal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition"
                  type="button"
                >
                  {generating ? 'Generating...' : showJobModal ? 'Opening Form...' : 'Generate CV & Cover Letter'}
                </button>
              </div>
              {showJobModal && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Job Details Form is Open</strong> - Please fill in the form above to generate your CV.
                  </p>
                </div>
              )}
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

        {generating && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <h3 className="text-xl font-semibold text-gray-900">Generating Your CV...</h3>
              <p className="text-gray-600">This may take a few moments. Please don't close this page.</p>
            </div>
          </div>
        )}

        {(step === 'editing' || step === 'ready') && fullCVData && !generating && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Preview */}
            <div className="lg:col-span-2">
              <LivePreview templateId={selectedTemplate} data={fullCVData} />
              <div className="mt-6 space-y-4">
                {/* Download Options */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadCV}
                    disabled={exporting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {exporting ? 'Downloading...' : 'Download CV (PDF)'}
                  </button>
                  {coverLetterContent && (
                    <button
                      onClick={handleDownloadCoverLetter}
                      disabled={exporting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {exporting ? 'Downloading...' : 'Download Cover Letter (DOCX)'}
                    </button>
                  )}
                </div>
                {coverLetterContent && (
                  <button
                    onClick={handleDownloadBoth}
                    disabled={exporting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {exporting ? 'Downloading Both...' : 'Download Both (CV + Cover Letter)'}
                  </button>
                )}
                <button
                  onClick={handleViewInDashboard}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View in Dashboard
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

        {(step === 'editing' || step === 'ready') && !fullCVData && !generating && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-600">No CV data available. Please try generating again.</p>
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Preview
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Error</h3>
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    if (step === 'preview') {
                      // Stay on preview
                    } else {
                      setStep('preview')
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Dismiss & Continue
                </button>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Fallback: Show preview if no other step is active */}
        {step !== 'template-selection' && step !== 'preview' && step !== 'editing' && step !== 'ready' && !generating && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Unexpected state. Current step: <strong>{step}</strong></p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStep('preview')
                    setError(null)
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Back to Preview
                </button>
                <button
                  onClick={() => {
                    setStep('template-selection')
                    setError(null)
                  }}
                  className="ml-4 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Back to Template Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Safety: Always show something if nothing else matches */}
        {!step && !generating && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 mb-4">Page state error. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showJobModal && (
        <JobDetailsModal
          isOpen={showJobModal}
          onClose={() => {
            console.log('Modal closed')
            setShowJobModal(false)
          }}
          onSubmit={handleJobDetailsSubmit}
        />
      )}
    </div>
  )
}

