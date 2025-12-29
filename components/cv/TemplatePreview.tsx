'use client'

import { CVData } from '@/lib/pdf-templates/shared/types'
import LivePreview from './LivePreview'

interface TemplatePreviewProps {
  templateId: string
  data: CVData
  className?: string
}

// Reusable template preview - uses the same LivePreview component
// This ensures the preview matches exactly what the user will see in the actual CV
// The preview is scaled down to fit in the template card
export default function TemplatePreview({ templateId, data, className = '' }: TemplatePreviewProps) {
  return (
    <div 
      className={`template-preview-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="template-preview-scaler"
        style={{
          transform: 'scale(0.25)',
          transformOrigin: 'top left',
          width: '400%',
          height: '400%',
        }}
      >
        <LivePreview templateId={templateId} data={data} className="template-preview-wrapper" />
      </div>
    </div>
  )
}
