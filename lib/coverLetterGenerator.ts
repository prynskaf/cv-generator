import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'

interface CoverLetterData {
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAddress: string
  companyName: string
  hiringManagerName?: string
  jobTitle: string
  coverLetterContent: string
}

export async function generateCoverLetterDocx(data: CoverLetterData): Promise<Blob> {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Parse the cover letter content into paragraphs
  const contentParagraphs = data.coverLetterContent
    .split('\n')
    .filter(line => line.trim().length > 0)

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Applicant's contact information (aligned right)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: data.applicantName,
                bold: true,
                size: 24
              })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: data.applicantEmail,
                size: 22
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: data.applicantPhone,
                size: 22
              })
            ]
          }),
          ...(data.applicantAddress ? [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: data.applicantAddress,
                  size: 22
                })
              ],
              spacing: { after: 400 }
            })
          ] : [
            new Paragraph({
              spacing: { after: 400 }
            })
          ]),

          // Date
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: today,
                size: 22
              })
            ],
            spacing: { after: 400 }
          }),

          // Company information
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: data.hiringManagerName || 'Hiring Manager',
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: data.companyName,
                size: 22
              })
            ],
            spacing: { after: 400 }
          }),

          // Salutation
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Dear ${data.hiringManagerName || 'Hiring Manager'},`,
                size: 24
              })
            ],
            spacing: { after: 300 }
          }),

          // Cover letter content paragraphs
          ...contentParagraphs.map(paragraph => 
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [
                new TextRun({
                  text: paragraph,
                  size: 24
                })
              ],
              spacing: { after: 200, line: 360 }
            })
          ),

          // Closing
          new Paragraph({
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'Sincerely,',
                size: 24
              })
            ],
            spacing: { after: 600 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: data.applicantName,
                bold: true,
                size: 24
              })
            ]
          })
        ]
      }
    ]
  })

  return await Packer.toBlob(doc)
}

export async function generateCoverLetterTxt(data: CoverLetterData): Promise<string> {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `${data.applicantName}
${data.applicantEmail}
${data.applicantPhone}
${data.applicantAddress || ''}

${today}

${data.hiringManagerName || 'Hiring Manager'}
${data.companyName}

Dear ${data.hiringManagerName || 'Hiring Manager'},

${data.coverLetterContent}

Sincerely,

${data.applicantName}`
}
