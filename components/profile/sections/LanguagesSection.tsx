'use client'

import LanguageCard from '@/components/profile/LanguageCard'
import { useLanguages } from '@/hooks/useLanguages'

export default function LanguagesSection() {
  const {
    languages,
    loading,
    addLanguage,
    updateLanguage,
    saveLanguage,
    deleteLanguage,
  } = useLanguages()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200"></div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-8">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Languages</h2>
              <p className="text-xs sm:text-sm text-gray-600">Languages you speak</p>
            </div>
          </div>
          <button
            onClick={addLanguage}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition shadow-md"
          >
            <span className="hidden sm:inline">+ Add Language</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-200">
        {languages.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <p className="mt-4 text-gray-500">No languages added yet.</p>
            <p className="text-gray-400 text-sm">Click &quot;Add Language&quot; to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((language, index) => (
              <LanguageCard
                key={language.id}
                language={language}
                index={index}
                onSave={saveLanguage}
                onDelete={deleteLanguage}
                onChange={updateLanguage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

