import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractCVData, type ExtractedCVData } from '@/lib/gemini'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

if (typeof process !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

function normalizeDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null
  
  const trimmed = dateString.trim()
  if (!trimmed) return null
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }
  
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return `${trimmed}-01`
  }
  
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01-01`
  }
  
  return null
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    const pdf = await loadingTask.promise
    
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or Word document.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    let cvText = ''
    
    if (file.type === 'application/pdf') {
      cvText = await extractTextFromPDF(buffer)
    } else {
      cvText = await extractTextFromDOCX(buffer)
    }

    if (!cvText || cvText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the CV. Please ensure the file is not empty or corrupted.' },
        { status: 400 }
      )
    }

    console.log('Extracted CV text length:', cvText.length)
    
    const extractedData: ExtractedCVData = await extractCVData(cvText)

    console.log('Extracted data:', JSON.stringify(extractedData, null, 2))

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        full_name: extractedData.fullName || user.user_metadata?.full_name || '',
        email: extractedData.email || user.email || '',
        phone: extractedData.phone || null,
        location: extractedData.location || null,
        date_of_birth: normalizeDate(extractedData.dateOfBirth),
        professional_summary: extractedData.professionalSummary || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      throw profileError
    }

    await supabase
      .from('experiences')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.experience && extractedData.experience.length > 0) {
      const experiencesData = extractedData.experience.map((exp) => ({
        user_id: user.id,
        company: exp.company,
        position: exp.position,
        location: exp.location || null,
        start_date: normalizeDate(exp.startDate),
        end_date: exp.currentPosition ? null : normalizeDate(exp.endDate),
        is_current: exp.currentPosition,
        description: exp.description || null,
      }))

      const { error: expError } = await supabase
        .from('experiences')
        .insert(experiencesData)

      if (expError) {
        console.error('Experience insert error:', expError)
        throw expError
      }
      console.log(`✅ Inserted ${experiencesData.length} experiences`)
    }

    await supabase
      .from('education')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.education && extractedData.education.length > 0) {
      const educationData = extractedData.education.map((edu) => ({
        user_id: user.id,
        institution: edu.institution,
        degree: edu.degree,
        field_of_study: edu.fieldOfStudy || null,
        location: edu.location || null,
        start_date: normalizeDate(edu.startDate),
        end_date: edu.currentlyEnrolled ? null : normalizeDate(edu.endDate),
        is_current: edu.currentlyEnrolled,
        description: edu.description || null,
      }))

      const { error: eduError } = await supabase
        .from('education')
        .insert(educationData)

      if (eduError) {
        console.error('Education insert error:', eduError)
        throw eduError
      }
      console.log(`✅ Inserted ${educationData.length} education entries`)
    }

    await supabase
      .from('skills')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.skills && extractedData.skills.length > 0) {
      const skillsData = extractedData.skills.map((skill) => ({
        user_id: user.id,
        skill_name: skill.name,
        skill_level: skill.proficiencyLevel,
        skill_category: skill.category || null,
      }))

      const { error: skillError } = await supabase
        .from('skills')
        .insert(skillsData)

      if (skillError) {
        console.error('Skills insert error:', skillError)
        throw skillError
      }
      console.log(`✅ Inserted ${skillsData.length} skills`)
    }

    await supabase
      .from('links')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.links) {
      const { error: linksError } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          linkedin: extractedData.links.linkedin || null,
          github: extractedData.links.github || null,
          portfolio: extractedData.links.portfolio || null,
          other_links: extractedData.links.otherLinks || [],
        })

      if (linksError) {
        console.error('Links insert error:', linksError)
        throw linksError
      }
    }

    await supabase
      .from('languages')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.languages && extractedData.languages.length > 0) {
      const languagesData = extractedData.languages.map((lang) => ({
        user_id: user.id,
        name: lang.name,
        proficiency: lang.proficiency || null,
      }))

      const { error: langError } = await supabase
        .from('languages')
        .insert(languagesData)

      if (langError) {
        console.error('Languages insert error:', langError)
        throw langError
      }
    }

    await supabase
      .from('projects')
      .delete()
      .eq('user_id', user.id)

    if (extractedData.projects && extractedData.projects.length > 0) {
      const projectsData = extractedData.projects.map((proj) => ({
        user_id: user.id,
        name: proj.name,
        description: proj.description || null,
        technologies: proj.technologies || [],
      }))

      const { error: projError } = await supabase
        .from('projects')
        .insert(projectsData)

      if (projError) {
        console.error('Projects insert error:', projError)
        throw projError
      }
    }

    return NextResponse.json({
      success: true,
      message: 'CV uploaded and profile updated successfully',
      data: extractedData,
    })

  } catch (error: any) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process CV' },
      { status: 500 }
    )
  }
}
