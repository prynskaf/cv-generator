export function professionalTemplate(data: any): string {
  const { full_name, email, phone, location, summary, experiences, education, skills } = data

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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${full_name || 'Your Name'}</h1>
      <div class="contact-info">
        ${email ? `<span>${email}</span>` : ''}
        ${phone ? `<span>${phone}</span>` : ''}
        ${location ? `<span>${location}</span>` : ''}
      </div>
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <div class="summary">${summary}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-header">
            <div class="item-title">${exp.position || ''}</div>
          </div>
          <div class="item-meta">
            <span>${exp.company || ''}${exp.location ? ` - ${exp.location}` : ''}</span>
            <span>${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
          </div>
          ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
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
          </div>
          <div class="item-meta">
            <span>${edu.institution || ''}${edu.location ? ` - ${edu.location}` : ''}</span>
            <span>${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</span>
          </div>
          ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-container">
        ${skills.map((skill: any) => `
          <span class="skill-item">${skill.skill_name || ''}${skill.skill_level ? ` (${skill.skill_level})` : ''}</span>
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
