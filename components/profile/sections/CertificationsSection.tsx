'use client'

import CertificationCard from '@/components/profile/CertificationCard'
import { useCertifications } from '@/hooks/useCertifications'

export default function CertificationsSection() {
  const {
    certifications,
    loading,
    addCertification,
    updateCertification,
    saveCertification,
    deleteCertification,
  } = useCertifications()

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
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
              <p className="text-sm text-gray-600">Professional certifications and credentials</p>
            </div>
          </div>
          <button
            onClick={addCertification}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition shadow-md"
          >
            + Add Certification
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {certifications.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="mt-4 text-gray-500">No certifications added yet.</p>
            <p className="text-gray-400 text-sm">Click "Add Certification" to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                onSave={saveCertification}
                onDelete={deleteCertification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

