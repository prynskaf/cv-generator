'use client'

interface CVUploadCardProps {
  uploadFile: File | null
  uploading: boolean
  onFileSelect: (file: File | null) => void
  onUpload: () => void
}

export default function CVUploadCard({
  uploadFile,
  uploading,
  onFileSelect,
  onUpload,
}: CVUploadCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Upload Your CV</h2>
          <p className="text-blue-100 text-xs sm:text-sm">AI will automatically extract and fill your profile</p>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="block">
              <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-white/40 rounded-xl hover:border-white/60 transition cursor-pointer bg-white/5">
                <div className="flex items-center gap-2 text-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {uploadFile ? uploadFile.name : 'Choose PDF or Word file'}
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            <p className="text-xs text-blue-100 mt-2 text-center sm:text-left">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
          
          <button
            onClick={onUpload}
            disabled={!uploadFile || uploading}
            className="w-full sm:w-auto px-6 py-3 mb-5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 disabled:bg-white/50 disabled:text-blue-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload & Extract
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

