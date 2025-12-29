'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function DesignerPreview({ data }: { data: CVData }) {
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
      {/* Header - Asymmetric with large profile picture */}
      <div className="bg-white px-4 md:px-9 py-4 md:py-7 border-b-4 border-pink-500">
        <div className="flex items-start gap-8">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-pink-500 overflow-hidden flex-shrink-0">
              <img
                src={data.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 pt-2">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              {data.full_name || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-2 text-xs text-pink-500">
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
        </div>
      </div>

      {/* Summary Section - Colored background */}
      {data.summary && (
        <div className="bg-pink-50 px-4 md:px-9 py-4 md:py-6 border-b border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-3 border-l-5 border-pink-500 pl-3 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            ABOUT ME
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{data.summary}</p>
        </div>
      )}

      {/* Main Content - Asymmetric Grid Layout */}
      <div className="flex flex-col md:flex-row px-4 md:px-4 md:px-9 py-4 md:py-4 md:py-6">
        {/* Left Column - Main content (70%) */}
        <div className="w-full md:w-[70%] pr-0 md:pr-6">
          {/* Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp, idx) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-pink-100 border-l-5 border-l-pink-500">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                          <p className="text-xs font-bold text-pink-500 mb-1">{exp.company}, {exp.location}</p>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </p>
                      </div>
                      {bullets.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : exp.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => {
                  const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                  return (
                    <div key={idx} className="bg-pink-50 p-3 rounded border-l-4 border-pink-300">
                      <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        {edu.degree}, {edu.field_of_study}
                      </h3>
                      <p className="text-xs font-bold text-pink-500 mb-1">{edu.institution}, {edu.location}</p>
                      <p className="text-xs text-gray-500 italic mb-2">
                        {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                      </p>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : edu.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {edu.description}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Portfolio Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                PORTFOLIO PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((proj, idx) => {
                  const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                  return (
                    <div key={idx} className="bg-white p-4 rounded-lg border-2 border-pink-100 border-t-4 border-t-pink-500">
                      <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.name}</h3>
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : proj.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.description}</p>
                      ) : null}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-pink-500 italic mt-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          Tools: {proj.technologies.join(' • ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar (30%) */}
        <div className="w-full md:w-[30%] pr-0 md:pl-6 border-t-2 md:border-t-0 md:border-l-2 border-pink-100">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                SKILLS
              </h2>
              {Object.keys(skillsByCategory).length > 1 ? (
                Object.entries(skillsByCategory).map(([category, skills], idx) => (
                  <div key={idx} className="mb-3">
                    <h3 className="text-xs font-bold text-pink-500 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs bg-pink-50 text-pink-600 rounded-full border-1.5 border-pink-200 font-bold"
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
                      className="px-2.5 py-1 text-xs bg-pink-50 text-pink-600 rounded-full border-1.5 border-pink-200 font-bold"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => {
                  const descriptionBullets = cert.description ? splitIntoBullets(cert.description) : []
                  return (
                    <div key={idx} className="bg-pink-50 p-3 rounded border-l-4 border-pink-300">
                      <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                      <p className="text-xs font-bold text-pink-500 mb-1">{cert.issuing_organization}</p>
                      {(cert.issue_date || cert.expiry_date) && (
                        <p className="text-xs text-gray-500 italic mb-1">
                          {cert.issue_date ? formatDate(cert.issue_date) : ''}
                          {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                          {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                        </p>
                      )}
                      {cert.credential_id && (
                        <p className="text-xs text-pink-500 italic mb-1">ID: {cert.credential_id}</p>
                      )}
                      {descriptionBullets.length > 0 ? (
                        <ul className="mt-1 space-y-0.5">
                          {descriptionBullets.map((bullet, i) => (
                            <li key={i} className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : cert.description ? (
                        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.description}</p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-pink-500 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-pink-100">
                    <span className="text-xs font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.name}</span>
                    <span className="text-xs text-gray-500 italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.proficiency}</span>
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