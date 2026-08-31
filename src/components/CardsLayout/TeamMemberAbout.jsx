'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Opis člana tima, skraćen na tri reda.
 *
 * U dizajnu svaka kartica ima opis od tačno tri reda, pa se duži tekst ovde
 * odseca preko `-webkit-line-clamp`. Dugme „Pročitaj više" se ne prikazuje
 * uvek, nego samo kad tekst zaista ne staje — inače bi na kratkim opisima
 * stajalo dugme koje ne otvara ništa novo.
 *
 * Da li tekst preliva ne može da se zna unapred: zavisi od širine kartice i od
 * toga da li je font već učitan. Zato se meri posle iscrtavanja, pa ponovo kad
 * se učitaju fontovi i kad se kartica promeni po širini.
 */
const TeamMemberAbout = ({ text, onReadMore }) => {
  const ref = useRef(null)
  const [preliva, setPreliva] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const proveri = () => {
      // Jedan piksel tolerancije — zaokruživanje visine reda ume da napravi
      // razliku od pola piksela i na tekstu koji uredno staje.
      setPreliva(el.scrollHeight > el.clientHeight + 1)
    }

    proveri()

    // Tekstualni font stiže naknadno; dok se ne učita, tekst se meri u
    // zamenskom fontu i broj redova ume da bude drugačiji.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(proveri).catch(() => {})
    }

    // Širina kartice se menja jedino sa širinom prozora, pa je dovoljno pratiti
    // to. `ResizeObserver` bi bio precizniji, ali ume da zakaže bez ikakve
    // greške — a tada dugme prosto nikad ne osvane, što se teško primeti.
    window.addEventListener('resize', proveri)

    return () => window.removeEventListener('resize', proveri)
  }, [text])

  if (!text) return null

  return (
    <div className="team-member-about-wrap">
      <div ref={ref} className="team-member-about">{text}</div>
      {preliva && (
        <button type="button" className="team-member-more" onClick={onReadMore}>
          Pročitaj više
        </button>
      )}
    </div>
  )
}

export default TeamMemberAbout
