import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Language } from '@/types/profile'

export function useLanguages() {
  const supabase = createClient()
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)

  const loadLanguages = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('languages')
      .select('*')
      .eq('user_id', user.id)

    setLanguages(data || [])
    setLoading(false)
  }

  const addLanguage = () => {
    setLanguages([...languages, {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      proficiency: 'beginner',
    }])
  }

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    setLanguages(prev => prev.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    ))
  }

  const saveLanguage = async (index: number) => {
    const lang = languages[index]
    if (!lang) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('languages')
      .upsert({
        id: lang.id?.startsWith('temp-') ? undefined : lang.id,
        user_id: user.id,
        name: lang.name,
        proficiency: lang.proficiency,
      })

    if (!error) {
      await loadLanguages()
    }
  }

  const deleteLanguage = async (index: number) => {
    const lang = languages[index]
    if (!lang || lang.id?.startsWith('temp-')) {
      setLanguages(prev => prev.filter((_, i) => i !== index))
      return
    }

    await supabase.from('languages').delete().eq('id', lang.id)
    await loadLanguages()
  }

  useEffect(() => {
    loadLanguages()
  }, [])

  return {
    languages,
    loading,
    addLanguage,
    updateLanguage,
    saveLanguage,
    deleteLanguage,
    reloadLanguages: loadLanguages,
  }
}

