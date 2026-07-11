'use client'
import { useState, useEffect, useCallback } from 'react'

const ArrowBtn = ({ dir, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? 'Prethodna fotografija' : 'Sledeća fotografija'}
    style={{
      background: 'none', border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.25 : 1,
      padding: '8px', display: 'flex', alignItems: 'center',
      transition: 'opacity 0.2s',
    }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
        stroke="#261A54" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  </button>
)

const PhotosGallery = ({ photos = [] }) => {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setCurrent(i => Math.min(photos.length - 1, i + 1)), [photos.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!photos.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontFamily: "'MADE GoodTime Script', sans-serif", fontSize: '64px', color: '#261A54', margin: '0 0 16px', lineHeight: 1.2 }}>
          Uskoro stiže!
        </p>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '18px', color: '#261A54', opacity: 0.65, margin: 0 }}>
          Ne brinite, fotografije uskoro stižu.
        </p>
      </div>
    )
  }

  const featured = photos[current]

  return (
    <div style={{ width: '100%', maxWidth: '1400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
        <ArrowBtn dir="prev" onClick={prev} disabled={current === 0} />
        <div style={{ flex: 1, maxWidth: '900px', borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/9', background: '#ddd', position: 'relative' }}>
          <img
            src={featured.url}
            alt={featured.alt_text || `Fotografija ${current + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <ArrowBtn dir="next" onClick={next} disabled={current === photos.length - 1} />
      </div>
      <div style={{ display: 'flex', gap: '4px', width: '100%', overflow: 'hidden' }}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setCurrent(i)}
            style={{
              flex: 1, aspectRatio: '16/9', border: 'none', padding: 0,
              cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
              outline: i === current ? '3px solid #261A54' : 'none',
              outlineOffset: '2px',
              opacity: i === current ? 1 : 0.75,
              transition: 'opacity 0.2s, outline 0.15s',
              position: 'relative',
            }}
            aria-label={`Fotografija ${i + 1}`}
          >
            <img
              src={photo.url}
              alt={photo.alt_text || `thumb-${i}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PhotosGallery
