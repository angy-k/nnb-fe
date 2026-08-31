'use client'

import { useEffect, useState } from 'react'

/**
 * Povratak na vrh stranice.
 *
 * Pojavljuje se tek kad se odmakne od vrha — na kratkim stranicama nema šta da
 * radi, a na dugačkim (kalendar, blog, uslovi izlaganja) štedi dosta skrolovanja.
 *
 * Poštuje `prefers-reduced-motion`: korisniku koji je isključio animacije skok
 * je trenutan, bez klizanja.
 */
const PRAG = 600

const BackToTop = () => {
  const [vidljivo, setVidljivo] = useState(false)

  useEffect(() => {
    const proveri = () => setVidljivo(window.scrollY > PRAG)

    proveri()
    window.addEventListener('scroll', proveri, { passive: true })

    return () => window.removeEventListener('scroll', proveri)
  }, [])

  const naVrh = () => {
    const bezAnimacije = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (bezAnimacije) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Glatko klizanje ume da bude nemo — isključuju ga neka podešavanja
    // browsera i okruženja pod automatizacijom. Tada dugme ne bi radilo ništa,
    // što je gore od trenutnog skoka. Ako se posle kratke pauze nije pomerilo,
    // skače se odmah.
    window.setTimeout(() => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }, 400)
  }

  if (!vidljivo) return null

  return (
    <button
      type="button"
      onClick={naVrh}
      aria-label="Nazad na vrh stranice"
      title="Nazad na vrh"
      className="nnb-back-to-top"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 19V5M12 5l-7 7M12 5l7 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default BackToTop
