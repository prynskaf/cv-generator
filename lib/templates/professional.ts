// Helper function to remove duplicates from arrays
function cleanCVData(data: any): any {
  const cleaned = { ...data }
  
  // Remove duplicate skills
  if (cleaned.skills && Array.isArray(cleaned.skills)) {
    const seenSkills = new Set()
    cleaned.skills = cleaned.skills.filter((skill: any) => {
      const key = skill.skill_name?.toLowerCase()
      if (!key || seenSkills.has(key)) return false
      seenSkills.add(key)
      return true
    })
  }
  
  // Remove duplicate languages
  if (cleaned.languages && Array.isArray(cleaned.languages)) {
    const seenLangs = new Set()
    cleaned.languages = cleaned.languages.filter((lang: any) => {
      const key = lang.name?.toLowerCase()
      if (!key || seenLangs.has(key)) return false
      seenLangs.add(key)
      return true
    })
  }
  
  // Remove duplicate projects
  if (cleaned.projects && Array.isArray(cleaned.projects)) {
    const seenProjects = new Set()
    cleaned.projects = cleaned.projects.filter((proj: any) => {
      const key = proj.name?.toLowerCase()
      if (!key || seenProjects.has(key)) return false
      seenProjects.add(key)
      return true
    })
  }
  
  return cleaned
}

function cleanMarkdown(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^#+\s*/gm, '')
    .trim()
}

function formatDescription(description: string): string {
  if (!description) return ''
  
  const cleanedDescription = cleanMarkdown(description)
  const sentences = cleanedDescription
    .split(/[.\n]/)
    .map(s => cleanMarkdown(s.trim()))
    .filter(s => s.length > 20)
  
  if (sentences.length <= 1) {
    return `<div style="text-align: justify;">${cleanedDescription}</div>`
  }
  
  return `<ul style="margin: 5px 0; padding-left: 20px;">${sentences.map(sentence => `<li style="margin-bottom: 4px;">${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}</li>`).join('')}</ul>`
}

export function professionalTemplate(data: any): string {
  const cleanedData = cleanCVData(data)
  const { full_name, email, phone, location, summary, experiences, education, skills, links, languages, projects } = cleanedData

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #2d3748;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #cbd5e0;
    }
    .header h1 {
      font-size: 28pt;
      color: #1a202c;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .contact-info {
      font-size: 10pt;
      color: #4a5568;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1a202c;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .summary {
      text-align: justify;
      margin-bottom: 20px;
      font-style: italic;
    }
    .experience-item, .education-item {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .item-header {
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: bold;
      font-size: 12pt;
      color: #2d3748;
    }
    .item-meta {
      display: flex;
      justify-content: space-between;
      color: #4a5568;
      font-size: 10pt;
      margin-bottom: 8px;
    }
    .item-description {
      margin-top: 8px;
      text-align: justify;
      color: #4a5568;
    }
    .item-description ul {
      margin: 5px 0;
      padding-left: 20px;
    }
    .item-description li {
      margin-bottom: 4px;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-item {
      padding: 6px 14px;
      background: #edf2f7;
      border: 1px solid #cbd5e0;
      border-radius: 3px;
      font-size: 10pt;
      color: #2d3748;
    }
    .skills-list {
      font-size: 10pt;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${cleanMarkdown(full_name || 'Your Name')}</h1>
      <div class="contact-info">
        ${email ? `<span>${email}</span>` : ''}
        ${phone ? `<span>${phone}</span>` : ''}
        ${location ? `<span>${location}</span>` : ''}
      </div>
      ${links && (links.linkedin || links.github || links.portfolio) ? `
      <div class="contact-info" style="margin-top: 8px;">
        ${[
          links.linkedin ? `<a href="${links.linkedin}" style="color: #4a5568; text-decoration: none;">LinkedIn</a>` : '',
          links.github ? `<a href="${links.github}" style="color: #4a5568; text-decoration: none;">GitHub</a>` : '',
          links.portfolio ? `<a href="${links.portfolio}" style="color: #4a5568; text-decoration: none;">Portfolio</a>` : ''
        ].filter(Boolean).join(' | ')}
      </div>
      ` : ''}
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <div class="summary">${cleanMarkdown(summary)}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-header">
            <div class="item-title">${cleanMarkdown(exp.position || '')}</div>
          </div>
          <div class="item-meta">
            <span>${cleanMarkdown(exp.company || '')}${exp.location ? ` - ${cleanMarkdown(exp.location)}` : ''}</span>
            <span>${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
          </div>
          ${exp.description ? `<div class="item-description">${formatDescription(exp.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${education && education.length > 0 ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${education.map((edu: any) => `
        <div class="education-item">
          <div class="item-header">
            <div class="item-title">${cleanMarkdown(edu.degree || '')}${edu.field_of_study ? ` in ${cleanMarkdown(edu.field_of_study)}` : ''}</div>
          </div>
          <div class="item-meta">
            <span>${cleanMarkdown(edu.institution || '')}${edu.location ? ` - ${cleanMarkdown(edu.location)}` : ''}</span>
            <span>${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</span>
          </div>
          ${edu.description ? `<div class="item-description">${formatDescription(edu.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-container">
        ${skills.map((skill: any) => `
          <span class="skill-item">${cleanMarkdown(skill.skill_name || '')}${skill.skill_level ? ` (${cleanMarkdown(skill.skill_level)})` : ''}</span>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${projects && projects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${projects.map((project: any) => `
        <div class="experience-item">
          <div class="item-title">${cleanMarkdown(project.name || '')}</div>
          ${project.description ? `<div class="item-description">${formatDescription(project.description)}</div>` : ''}
          ${project.technologies && project.technologies.length > 0 ? `
            <div style="margin-top: 8px; font-size: 10pt; color: #4a5568;">
              <span style="font-weight: bold;">Technologies:</span> ${project.technologies.map((t: string) => cleanMarkdown(t)).join(', ')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="skills-list">
        ${languages.map((lang: any) => `${cleanMarkdown(lang.name)} (${cleanMarkdown(lang.proficiency)})`).join(' • ')}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim()
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
