import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { modernStyles as styles } from './modernStyles'

export function ModernTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Clean, modern header with profile pic on right */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text>{data.email}</Text>}
              {data.phone && <Text>• {data.phone}</Text>}
              {data.location && <Text>• {data.location}</Text>}
            </View>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View style={styles.contactRow}>
                {data.links.linkedin && (
                  <Text>LinkedIn: {data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
                {data.links.github && (
                  <Text>• GitHub: {data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
                {data.links.portfolio && (
                  <Text>• Portfolio: {data.links.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
              </View>
            )}
          </View>
          {/* Profile Picture - Floating in header corner */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
        </View>

        {/* Asymmetric Grid Layout - 30/70 split */}
        <View style={styles.mainContent}>
          {/* Left Sidebar - 30% width, colored background */}
          <View style={styles.sidebar}>
            {/* Skills Section - Vertical badges */}
            {data.skills && data.skills.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Skills</Text>
                {Object.keys(skillsByCategory).length > 1 ? (
                  Object.entries(skillsByCategory).map(([category, skills], index) => (
                    <View key={index}>
                      <Text style={styles.skillCategory}>{category}</Text>
                      <View style={styles.skillsContainer}>
                        {skills.map((skill, idx) => (
                          <Text key={idx} style={styles.skill}>
                            {skill}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.skillsContainer}>
                    {data.skills.map((skill, index) => (
                      <Text key={index} style={styles.skill}>
                        {skill.skill_name}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Languages Section */}
            {data.languages && data.languages.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang, index) => (
                  <View key={index} style={styles.languageItem}>
                    <Text>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text> - {lang.proficiency}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Links Section */}
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View>
                <Text style={styles.sectionTitle}>Links</Text>
                {data.links.linkedin && (
                  <View style={styles.link}>
                    <Text>
                      <Text style={styles.linkLabel}>LinkedIn: </Text>
                      <Text>{data.links.linkedin.replace('https://', '').replace('http://', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.github && (
                  <View style={styles.link}>
                    <Text>
                      <Text style={styles.linkLabel}>GitHub: </Text>
                      <Text>{data.links.github.replace('https://', '').replace('http://', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.portfolio && (
                  <View style={styles.link}>
                    <Text>
                      <Text style={styles.linkLabel}>Portfolio: </Text>
                      <Text>{data.links.portfolio.replace('https://', '').replace('http://', '')}</Text>
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Right Content - 70% width */}
          <View style={styles.content}>
            {/* Professional Summary */}
            {data.summary && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Summary</Text>
                <Text style={styles.description}>{data.summary}</Text>
              </View>
            )}

            {/* Experience Section - Clean, aligned with Summary */}
            {data.experiences && data.experiences.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experiences.map((exp, index) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <View key={index} style={styles.experienceItem}>
                      <View style={styles.jobHeader}>
                        <Text style={styles.jobTitle}>{exp.position}</Text>
                        <Text style={styles.company}>
                          {exp.company} • {exp.location}
                        </Text>
                        <Text style={styles.date}>
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                        </Text>
                      </View>
                      {bullets.length > 0 ? (
                        bullets.map((bullet, idx) => (
                          <Text key={idx} style={styles.bullet}>
                            • {bullet.trim()}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.bullet}>
                          • {exp.description}
                        </Text>
                      )}
                    </View>
                  )
                })}
              </View>
            )}

            {/* Education Section */}
            {data.education && data.education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.jobTitle}>
                      {edu.degree} in {edu.field_of_study}
                    </Text>
                    <Text style={styles.company}>
                      {edu.institution} • {edu.location}
                    </Text>
                    <Text style={styles.date}>
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Projects Section - 2-column card grid */}
            {data.projects && data.projects.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Projects</Text>
                <View style={styles.projectsGrid}>
                  {data.projects.map((project, index) => (
                    <View key={index} style={styles.projectCard}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectDesc}>{project.description}</Text>
                      {project.technologies && project.technologies.length > 0 && (
                        <Text style={styles.projectTech}>
                          {project.technologies.join(' • ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications Section */}
            {data.certifications && data.certifications.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert, index) => (
                  <View key={index} style={styles.certificationItem}>
                    <Text style={styles.jobTitle}>{cert.name}</Text>
                    <Text style={styles.company}>{cert.issuing_organization}</Text>
                    {(cert.issue_date || cert.expiry_date) && (
                      <Text style={styles.date}>
                        {cert.issue_date ? formatDate(cert.issue_date) : ''}
                        {cert.issue_date && cert.expiry_date ? ' - ' : ''}
                        {cert.expiry_date ? formatDate(cert.expiry_date) : ''}
                        {cert.issue_date && !cert.expiry_date ? ' (Issued)' : ''}
                      </Text>
                    )}
                    {cert.credential_id && (
                      <Text style={styles.description}>Credential ID: {cert.credential_id}</Text>
                    )}
                    {cert.description && (
                      <Text style={styles.description}>{cert.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
