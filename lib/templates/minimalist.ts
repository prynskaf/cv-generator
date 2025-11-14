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
  
  return `<ul style="margin: 5px 0; padding-left: 18px;">${sentences.map(sentence => `<li style="margin-bottom: 3px;">${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}</li>`).join('')}</ul>`
}

export function minimalistTemplate(data: any): string {
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
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #000;
    }
    .container {
      max-width: 750px;
      margin: 0 auto;
      padding: 30px;
    }
    .header {
      margin-bottom: 25px;
    }
    .header h1 {
      font-size: 24pt;
      font-weight: 300;
      color: #000;
      margin-bottom: 5px;
    }
    .contact-info {
      font-size: 9pt;
      color: #666;
      line-height: 1.4;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 600;
      color: #000;
      margin-bottom: 10px;
      padding-bottom: 3px;
      border-bottom: 1px solid #000;
    }
    .summary {
      text-align: justify;
      margin-bottom: 15px;
      font-size: 10pt;
    }
    .experience-item, .education-item {
      margin-bottom: 15px;
    }
    .item-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .item-title {
      font-weight: 600;
      font-size: 10.5pt;
    }
    .item-date {
      color: #666;
      font-size: 9pt;
    }
    .item-subtitle {
      color: #666;
      font-size: 10pt;
      margin-bottom: 5px;
    }
    .item-description {
      margin-top: 5px;
      font-size: 10pt;
    }
    .item-description ul {
      margin: 5px 0;
      padding-left: 18px;
    }
    .item-description li {
      margin-bottom: 3px;
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
        ${[email, phone, location].filter(Boolean).join(' • ')}
      </div>
      ${links && (links.linkedin || links.github || links.portfolio) ? `
      <div class="contact-info" style="margin-top: 5px;">
        ${[
          links.linkedin ? `<a href="${links.linkedin}" style="color: #000; text-decoration: none;">LinkedIn</a>` : '',
          links.github ? `<a href="${links.github}" style="color: #000; text-decoration: none;">GitHub</a>` : '',
          links.portfolio ? `<a href="${links.portfolio}" style="color: #000; text-decoration: none;">Portfolio</a>` : ''
        ].filter(Boolean).join(' • ')}
      </div>
      ` : ''}
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">SUMMARY</div>
      <div class="summary">${cleanMarkdown(summary)}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">EXPERIENCE</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-line">
            <div class="item-title">${cleanMarkdown(exp.position || '')}</div>
            <div class="item-date">${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</div>
          </div>
          <div class="item-subtitle">${cleanMarkdown(exp.company || '')}${exp.location ? `, ${cleanMarkdown(exp.location)}` : ''}</div>
          ${exp.description ? `<div class="item-description">${formatDescription(exp.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${education && education.length > 0 ? `
    <div class="section">
      <div class="section-title">EDUCATION</div>
      ${education.map((edu: any) => `
        <div class="education-item">
          <div class="item-line">
            <div class="item-title">${cleanMarkdown(edu.degree || '')}${edu.field_of_study ? ` in ${cleanMarkdown(edu.field_of_study)}` : ''}</div>
            <div class="item-date">${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</div>
          </div>
          <div class="item-subtitle">${cleanMarkdown(edu.institution || '')}${edu.location ? `, ${cleanMarkdown(edu.location)}` : ''}</div>
          ${edu.description ? `<div class="item-description">${formatDescription(edu.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">SKILLS</div>
      <div class="skills-list">
        ${skills.map((skill: any) => cleanMarkdown(skill.skill_name)).join(' • ')}
      </div>
    </div>
    ` : ''}

    ${projects && projects.length > 0 ? `
    <div class="section">
      <div class="section-title">PROJECTS</div>
      ${projects.map((project: any) => `
        <div class="experience-item">
          <div class="item-title">${cleanMarkdown(project.name || '')}</div>
          ${project.description ? `<div class="item-description">${formatDescription(project.description)}</div>` : ''}
          ${project.technologies && project.technologies.length > 0 ? `
            <div style="margin-top: 5px; font-size: 9.5pt; color: #666;">
              ${project.technologies.map((t: string) => cleanMarkdown(t)).join(' • ')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">LANGUAGES</div>
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
