'use client'

import ProjectCard from '@/components/profile/ProjectCard'
import { useProjects } from '@/hooks/useProjects'

export default function ProjectsSection() {
  const {
    projects,
    loading,
    addProject,
    updateProject,
    saveProject,
    deleteProject,
  } = useProjects()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200"></div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Projects</h2>
              <p className="text-xs sm:text-sm text-gray-600">Your personal and professional projects</p>
            </div>
          </div>
          <button
            onClick={addProject}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-md"
          >
            <span className="hidden sm:inline">+ Add Project</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-gray-500">No projects added yet.</p>
            <p className="text-gray-400 text-sm">Click &quot;Add Project&quot; to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSave={saveProject}
                onDelete={deleteProject}
                onChange={updateProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

