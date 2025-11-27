'use no memo'

import { NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { CVData, sanitizeCVData } from '@/lib/pdf-templates/shared/types'
import { ModernTemplate } from '@/lib/pdf-templates/modern/ModernTemplate'
import { ProfessionalTemplate } from '@/lib/pdf-templates/professional/ProfessionalTemplate'
import { MinimalistTemplate } from '@/lib/pdf-templates/minimalist/MinimalistTemplate'
import { CreativeTemplate } from '@/lib/pdf-templates/creative/CreativeTemplate'
import { ExecutiveTemplate } from '@/lib/pdf-templates/executive/ExecutiveTemplate'
import { TechTemplate } from '@/lib/pdf-templates/tech/TechTemplate'
import { DesignerTemplate } from '@/lib/pdf-templates/designer/DesignerTemplate'
import { requireAuth } from '@/lib/utils/auth'
import { ValidationError, NotFoundError, handleApiError } from '@/lib/utils/errors'
import { errorResponse } from '@/lib/utils/api-response'

function getTemplateComponent(templateId: string, data: CVData) {
  switch (templateId) {
    case 'professional':
      return <ProfessionalTemplate data={data} />
    case 'minimalist':
      return <MinimalistTemplate data={data} />
    case 'creative':
      return <CreativeTemplate data={data} />
    case 'executive':
      return <ExecutiveTemplate data={data} />
    case 'tech':
      return <TechTemplate data={data} />
    case 'designer':
      return <DesignerTemplate data={data} />
    default:
      return <ModernTemplate data={data} />
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()

    const body = await request.json()
    const { document_id, template_id } = body

    if (!document_id) {
      throw new ValidationError('Missing document_id', 'Please provide a document ID.')
    }

    const { data: document, error: docError } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (docError || !document) {
      throw new NotFoundError('Document not found', 'The requested document was not found or you do not have access to it.')
    }

    const cvContent = document.cv_content as CVData
    const sanitizedData = sanitizeCVData(cvContent)
    const fileName = `cv_${document.job_title.replace(/\s+/g, '_')}_${document.created_at}.pdf`
    const selectedTemplate = template_id || document.template_id || 'modern'

    const pdfDoc = getTemplateComponent(selectedTemplate, sanitizedData)
    const blob = await pdf(pdfDoc).toBlob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}
