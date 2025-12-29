'use client'

import React from 'react'
import { CVData, splitIntoBullets } from '@/lib/pdf-templates/shared/types'

import { formatDate, groupSkillsByCategory } from './shared/utils'

export default function MinimalistPreview({ data }: { data: CVData }) {
  return (
    <div className="bg-white px-4 py-4 md:px-10 md:py-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header - Clean, left-aligned */}
      <div className="border-b border-gray-200 pb-4 mb-5 flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-lg md:text-2xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.02em' }}>
            {data.full_name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span className="text-gray-400">| {data.phone}</span>}
            {data.location && <span className="text-gray-400">| {data.location}</span>}
          </div>
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              {data.links.linkedin && <span>{data.links.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>}
              {data.links.github && <span className="text-gray-400">| {data.links.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>}
              {data.links.portfolio && <span className="text-gray-400">| {data.links.portfolio.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>}
            </div>
          )}
        </div>
        {/* Profile Picture - Small circle, top-right */}
        {data.show_profile_picture !== false && data.profile_picture_url && (
          <div className="ml-4">
            <img
              src={data.profile_picture_url}
              alt="Profile"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 object-cover"
            />
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Summary
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp, idx) => {
              const bullets = splitIntoBullets(exp.description)
              return (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="text-sm font-normal text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{exp.position}</h3>
                      <p className="text-xs text-gray-500">{exp.company}, {exp.location}</p>
                    </div>
                    <span className="text-xs text-gray-400 italic whitespace-nowrap ml-4">
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                    </span>
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="text-xs text-gray-600 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {bullet.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600 ml-3 mt-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      • {exp.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => {
              const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
              return (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="text-sm font-normal text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        {edu.degree}, {edu.field_of_study}
                      </h3>
                      <p className="text-xs text-gray-500">{edu.institution}, {edu.location}</p>
                    </div>
                    <span className="text-xs text-gray-400 italic whitespace-nowrap ml-4">
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                    </span>
                  </div>
                  {descriptionBullets.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {descriptionBullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-xs text-gray-600 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {bullet.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : edu.description ? (
                    <p className="text-xs text-gray-600 ml-3 mt-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      • {edu.description}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-0.5 text-xs text-gray-600 leading-tight">
            {(() => {
              const skillsByCategory: Record<string, string[]> = {}
              data.skills?.forEach(skill => {
                const category = skill.skill_category || 'Other'
                if (!skillsByCategory[category]) {
                  skillsByCategory[category] = []
                }
                skillsByCategory[category].push(skill.skill_name)
              })
              
              const hasMultipleCategories = Object.keys(skillsByCategory).length > 1
              
              if (hasMultipleCategories) {
                return Object.entries(skillsByCategory).map(([category, skills], categoryIdx) => (
                  <React.Fragment key={categoryIdx}>
                    {categoryIdx > 0 && <span className="text-gray-300 mx-0.5"> • </span>}
                    <span className="text-gray-500" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{category}: </span>
                    {skills.map((skill, idx) => (
                      <React.Fragment key={idx}>
                        <span style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{skill}</span>
                        {idx < skills.length - 1 && <span className="text-gray-300 mx-0.5"> • </span>}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))
              } else {
                return data.skills?.map((skill, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{skill.skill_name}</span>
                    {idx < (data.skills?.length ?? 0) - 1 && <span className="text-gray-300 mx-0.5"> • </span>}
                  </React.Fragment>
                ))
              }
            })()}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, idx) => {
              const descriptionBullets = project.description ? splitIntoBullets(project.description) : []
              return (
                <div key={idx} className="mb-2">
                  <h3 className="text-sm font-normal text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{project.name}</h3>
                  {descriptionBullets.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {descriptionBullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-xs text-gray-600 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          • {bullet.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : project.description ? (
                    <p className="text-xs text-gray-600 ml-3 mt-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      • {project.description}
                    </p>
                  ) : null}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Technologies: <span className="text-gray-600">{project.technologies.join(' • ')}</span>
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
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, idx) => (
              <div key={idx} className="mb-2">
                <h3 className="text-sm font-normal text-gray-900 mb-0.5" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{cert.name}</h3>
                <p className="text-xs text-gray-500">{cert.issuing_organization}</p>
                {(cert.issue_date || cert.expiry_date) && (
                  <p className="text-xs text-gray-400 italic">
                    {cert.issue_date ? formatDate(cert.issue_date) : ''}
                    {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                    {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                  </p>
                )}
                {cert.credential_id && (
                  <p className="text-xs text-gray-500 mt-0.5">ID: {cert.credential_id}</p>
                )}
                {cert.description && (
                  <p className="text-xs text-gray-600 ml-3 mt-1">
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
        <div className="mb-5">
          <h2 className="text-xs font-normal text-gray-400 mb-2 border-b border-gray-100 pb-1 uppercase tracking-wide" style={{ fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.1em' }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-1 text-xs text-gray-600">
            {data.languages?.map((lang, idx) => (
              <React.Fragment key={idx}>
                <span style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  <span className="font-normal text-gray-900">{lang.name}</span> ({lang.proficiency})
                </span>
                {idx < (data.languages?.length ?? 0) - 1 && <span className="text-gray-300"> • </span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}