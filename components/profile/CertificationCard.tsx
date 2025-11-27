'use client'

import { useState } from 'react'
import { Certification } from '@/types/profile'

interface CertificationCardProps {
  certification: Certification
  onSave: (cert: Certification) => void
  onDelete: (id: string) => void
}

export default function CertificationCard({ certification, onSave, onDelete }: CertificationCardProps) {
  const [isEditing, setIsEditing] = useState(!certification.id || !certification.name)
  const [formData, setFormData] = useState<Certification>({
    ...certification,
    issue_date: certification.issue_date || '',
    expiry_date: certification.expiry_date || '',
  })

  const handleSave = () => {
    if (!formData.name || !formData.issuing_organization) {
      alert('Please fill in certification name and issuing organization')
      return
    }
    onSave(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (!certification.id) {
      onDelete(certification.id || '')
    } else {
      setFormData(certification)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.issuing_organization}
              onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
              placeholder="e.g., Amazon Web Services"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issue_date || ''}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry_date || ''}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              type="text"
              value={formData.credential_id || ''}
              onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
              placeholder="e.g., ABC123XYZ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Credential URL
            </label>
            <input
              type="url"
              value={formData.credential_url || ''}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this certification..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{certification.name}</h3>
          <p className="text-amber-700 font-semibold">{certification.issuing_organization}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => certification.id && onDelete(certification.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {(certification.issue_date || certification.expiry_date) && (
          <div className="flex gap-4">
            {certification.issue_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Issued: {new Date(certification.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
            {certification.expiry_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Expires: {new Date(certification.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        )}
        {certification.credential_id && (
          <p className="text-xs text-gray-500">ID: {certification.credential_id}</p>
        )}
        {certification.credential_url && (
          <a
            href={certification.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline text-xs flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Credential
          </a>
        )}
        {certification.description && (
          <p className="text-gray-700 mt-2">{certification.description}</p>
        )}
      </div>
    </div>
  )
}

