import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { minimalistStyles as styles } from './minimalistStyles'

export function MinimalistTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Clean, left-aligned */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text>{data.email}</Text>}
              {data.phone && <Text style={styles.separator}> | {data.phone}</Text>}
              {data.location && <Text style={styles.separator}> | {data.location}</Text>}
            </View>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View style={styles.contactRow}>
                {data.links.linkedin && (
                  <Text>{data.links.linkedin.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
                {data.links.github && (
                  <Text style={styles.separator}> | {data.links.github.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
                {data.links.portfolio && (
                  <Text style={styles.separator}> | {data.links.portfolio.replace('https://', '').replace('http://', '').replace('www.', '')}</Text>
                )}
              </View>
            )}
          </View>
          {/* Profile Picture - Small circle, top-right */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
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
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => {
              const descriptionBullets = edu.description ? splitIntoBullets(edu.description) : []
              return (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View style={styles.jobHeader}>
                    <View style={styles.jobHeaderLeft}>
                      <Text style={styles.jobTitle}>
                        {edu.degree}, {edu.field_of_study}
                      </Text>
                      <Text style={styles.company}>{edu.institution}, {edu.location}</Text>
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

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.keys(skillsByCategory).length > 1 ? (
              <View style={styles.skillsContainer}>
                {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    {categoryIndex > 0 && <Text style={styles.skillSeparator}> • </Text>}
                    <Text style={styles.categoryTitle}>{category}: </Text>
                    {skills.map((skill, idx) => (
                      <React.Fragment key={idx}>
                        <Text style={styles.skill}>{skill}</Text>
                        {idx < skills.length - 1 && <Text style={styles.skillSeparator}> • </Text>}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </View>
            ) : (
              <View style={styles.skillsContainer}>
                {data.skills?.map((skill, index) => (
                  <React.Fragment key={index}>
                    <Text style={styles.skill}>{skill.skill_name}</Text>
                    {index < (data.skills?.length ?? 0) - 1 && <Text style={styles.skillSeparator}> • </Text>}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
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
                    <View style={styles.skillsContainer}>
                      <Text style={styles.company}>Technologies: </Text>
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={idx}>
                          <Text style={styles.skill}>{tech}</Text>
                          {idx < (project.technologies?.length ?? 0) - 1 && <Text style={styles.skillSeparator}> • </Text>}
                        </React.Fragment>
                      ))}
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        )}

        {/* Certifications */}
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
                  </Text>
                )}
                {cert.credential_id && (
                  <Text style={styles.description}>ID: {cert.credential_id}</Text>
                )}
                {cert.description && (
                  <Text style={styles.bullet}>
                    • {cert.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
              {data.languages?.map((lang, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.languageItem}>
                    <Text style={styles.languageName}>{lang.name}</Text> ({lang.proficiency})
                  </Text>
                  {index < (data.languages?.length ?? 0) - 1 && <Text style={styles.skillSeparator}> • </Text>}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
