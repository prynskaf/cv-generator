import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Skill } from '@/types/profile'

export function useSkills() {
  const supabase = createClient()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  const loadSkills = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)

    if (data) {
      setSkills(data)
    }
    setLoading(false)
  }

  const addSkill = () => {
    setSkills([...skills, {
      id: `temp-${Date.now()}-${Math.random()}`,
      skill_name: '',
      skill_level: 'beginner',
    }])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    setSkills(prev => prev.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    ))
  }

  const saveSkill = async (index: number) => {
    const skill = skills[index]
    if (!skill) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('skills')
      .upsert({
        id: skill.id?.startsWith('temp-') ? undefined : skill.id,
        user_id: user.id,
        skill_name: skill.skill_name,
        skill_level: skill.skill_level,
        skill_category: skill.skill_category,
      })

    if (!error) {
      await loadSkills()
    }
  }

  const deleteSkill = async (index: number) => {
    const skill = skills[index]
    if (!skill || skill.id?.startsWith('temp-')) {
      setSkills(prev => prev.filter((_, i) => i !== index))
      return
    }

    await supabase.from('skills').delete().eq('id', skill.id)
    await loadSkills()
  }

  useEffect(() => {
    loadSkills()
  }, [])

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    saveSkill,
    deleteSkill,
    reloadSkills: loadSkills,
  }
}

