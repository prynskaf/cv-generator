'use client'

import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

interface LivePreviewProps {
  templateId: string
  data: CVData
  className?: string
}

// Helper function to format dates
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// Shared section renderers
function renderExperiences(experiences: CVData['experiences'], template: string) {
  if (!experiences || experiences.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>
        {template === 'professional' ? 'Professional Experience' : 'Experience'}
      </h2>
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div key={idx} className={template === 'modern' ? 'border-l-4 border-blue-600 pl-4' : ''}>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className={`text-sm ${
                  template === 'modern' ? 'text-blue-600' :
                  template === 'professional' ? 'text-gray-700' :
                  template === 'creative' ? 'text-purple-600' :
                  template === 'tech' ? 'text-green-600' :
                  template === 'designer' ? 'text-pink-600' :
                  'text-gray-600'
                }`}>
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
              </span>
            </div>
            {exp.description && (
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {exp.description.split('\n').filter(b => b.trim()).map((bullet, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet.trim()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function renderEducation(education: CVData['education'], template: string) {
  if (!education || education.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>Education</h2>
      <div className="space-y-3">
        {education.map((edu, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
            <p className={`text-sm ${
              template === 'modern' ? 'text-blue-600' :
              template === 'professional' ? 'text-gray-700' :
              template === 'creative' ? 'text-purple-600' :
              template === 'tech' ? 'text-green-600' :
              template === 'designer' ? 'text-pink-600' :
              'text-gray-600'
            }`}>{edu.institution}</p>
            {edu.field_of_study && <p className="text-xs text-gray-500">{edu.field_of_study}</p>}
            <p className="text-xs text-gray-500">
              {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderSkills(skills: CVData['skills'], template: string) {
  if (!skills || skills.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded-full text-sm ${
              template === 'modern' ? 'bg-blue-100 text-blue-700' :
              template === 'professional' ? 'bg-gray-100 text-gray-700' :
              template === 'creative' ? 'bg-purple-100 text-purple-700' :
              template === 'tech' ? 'bg-green-100 text-green-700' :
              template === 'designer' ? 'bg-pink-100 text-pink-700' :
              'bg-gray-100 text-gray-700'
            }`}
          >
            {skill.skill_name}
          </span>
        ))}
      </div>
    </div>
  )
}

function renderProjects(projects: CVData['projects'], template: string) {
  if (!projects || projects.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>
        {template === 'designer' ? 'Portfolio Projects' : 'Projects'}
      </h2>
      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-900">{proj.name}</h3>
            {proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}
            {proj.technologies && proj.technologies.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{proj.technologies.join(' • ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function renderLanguages(languages: CVData['languages'], template: string) {
  if (!languages || languages.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>Languages</h2>
      <div className="space-y-2">
        {languages.map((lang, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-sm text-gray-700">{lang.name}</span>
            <span className="text-xs text-gray-500">{lang.proficiency}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderCertifications(certifications: CVData['certifications'], template: string) {
  if (!certifications || certifications.length === 0) return null

  return (
    <div>
      <h2 className={`text-lg font-bold text-gray-900 mb-3 ${
        template === 'modern' ? 'border-b-2 border-blue-600 pb-1' :
        template === 'professional' ? 'border-b-2 border-gray-800 pb-1' :
        template === 'creative' ? 'border-b-2 border-purple-600 pb-1' :
        template === 'executive' ? 'border-b border-gray-300 pb-1' :
        template === 'tech' ? 'border-b-2 border-green-600 pb-1' :
        template === 'designer' ? 'border-b-2 border-pink-600 pb-1' :
        'border-b border-gray-300 pb-1'
      }`}>Certifications</h2>
      <div className="space-y-3">
        {certifications.map((cert, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className={`text-sm ${
                  template === 'modern' ? 'text-blue-600' :
                  template === 'professional' ? 'text-gray-700' :
                  template === 'creative' ? 'text-purple-600' :
                  template === 'tech' ? 'text-green-600' :
                  template === 'designer' ? 'text-pink-600' :
                  'text-gray-600'
                }`}>
                  {cert.issuing_organization}
                </p>
              </div>
              {cert.issue_date && (
                <span className="text-xs text-gray-500">
                  {formatDate(cert.issue_date)}
                  {cert.expiry_date ? ` - ${formatDate(cert.expiry_date)}` : ''}
                </span>
              )}
            </div>
            {cert.credential_id && (
              <p className="text-xs text-gray-500">ID: {cert.credential_id}</p>
            )}
            {cert.description && (
              <p className="text-sm text-gray-700 mt-1">{cert.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
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

// Modern Preview Component - Asymmetric Grid + Timeline Layout
function ModernPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white">
      {/* Header - Clean, modern header with profile pic on right */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
        <div className="flex-1 pr-24">
          <h1 className="text-2xl font-bold mb-3">{data.full_name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-blue-100">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
          </div>
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-blue-200">
              {data.links.linkedin && (
                <span>LinkedIn: {data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
              )}
              {data.links.github && (
                <span>• GitHub: {data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
              )}
              {data.links.portfolio && (
                <span>• Portfolio: {data.links.portfolio.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
              )}
            </div>
          )}
        </div>
        {/* Profile Picture - Floating in header corner */}
        {data.show_profile_picture !== false && data.profile_picture_url && (
          <div className="absolute right-6 top-6">
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
        )}
      </div>

      {/* Asymmetric Grid Layout - 30/70 split */}
      <div className="flex">
        {/* Left Sidebar - 30% width, colored background */}
        <div className="w-[30%] bg-slate-100 p-5 border-r-4 border-blue-600">
          {/* Skills Section - Vertical badges */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Skills</h2>
              <div className="flex flex-col gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold text-center"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Languages</h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="text-xs text-gray-700 pl-2">
                    <span className="font-bold text-gray-900">{lang.name}</span> - {lang.proficiency}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div>
              <h2 className="text-sm font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Links</h2>
              <div className="space-y-2 text-xs">
                {data.links.linkedin && (
                  <div className="text-blue-600">
                    <span className="font-bold">LinkedIn: </span>
                    <span>{data.links.linkedin.replace('https://', '').replace('http://', '')}</span>
                  </div>
                )}
                {data.links.github && (
                  <div className="text-blue-600">
                    <span className="font-bold">GitHub: </span>
                    <span>{data.links.github.replace('https://', '').replace('http://', '')}</span>
                  </div>
                )}
                {data.links.portfolio && (
                  <div className="text-blue-600">
                    <span className="font-bold">Portfolio: </span>
                    <span>{data.links.portfolio.replace('https://', '').replace('http://', '')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Content - 70% width */}
        <div className="w-[70%] p-6">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-600 mb-2 border-b-2 border-blue-600 pb-1">Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience - Clean, aligned with Summary */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">Experience</h2>
              <div className="space-y-5">
                {data.experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-blue-600 font-semibold">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-gray-500 italic">
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                      </p>
                    </div>
                    {exp.description && (() => {
                      // Use the same splitIntoBullets logic
                      let bullets: string[] = []
                      
                      // First, split by newlines
                      const newlineSplit = exp.description.split(/\r?\n/).filter(line => line.trim().length > 0)
                      
                      if (newlineSplit.length > 1) {
                        bullets = newlineSplit
                      } else {
                        // Try splitting by bullet characters
                        const bulletSplit = exp.description.split(/[•\-\*]\s+/).filter(line => line.trim().length > 0)
                        
                        if (bulletSplit.length > 1) {
                          bullets = bulletSplit
                        } else {
                          // Split by sentences (period followed by space and capital letter)
                          bullets = exp.description.split(/\.\s+(?=[A-Z])|\.$/).filter(line => line.trim().length > 0)
                          
                          // Add period back to each sentence
                          bullets = bullets.map((line, index) => {
                            const trimmed = line.trim()
                            if (index < bullets.length - 1 && !trimmed.endsWith('.')) {
                              return trimmed + '.'
                            }
                            return trimmed
                          })
                        }
                      }
                      
                      // Clean up - remove leading bullet characters
                      bullets = bullets.map(line => line.replace(/^[•\-\*]\s*/, '').trim()).filter(line => line.length > 0)
                      
                      return bullets.length > 0 ? (
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 text-blue-600">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="mr-2 text-blue-600">•</span>
                            <span>{exp.description}</span>
                          </li>
                        </ul>
                      )
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Education</h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field_of_study}</h3>
                    <p className="text-sm text-blue-600 font-semibold">{edu.institution} • {edu.location}</p>
                    <p className="text-xs text-gray-500 italic">
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects - 2-column card grid */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Projects</h2>
              <div className="grid grid-cols-2 gap-3">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{project.name}</h3>
                    <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-xs text-blue-600 italic">{project.technologies.join(' • ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">Certifications</h2>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold">{cert.issuing_organization}</p>
                    {(cert.issue_date || cert.expiry_date) && (
                      <p className="text-xs text-gray-500 italic">
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Professional Preview Component - Classic sidebar + formal layout
function ProfessionalPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header with thick top border */}
      <div className="border-t-4 border-gray-800 pb-5 pt-6 px-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-6">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
              {data.full_name || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>| {data.phone}</span>}
              {data.location && <span>| {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                {data.links.linkedin && (
                  <span>LinkedIn: {data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                )}
                {data.links.github && (
                  <span>| GitHub: {data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                )}
                {data.links.portfolio && (
                  <span>| Portfolio: {data.links.portfolio.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                )}
              </div>
            )}
          </div>
          {/* Profile Picture - Circle, top-right */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-gray-800 object-cover flex-shrink-0"
            />
          )}
        </div>
      </div>

      {/* Main Content with Sidebar - 65/35 split */}
      <div className="flex px-10">
        {/* Main Content Area - Left (65%) */}
        <div className="w-[65%] pr-8">
          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-5">
                {data.experiences.map((exp, idx) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <div key={idx} className="mb-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-4">
                          <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                          <p className="text-sm text-gray-700">{exp.company}, {exp.location}</p>
                        </div>
                        {/* Date - Right-aligned */}
                        <span className="text-xs text-gray-500 italic whitespace-nowrap">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </span>
                      </div>
                      {bullets.length > 0 ? (
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start" style={{ marginLeft: '18px' }}>
                              <span className="mr-2">•</span>
                              <span>{bullet.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                          <li className="flex items-start" style={{ marginLeft: '18px' }}>
                            <span className="mr-2">•</span>
                            <span>{exp.description}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 pr-4">
                        <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          {edu.degree}, {edu.field_of_study}
                        </h3>
                        <p className="text-sm text-gray-700">{edu.institution}, {edu.location}</p>
                      </div>
                      <span className="text-xs text-gray-500 italic whitespace-nowrap">
                        {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{project.name}</h3>
                    <p className="text-sm text-gray-700">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">Technologies: {project.technologies.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-4">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                    <p className="text-sm text-gray-700">{cert.issuing_organization}</p>
                    {(cert.issue_date || cert.expiry_date) && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - 35% */}
        <div className="w-[35%] pl-8 border-l-4 border-gray-800">
          {/* Technical Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                TECHNICAL SKILLS
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{skill.skill_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{lang.name}</span> ({lang.proficiency})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-4 border-gray-800 pb-1 uppercase tracking-widest" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.15em' }}>
                LINKS
              </h2>
              <div className="space-y-2 text-xs">
                {data.links.linkedin && (
                  <div className="text-gray-700">
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>LinkedIn: </span>
                    <span>{data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.github && (
                  <div className="text-gray-700">
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>GitHub: </span>
                    <span>{data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.portfolio && (
                  <div className="text-gray-700">
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Portfolio: </span>
                    <span>{data.links.portfolio.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Minimalist Preview Component
function MinimalistPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6 text-center">
      <div className="border-b border-gray-200 pb-6">
        {data.show_profile_picture !== false && data.profile_picture_url && (
          <div className="flex justify-center mb-4">
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-16 h-16 rounded-full border border-gray-200 object-cover"
            />
          </div>
        )}
        <h1 className="text-2xl font-normal text-gray-900">{data.full_name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500 justify-center">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>| {data.phone}</span>}
          {data.location && <span>| {data.location}</span>}
        </div>
        {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400 justify-center">
            {data.links.linkedin && <span>{data.links.linkedin.replace(/^https?:\/\//, '')}</span>}
            {data.links.github && <span>| {data.links.github.replace(/^https?:\/\//, '')}</span>}
            {data.links.portfolio && <span>| {data.links.portfolio.replace(/^https?:\/\//, '')}</span>}
          </div>
        )}
      </div>
      {data.summary && (
        <div>
          <h2 className="text-xs font-normal text-gray-400 mb-3 border-b border-gray-200 pb-1 uppercase tracking-widest">Summary</h2>
          <p className="text-sm text-gray-600 leading-relaxed italic">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'minimalist')}
      {renderEducation(data.education, 'minimalist')}
      {renderSkills(data.skills, 'minimalist')}
      {renderProjects(data.projects, 'minimalist')}
      {renderLanguages(data.languages, 'minimalist')}
      {renderCertifications(data.certifications, 'minimalist')}
    </div>
  )
}

// Creative Preview Component
function CreativePreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <img
                src={data.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-purple-100">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-purple-200">
                {data.links.linkedin && <span>LinkedIn</span>}
                {data.links.github && <span>GitHub</span>}
                {data.links.portfolio && <span>Portfolio</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-lg font-bold text-purple-600 mb-2 border-b-2 border-purple-600 pb-1 uppercase">
            ABOUT
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'creative')}
      {renderEducation(data.education, 'creative')}
      {renderSkills(data.skills, 'creative')}
      {renderProjects(data.projects, 'creative')}
      {renderLanguages(data.languages, 'creative')}
      {renderCertifications(data.certifications, 'creative')}
    </div>
  )
}

// Executive Preview Component
function ExecutivePreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wider">
              {data.full_name || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-300">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>| {data.phone}</span>}
              {data.location && <span>| {data.location}</span>}
            </div>
          </div>
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover grayscale"
            />
          )}
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">Executive Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'executive')}
      {renderEducation(data.education, 'executive')}
      {renderSkills(data.skills, 'executive')}
      {renderProjects(data.projects, 'executive')}
      {renderLanguages(data.languages, 'executive')}
      {renderCertifications(data.certifications, 'executive')}
    </div>
  )
}

// Tech Preview Component
function TechPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded border-4 border-white object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-mono">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-green-100 font-mono">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-green-200 font-mono">
                {data.links.linkedin && <span>LinkedIn</span>}
                {data.links.github && <span>GitHub</span>}
                {data.links.portfolio && <span>Portfolio</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-lg font-bold text-green-600 mb-2 font-mono border-b-2 border-green-600 pb-1">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed font-mono">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'tech')}
      {renderEducation(data.education, 'tech')}
      {renderSkills(data.skills, 'tech')}
      {renderProjects(data.projects, 'tech')}
      {renderLanguages(data.languages, 'tech')}
      {renderCertifications(data.certifications, 'tech')}
    </div>
  )
}

// Designer Preview Component
function DesignerPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 rounded-lg">
        <div className="flex items-start gap-6">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img
                src={data.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-pink-100">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-pink-200">
                {data.links.linkedin && <span>LinkedIn</span>}
                {data.links.github && <span>GitHub</span>}
                {data.links.portfolio && <span>Portfolio</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-xl font-bold text-pink-600 mb-3 border-b-3 border-pink-600 pb-2 uppercase tracking-wide">ABOUT ME</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'designer')}
      {renderEducation(data.education, 'designer')}
      {renderSkills(data.skills, 'designer')}
      {renderProjects(data.projects, 'designer')}
      {renderLanguages(data.languages, 'designer')}
      {renderCertifications(data.certifications, 'designer')}
    </div>
  )
}

