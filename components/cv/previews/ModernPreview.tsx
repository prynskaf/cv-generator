'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'
import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function ModernPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white">
      {/* Header - Clean, modern header with profile pic on right */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6 relative">
        <div className="flex-1 pr-0 md:pr-24">
          <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">{data.full_name || 'Your Name'}</h1>
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
          <div className="absolute right-2 top-2 md:right-6 md:top-6">
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white object-cover"
            />
          </div>
        )}
      </div>

      {/* Asymmetric Grid Layout - 30/70 split */}
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - 30% width, colored background */}
        <div className="w-full md:w-[30%] bg-slate-100 p-3 md:p-5 border-b-4 md:border-b-0 md:border-r-4 border-blue-600">
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
        <div className="w-full md:w-[70%] p-4 md:p-6">
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
                      const bullets = splitIntoBullets(exp.description)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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