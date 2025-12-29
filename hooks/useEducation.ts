import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Education } from '@/types/profile'

export function useEducation() {
  const supabase = createClient()
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  const loadEducation = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (data) {
      const normalized = data.map(edu => ({
        ...edu,
        field_of_study: edu.field_of_study || '',
        location: edu.location || '',
        end_date: edu.end_date || null,
        description: edu.description || '',
      }))
      setEducation(normalized)
    }
    setLoading(false)
  }

  const addEducation = () => {
    setEducation([...education, {
      id: `temp-${Date.now()}-${Math.random()}`,
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: '',
    }])
  }

  const updateEducation = (index: number, field: keyof Education, value: string | boolean | null) => {
    setEducation(prev => prev.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    ))
  }

  const saveEducation = async (index: number) => {
    const edu = education[index]
    if (!edu) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('education')
      .upsert({
        id: edu.id?.startsWith('temp-') ? undefined : edu.id,
        user_id: user.id,
        institution: edu.institution,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        location: edu.location,
        start_date: edu.start_date,
        end_date: edu.end_date,
        is_current: edu.is_current,
        description: edu.description,
      })

    if (!error) {
      await loadEducation()
    }
  }

  const deleteEducation = async (index: number) => {
    const edu = education[index]
    if (!edu || edu.id?.startsWith('temp-')) {
      setEducation(prev => prev.filter((_, i) => i !== index))
      return
    }

    await supabase.from('education').delete().eq('id', edu.id)
    await loadEducation()
  }

  useEffect(() => {
    loadEducation()
  }, [])

  return {
    education,
    loading,
    addEducation,
    updateEducation,
    saveEducation,
    deleteEducation,
    reloadEducation: loadEducation,
  }
}

