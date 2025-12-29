'use client'

interface ProfilePictureUploadCardProps {
  profilePictureUrl: string | null
  uploadingPicture: boolean
  onUpload: (file: File) => void
  onDelete: () => void
}

export default function ProfilePictureUploadCard({
  profilePictureUrl,
  uploadingPicture,
  onUpload,
  onDelete,
}: ProfilePictureUploadCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Picture</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Upload a professional photo for your CV</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Profile Picture Preview */}
        <div className="relative">
          {profilePictureUrl ? (
            <div className="relative group">
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-gray-200 shadow-lg"
              />
              <button
                onClick={onDelete}
                disabled={uploadingPicture}
                className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                title="Remove picture"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 sm:border-4 border-gray-200">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 w-full">
          <label className="block">
            <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition cursor-pointer bg-gray-50 hover:bg-blue-50">
              <div className="flex items-center gap-2 text-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {uploadingPicture ? 'Uploading...' : profilePictureUrl ? 'Change Picture' : 'Choose Image'}
                </span>
              </div>
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onUpload(file)
                }
              }}
              disabled={uploadingPicture}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Supported formats: PNG, JPG, WebP (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  )
}

