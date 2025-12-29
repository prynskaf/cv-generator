import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { techStyles as styles } from './techStyles'

export function TechTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Terminal-inspired */}
        <View style={styles.header}>
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text>{data.email}</Text>}
              {data.phone && <Text> • {data.phone}</Text>}
              {data.location && <Text> • {data.location}</Text>}
            </View>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View style={styles.linksRow}>
                {data.links.linkedin && (
                  <Text style={styles.link}>
                    LinkedIn: {data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
                {data.links.github && (
                  <Text style={styles.link}>
                    | GitHub: {data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
                {data.links.portfolio && (
                  <Text style={styles.link}>
                    | Portfolio: {data.links.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Summary Section */}
        {data.summary && (
          <View style={styles.summarySection}>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithLine]}>Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Main Content - Single Column Layout */}
        <View style={styles.mainContent}>
          {/* Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experiences.map((exp, idx) => {
                const bullets = splitIntoBullets(exp.description)
                return (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.jobHeader}>
                      <View style={styles.jobHeaderLeft}>
                        <Text style={styles.jobTitle}>{exp.position}</Text>
                        <Text style={styles.company}>
                          {exp.company}, {exp.location}
                        </Text>
                      </View>
                      <Text style={styles.date}>
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                      </Text>
                    </View>
                    {bullets.length > 0 ? (
                      bullets.map((bullet, i) => (
                        <Text key={i} style={styles.bullet}>• {bullet.trim()}</Text>
                      ))
                    ) : exp.description ? (
                      <Text style={styles.bullet}>• {exp.description}</Text>
                    ) : null}
                  </View>
                )
              })}
            </View>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu, idx) => {
                const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                return (
                  <View key={idx} style={styles.educationItem}>
                    <Text style={styles.degree}>
                      {edu.degree}, {edu.field_of_study}
                    </Text>
                    <Text style={styles.institution}>{edu.institution}, {edu.location}</Text>
                    <Text style={styles.date}>
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                    </Text>
                    {descriptionBullets.length > 0 ? (
                      descriptionBullets.map((bullet, i) => (
                        <Text key={i} style={styles.bullet}>• {bullet.trim()}</Text>
                      ))
                    ) : edu.description ? (
                      <Text style={styles.bullet}>• {edu.description}</Text>
                    ) : null}
                  </View>
                )
              })}
            </View>
          )}

          {/* Technical Skills */}
          {data.skills && data.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Skills</Text>
              {Object.keys(skillsByCategory).length > 1 ? (
                Object.entries(skillsByCategory).map(([category, skills], idx) => (
                  <View key={idx} style={styles.skillGroup}>
                    <Text style={styles.skillCategory}>{category}</Text>
                    <View style={styles.skillsContainer}>
                      {skills.map((skill, i) => (
                        <Text key={i} style={styles.skill}>{skill}</Text>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill, i) => (
                    <Text key={i} style={styles.skill}>{skill.skill_name}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((proj, idx) => {
                const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                return (
                  <View key={idx} style={styles.projectItem}>
                    <Text style={styles.projectName}>{proj.name}</Text>
                    {descriptionBullets.length > 0 ? (
                      descriptionBullets.map((bullet, i) => (
                        <Text key={i} style={styles.projectDesc}>• {bullet.trim()}</Text>
                      ))
                    ) : proj.description ? (
                      <Text style={styles.projectDesc}>{proj.description}</Text>
                    ) : null}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <Text style={styles.technologies}>
                        Technologies: {proj.technologies.join(' • ')}
                      </Text>
                    )}
                  </View>
                )
              })}
            </View>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certifications.map((cert, idx) => {
                const descriptionBullets = cert.description ? splitIntoBullets(cert.description) : []
                return (
                  <View key={idx} style={styles.certificationItem}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationOrg}>{cert.issuing_organization}</Text>
                    {(cert.issue_date || cert.expiry_date) && (
                      <Text style={styles.date}>
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                      </Text>
                    )}
                    {cert.credential_id && (
                      <Text style={styles.technologies}>ID: {cert.credential_id}</Text>
                    )}
                    {descriptionBullets.length > 0 ? (
                      descriptionBullets.map((bullet, i) => (
                        <Text key={i} style={styles.projectDesc}>• {bullet.trim()}</Text>
                      ))
                    ) : cert.description ? (
                      <Text style={styles.projectDesc}>{cert.description}</Text>
                    ) : null}
                  </View>
                )
              })}
            </View>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {data.languages.map((lang, idx) => (
                <View key={idx} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.proficiency}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
