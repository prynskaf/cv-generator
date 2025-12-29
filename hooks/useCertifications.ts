import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Certification } from '@/types/profile'

export function useCertifications() {
  const supabase = createClient()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  const loadCertifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', user.id)
      .order('issue_date', { ascending: false })

    setCertifications(data || [])
    setLoading(false)
  }

  const addCertification = () => {
    setCertifications([...certifications, {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      issuing_organization: '',
      issue_date: null,
      expiry_date: null,
      credential_id: undefined,
      credential_url: undefined,
    }])
  }

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => prev.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    ))
  }

  const saveCertification = async (cert: Certification) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('certifications')
      .upsert({
        id: cert.id?.startsWith('temp-') ? undefined : cert.id,
        user_id: user.id,
        name: cert.name,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date || null,
        expiry_date: cert.expiry_date || null,
        credential_id: cert.credential_id || undefined,
        credential_url: cert.credential_url || undefined,
        description: cert.description || null,
      })

    if (!error) {
      await loadCertifications()
    }
  }

  const deleteCertification = async (id: string) => {
    if (id.startsWith('temp-')) {
      setCertifications(prev => prev.filter(cert => cert.id !== id))
      return
    }

    await supabase.from('certifications').delete().eq('id', id)
    await loadCertifications()
  }

  useEffect(() => {
    loadCertifications()
  }, [])

  return {
    certifications,
    loading,
    addCertification,
    updateCertification,
    saveCertification,
    deleteCertification,
    reloadCertifications: loadCertifications,
  }
}

