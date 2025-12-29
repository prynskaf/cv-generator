'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import LinksSection from '@/components/profile/LinksSection'
import ProfilePictureUploadCard from '@/components/profile/ProfilePictureUploadCard'
import CVUploadCard from '@/components/profile/CVUploadCard'
import ExperienceSection from '@/components/profile/sections/ExperienceSection'
import EducationSection from '@/components/profile/sections/EducationSection'
import SkillsSection from '@/components/profile/sections/SkillsSection'
import LanguagesSection from '@/components/profile/sections/LanguagesSection'
import ProjectsSection from '@/components/profile/sections/ProjectsSection'
import CertificationsSection from '@/components/profile/sections/CertificationsSection'
import { useProfile } from '@/hooks/useProfile'
import { useProfileUpload } from '@/hooks/useProfileUpload'
import { useLinks } from '@/hooks/useLinks'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Custom hooks for data management
  const { profile, loading, saving, message, updateField, updateProfile } = useProfile()
  const { 
    uploading, 
    uploadingPicture, 
    uploadFile, 
    setUploadFile,
    handleCVUpload,
    handleProfilePictureUpload,
    handleProfilePictureDelete 
  } = useProfileUpload()
  const { links, saving: savingLinks, updateLink, saveLinks } = useLinks()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Handle CV upload with reload
  const handleCVUploadWithReload = async () => {
    const result = await handleCVUpload()
    if (result?.success) {
      // Reload profile data after successful upload
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }

  // Handle profile picture upload with reload
  const handleProfilePictureUploadWithReload = async (file: File) => {
    const result = await handleProfilePictureUpload(file)
    if (result?.success && result.url) {
      // Update profile picture URL in profile hook
      updateProfile({ profilePictureUrl: result.url })
    }
  }

  // Handle profile picture delete with reload
  const handleProfilePictureDeleteWithReload = async () => {
    const result = await handleProfilePictureDelete()
    if (result?.success) {
      updateProfile({ profilePictureUrl: null })
    }
  }

  // Wrapper to save current profile state
  const handleSaveProfile = () => {
    updateProfile({})
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
                <Link href="/dashboard">
                  <span className="text-white font-bold text-xl">CV</span>
                </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your personal information and professional details</p>
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

        {/* Profile Picture Upload Card */}
        <ProfilePictureUploadCard
          profilePictureUrl={profile.profilePictureUrl}
          uploadingPicture={uploadingPicture}
          onUpload={handleProfilePictureUploadWithReload}
          onDelete={handleProfilePictureDeleteWithReload}
        />

        {/* CV Upload Card */}
        <CVUploadCard
          uploadFile={uploadFile}
          uploading={uploading}
          onFileSelect={setUploadFile}
          onUpload={handleCVUploadWithReload}
        />

        {/* Personal Information Card */}
        <PersonalInfoSection
          fullName={profile.fullName}
          email={profile.email}
          phone={profile.phone}
          location={profile.location}
          summary={profile.summary}
          saving={saving}
          onFieldChange={updateField}
          onSave={handleSaveProfile}
        />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Education Section */}
        <EducationSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Links Section */}
        <LinksSection
          links={links}
          saving={savingLinks}
          onChange={updateLink}
          onSave={saveLinks}
        />

        {/* Languages Section */}
        <LanguagesSection />

        {/* Certifications Section */}
        <CertificationsSection />

        {/* Projects Section */}
        <ProjectsSection />
      </div>
    </div>
  )
}

