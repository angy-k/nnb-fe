'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import useUser from '@/data/use-user'
import OwlShopping from '@/icons/owl-shopping-left.svg'
import ExhibitorIcon from '@/icons/exhibitor-icon.svg'
import OWLsCommunity from '@/icons/owls-community.svg'
import LeafTopLeft from '@/icons/leaf-top-left.svg'
import LeafBottomLeft from '@/icons/leaf-bottom-left.svg'
import LeafBottomRight from '@/icons/leaf-bottom-right.svg'
import { zapamtiUlogu, POSETILAC, IZLAGAC } from '@/utils/izborUloge'

const COOKIE_NAME = 'nnb_welcome'

const getCookie = (name) => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

// Session cookie — bez max-age/expires, ističe kad korisnik zatvori browser
const setSessionCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading } = useUser()

  useEffect(() => {
    // Ne prikazuj ulogovanim korisnicima
    if (loading) return
    if (user) return
    // Prikaži samo ako cookie nije postavljen (ili je istekao)
    if (!getCookie(COOKIE_NAME)) setIsOpen(true)
  }, [user, loading])

  /**
   * Zatvaranje ostavlja trag u istoriji.
   *
   * Bez ovoga je izbor posetilac/izlagač bio samo promena stanja u komponenti —
   * browser o njemu ništa ne zna. Prvi „nazad" je zato vodio na ono što je bilo
   * pre sajta, obično na Google pretragu. Nova stavka u istoriji čini da „nazad"
   * vrati na sam izbor.
   */
  const dismiss = () => {
    setSessionCookie(COOKIE_NAME, '1')
    setIsOpen(false)

    if (typeof window !== 'undefined') {
      window.history.pushState({ nnbWelcome: 'dismissed' }, '')
    }
  }

  useEffect(() => {
    const onPop = (e) => {
      // Vraćamo prozor samo kad se stiglo na stavku istorije koja je *pre*
      // zatvaranja. Stavka koju smo sami dodali nosi oznaku, pa se na njoj
      // ništa ne otvara — inače bi se prozor pojavljivao i pri običnom
      // kretanju unazad kroz sajt.
      if (e.state?.nnbWelcome === 'dismissed') return
      if (user) return
      if (!getCookie(COOKIE_NAME)) return

      setIsOpen(true)
    }

    window.addEventListener('popstate', onPop)

    return () => window.removeEventListener('popstate', onPop)
  }, [user])

  // Izbor se pamti da bi ostatak sajta znao kome se obraća i pre prijave —
  // videti `utils/izborUloge`.
  const handleVisitor = () => {
    zapamtiUlogu(POSETILAC)
    dismiss()
  }

  const handleExhibitor = () => {
    zapamtiUlogu(IZLAGAC)
    dismiss()
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('nnb:open-auth-modal', { detail: { tab: 'login' } }))
    }, 200)
  }

  const handleCollaborate = () => {
    dismiss()
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('nnb:open-auth-modal', { detail: { tab: 'login' } }))
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className="wm-overlay" role="dialog" aria-modal="true" aria-label="Dobrodošli">
      <div className="wm-card">
        {/* Leaf decorations */}
        <Image src={LeafTopLeft} alt="" aria-hidden="true" style={{ position: 'absolute', top: '6%', left: '7%', pointerEvents: 'none' }} />
        <Image src={LeafBottomLeft} alt="" aria-hidden="true" style={{ position: 'absolute', top: '64%', left: '1%', pointerEvents: 'none' }} />
        <Image src={LeafBottomRight} alt="" aria-hidden="true" style={{ position: 'absolute', top: '62%', right: '2%', pointerEvents: 'none' }} />

        {/* Close */}
        <button type="button" className="wm-close" onClick={dismiss} aria-label="Zatvori">×</button>

        {/* Logo */}
        <div className="wm-logo">
          {/* Kartica modala je svetla, pa ide varijanta sa ljubičastim „Novosadski".
              Sa belom varijantom taj deo loga se ne vidi. */}
          <Image src="/logo-purple.svg" width={240} height={74} alt="Novosadski noćni bazar" priority />
        </div>

        {/* Two choice cards */}
        <div className="wm-choices">
          <button type="button" className="wm-choice" onClick={handleVisitor}>
            <span className="wm-choice-title">Ja sam posetilac</span>
            <div className="wm-choice-owl">
              <Image src={OwlShopping} width={200} height={200} alt="Posetilac" />
            </div>
          </button>

          <button type="button" className="wm-choice" onClick={handleExhibitor}>
            <span className="wm-choice-title">Ja sam izlagač</span>
            <div className="wm-choice-owl">
              <Image src={ExhibitorIcon} width={200} height={200} alt="Izlagač" />
            </div>
          </button>
        </div>

        {/* Collaboration banner */}
        <button type="button" className="wm-collab" onClick={handleCollaborate}>
          <span className="wm-collab-text">Želite da sarađujete sa nama?</span>
          <Image src={OWLsCommunity} width={220} height={140} alt="" className="wm-collab-owls" />
        </button>

        {/* Bottom hint */}
        <p className="wm-hint">Izaberite da li ste posetilac ili izlagač.</p>
      </div>
    </div>
  )
}

export default WelcomeModal
