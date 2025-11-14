export function minimalistTemplate(data: any): string {
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
      text-align: justify;
      font-size: 10pt;
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
      <h1>${full_name || 'Your Name'}</h1>
      <div class="contact-info">
        ${[email, phone, location].filter(Boolean).join(' • ')}
      </div>
    </div>

    ${summary ? `
    <div class="section">
      <div class="section-title">SUMMARY</div>
      <div class="summary">${summary}</div>
    </div>
    ` : ''}

    ${experiences && experiences.length > 0 ? `
    <div class="section">
      <div class="section-title">EXPERIENCE</div>
      ${experiences.map((exp: any) => `
        <div class="experience-item">
          <div class="item-line">
            <div class="item-title">${exp.position || ''}</div>
            <div class="item-date">${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</div>
          </div>
          <div class="item-subtitle">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
          ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
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
            <div class="item-title">${edu.degree || ''}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</div>
            <div class="item-date">${formatDate(edu.start_date)} - ${edu.is_current ? 'Present' : formatDate(edu.end_date)}</div>
          </div>
          <div class="item-subtitle">${edu.institution || ''}${edu.location ? `, ${edu.location}` : ''}</div>
          ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">SKILLS</div>
      <div class="skills-list">
        ${skills.map((skill: any) => skill.skill_name).join(' • ')}
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
