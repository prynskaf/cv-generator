import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { minimalistStyles as styles } from './minimalistStyles'

export function MinimalistTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Centered */}
        <View style={styles.header}>
          {/* Profile Picture - Small circle, centered */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
          <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
          <View style={styles.contactRow}>
            {data.email && <Text>{data.email}</Text>}
            {data.phone && <Text style={styles.separator}> | {data.phone}</Text>}
            {data.location && <Text style={styles.separator}> | {data.location}</Text>}
          </View>
          {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
            <View style={styles.contactRow}>
              {data.links.linkedin && (
                <Text>{data.links.linkedin.replace('https://', '').replace('http://', '')}</Text>
              )}
              {data.links.github && (
                <Text style={styles.separator}> | {data.links.github.replace('https://', '').replace('http://', '')}</Text>
              )}
              {data.links.portfolio && (
                <Text style={styles.separator}> | {data.links.portfolio.replace('https://', '').replace('http://', '')}</Text>
              )}
            </View>
          )}
        </View>

        {/* Summary */}
        {data.summary && (
          <View>
            <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences && data.experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, index) => {
              const bullets = splitIntoBullets(exp.description)
              return (
                <View key={index} style={{ marginBottom: 12 }}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>
                      {exp.company}, {exp.location}
                    </Text>
                    <Text style={styles.date}>
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                    </Text>
                  </View>
                  {bullets.map((bullet, idx) => (
                    <Text key={idx} style={styles.bullet}>
                      — {bullet}
                    </Text>
                  ))}
                </View>
              )
            })}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>
                  {edu.degree}, {edu.field_of_study}
                </Text>
                <Text style={styles.company}>{edu.institution}</Text>
                <Text style={styles.date}>
                  {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.keys(skillsByCategory).length > 1 ? (
              Object.entries(skillsByCategory).map(([category, skills], index) => (
                <View key={index}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.skillsContainer}>
                    {skills.map((skill, idx) => (
                      <React.Fragment key={idx}>
                        <Text style={styles.skill}>{skill}</Text>
                        {idx < skills.length - 1 && <Text style={styles.skillDot}>•</Text>}
                      </React.Fragment>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.skillsContainer}>
                {data.skills?.map((skill, index) => (
                  <React.Fragment key={index}>
                    <Text style={styles.skill}>{skill.skill_name}</Text>
                    {index < (data.skills?.length ?? 0) - 1 && <Text style={styles.skillDot}>•</Text>}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.skillsContainer}>
              {data.languages?.map((lang, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.languageItem}>
                    <Text style={styles.languageName}>{lang.name}</Text> ({lang.proficiency})
                  </Text>
                  {index < (data.languages?.length ?? 0) - 1 && <Text style={styles.skillDot}>•</Text>}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                <Text style={styles.description}>{project.description}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {project.technologies?.map((tech, idx) => (
                      <React.Fragment key={idx}>
                        <Text style={styles.skill}>{tech}</Text>
                        {idx < (project.technologies?.length ?? 0) - 1 && <Text style={styles.skillDot}>•</Text>}
                      </React.Fragment>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>{cert.name}</Text>
                <Text style={styles.company}>{cert.issuing_organization}</Text>
                {(cert.issue_date || cert.expiry_date) && (
                  <Text style={styles.date}>
                    {cert.issue_date ? formatDate(cert.issue_date) : ''}
                    {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                    {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                  </Text>
                )}
                {cert.credential_id && (
                  <Text style={styles.description}>ID: {cert.credential_id}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
