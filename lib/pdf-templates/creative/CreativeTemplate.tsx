import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { CVData, formatDate, splitIntoBullets, groupSkillsByCategory } from '../shared/types'
import { creativeStyles as styles } from './creativeStyles'

export function CreativeTemplate({ data }: { data: CVData }) {
  const skillsByCategory = groupSkillsByCategory(data.skills)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with gradient accent */}
        <View style={styles.header}>
          {data.show_profile_picture !== false && data.profile_picture_url && (
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePictureFrame}>
                <Image
                  src={data.profile_picture_url}
                  style={styles.profilePicture}
                />
              </View>
            </View>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
            <View style={styles.contactRow}>
              {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
              {data.phone && <Text style={styles.contactItem}>• {data.phone}</Text>}
              {data.location && <Text style={styles.contactItem}>• {data.location}</Text>}
            </View>
            {data.links && (data.links.linkedin || data.links.github || data.links.portfolio) && (
              <View style={styles.linksRow}>
                {data.links.linkedin && <Text style={styles.link}>LinkedIn</Text>}
                {data.links.github && <Text style={styles.link}>GitHub</Text>}
                {data.links.portfolio && <Text style={styles.link}>Portfolio</Text>}
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Main Content - Two Column */}
        <View style={styles.mainContent}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Experience */}
            {data.experiences && data.experiences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experiences.map((exp, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
                    <Text style={styles.date}>
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </Text>
                    {exp.description && (
                      <View style={styles.bullets}>
                        {splitIntoBullets(exp.description).map((bullet, i) => (
                          <Text key={i} style={styles.bullet}>• {bullet}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, idx) => (
                  <View key={idx} style={styles.educationItem}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.institution}>{edu.institution}</Text>
                    <Text style={styles.date}>
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
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
                {data.projects.map((proj, idx) => (
                  <View key={idx} style={styles.projectItem}>
                    <Text style={styles.projectName}>{proj.name}</Text>
                    {proj.description && <Text style={styles.projectDesc}>{proj.description}</Text>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <Text style={styles.technologies}>{proj.technologies.join(' • ')}</Text>
                    )}
                  </View>
                ))}
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
        </View>
      </Page>
    </Document>
  )
}

