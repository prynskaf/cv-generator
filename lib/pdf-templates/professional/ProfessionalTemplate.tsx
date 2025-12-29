import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { professionalStyles as styles } from './professionalStyles'

export function ProfessionalTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with thick top border - Classic resume style */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.full_name || 'YOUR NAME'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text>{data.email}</Text>}
              {data.phone && <Text>|  {data.phone}</Text>}
              {data.location && <Text>|  {data.location}</Text>}
            </View>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View style={styles.linksRow}>
                {data.links.linkedin && (
                  <Text style={styles.linkItem}>
                    LinkedIn: {data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
                {data.links.github && (
                  <Text style={styles.linkItem}>
                    |  GitHub: {data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
                {data.links.portfolio && (
                  <Text style={styles.linkItem}>
                    |  Portfolio: {data.links.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </Text>
                )}
              </View>
            )}
          </View>
          {/* Profile Picture - Small rounded rectangle, top-right */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
        </View>

        {/* Main Content with Sidebar - 65/35 split */}
        <View style={styles.mainContent}>
          {/* Main Content Area - Left (65%) */}
          <View style={styles.content}>
            {/* Professional Summary */}
            {data.summary && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>PROFESSIONAL SUMMARY</Text>
                <Text style={styles.summary}>{data.summary}</Text>
              </View>
            )}

            {/* Professional Experience */}
            {data.experiences && data.experiences.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                {data.experiences.map((exp, index) => {
                  const bullets = splitIntoBullets(exp.description)
                  return (
                    <View key={index} style={{ marginBottom: 10 }}>
                      <View style={styles.jobHeader}>
                        <View style={styles.jobHeaderLeft}>
                          <Text style={styles.jobTitle}>{exp.position}</Text>
                          <Text style={styles.company}>
                            {exp.company}, {exp.location}
                          </Text>
                        </View>
                        {/* Date - Right-aligned */}
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

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {data.education.map((edu, index) => {
                  const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
                  return (
                    <View key={index} style={styles.educationItem}>
                      <View style={styles.jobHeader}>
                        <View style={styles.jobHeaderLeft}>
                          <Text style={styles.jobTitle}>
                            {edu.degree}, {edu.field_of_study}
                          </Text>
                          <Text style={styles.company}>
                            {edu.institution}, {edu.location}
                          </Text>
                        </View>
                        <Text style={styles.date}>
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                        </Text>
                      </View>
                      {descriptionBullets.length > 0 ? (
                        descriptionBullets.map((bullet, idx) => (
                          <Text key={idx} style={styles.bullet}>
                            • {bullet.trim()}
                          </Text>
                        ))
                      ) : edu.description ? (
                        <Text style={styles.bullet}>
                          • {edu.description}
                        </Text>
                      ) : null}
                    </View>
                  )
                })}
              </View>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                {data.projects.map((project, index) => {
                  const descriptionBullets = project.description ? splitIntoBullets(project.description) : []
                  return (
                    <View key={index} style={styles.projectItem}>
                      <Text style={styles.jobTitle}>{project.name}</Text>
                      {descriptionBullets.length > 0 ? (
                        descriptionBullets.map((bullet, idx) => (
                          <Text key={idx} style={styles.bullet}>
                            • {bullet.trim()}
                          </Text>
                        ))
                      ) : project.description ? (
                        <Text style={styles.bullet}>
                          • {project.description}
                        </Text>
                      ) : null}
                      {project.technologies && project.technologies.length > 0 && (
                        <Text style={[styles.company, { marginTop: 6 }]}>
                          Technologies: {project.technologies.join(', ')}
                        </Text>
                      )}
                    </View>
                  )
                })}
              </View>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
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

          {/* Right Sidebar - 35% */}
          <View style={styles.sidebar}>
            {/* Technical Skills */}
            {data.skills && data.skills.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>TECHNICAL SKILLS</Text>
                {Object.keys(skillsByCategory).length > 0 ? (
                  Object.entries(skillsByCategory).map(([category, skills], index) => {
                    // Split skills into two columns
                    const midPoint = Math.ceil(skills.length / 2)
                    const leftColumn = skills.slice(0, midPoint)
                    const rightColumn = skills.slice(midPoint)
                    return (
                      <View key={index}>
                        {Object.keys(skillsByCategory).length > 1 && (
                          <Text style={styles.categoryTitle}>{category}:</Text>
                        )}
                        <View style={styles.skillsContainer}>
                          <View style={styles.skillColumn}>
                            {leftColumn.map((skill, idx) => (
                              <Text key={idx} style={styles.skill}>
                                • {skill}
                              </Text>
                            ))}
                          </View>
                          <View style={styles.skillColumn}>
                            {rightColumn.map((skill, idx) => (
                              <Text key={idx} style={styles.skill}>
                                • {skill}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </View>
                    )
                  })
                ) : (
                  (() => {
                    // Fallback: Split skills into two columns when no categories
                    const validSkills = data.skills.filter(skill => skill && skill.skill_name)
                    const midPoint = Math.ceil(validSkills.length / 2)
                    const leftColumn = validSkills.slice(0, midPoint)
                    const rightColumn = validSkills.slice(midPoint)
                    return (
                      <View style={styles.skillsContainer}>
                        <View style={styles.skillColumn}>
                          {leftColumn.map((skill, index) => (
                            <Text key={index} style={styles.skill}>
                              • {skill.skill_name || ''}
                            </Text>
                          ))}
                        </View>
                        <View style={styles.skillColumn}>
                          {rightColumn.map((skill, index) => (
                            <Text key={index + midPoint} style={styles.skill}>
                              • {skill.skill_name || ''}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )
                  })()
                )}
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                <View style={styles.languagesContainer}>
                  {data.languages.map((lang, index) => (
                    <Text key={index} style={styles.languageItem}>
                      <Text style={styles.languageName}>{lang.name}</Text> ({lang.proficiency})
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Links */}
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View>
                <Text style={styles.sectionTitle}>LINKS</Text>
                {data.links.linkedin && (
                  <View style={styles.link}>
                    <Text>
                      <Text style={styles.linkLabel}>LinkedIn: </Text>
                      <Text>{data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.github && (
                  <View style={styles.link}>
                    <Text>
                      <Text style={styles.linkLabel}>GitHub: </Text>
                      <Text>{data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                    </Text>
                  </View>
                )}
                {data.links.portfolio && (
                  <View style={styles.link}>
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
