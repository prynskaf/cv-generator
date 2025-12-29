import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useProfileUpload() {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const handleCVUpload = async () => {
    if (!uploadFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(result.error || 'Upload failed')
      }

      const result = await response.json()
      setUploadFile(null)
      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    } finally {
      setUploading(false)
    }
  }

  const handleProfilePictureUpload = async (file: File) => {
    setUploadingPicture(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      return { 
        success: true, 
        url: result.data?.url || null 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    } finally {
      setUploadingPicture(false)
    }
  }

  const handleProfilePictureDelete = async () => {
    setUploadingPicture(true)
    try {
      const response = await fetch('/api/upload-profile-picture', {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed')
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      }
    } finally {
      setUploadingPicture(false)
    }
  }

  return {
    uploading,
    uploadingPicture,
    uploadFile,
    setUploadFile,
    handleCVUpload,
    handleProfilePictureUpload,
    handleProfilePictureDelete,
  }
}

