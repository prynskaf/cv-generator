'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function TechPreview({ data }: { data: CVData }) {
  const skillsByCategory: Record<string, string[]> = {}
  data.skills?.forEach(skill => {
    const category = skill.skill_category || 'Other'
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = []
    }
    skillsByCategory[category].push(skill.skill_name)
  })

  return (
    <div className="bg-white text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header - Terminal-inspired with rounded profile */}
      <div className="bg-gray-500 px-4 py-4 md:px-8 md:py-7 border-b-2 border-cyan-400">
        <div className="flex items-center gap-3 md:gap-5">
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-3 border-cyan-400 object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold mb-2 text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              {data.full_name || 'Your Name'}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-gray-100 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <div className="flex flex-wrap gap-2 text-xs text-cyan-300">
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

      {/* Summary Section */}
      {data.summary && (
        <div className="bg-gray-50 px-4 py-4 md:px-8 md:py-6 border-b border-gray-200">
          <h2 className="text-sm font-bold text-cyan-400 mb-3 border-b border-gray-200 pb-2 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
            Summary
          </h2>
          <p className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{data.summary}</p>
        </div>
      )}

      {/* Main Content - Single Column Layout */}
      <div className="px-4 py-4 md:px-8 md:py-6">
        {/* Experience */}
        {data.experiences && data.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp, idx) => {
                const bullets = splitIntoBullets(exp.description)
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-cyan-400 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-black mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                        <p className="text-xs text-black mb-1">{exp.company}, {exp.location}</p>
                      </div>
                      <p className="text-xs text-black italic">
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                      </p>
                    </div>
                    {bullets.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {bullets.map((bullet, i) => (
                          <li key={i} className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {bullet.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : exp.description ? (
                      <p className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, idx) => {
                const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500 border border-gray-200">
                    <h3 className="text-sm font-bold text-black mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      {edu.degree}, {edu.field_of_study}
                    </h3>
                    <p className="text-xs text-black mb-1">{edu.institution}, {edu.location}</p>
                    <p className="text-xs text-black italic mb-2">
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                    </p>
                    {descriptionBullets.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {descriptionBullets.map((bullet, i) => (
                          <li key={i} className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {bullet.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : edu.description ? (
                      <p className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        • {edu.description}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Technical Skills
            </h2>
            {Object.keys(skillsByCategory).length > 1 ? (
              Object.entries(skillsByCategory).map(([category, skills], idx) => (
                <div key={idx} className="mb-3">
                    <h3 className="text-xs font-bold text-black mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs bg-cyan-50 text-cyan-600 rounded border border-cyan-400 font-bold"
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
                    className="px-2.5 py-1 text-xs bg-cyan-50 text-cyan-600 rounded border border-cyan-400 font-bold"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, idx) => {
                const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="text-sm font-bold text-black mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.name}</h3>
                    {descriptionBullets.length > 0 ? (
                      <ul className="mt-1 space-y-0.5">
                        {descriptionBullets.map((bullet, i) => (
                          <li key={i} className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {bullet.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : proj.description ? (
                      <p className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{proj.description}</p>
                    ) : null}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-xs text-black italic mt-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        Technologies: {proj.technologies.join(' • ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications.map((cert, idx) => {
                const descriptionBullets = cert.description ? splitIntoBullets(cert.description) : []
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <h3 className="text-sm font-bold text-black mb-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                    <p className="text-xs text-black mb-1">{cert.issuing_organization}</p>
                    {(cert.issue_date || cert.expiry_date) && (
                      <p className="text-xs text-black italic mb-1">
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </p>
                    )}
                    {cert.credential_id && (
                      <p className="text-xs text-black italic mb-1">ID: {cert.credential_id}</p>
                    )}
                    {descriptionBullets.length > 0 ? (
                      <ul className="mt-1 space-y-0.5">
                        {descriptionBullets.map((bullet, i) => (
                          <li key={i} className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            • {bullet.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : cert.description ? (
                      <p className="text-xs text-black leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.description}</p>
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
            <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
              Languages
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold text-black" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.name}</span>
                  <span className="text-xs text-black italic" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}