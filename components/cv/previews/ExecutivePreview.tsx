'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function ExecutivePreview({ data }: { data: CVData }) {
  const skillsByCategory: Record<string, string[]> = {}
  data.skills?.forEach(skill => {
    const category = skill.skill_category || 'Other'
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = []
    }
    skillsByCategory[category].push(skill.skill_name)
  })

  return (
    <div className="bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header - Elegant navy blue */}
      <div className="bg-blue-900 text-white px-4 md:px-9 py-4 md:py-7 border-b-2 border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-0 md:pr-6">
            <h1 className="text-xl md:text-3xl font-bold uppercase tracking-wide mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              {data.full_name || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-blue-100 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>| {data.phone}</span>}
              {data.location && <span>| {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-2 text-xs text-blue-100">
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
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="ml-4">
              <img
                src={data.profile_picture_url}
                alt="Profile"
                className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-3 border-white object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col md:flex-row px-4 md:px-4 md:px-9 py-4 md:py-4 md:py-7">
        {/* Left Column - Main content (65%) */}
        <div className="w-full md:w-[65%] pr-0 md:pr-6">
          {/* Executive Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-3 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                EXECUTIVE SUMMARY
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed text-justify" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{data.summary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-4 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp, idx) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                          <p className="text-xs font-bold text-blue-900">{exp.company}, {exp.location}</p>
                        </div>
                        <span className="text-xs text-gray-500 italic whitespace-nowrap">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </span>
                      </div>
                      {bullets.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 ml-4 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : exp.description ? (
                        <p className="text-xs text-gray-700 ml-4 mt-2 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {exp.description}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-4 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => {
                  const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                  return (
                    <div key={idx} className="mb-3">
                      <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        {edu.degree}, {edu.field_of_study}
                      </h3>
                      <p className="text-xs font-bold text-blue-900 mb-1">{edu.institution}, {edu.location}</p>
                      <p className="text-xs text-gray-500 italic">
                        {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                      </p>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 ml-4 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : edu.description ? (
                        <p className="text-xs text-gray-700 ml-4 mt-2 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {edu.description}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-4 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                KEY PROJECTS
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj, idx) => {
                  const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                  return (
                    <div key={idx} className="mb-3">
                      <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.name}</h3>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 ml-4 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : proj.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.description}</p>
                      ) : null}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1 italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          Technologies: {proj.technologies.join(', ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar (35%) */}
        <div className="w-full md:w-[35%] pr-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-200">
          {/* Core Competencies */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-3 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                CORE COMPETENCIES
              </h2>
              {Object.keys(skillsByCategory).length > 1 ? (
                Object.entries(skillsByCategory).map(([category, skills], idx) => (
                  <div key={idx} className="mb-3">
                    <h3 className="text-xs font-bold text-blue-900 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs border border-blue-500 rounded bg-blue-50 text-blue-900"
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs border border-blue-500 rounded bg-blue-50 text-blue-900"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Professional Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-3 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="mb-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                    <p className="text-xs font-bold text-blue-900 mb-1">{cert.issuing_organization}</p>
                    {(cert.issue_date || cert.expiry_date) && (
                      <p className="text-xs text-gray-500 italic">
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </p>
                    )}
                    {cert.credential_id && (
                      <p className="text-xs text-gray-500 italic mt-1">Credential ID: {cert.credential_id}</p>
                    )}
                    {cert.description && (
                      <p className="text-xs text-gray-700 ml-4 mt-1 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        • {cert.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-3 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-xs font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.name}</span>
                    <span className="text-xs text-gray-500 italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-blue-900 mb-3 border-b-2 border-blue-500 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                LINKS
              </h2>
              <div className="space-y-2 text-xs">
                {data.links.linkedin && (
                  <div className="text-gray-700">
                    <span className="font-bold text-blue-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>LinkedIn: </span>
                    <span>{data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.github && (
                  <div className="text-gray-700">
                    <span className="font-bold text-blue-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>GitHub: </span>
                    <span>{data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.portfolio && (
                  <div className="text-gray-700">
                    <span className="font-bold text-blue-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Portfolio: </span>
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