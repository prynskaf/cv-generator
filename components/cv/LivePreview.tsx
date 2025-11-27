'use client'

import { CVData } from '@/lib/pdf-templates/shared/types'

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

export default function LivePreview({ templateId, data, className = '' }: LivePreviewProps) {
  // Ensure data is always valid
  const safeData: CVData = {
    full_name: data?.full_name || 'Your Name',
    email: data?.email || 'your.email@example.com',
    phone: data?.phone || '',
    location: data?.location || '',
    summary: data?.summary || 'Your professional summary will appear here...',
    profile_picture_url: data?.profile_picture_url,
    show_profile_picture: data?.show_profile_picture !== undefined ? data.show_profile_picture : true,
    experiences: data?.experiences || [],
    education: data?.education || [],
    skills: data?.skills || [],
    projects: data?.projects || [],
    languages: data?.languages || [],
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

// Modern Preview Component
function ModernPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-100">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-blue-200">
                {data.links.linkedin && <span>LinkedIn</span>}
                {data.links.github && <span>GitHub</span>}
                {data.links.portfolio && <span>Portfolio</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-blue-600 pb-1">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-blue-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
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
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-blue-600">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill.skill_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
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
      )}

      {/* Languages */}
      {renderLanguages(data.languages, 'modern')}
    </div>
  )
}

// Professional Preview Component
function ProfessionalPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="border-b-4 border-gray-800 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
              {data.full_name || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>| {data.phone}</span>}
              {data.location && <span>| {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                {data.links.linkedin && <span>LinkedIn: {data.links.linkedin.replace(/^https?:\/\//, '')}</span>}
                {data.links.github && <span>| GitHub: {data.links.github.replace(/^https?:\/\//, '')}</span>}
                {data.links.portfolio && <span>| Portfolio: {data.links.portfolio.replace(/^https?:\/\//, '')}</span>}
              </div>
            )}
          </div>
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-24 h-24 rounded-lg border-2 border-gray-800 object-cover"
            />
          )}
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-800 pb-1">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'professional')}
      {renderEducation(data.education, 'professional')}
      {renderSkills(data.skills, 'professional')}
      {renderProjects(data.projects, 'professional')}
      {renderLanguages(data.languages, 'professional')}
    </div>
  )
}

// Minimalist Preview Component
function MinimalistPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-16 h-16 rounded-full border border-gray-300 object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>| {data.phone}</span>}
              {data.location && <span>| {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                {data.links.linkedin && <span>{data.links.linkedin.replace(/^https?:\/\//, '')}</span>}
                {data.links.github && <span>| {data.links.github.replace(/^https?:\/\//, '')}</span>}
                {data.links.portfolio && <span>| {data.links.portfolio.replace(/^https?:\/\//, '')}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      {data.summary && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Summary</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'minimalist')}
      {renderEducation(data.education, 'minimalist')}
      {renderSkills(data.skills, 'minimalist')}
      {renderProjects(data.projects, 'minimalist')}
      {renderLanguages(data.languages, 'minimalist')}
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
          <h2 className="text-lg font-bold text-purple-600 mb-2 border-b-2 border-purple-600 pb-1">
            About
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'creative')}
      {renderEducation(data.education, 'creative')}
      {renderSkills(data.skills, 'creative')}
      {renderProjects(data.projects, 'creative')}
      {renderLanguages(data.languages, 'creative')}
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
    </div>
  )
}

// Tech Preview Component
function TechPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
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
    </div>
  )
}

// Designer Preview Component
function DesignerPreview({ data }: { data: CVData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-lg">
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
          <h2 className="text-lg font-bold text-pink-600 mb-2 border-b-2 border-pink-600 pb-1">About Me</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}
      {renderExperiences(data.experiences, 'designer')}
      {renderEducation(data.education, 'designer')}
      {renderSkills(data.skills, 'designer')}
      {renderProjects(data.projects, 'designer')}
      {renderLanguages(data.languages, 'designer')}
    </div>
  )
}

