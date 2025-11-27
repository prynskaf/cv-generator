'use client'

import SectionWrapper from '@/components/profile/SectionWrapper'
import EducationCard from '@/components/profile/EducationCard'
import { useEducation } from '@/hooks/useEducation'

export default function EducationSection() {
  const {
    education,
    loading,
    addEducation,
    updateEducation,
    saveEducation,
    deleteEducation,
  } = useEducation()

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
      title="Education"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      }
      addButtonLabel="Add Education"
      onAdd={addEducation}
      isEmpty={education.length === 0}
      emptyStateIcon={
        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      }
      emptyStateTitle="No education added yet."
      emptyStateDescription='Click "Add Education" to get started!'
    >
      {education.map((edu, index) => (
        <EducationCard
          key={edu.id}
          education={edu}
          index={index}
          onSave={saveEducation}
          onDelete={deleteEducation}
          onChange={updateEducation}
        />
      ))}
    </SectionWrapper>
  )
}

