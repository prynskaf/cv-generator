import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Experience } from '@/types/profile'

export function useExperiences() {
  const supabase = createClient()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const loadExperiences = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (data) {
      const normalized = data.map(exp => ({
        ...exp,
        location: exp.location || '',
        end_date: exp.end_date || null,
        description: exp.description || '',
      }))
      setExperiences(normalized)
    }
    setLoading(false)
  }

  const addExperience = () => {
    setExperiences([...experiences, {
      id: `temp-${Date.now()}-${Math.random()}`,
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: '',
    }])
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean | null) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ))
  }

  const saveExperience = async (index: number) => {
    const exp = experiences[index]
    if (!exp) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('experiences')
      .upsert({
        id: exp.id?.startsWith('temp-') ? undefined : exp.id,
        user_id: user.id,
        company: exp.company,
        position: exp.position,
        location: exp.location,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current,
        description: exp.description,
      })

    if (!error) {
      await loadExperiences()
    }
  }

  const deleteExperience = async (index: number) => {
    const exp = experiences[index]
    if (!exp || exp.id?.startsWith('temp-')) {
      setExperiences(prev => prev.filter((_, i) => i !== index))
      return
    }

    await supabase.from('experiences').delete().eq('id', exp.id)
    await loadExperiences()
  }

  useEffect(() => {
    loadExperiences()
  }, [])

  return {
    experiences,
    loading,
    addExperience,
    updateExperience,
    saveExperience,
    deleteExperience,
    reloadExperiences: loadExperiences,
  }
}

