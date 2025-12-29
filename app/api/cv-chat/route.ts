import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { handleApiError } from '@/lib/utils/errors'
import { CVData } from '@/lib/pdf-templates/shared/types'
import { GoogleGenAI } from '@google/genai'

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
}) : null

async function callGemini(prompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini API not configured')
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    return response.text ?? ''
  } catch (error: any) {
    console.error('Gemini error:', error.message)
    throw error
  }
}

interface ChatRequest {
  message: string
  currentCV: CVData
  templateId: string
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth()

    const body: ChatRequest = await request.json()
    const { message, currentCV, templateId } = body

    if (!message || !currentCV) {
      return validationErrorResponse('Message and current CV data are required')
    }

    // Optimize and apply user's edit request
    const prompt = `You are an AI assistant helping to edit a CV. The user wants to make changes to their CV.

User's request: "${message}"

Current CV data (JSON):
${JSON.stringify(currentCV, null, 2)}

Template: ${templateId}

Your CRITICAL tasks:
1. Apply the user's requested changes accurately and completely
2. AUTOMATICALLY optimize ALL content for conciseness:
   - Reduce overly long bullet points (max 2 lines each)
   - Combine similar or repetitive points
   - Use action-oriented language: "Implemented...", "Managed...", "Designed...", "Led...", "Optimized..."
   - Remove filler words and verbose phrases
   - Ensure clarity, relevance, and professional appeal
   - Make bullet points quantifiable when possible (include numbers, percentages, metrics)
3. Maintain formatting consistency and template style
4. Keep ALL existing data unless explicitly asked to remove
5. Preserve the exact JSON structure - return complete CVData with ALL fields
6. For experiences, ensure descriptions are arrays of concise bullet points separated by \\n
7. Return ONLY valid JSON, no markdown, no code blocks, no explanations

CRITICAL: Return the COMPLETE updated CVData JSON object with ALL sections (full_name, email, phone, location, summary, experiences, education, skills, projects, languages, links, profile_picture_url, show_profile_picture).`

    try {
      const responseText = await callGemini(prompt)
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const updatedCV: CVData = JSON.parse(cleanedResponse)

      return successResponse({
        cvData: updatedCV,
        message: 'CV updated successfully!',
      })
    } catch (aiError) {
      console.error('AI error:', aiError)
      // Fallback: return original CV with a note
      return successResponse({
        cvData: currentCV,
        message: 'AI processing unavailable. Please try again.',
      })
    }
  } catch (error) {
    console.error('CV chat error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}

