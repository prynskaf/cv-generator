import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, validationErrorResponse, errorResponse } from '@/lib/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Input validation
    if (!name || !email || !subject || !message) {
      return validationErrorResponse('All fields are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return validationErrorResponse('Invalid email address')
    }

    // Validate field lengths
    if (name.length > 100) {
      return validationErrorResponse('Name must be less than 100 characters')
    }

    if (subject.length > 200) {
      return validationErrorResponse('Subject must be less than 200 characters')
    }

    if (message.length > 5000) {
      return validationErrorResponse('Message must be less than 5000 characters')
    }

    if (message.length < 10) {
      return validationErrorResponse('Message must be at least 10 characters')
    }

    // Get user if authenticated (optional - contact form can be used by non-authenticated users)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Store contact message in database
    // Note: You'll need to create a contact_messages table in Supabase
    // For now, we'll just return success (you can add email sending later)
    
    // If you want to store in database, uncomment this after creating the table:
    /*
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        user_id: user?.id || null,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error saving contact message:', error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }
    */

    // In production, you would also send an email here using a service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Supabase Edge Functions with email service

    return successResponse(
      null,
      'Thank you for your message! We will get back to you soon.'
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return errorResponse('An unexpected error occurred. Please try again later.')
  }
}

