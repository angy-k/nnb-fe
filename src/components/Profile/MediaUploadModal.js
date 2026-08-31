'use client'

import { useRef, useState } from 'react'

const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

// Mere sa izvoza dizajna (modal je izvezen ceo, sa zaobljenim uglovima, na
// 2880 × 1520 — dakle 1440 × 760 na okviru od 1920). Sve je ovde srazmerno
// umanjeno na kolonu sajta od 1400, činilac 0,972.
const MERE = {
  sirinaModala: 1400,      // 1440
  visinaModala: 739,       // 760
  radijusModala: 24,       // 25
  kolona: 683,             // 703 — usredišćena, sa dosta praznine sa strane
  visinaZone: 302,         // 311
  radijusZone: 22,         // 23
  visinaPolja: 70,         // 72
  uvlakaPolja: 48,         // 49
  zonaDoLabele: 56,        // 57,5
  labelaDoPolja: 30,       // 30,5
  prevuciteOdDna: 36,      // 37
  vrhZone: 132,            // 136
}

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
  const urlInputRef = useRef(null)

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

  const jeVideo = mode === 'video'
  const dropLabel = jeVideo ? 'Dodajte još video snimaka' : 'Dodajte fotografije'
  const accept = 'image/jpeg,image/png,image/gif,image/webp'

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
          borderRadius: `${MERE.radijusModala}px`,
          width: '100%',
          maxWidth: `${MERE.sirinaModala}px`,
          // Izmerenih 760 sa dizajna odnosi se na video varijantu, koja ispod
          // zone ima još labelu i polje za link. Foto varijanta ima samo zonu,
          // pa joj visinu određuje sadržaj — inače bi ostalo preko 300px
          // praznine ispod.
          minHeight: jeVideo ? `${MERE.visinaModala}px` : undefined,
          paddingTop: `${MERE.vrhZone}px`,
          paddingBottom: '60px',
          // Razmak sa strane stoji na modalu, ne na koloni — inače bi kolonu
          // suzio ispod izmerenih 683.
          paddingLeft: '24px',
          paddingRight: '24px',
          position: 'relative',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close — u dizajnu tanak iks od 36px, a ne znak ✕ iz fonta */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '44px',
            right: '50px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#261A54',
            lineHeight: 0,
            opacity: 0.75,
            padding: 0,
          }}
          aria-label="Zatvori"
        >
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        {/* Kolona sadržaja — u dizajnu uska i usredišćena unutar širokog modala */}
        <div style={{ width: '100%', maxWidth: `${MERE.kolona}px`, margin: '0 auto' }}>

        {/* Uokvireno polje.

            Za fotografije je pravo mesto za prevlačenje i biranje fajla.

            Za video nije — backend (`GalleryController::storeVideo`) prima
            isključivo YouTube link, video fajl se nigde ne čuva. Ranije je ovo
            polje i u video režimu primalo `video/*` i slalo ga na
            `/gallery/images`, gde validacija propušta samo slike; odgovor 422
            se nigde nije hvatao, pa je prevučeni snimak nestajao bez ijedne
            poruke. Sada polje zadržava izgled iz dizajna, ali vodi na polje za
            link ispod, gde se video zaista i dodaje. */}
        <div
          {...(jeVideo ? {} : {
            onDragOver: (e) => { e.preventDefault(); setDragOver(true) },
            onDragLeave: () => setDragOver(false),
            onDrop: handleDrop,
          })}
          onClick={() => {
            if (jeVideo) urlInputRef.current?.focus()
            else fileInputRef.current?.click()
          }}
          style={{
            border: `1px solid ${dragOver ? '#56C4CF' : '#261A54'}`,
            borderRadius: `${MERE.radijusZone}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: `${MERE.visinaZone}px`,
            position: 'relative',
            cursor: uploading ? 'default' : 'pointer',
            color: dragOver ? '#56C4CF' : '#261A54',
            transition: 'border-color 0.2s, color 0.2s',
            background: dragOver ? '#f0fafa' : '#ffffff',
            marginBottom: jeVideo ? `${MERE.zonaDoLabele}px` : '0',
          }}
        >
          {uploading ? (
            <span style={{ fontSize: '15px', color: '#606060' }}>Otpremanje...</span>
          ) : (
            <>
              <UploadIcon />
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#261A54' }}>{dropLabel}</span>
              <span style={{
                fontSize: '14px', color: '#aaa',
                position: 'absolute', bottom: `${MERE.prevuciteOdDna}px`,
              }}>
                {jeVideo ? 'Nalepite YouTube link ispod' : 'Prevucite ovde'}
              </span>
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
        {jeVideo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${MERE.labelaDoPolja}px` }}>
            <span style={{ fontSize: '16px', fontWeight: '400', color: '#606060' }}>Linkovi sa Youtube</span>
            {/* U dizajnu pored polja nema dugmeta — link se potvrđuje sa Enter.
                Zato polje mora samo da kaže šta se dešava: dok se dodaje piše
                „Dodavanje...", a greška stoji odmah ispod. */}
            <input
              ref={urlInputRef}
              id="video-url-input"
              type="url"
              value={videoUrl}
              disabled={addingVideo}
              onChange={(e) => { setVideoUrl(e.target.value); setUrlError('') }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl() } }}
              placeholder={addingVideo ? 'Dodavanje...' : 'Ubaci link'}
              style={{
                width: '100%',
                height: `${MERE.visinaPolja}px`,
                background: '#f0f0f0',
                border: 'none',
                borderRadius: `${MERE.visinaPolja / 2}px`,
                padding: `0 ${MERE.uvlakaPolja}px`,
                fontSize: '16px',
                color: '#261A54',
                outline: 'none',
              }}
            />
            {urlError && (
              <p style={{ fontSize: '13px', color: '#EC4923', paddingLeft: `${MERE.uvlakaPolja}px`, marginTop: '-18px' }}>{urlError}</p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default MediaUploadModal
