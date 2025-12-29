'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function CreativePreview({ data }: { data: CVData }) {
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
      {/* Header with gradient background */}
      <div className="bg-indigo-500 text-white p-4 md:p-8">
        <div className="flex items-start gap-3 md:gap-6">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-white overflow-hidden shadow-lg flex-shrink-0">
              <img
                src={data.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              {data.full_name || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-indigo-100 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-3 text-xs text-indigo-100">
                {data.links.linkedin && (
                  <span className="underline">
                    LinkedIn: {data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </span>
                )}
                {data.links.github && (
                  <span className="underline">
                    GitHub: {data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </span>
                )}
                {data.links.portfolio && (
                  <span className="underline">
                    Portfolio: {data.links.portfolio.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About section with colored background */}
      {data.summary && (
        <div className="bg-gray-100 px-4 md:px-8 py-6">
          <h2 className="text-lg font-bold text-indigo-600 mb-3 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            ABOUT
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{data.summary}</p>
        </div>
      )}

      {/* Main Content - Two Column */}
      <div className="flex flex-col md:flex-row px-4 md:px-4 md:px-8 py-4 md:py-6">
        {/* Left Column */}
        <div className="w-full md:w-[60%] pr-0 md:pr-6">
          {/* Experience with timeline */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                EXPERIENCE
              </h2>
                          <div className="space-y-5 relative">
                            {data.experiences.map((exp, idx) => {
                              const bullets = splitIntoBullets(exp.description)
                              const isLast = idx === (data.experiences?.length ?? 0) - 1
                  return (
                    <div key={idx} className="relative pr-0 md:pl-6">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white z-10"></div>
                      {/* Timeline line */}
                      {!isLast && (
                        <div className="absolute left-1.5 top-6 w-0.5 h-full bg-indigo-200"></div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                        <p className="text-xs font-bold text-indigo-600 mb-1">{exp.company}, {exp.location}</p>
                        <p className="text-xs text-gray-500 italic mb-2">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </p>
                        {bullets.length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {bullets.map((bullet, i) => (
                              <li key={i} className="text-xs text-gray-700 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                                • {bullet.trim()}
                              </li>
                            ))}
                          </ul>
                        ) : exp.description ? (
                          <p className="text-xs text-gray-700 ml-3 mt-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {exp.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, idx) => {
                  const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                  return (
                    <div key={idx} className="pr-0 md:pl-6 relative">
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white z-10"></div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          {edu.degree}, {edu.field_of_study}
                        </h3>
                        <p className="text-xs font-bold text-indigo-600 mb-1">{edu.institution}, {edu.location}</p>
                        <p className="text-xs text-gray-500 italic mb-2">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                        </p>
                        {descriptionBullets.length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {descriptionBullets.map((bullet, i) => (
                              <li key={i} className="text-xs text-gray-700 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                                • {bullet.trim()}
                              </li>
                            ))}
                          </ul>
                        ) : edu.description ? (
                          <p className="text-xs text-gray-700 ml-3 mt-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {edu.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] pr-0 md:pl-6 border-t-3 md:border-t-0 md:border-l-3 border-indigo-200">
          {/* Skills - Colorful badges */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                SKILLS
              </h2>
              {Object.keys(skillsByCategory).length > 1 ? (
                Object.entries(skillsByCategory).map(([category, skills], idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}>
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full"
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects - Cards with colored backgrounds */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                PROJECTS
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj, idx) => {
                  const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                  return (
                    <div key={idx} className="bg-gray-100 p-3 rounded-lg border-l-4 border-indigo-600">
                      <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.name}</h3>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mb-2 space-y-1">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : proj.description ? (
                        <p className="text-xs text-gray-700 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.description}</p>
                      ) : null}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs font-bold text-indigo-600 italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          {proj.technologies.join(' • ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Certifications - Cards */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-gray-100 p-3 rounded-lg border-l-4 border-indigo-600">
                    <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                    <p className="text-xs font-bold text-indigo-600 mb-1">{cert.issuing_organization}</p>
                    {(cert.issue_date || cert.expiry_date) && (
                      <p className="text-xs text-gray-500 italic mb-1">
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </p>
                    )}
                    {cert.credential_id && (
                      <p className="text-xs font-bold text-indigo-600 italic mb-1">ID: {cert.credential_id}</p>
                    )}
                    {cert.description && (
                      <p className="text-xs text-gray-700 ml-3 mt-1">
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
              <h2 className="text-lg font-bold text-indigo-600 mb-4 border-b-3 border-indigo-600 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-indigo-100">
                    <span className="text-xs font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.name}</span>
                    <span className="text-xs font-bold text-indigo-600" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.proficiency}</span>
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