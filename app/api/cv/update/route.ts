import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { ValidationError } from '@/lib/utils/errors'
import { errorResponse } from '@/lib/utils/api-response'
import { handleApiError } from '@/lib/utils/errors'

export async function PUT(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()
    const body = await request.json()
    const { document_id, cv_content, cover_letter_content, template_id } = body

    if (!document_id) {
      throw new ValidationError('Missing document_id', 'Please provide a document ID.')
    }

    if (!cv_content) {
      throw new ValidationError('Missing cv_content', 'Please provide CV content to update.')
    }

    // Verify document belongs to user
    const { data: existingDoc, error: checkError } = await supabase
      .from('generated_documents')
      .select('id, user_id')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingDoc) {
      throw new ValidationError('Document not found', 'The document was not found or you do not have permission to edit it.')
    }

    // Update document
    const updateData: any = {
      cv_content,
    }

    if (cover_letter_content !== undefined) {
      updateData.cover_letter_content = cover_letter_content
    }

    if (template_id) {
      updateData.template_id = template_id
    }

    const { data: updatedDoc, error: updateError } = await supabase
      .from('generated_documents')
      .update(updateData)
      .eq('id', document_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error('Failed to update document')
    }

    // Verify the update was successful by checking the returned data
    if (!updatedDoc) {
      throw new Error('Update completed but document not returned')
    }

    console.log('Document updated successfully:', {
      id: updatedDoc.id,
      template: updatedDoc.template_id,
      hasCvContent: !!updatedDoc.cv_content,
    })

    return new Response(
      JSON.stringify({
        success: true,
        document: updatedDoc,
        message: 'CV updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('CV update error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}

