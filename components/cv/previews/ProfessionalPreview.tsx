'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function ProfessionalPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header with thick top border */}
      <div className="border-t-4 border-gray-800 pb-2 pt-2 md:pb-3 md:pt-4 px-4 md:px-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-6">
            <h1 className="text-base md:text-xl font-bold text-gray-900 uppercase tracking-wide mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}>
              {data.full_name || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-1.5 text-xs text-gray-600 mb-1">
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
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-800 object-cover flex-shrink-0"
            />
          )}
        </div>
      </div>

      {/* Main Content with Sidebar - 65/35 split */}
      <div className="flex flex-col md:flex-row px-4 md:px-10">
        {/* Main Content Area - Left (65%) */}
        <div className="w-full md:w-[65%] pr-0 md:pr-8">
          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-xs text-gray-700 leading-snug italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-3">
                {data.experiences.map((exp, idx) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <div key={idx} className="mb-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                          <p className="text-xs text-gray-700">{exp.company}, {exp.location}</p>
                        </div>
                        {/* Date - Right-aligned */}
                        <span className="text-xs text-gray-500 italic whitespace-nowrap">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </span>
                      </div>
                      {bullets.length > 0 ? (
                        <ul className="mt-1 space-y-0.5 text-xs text-gray-700">
                          {bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start" style={{ marginLeft: '15px' }}>
                              <span className="mr-1.5">•</span>
                              <span>{bullet.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-1 space-y-0.5 text-xs text-gray-700">
                          <li className="flex items-start" style={{ marginLeft: '15px' }}>
                            <span className="mr-1.5">•</span>
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
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => {
                  const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                  return (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            {edu.degree}, {edu.field_of_study}
                          </h3>
                          <p className="text-xs text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{edu.institution}, {edu.location}</p>
                        </div>
                        <span className="text-xs text-gray-500 italic whitespace-nowrap" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                        </span>
                      </div>
                      {descriptionBullets.length > 0 ? (
                        <ul className="list-none ml-4 mt-1 space-y-0.5">
                          {descriptionBullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="text-xs text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : edu.description ? (
                        <p className="text-xs text-gray-700 mt-1 ml-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {edu.description}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                PROJECTS
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, idx) => {
                  const descriptionBullets = project.description ? splitIntoBullets(project.description) : []
                  return (
                    <div key={idx} className="mb-2">
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{project.name}</h3>
                      {descriptionBullets.length > 0 ? (
                        <ul className="list-none ml-4 mt-1 space-y-0.5">
                          {descriptionBullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="text-xs text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                              • {bullet.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : project.description ? (
                        <p className="text-xs text-gray-700 ml-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {project.description}
                        </p>
                      ) : null}
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Technologies: {project.technologies.join(', ')}</p>
                      )}
                    </div>
                  )
                })}
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
        <div className="w-full md:w-[35%] pr-0 md:pl-5 border-t-4 md:border-t-0 md:border-l-4 border-gray-800 pt-4 md:pt-0">
          {/* Technical Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                TECHNICAL SKILLS
              </h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                LANGUAGES
              </h2>
              <div className="space-y-1.5">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="text-xs text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.name}</span> ({lang.proficiency})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div>
              <h2 className="text-xs font-bold text-gray-900 mb-2 border-b-3 border-gray-800 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
                LINKS
              </h2>
              <div className="space-y-1.5 text-xs">
                {data.links.linkedin && (
                  <div className="text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>LinkedIn: </span>
                    <span>{data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.github && (
                  <div className="text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span className="font-bold text-gray-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>GitHub: </span>
                    <span>{data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  </div>
                )}
                {data.links.portfolio && (
                  <div className="text-gray-700" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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