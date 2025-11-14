import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTemplate } from '@/lib/templates'
import puppeteer from 'puppeteer'

export async function POST(request: NextRequest) {
  let browser

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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

    const cvContent = document.cv_content
    const selectedTemplate = template_id || document.template_id || 'modern'

    const html = getTemplate(selectedTemplate, cvContent)

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    })

    await browser.close()

    const fileName = `cv_${document.job_title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`${user.id}/${fileName}`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      
      // Convert Uint8Array to Buffer then to base64
      const buffer = Buffer.from(pdfBuffer)
      const base64 = buffer.toString('base64')
      const dataUrl = `data:application/pdf;base64,${base64}`
      
      return NextResponse.json({
        success: true,
        download_url: dataUrl,
        fileName,
        storage_error: uploadError.message
      })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(uploadData.path)

    await supabase
      .from('generated_documents')
      .update({ pdf_url: publicUrl })
      .eq('id', document_id)

    return NextResponse.json({
      success: true,
      pdf_url: publicUrl,
      fileName,
    })
  } catch (error: any) {
    console.error('Export error:', error)
    if (browser) {
      await browser.close()
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
