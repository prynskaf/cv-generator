import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Links } from '@/types/profile'

export function useLinks() {
  const supabase = createClient()
  const [links, setLinks] = useState<Links>({ linkedin: '', github: '', portfolio: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadLinks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: linksData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (linksData) {
      setLinks({
        linkedin: linksData.linkedin || '',
        github: linksData.github || '',
        portfolio: linksData.portfolio || '',
      })
    }
    setLoading(false)
  }

  const updateLink = (field: keyof Links, value: string) => {
    setLinks(prev => ({ ...prev, [field]: value }))
  }

  const saveLinks = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('links')
      .upsert({
        user_id: user.id,
        linkedin: links.linkedin,
        github: links.github,
        portfolio: links.portfolio,
        updated_at: new Date().toISOString(),
      })

    if (!error) {
      await loadLinks()
    }
    setSaving(false)
  }

  useEffect(() => {
    loadLinks()
  }, [])

  return {
    links,
    loading,
    saving,
    updateLink,
    saveLinks,
    reloadLinks: loadLinks,
  }
}

