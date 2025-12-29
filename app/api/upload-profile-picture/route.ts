import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { handleApiError } from '@/lib/utils/errors'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return validationErrorResponse('No file uploaded')
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationErrorResponse(
        'Invalid file type. Please upload a PNG, JPG, or WebP image.'
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return validationErrorResponse(
        'File size must be less than 5MB. Please compress your image and try again.'
      )
    }

    if (file.size === 0) {
      return validationErrorResponse('File is empty. Please upload a valid image.')
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}.${fileExt}`
    // Store in user's folder: {user_id}/filename.ext
    const filePath = `${user.id}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true, // Replace existing file if it exists
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update user profile with the new picture URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        profile_picture_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      throw updateError
    }

    return successResponse(
      { url: publicUrl },
      'Profile picture uploaded successfully!'
    )
  } catch (error) {
    console.error('Profile picture upload error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()

    // Get current profile picture URL
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('profile_picture_url')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    // Delete from storage if URL exists
    if (profile?.profile_picture_url) {
      // Extract file path from URL
      // URL format: https://...supabase.co/storage/v1/object/public/profile-pictures/{user_id}/{filename}
      const urlParts = profile.profile_picture_url.split('/profile-pictures/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0] // Remove query params if any
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([filePath])
        
        if (deleteError) {
          console.error('Error deleting file from storage:', deleteError)
          // Continue anyway - not critical if file deletion fails
        }
      }
    }

    // Remove URL from profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        profile_picture_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return successResponse(null, 'Profile picture removed successfully!')
  } catch (error) {
    console.error('Profile picture delete error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}

