'use no memo'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { pdf } from '@react-pdf/renderer'
import { CVData, sanitizeCVData } from '@/lib/pdf-templates/shared/types'
import { ModernTemplate } from '@/lib/pdf-templates/modern/ModernTemplate'
import { ProfessionalTemplate } from '@/lib/pdf-templates/professional/ProfessionalTemplate'
import { MinimalistTemplate } from '@/lib/pdf-templates/minimalist/MinimalistTemplate'

function getTemplateComponent(templateId: string, data: CVData) {
  if (templateId === 'professional') {
    return <ProfessionalTemplate data={data} />
  } else if (templateId === 'minimalist') {
    return <MinimalistTemplate data={data} />
  }
  return <ModernTemplate data={data} />
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { document_id, template_id } = body

    if (!document_id) {
      return NextResponse.json({ error: 'Missing document_id' }, { status: 400 })
    }

    const { data: document } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    )
  }
}
