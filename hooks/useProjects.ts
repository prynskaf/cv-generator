import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types/profile'

export function useProjects() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)

    setProjects(data || [])
    setLoading(false)
  }

  const addProject = () => {
    setProjects([...projects, {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      description: '',
      technologies: [],
    }])
  }

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    setProjects(prev => prev.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    ))
  }

  const saveProject = async (index: number) => {
    const project = projects[index]
    if (!project) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id?.startsWith('temp-') ? undefined : project.id,
        user_id: user.id,
        name: project.name,
        description: project.description,
        technologies: project.technologies || [],
      })

    if (!error) {
      await loadProjects()
    }
  }

  const deleteProject = async (index: number) => {
    const project = projects[index]
    if (!project || project.id?.startsWith('temp-')) {
      setProjects(prev => prev.filter((_, i) => i !== index))
      return
    }

    await supabase.from('projects').delete().eq('id', project.id)
    await loadProjects()
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return {
    projects,
    loading,
    addProject,
    updateProject,
    saveProject,
    deleteProject,
    reloadProjects: loadProjects,
  }
}

