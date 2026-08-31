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
    <>
      {/* Glavna fotografija — cela kolona sadržaja.

          Mereno sa izvoza Figme (okvir 1920): fotografija je 1440 × 754, dakle
          preko cele kolone i u odnosu 1,91. Ovde je ranije stajalo
          `maxWidth: 900px`, pa je glavna slika bila uža od trake ispod nje.

          Strelice su u dizajnu izvan kolone, u marginama okvira (na x 174 i
          1745). Toliko mesta ima tek na širokom ekranu, pa su ovde apsolutno
          postavljene uz ivice: na 1920 padnu u marginu kao u dizajnu, a na užem
          ekranu blago pređu preko same fotografije. */}
      <div className="galerija-glavna">
        <div className="galerija-glavna-okvir">
          <img
            src={featured.url}
            alt={featured.alt_text || `Fotografija ${current + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div className="galerija-strelica galerija-strelica--levo">
          <ArrowBtn dir="prev" onClick={prev} disabled={current === 0} />
        </div>
        <div className="galerija-strelica galerija-strelica--desno">
          <ArrowBtn dir="next" onClick={next} disabled={current === photos.length - 1} />
        </div>
      </div>

      {/* Traka sa umanjenim prikazima — preko cele širine prozora, sa trenutnim
          po sredini i susednima koji se prelivaju preko obe ivice.

          U dizajnu je umanjeni prikaz 448 × 300 na okviru od 1920, dakle 23,3%
          širine i odnos 1,49, sa razmakom od 24px (1,25%). Ranije je svaki imao
          `flex: 1`, pa se pri jednoj fotografiji razvlačio preko cele širine i
          ispadao veći od glavne slike. */}
      <div className="galerija-traka">
        <div
          className="galerija-traka-red"
          style={{ transform: `translateX(calc(50vw - ${current} * (23.3vw + 1.25vw) - 11.65vw))` }}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setCurrent(i)}
              className={'galerija-umanjena' + (i === current ? ' galerija-umanjena--tekuca' : '')}
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
    </>
  )
}

export default PhotosGallery
