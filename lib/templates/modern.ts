export function modernTemplate(data: any): string {
  const { full_name, email, phone, location, summary, experiences, education, skills, links, languages, projects } = data

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
      <div class="summary">${summary}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">Work Experience</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-header">
            <div class="item-title">${exp.position || ''}</div>
            <div class="item-date">${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</div>
          </div>
          <div class="item-subtitle">${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''}</div>
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
            <div class="item-title">${edu.degree || ''}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</div>
            <div class="item-date">${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</div>
          </div>
          <div class="item-subtitle">${edu.institution || ''}${edu.location ? ` | ${edu.location}` : ''}</div>
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
            <div class="skill-name">${skill.skill_name || ''}</div>
            ${skill.skill_level ? `<div class="skill-level">${skill.skill_level}</div>` : ''}
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
          <div class="item-title">${project.name || ''}</div>
          ${project.description ? `<div class="item-description">${formatDescription(project.description)}</div>` : ''}
          ${project.technologies && project.technologies.length > 0 ? `
            <div style="margin-top: 8px;">
              <span style="font-weight: bold; color: #1f2937; font-size: 10pt;">Technologies:</span>
              <span style="color: #4b5563; font-size: 10pt;">${project.technologies.join(', ')}</span>
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

function formatDescription(description: string): string {
  if (!description) return ''
  
  // Split by periods, newlines, or bullet points
  const sentences = description
    .split(/[.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 20) // Filter out very short fragments
  
  if (sentences.length <= 1) {
    // If only one sentence, return as paragraph
    return `<div style="text-align: justify;">${description}</div>`
  }
  
  // Multiple sentences - convert to bullet points
  return `<ul>${sentences.map(sentence => `<li>${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}</li>`).join('')}</ul>`
}
