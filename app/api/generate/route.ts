import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeJobDescription, generateTailoredCV, generateCoverLetter, UserProfile } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { job_description, job_title, company_name } = body

    if (!job_description || !job_title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ 
        error: 'Profile not found. Please complete your profile first by going to My Profile page.' 
      }, { status: 400 })
    }

    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    const { data: skills } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)

    const userProfile: UserProfile = {
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone || '',
      location: profile.location || '',
      summary: profile.summary || '',
      experiences: experiences || [],
      education: education || [],
      skills: skills || [],
    }

    const analysis = await analyzeJobDescription(job_description, userProfile)
    
    const tailoredCV = await generateTailoredCV(job_description, userProfile, analysis)
    
    const coverLetter = await generateCoverLetter(
      job_description,
      userProfile,
      analysis,
      job_title,
      company_name || ''
    )

    const { data: document, error: insertError } = await supabase
      .from('generated_documents')
      .insert({
        user_id: user.id,
        job_title,
        company_name: company_name || null,
        job_description,
        cv_content: tailoredCV,
        cover_letter_content: coverLetter,
        template_id: 'modern',
        analysis: analysis,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document_id: document.id,
      analysis,
      cv_content: tailoredCV,
      cover_letter: coverLetter,
    })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
