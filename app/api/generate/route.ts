import { NextRequest } from 'next/server'
import { analyzeJobDescription, generateTailoredCV, generateCoverLetter, UserProfile } from '@/lib/gemini'
import { ValidationError, handleApiError } from '@/lib/utils/errors'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { requireAuth } from '@/lib/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth()

    const body = await request.json()
    const { job_description, job_title, company_name, show_profile_picture, template_id } = body

    // Input validation
    if (!job_description || !job_title) {
      throw new ValidationError('Missing required fields', 'Please provide both job title and job description.')
    }

    // Validate job description length
    if (typeof job_description !== 'string' || job_description.trim().length < 50) {
      throw new ValidationError(
        'Job description too short',
        'Job description must be at least 50 characters long to generate an accurate CV.'
      )
    }

    if (job_description.length > 10000) {
      throw new ValidationError(
        'Job description too long',
        'Job description must be less than 10,000 characters.'
      )
    }

    // Validate job title
    if (typeof job_title !== 'string' || job_title.trim().length < 2) {
      throw new ValidationError(
        'Job title too short',
        'Job title must be at least 2 characters long.'
      )
    }

    if (job_title.length > 200) {
      throw new ValidationError(
        'Job title too long',
        'Job title must be less than 200 characters.'
      )
    }

    // Validate company name if provided
    if (company_name && (typeof company_name !== 'string' || company_name.length > 200)) {
      throw new ValidationError(
        'Company name too long',
        'Company name must be less than 200 characters.'
      )
    }

    // First, get profile (required check)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new ValidationError(
        'Profile not found',
        'Please complete your profile first by going to My Profile page.'
      )
    }

    // Run all other queries in parallel for better performance
    const [
      { data: experiences, error: experiencesError },
      { data: education, error: educationError },
      { data: skills, error: skillsError },
      { data: links, error: linksError },
      { data: languages, error: languagesError },
      { data: projects, error: projectsError },
      { data: certifications, error: certificationsError },
    ] = await Promise.all([
      supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false }),
      supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false }),
      supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id),
      supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false }),
    ])

    // Log errors but don't fail - use empty arrays as fallback
    if (experiencesError) console.error('Error fetching experiences:', experiencesError)
    if (educationError) console.error('Error fetching education:', educationError)
    if (skillsError) console.error('Error fetching skills:', skillsError)
    if (linksError && linksError.code !== 'PGRST116') console.error('Error fetching links:', linksError) // PGRST116 = no rows returned
    if (languagesError) console.error('Error fetching languages:', languagesError)
    if (projectsError) console.error('Error fetching projects:', projectsError)
    if (certificationsError) console.error('Error fetching certifications:', certificationsError)

    const userProfile: UserProfile = {
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone || '',
      location: profile.location || '',
      summary: profile.summary || '',
      experiences: experiences || [],
      education: education || [],
      skills: skills || [],
      links: links || { linkedin: '', github: '', portfolio: '' },
      languages: languages || [],
      projects: projects || [],
      certifications: certifications || [],
    }

    const analysis = await analyzeJobDescription(job_description, userProfile)
    
    const tailoredCV = await generateTailoredCV(job_description, userProfile, analysis)
    
    // Post-process: Filter skills to only include user's actual skills that match job description
    const userSkillNames = new Set((skills || []).map(s => s.skill_name.toLowerCase().trim()))
    const jobSkillsLower = analysis.required_skills.map(s => s.toLowerCase().trim())
    
    const filteredSkills = (tailoredCV.skills || []).filter(skill => {
      const skillNameLower = skill.skill_name?.toLowerCase().trim() || ''
      // Only include if:
      // 1. User actually has this skill, OR
      // 2. It's a close match to a user skill (fuzzy match)
      const hasExactMatch = userSkillNames.has(skillNameLower)
      const hasFuzzyMatch = Array.from(userSkillNames).some(userSkill => 
        skillNameLower.includes(userSkill) || userSkill.includes(skillNameLower)
      )
      const isJobRelevant = jobSkillsLower.some(jobSkill => 
        skillNameLower.includes(jobSkill) || jobSkill.includes(skillNameLower)
      )
      
      return (hasExactMatch || hasFuzzyMatch) && isJobRelevant
    })
    
    // Post-process: Limit experience bullet points to 1-3 and shorten sentences
    const processedExperiences = (tailoredCV.experiences || []).map(exp => {
      if (!exp.description) return exp
      
      const bullets = exp.description.split('\n').filter(b => b.trim().length > 0)
      // Limit to 3 bullets max
      const limitedBullets = bullets.slice(0, 3)
      // Shorten each bullet (max 20 words)
      const shortenedBullets = limitedBullets.map(bullet => {
        const words = bullet.trim().split(/\s+/)
        if (words.length > 20) {
          return words.slice(0, 20).join(' ') + (bullet.endsWith('.') ? '' : '.')
        }
        return bullet.trim() + (bullet.endsWith('.') ? '' : '.')
      })
      
      return {
        ...exp,
        description: shortenedBullets.join('\n')
      }
    })
    
    // Post-process: Shorten project descriptions to one line
    const processedProjects = (tailoredCV.projects || []).map(project => {
      if (!project.description) return project
      
      const words = project.description.trim().split(/\s+/)
      // Limit to 20 words max (one line)
      const shortened = words.length > 20 
        ? words.slice(0, 20).join(' ') + (project.description.endsWith('.') ? '' : '.')
        : project.description.trim() + (project.description.endsWith('.') ? '' : '.')
      
      return {
        ...project,
        description: shortened
      }
    })
    
    // Add profile picture URL, show flag, and certifications to CV data
    const cvWithPicture = {
      ...tailoredCV,
      skills: filteredSkills,
      experiences: processedExperiences,
      projects: processedProjects,
      profile_picture_url: profile.profile_picture_url || undefined,
      show_profile_picture: show_profile_picture !== undefined ? show_profile_picture : true,
      certifications: certifications?.map(cert => ({
        name: cert.name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date,
        credential_id: cert.credential_id,
        credential_url: cert.credential_url,
        description: cert.description,
      })) || [],
    }
    
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
        cv_content: cvWithPicture,
        cover_letter_content: coverLetter,
        template_id: template_id || 'modern',
        analysis: analysis,
        show_profile_picture: show_profile_picture !== undefined ? show_profile_picture : true,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return successResponse({
      document_id: document.id,
      analysis,
      cv_content: cvWithPicture,
      cover_letter: coverLetter,
    })
  } catch (error) {
    console.error('Generation error:', error)
    const { statusCode, userMessage } = handleApiError(error)
    return errorResponse(userMessage, statusCode)
  }
}
