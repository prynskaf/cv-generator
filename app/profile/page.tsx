'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import ExperienceCard from '@/components/profile/ExperienceCard'
import EducationCard from '@/components/profile/EducationCard'
import SkillCard from '@/components/profile/SkillCard'
import LinksSection from '@/components/profile/LinksSection'
import LanguageCard from '@/components/profile/LanguageCard'
import ProjectCard from '@/components/profile/ProjectCard'
import type { Experience, Education, Skill, Links, Language, Project } from '@/types/profile'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [links, setLinks] = useState<Links>({ linkedin: '', github: '', portfolio: '' })
  const [languages, setLanguages] = useState<Language[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setFullName(profile.full_name || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      setLocation(profile.location || '')
      setSummary(profile.summary || '')
    }

    const { data: expData } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (expData) {
      const normalizedExp = expData.map(exp => ({
        ...exp,
        location: exp.location || '',
        end_date: exp.end_date || null,
        description: exp.description || ''
      }))
      setExperiences(normalizedExp)
    }

    const { data: eduData } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (eduData) {
      const normalizedEdu = eduData.map(edu => ({
        ...edu,
        field_of_study: edu.field_of_study || '',
        location: edu.location || '',
        end_date: edu.end_date || null,
        description: edu.description || ''
      }))
      setEducation(normalizedEdu)
    }

    const { data: skillData } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)

    if (skillData) setSkills(skillData)

    // Load links
    const { data: linksData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (linksData) {
      setLinks({
        linkedin: linksData.linkedin || '',
        github: linksData.github || '',
        portfolio: linksData.portfolio || ''
      })
    }

    // Load languages
    const { data: languagesData } = await supabase
      .from('languages')
      .select('*')
      .eq('user_id', user.id)

    setLanguages(languagesData || [])

    // Load projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)

    setProjects(projectsData || [])

    setLoading(false)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        email: email,
        phone: phone,
        location: location,
        summary: summary,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    }

    setSaving(false)
  }

  const addExperience = () => {
    setExperiences([...experiences, {
      id: `temp-${Date.now()}-${Math.random()}`,
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: '',
    }])
  }

  const addEducation = () => {
    setEducation([...education, {
      id: `temp-${Date.now()}-${Math.random()}`,
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: '',
    }])
  }

  const addSkill = () => {
    setSkills([...skills, {
      id: `temp-${Date.now()}-${Math.random()}`,
      skill_name: '',
      skill_level: '',
    }])
  }

  const saveExperience = async (index: number) => {
    const exp = experiences[index]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (exp.id) {
      await supabase
        .from('experiences')
        .update({ ...exp, user_id: user.id })
        .eq('id', exp.id)
    } else {
      const { data } = await supabase
        .from('experiences')
        .insert({ ...exp, user_id: user.id })
        .select()
        .single()
      
      if (data) {
        const newExperiences = [...experiences]
        newExperiences[index] = data
        setExperiences(newExperiences)
      }
    }
    setMessage({ type: 'success', text: 'Experience saved!' })
  }

  const saveEducation = async (index: number) => {
    const edu = education[index]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (edu.id) {
      await supabase
        .from('education')
        .update({ ...edu, user_id: user.id })
        .eq('id', edu.id)
    } else {
      const { data } = await supabase
        .from('education')
        .insert({ ...edu, user_id: user.id })
        .select()
        .single()
      
      if (data) {
        const newEducation = [...education]
        newEducation[index] = data
        setEducation(newEducation)
      }
    }
    setMessage({ type: 'success', text: 'Education saved!' })
  }

  const saveSkill = async (index: number) => {
    const skill = skills[index]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (skill.id) {
      await supabase
        .from('skills')
        .update({ ...skill, user_id: user.id })
        .eq('id', skill.id)
    } else {
      const { data } = await supabase
        .from('skills')
        .insert({ ...skill, user_id: user.id })
        .select()
        .single()
      
      if (data) {
        const newSkills = [...skills]
        newSkills[index] = data
        setSkills(newSkills)
      }
    }
    setMessage({ type: 'success', text: 'Skill saved!' })
  }

  const deleteExperience = async (index: number) => {
    const exp = experiences[index]
    if (exp.id) {
      await supabase.from('experiences').delete().eq('id', exp.id)
    }
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const deleteEducation = async (index: number) => {
    const edu = education[index]
    if (edu.id) {
      await supabase.from('education').delete().eq('id', edu.id)
    }
    setEducation(education.filter((_, i) => i !== index))
  }

  const deleteSkill = async (index: number) => {
    const skill = skills[index]
    if (skill.id) {
      await supabase.from('skills').delete().eq('id', skill.id)
    }
    setSkills(skills.filter((_, i) => i !== index))
  }

  const addLanguage = () => {
    setLanguages([...languages, {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      proficiency: '',
    }])
  }

  const saveLanguage = async (index: number) => {
    const lang = languages[index]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (lang.id?.startsWith('temp-')) {
      const { error } = await supabase.from('languages').insert({
        user_id: user.id,
        name: lang.name,
        proficiency: lang.proficiency
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Language added!' })
        await loadProfile()
      }
    } else {
      const { error } = await supabase.from('languages').update({
        name: lang.name,
        proficiency: lang.proficiency
      }).eq('id', lang.id)
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Language updated!' })
      }
    }
  }

  const deleteLanguage = async (index: number) => {
    const lang = languages[index]
    if (lang.id?.startsWith('temp-')) {
      setLanguages(languages.filter((_, i) => i !== index))
    } else {
      const { error } = await supabase.from('languages').delete().eq('id', lang.id)
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setLanguages(languages.filter((_, i) => i !== index))
        setMessage({ type: 'success', text: 'Language deleted!' })
      }
    }
  }

  const addProject = () => {
    setProjects([...projects, {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      description: '',
      technologies: []
    }])
  }

  const saveProject = async (index: number) => {
    const proj = projects[index]
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (proj.id?.startsWith('temp-')) {
      const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies || []
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Project added!' })
        await loadProfile()
      }
    } else {
      const { error } = await supabase.from('projects').update({
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies || []
      }).eq('id', proj.id)
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Project updated!' })
      }
    }
  }

  const deleteProject = async (index: number) => {
    const proj = projects[index]
    if (proj.id?.startsWith('temp-')) {
      setProjects(projects.filter((_, i) => i !== index))
    } else {
      const { error } = await supabase.from('projects').delete().eq('id', proj.id)
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setProjects(projects.filter((_, i) => i !== index))
        setMessage({ type: 'success', text: 'Project deleted!' })
      }
    }
  }

  const saveLinks = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existingLinks } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingLinks) {
      const { error } = await supabase.from('links').update({
        linkedin: links.linkedin,
        github: links.github,
        portfolio: links.portfolio
      }).eq('user_id', user.id)
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Links updated!' })
      }
    } else {
      const { error } = await supabase.from('links').insert({
        user_id: user.id,
        linkedin: links.linkedin,
        github: links.github,
        portfolio: links.portfolio
      })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Links saved!' })
      }
    }
    setSaving(false)
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    switch(field) {
      case 'fullName': setFullName(value); break
      case 'email': setEmail(value); break
      case 'phone': setPhone(value); break
      case 'location': setLocation(value); break
      case 'summary': setSummary(value); break
    }
  }

  const handleExperienceChange = (index: number, field: keyof Experience, value: string | boolean | null) => {
    const newExp = [...experiences]
    newExp[index] = { ...newExp[index], [field]: value }
    setExperiences(newExp)
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string | boolean | null) => {
    const newEdu = [...education]
    newEdu[index] = { ...newEdu[index], [field]: value }
    setEducation(newEdu)
  }

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setSkills(newSkills)
  }

  const handleLinkChange = (field: keyof Link, value: string) => {
    setLinks({ ...links, [field]: value })
  }

  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    const newLanguages = [...languages]
    newLanguages[index] = { ...newLanguages[index], [field]: value }
    setLanguages(newLanguages)
  }

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setProjects(newProjects)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleCVUpload = async () => {
    if (!uploadFile) {
      setMessage({ type: 'error', text: 'Please select a file first' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setMessage({ type: 'success', text: 'CV uploaded and profile auto-filled successfully! Refreshing...' })
      setUploadFile(null)
      
      setTimeout(() => {
        loadProfile()
      }, 1500)

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload CV' })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">Manage your personal information and professional details</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl shadow-md border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* CV Upload Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Upload Your CV</h2>
              <p className="text-blue-100 text-sm">AI will automatically extract and fill your profile</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <label className="block">
                  <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-white/40 rounded-xl hover:border-white/60 transition cursor-pointer bg-white/5">
                    <div className="flex items-center gap-2 text-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {uploadFile ? uploadFile.name : 'Choose PDF or Word file'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-blue-100 mt-2 text-center sm:text-left">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
              
              <button
                onClick={handleCVUpload}
                disabled={!uploadFile || uploading}
                className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 disabled:bg-white/50 disabled:text-blue-300 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload & Extract
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <PersonalInfoSection
          fullName={fullName}
          email={email}
          phone={phone}
          location={location}
          summary={summary}
          saving={saving}
          onFieldChange={handlePersonalInfoChange}
          onSave={handleSaveProfile}
        />

        {/* Experience Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            </div>
            <button
              onClick={addExperience}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Experience
            </button>
          </div>
          
          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">No experience added yet.</p>
              <p className="text-gray-400 text-sm">Click "Add Experience" to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  index={index}
                  onSave={saveExperience}
                  onDelete={deleteExperience}
                  onChange={handleExperienceChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            <button
              onClick={addEducation}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Education
            </button>
          </div>
          
          {education.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <p className="mt-4 text-gray-500">No education added yet.</p>
              <p className="text-gray-400 text-sm">Click "Add Education" to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu, index) => (
                <EducationCard
                  key={edu.id}
                  education={edu}
                  index={index}
                  onSave={saveEducation}
                  onDelete={deleteEducation}
                  onChange={handleEducationChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            </div>
            <button
              onClick={addSkill}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </button>
          </div>
          
          {skills.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="mt-4 text-gray-500">No skills added yet.</p>
              <p className="text-gray-400 text-sm">Click "Add Skill" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={index}
                  onSave={saveSkill}
                  onDelete={deleteSkill}
                  onChange={handleSkillChange}
                />
              ))}

            </div>
          )}
        </div>

        {/* Links Section */}
        <LinksSection
          links={links}
          saving={saving}
          onChange={handleLinkChange}
          onSave={saveLinks}
        />

        {/* Languages Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Languages</h2>
                  <p className="text-sm text-gray-600">Languages you speak</p>
                </div>
              </div>
              <button
                onClick={addLanguage}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition shadow-md"
              >
                + Add Language
              </button>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            {languages.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="mt-4 text-gray-500">No languages added yet.</p>
                <p className="text-gray-400 text-sm">Click &quot;Add Language&quot; to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language, index) => (
                  <LanguageCard
                    key={language.id}
                    language={language}
                    index={index}
                    onSave={saveLanguage}
                    onDelete={deleteLanguage}
                    onChange={handleLanguageChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                  <p className="text-sm text-gray-600">Your personal and professional projects</p>
                </div>
              </div>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-md"
              >
                + Add Project
              </button>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-4 text-gray-500">No projects added yet.</p>
                <p className="text-gray-400 text-sm">Click &quot;Add Project&quot; to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onSave={saveProject}
                    onDelete={deleteProject}
                    onChange={handleProjectChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
