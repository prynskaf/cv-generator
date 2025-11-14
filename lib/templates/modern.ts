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
  
  // Remove duplicate experiences
  if (cleaned.experiences && Array.isArray(cleaned.experiences)) {
    const seenExps = new Set()
    cleaned.experiences = cleaned.experiences.filter((exp: any) => {
      const key = `${exp.company?.toLowerCase()}-${exp.position?.toLowerCase()}`
      if (!key || seenExps.has(key)) return false
      seenExps.add(key)
      return true
    })
  }
  
  // Remove duplicate education
  if (cleaned.education && Array.isArray(cleaned.education)) {
    const seenEdu = new Set()
    cleaned.education = cleaned.education.filter((edu: any) => {
      const key = `${edu.institution?.toLowerCase()}-${edu.degree?.toLowerCase()}`
      if (!key || seenEdu.has(key)) return false
      seenEdu.add(key)
      return true
    })
  }
  
  return cleaned
}

export function modernTemplate(data: any): string {
  // Clean and deduplicate data
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
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
    }
    .header h1 {
      font-size: 32pt;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .contact-info {
      font-size: 10pt;
      color: #666;
      margin-top: 10px;
    }
    .contact-info span {
      margin: 0 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 16pt;
      font-weight: bold;
      color: #1e40af;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .summary {
      text-align: justify;
      margin-bottom: 20px;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .item-title {
      font-weight: bold;
      font-size: 12pt;
      color: #1f2937;
    }
    .item-subtitle {
      font-style: italic;
      color: #4b5563;
      margin-bottom: 5px;
    }
    .item-date {
      color: #6b7280;
      font-size: 10pt;
    }
    .item-description {
      margin-top: 8px;
    }
    .item-description ul {
      margin: 0;
      padding-left: 20px;
      list-style-type: disc;
    }
    .item-description li {
      margin-bottom: 4px;
      text-align: justify;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .skill-item {
      background: #f3f4f6;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 10pt;
    }
    .skill-name {
      font-weight: bold;
      color: #1f2937;
    }
    .skill-level {
      color: #6b7280;
      font-size: 9pt;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${full_name || 'Your Name'}</h1>
      <div class="contact-info">
        ${email ? `<span>${email}</span>` : ''}
        ${phone ? `<span>|</span><span>${phone}</span>` : ''}
        ${location ? `<span>|</span><span>${location}</span>` : ''}
      </div>
      ${links && (links.linkedin || links.github || links.portfolio) ? `
      <div class="contact-info" style="margin-top: 8px; font-size: 9pt;">
        ${links.linkedin ? `<span><a href="${links.linkedin}" style="color: #2563eb; text-decoration: none;">LinkedIn</a></span>` : ''}
        ${links.linkedin && (links.github || links.portfolio) ? `<span>|</span>` : ''}
        ${links.github ? `<span><a href="${links.github}" style="color: #2563eb; text-decoration: none;">GitHub</a></span>` : ''}
        ${links.github && links.portfolio ? `<span>|</span>` : ''}
        ${links.portfolio ? `<span><a href="${links.portfolio}" style="color: #2563eb; text-decoration: none;">Portfolio</a></span>` : ''}
      </div>
      ` : ''}
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <div class="summary">${cleanMarkdown(summary)}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">Work Experience</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-header">
            <div class="item-title">${cleanMarkdown(exp.position || '')}</div>
            <div class="item-date">${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</div>
          </div>
          <div class="item-subtitle">${cleanMarkdown(exp.company || '')}${exp.location ? ` | ${cleanMarkdown(exp.location)}` : ''}</div>
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
            <div class="item-date">${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</div>
          </div>
          <div class="item-subtitle">${cleanMarkdown(edu.institution || '')}${edu.location ? ` | ${cleanMarkdown(edu.location)}` : ''}</div>
          ${edu.description ? `<div class="item-description">${formatDescription(edu.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-grid">
        ${skills.map((skill: any) => `
          <div class="skill-item">
            <div class="skill-name">${cleanMarkdown(skill.skill_name || '')}</div>
            ${skill.skill_level ? `<div class="skill-level">${cleanMarkdown(skill.skill_level)}</div>` : ''}
          </div>
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
            <div style="margin-top: 8px;">
              <span style="font-weight: bold; color: #1f2937; font-size: 10pt;">Technologies:</span>
              <span style="color: #4b5563; font-size: 10pt;">${project.technologies.map((t: string) => cleanMarkdown(t)).join(', ')}</span>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="skills-grid">
        ${languages.map((lang: any) => `
          <div class="skill-item">
            <div class="skill-name">${cleanMarkdown(lang.name || '')}</div>
            ${lang.proficiency ? `<div class="skill-level">${cleanMarkdown(lang.proficiency)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${languages && languages.length > 0 ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="skills-grid">
        ${languages.map((lang: any) => `
          <div class="skill-item">
            <div class="skill-name">${lang.name || ''}</div>
            ${lang.proficiency ? `<div class="skill-level">${lang.proficiency}</div>` : ''}
          </div>
        `).join('')}
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

function cleanMarkdown(text: string): string {
  if (!text) return ''
  
  return text
    // Remove bold markdown (**text** or __text__)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove italic markdown (*text* or _text_)
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove code blocks
    .replace(/`(.+?)`/g, '$1')
    // Remove headers (# ## ###)
    .replace(/^#+\s*/gm, '')
    // Clean up any remaining markdown artifacts
    .trim()
}

function formatDescription(description: string): string {
  if (!description) return ''
  
  // Clean markdown first
  const cleanedDescription = cleanMarkdown(description)
  
  // Split by periods, newlines, or bullet points
  const sentences = cleanedDescription
    .split(/[.\n]/)
    .map(s => cleanMarkdown(s.trim()))
    .filter(s => s.length > 20) // Filter out very short fragments
  
  if (sentences.length <= 1) {
    // If only one sentence, return as paragraph
    return `<div style="text-align: justify;">${cleanedDescription}</div>`
  }
  
  // Multiple sentences - convert to bullet points
  return `<ul>${sentences.map(sentence => `<li>${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}</li>`).join('')}</ul>`
}
