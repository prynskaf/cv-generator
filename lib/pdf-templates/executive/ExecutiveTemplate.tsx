import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { executiveStyles as styles } from './executiveStyles'

export function ExecutiveTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Elegant navy blue */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{data.full_name || 'YOUR NAME'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text>{data.email}</Text>}
              {data.phone && <Text> | {data.phone}</Text>}
              {data.location && <Text> | {data.location}</Text>}
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
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
        </View>

        {/* Main Content - Two Column Layout */}
        <View style={styles.mainContent}>
          {/* Left Column - Main content (65%) */}
          <View style={styles.leftColumn}>
            {/* Executive Summary */}
            {data.summary && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>EXECUTIVE SUMMARY</Text>
                <Text style={styles.summary}>{data.summary}</Text>
              </View>
            )}

            {/* Professional Experience */}
            {data.experiences && data.experiences.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
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
              <View>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
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

            {/* Key Projects */}
            {data.projects && data.projects.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>KEY PROJECTS</Text>
                {data.projects.map((proj, idx) => {
                  const descriptionBullets = proj.description ? splitIntoBullets(proj.description) : []
                  return (
                    <View key={idx} style={styles.projectItem}>
                      <Text style={styles.projectName}>{proj.name}</Text>
                      {descriptionBullets.length > 0 ? (
                        descriptionBullets.map((bullet, i) => (
                          <Text key={i} style={styles.bullet}>• {bullet.trim()}</Text>
                        ))
                      ) : proj.description ? (
                        <Text style={styles.projectDesc}>{proj.description}</Text>
                      ) : null}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <Text style={styles.projectDesc}>
                          Technologies: {proj.technologies.join(', ')}
                        </Text>
                      )}
                    </View>
                  )
                })}
              </View>
            )}
          </View>

          {/* Right Column - Sidebar (35%) */}
          <View style={styles.rightColumn}>
            {/* Core Competencies */}
            {data.skills && data.skills.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>CORE COMPETENCIES</Text>
                {Object.keys(skillsByCategory).length > 1 ? (
                  Object.entries(skillsByCategory).map(([category, skills], idx) => (
                    <View key={idx}>
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

            {/* Professional Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                {data.certifications.map((cert, idx) => (
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
                      <Text style={styles.date}>Credential ID: {cert.credential_id}</Text>
                    )}
                    {cert.description && (
                      <Text style={styles.bullet}>• {cert.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                {data.languages.map((lang, idx) => (
                  <View key={idx} style={styles.languageItem}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    <Text style={styles.proficiency}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Links */}
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View>
                <Text style={styles.sectionTitle}>LINKS</Text>
                {data.links.linkedin && (
                  <View style={styles.linkItem}>
                    <Text>
                      <Text style={styles.linkLabel}>LinkedIn: </Text>
                      <Text>{data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.github && (
                  <View style={styles.linkItem}>
                    <Text>
                      <Text style={styles.linkLabel}>GitHub: </Text>
                      <Text>{data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.portfolio && (
                  <View style={styles.linkItem}>
                    <Text>
                      <Text style={styles.linkLabel}>Portfolio: </Text>
                      <Text>{data.links.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
