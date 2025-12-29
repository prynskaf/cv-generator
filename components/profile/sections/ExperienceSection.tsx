'use client'

import SectionWrapper from '@/components/profile/SectionWrapper'
import ExperienceCard from '@/components/profile/ExperienceCard'
import { useExperiences } from '@/hooks/useExperiences'

export default function ExperienceSection() {
  const {
    experiences,
    loading,
    addExperience,
    updateExperience,
    saveExperience,
    deleteExperience,
  } = useExperiences()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <SectionWrapper
      title="Experience"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
      addButtonLabel="Add Experience"
      onAdd={addExperience}
      isEmpty={experiences.length === 0}
      emptyStateIcon={
        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
      emptyStateTitle="No experience added yet."
      emptyStateDescription='Click "Add Experience" to get started!'
    >
      {experiences.map((exp, index) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          index={index}
          onSave={saveExperience}
          onDelete={deleteExperience}
          onChange={updateExperience}
        />
      ))}
    </SectionWrapper>
  )
}

