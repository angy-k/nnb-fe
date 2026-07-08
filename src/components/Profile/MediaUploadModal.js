'use client'

import { useRef, useState } from 'react'

const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

/**
 * MediaUploadModal
 *
 * Props:
 *   isOpen        – boolean
 *   onClose       – () => void
 *   mode          – 'video' | 'image'  (default 'video')
 *   onFileUpload  – (File) => Promise<void>   (called for file drop/select)
 *   onVideoUrl    – (url: string) => Promise<void>  (called for YouTube link)
 *   uploading     – boolean
 *   addingVideo   – boolean
 */
const MediaUploadModal = ({
  isOpen,
  onClose,
  mode = 'video',
  onFileUpload,
  onVideoUrl,
  uploading = false,
  addingVideo = false,
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileUpload?.(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileUpload?.(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddUrl = async () => {
    setUrlError('')
    const trimmed = videoUrl.trim()
    if (!trimmed) return

    const youtubePattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+/
    if (!youtubePattern.test(trimmed)) {
      setUrlError('Unesite validan javni YouTube link.')
      return
    }
    await onVideoUrl?.(trimmed)
    setVideoUrl('')
  }

  const dropLabel = mode === 'video' ? 'Dodajte još video snimaka' : 'Dodajte fotografije'
  const accept = mode === 'video' ? 'video/*' : 'image/jpeg,image/png,image/gif,image/webp'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '700px',
          padding: '48px 40px 40px',
          position: 'relative',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#261A54',
            lineHeight: 1,
            opacity: 0.7,
          }}
          aria-label="Zatvori"
        >
          ✕
        </button>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `1.5px solid ${dragOver ? '#56C4CF' : '#d1d5db'}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '240px',
            cursor: uploading ? 'default' : 'pointer',
            color: dragOver ? '#56C4CF' : '#261A54',
            transition: 'border-color 0.2s, color 0.2s',
            background: dragOver ? '#f0fafa' : '#ffffff',
            marginBottom: mode === 'video' ? '32px' : '0',
          }}
        >
          {uploading ? (
            <span style={{ fontSize: '15px', color: '#606060' }}>Otpremanje...</span>
          ) : (
            <>
              <UploadIcon />
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#261A54' }}>{dropLabel}</span>
              <span style={{ fontSize: '14px', color: '#aaa' }}>Prevucite ovde</span>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* YouTube section – only for video mode */}
        {mode === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '400', color: '#261A54' }}>Linkovi sa Youtube</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="video-url-input"
                type="url"
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); setUrlError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl() }}
                placeholder="Ubaci link"
                style={{
                  flex: 1,
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  color: '#261A54',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={addingVideo || !videoUrl.trim()}
                style={{
                  background: '#56C4CF',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: addingVideo || !videoUrl.trim() ? 'not-allowed' : 'pointer',
                  opacity: addingVideo || !videoUrl.trim() ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
              >
                {addingVideo ? 'Dodavanje...' : '+ Dodaj'}
              </button>
            </div>
            {urlError && (
              <p style={{ fontSize: '13px', color: '#EC4923', paddingLeft: '8px' }}>{urlError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaUploadModal
