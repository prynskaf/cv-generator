import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { professionalStyles as styles } from './professionalStyles'

export function ProfessionalTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
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
                  LinkedIn: {data.links.linkedin.replace('https://', '').replace('http://', '')}
                </Text>
              )}
              {data.links.github && (
                <Text style={styles.linkItem}>
                  |  GitHub: {data.links.github.replace('https://', '').replace('http://', '')}
                </Text>
              )}
              {data.links.portfolio && (
                <Text style={styles.linkItem}>
                  |  Portfolio: {data.links.portfolio.replace('https://', '').replace('http://', '')}
                </Text>
              )}
            </View>
          )}
          </View>
          {/* Profile Picture - Rounded rectangle, right-aligned */}
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <Image
                src={data.profile_picture_url}
                style={styles.profilePicture}
              />
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View>
            <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Professional Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experiences && data.experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experiences.map((exp, index) => {
              const bullets = splitIntoBullets(exp.description)
              return (
                <View key={index} style={{ marginBottom: 16 }}>
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
                      • {bullet}
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
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.jobTitle}>
                  {edu.degree}, {edu.field_of_study}
                </Text>
                <Text style={styles.company}>
                  {edu.institution}, {edu.location}
                </Text>
                <Text style={styles.date}>
                  {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
                </Text>
                {edu.description && <Text style={styles.description}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {Object.keys(skillsByCategory).length > 1 ? (
              Object.entries(skillsByCategory).map(([category, skills], index) => (
                <View key={index}>
                  <Text style={styles.categoryTitle}>{category}:</Text>
                  <View style={styles.skillsGrid}>
                    {skills.map((skill, idx) => (
                      <Text key={idx} style={styles.skill}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.skillsGrid}>
                {data.skills.map((skill, index) => (
                  <Text key={index} style={styles.skill}>
                    {skill.skill_name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
              {data.languages.map((lang, index) => (
                <Text key={index} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}</Text> ({lang.proficiency})
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                <Text style={styles.description}>{project.description}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={styles.description}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
