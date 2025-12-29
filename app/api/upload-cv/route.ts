import { NextRequest, NextResponse } from 'next/server'
import { extractCVData, type ExtractedCVData } from '@/lib/gemini'
import mammoth from 'mammoth'
import PDFParser from 'pdf2json'
import { handleApiError } from '@/lib/utils/errors'
import { requireAuth } from '@/lib/utils/auth'
import { errorResponse } from '@/lib/utils/api-response'

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

interface PDFParserError {
  parserError?: string | Error
}

interface IPDFParser {
  on(event: 'pdfParser_dataError', handler: (errData: PDFParserError) => void): void
  on(event: 'pdfParser_dataReady', handler: () => void): void
  parseBuffer(buffer: Buffer): void
  getRawTextContent(): string
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as unknown as new (config: null, version: number) => IPDFParser)(null, 1)
    
    pdfParser.on('pdfParser_dataError', (errData: PDFParserError) => {
      console.error('PDF parsing error:', errData.parserError)
      reject(new Error('Failed to extract text from PDF'))
    })
    
    pdfParser.on('pdfParser_dataReady', () => {
      try {
        const text = pdfParser.getRawTextContent()
        resolve(text)
      } catch (error) {
        console.error('PDF text extraction error:', error)
        reject(new Error('Failed to extract text from PDF'))
      }
    })
    
    pdfParser.parseBuffer(buffer)
  })
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()

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

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB. Please upload a smaller file.' },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty. Please upload a valid file.' },
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

    // Delete existing experiences
    const { error: deleteExpError } = await supabase
      .from('experiences')
      .delete()
      .eq('user_id', user.id)

    if (deleteExpError) {
      console.error('Error deleting experiences:', deleteExpError)
      // Continue anyway - not critical
    }

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

    // Delete existing education
    const { error: deleteEduError } = await supabase
      .from('education')
      .delete()
      .eq('user_id', user.id)

    if (deleteEduError) {
      console.error('Error deleting education:', deleteEduError)
      // Continue anyway - not critical
    }

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

    // Delete existing skills
    const { error: deleteSkillsError } = await supabase
      .from('skills')
      .delete()
      .eq('user_id', user.id)

    if (deleteSkillsError) {
      console.error('Error deleting skills:', deleteSkillsError)
      // Continue anyway - not critical
    }

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

    // Delete existing links
    const { error: deleteLinksError } = await supabase
      .from('links')
      .delete()
      .eq('user_id', user.id)

    if (deleteLinksError) {
      console.error('Error deleting links:', deleteLinksError)
      // Continue anyway - not critical
    }

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

    // Delete existing languages
    const { error: deleteLangError } = await supabase
      .from('languages')
      .delete()
      .eq('user_id', user.id)

    if (deleteLangError) {
      console.error('Error deleting languages:', deleteLangError)
      // Continue anyway - not critical
    }

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

    // Delete existing projects
    const { error: deleteProjectsError } = await supabase
      .from('projects')
      .delete()
      .eq('user_id', user.id)

    if (deleteProjectsError) {
      console.error('Error deleting projects:', deleteProjectsError)
      // Continue anyway - not critical
    }

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

  } catch (error) {
    console.error('CV upload error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}
