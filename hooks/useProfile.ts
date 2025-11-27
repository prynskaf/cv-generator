import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  profilePictureUrl: string | null
}

export function useProfile() {
  const router = useRouter()
  const supabase = createClient()
  
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    profilePictureUrl: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile({
        fullName: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        summary: profileData.summary || '',
        profilePictureUrl: profileData.profile_picture_url || null,
      })
    }

    setLoading(false)
  }

  const updateProfile = async (updates: Partial<ProfileData>) => {
    setSaving(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        full_name: updates.fullName ?? profile.fullName,
        email: updates.email ?? profile.email,
        phone: updates.phone ?? profile.phone,
        location: updates.location ?? profile.location,
        summary: updates.summary ?? profile.summary,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setProfile(prev => ({ ...prev, ...updates }))
      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    }

    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    const fieldMap: Record<string, keyof ProfileData> = {
      'fullName': 'fullName',
      'email': 'email',
      'phone': 'phone',
      'location': 'location',
      'summary': 'summary',
    }
    const mappedField = fieldMap[field]
    if (mappedField) {
      setProfile(prev => ({ ...prev, [mappedField]: value }))
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return {
    profile,
    loading,
    saving,
    message,
    updateProfile,
    updateField,
    reloadProfile: loadProfile,
  }
}

