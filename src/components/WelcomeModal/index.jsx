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

  const dismiss = () => {
    setSessionCookie(COOKIE_NAME, '1')
    setIsOpen(false)
  }

  const handleVisitor = () => dismiss()

  const handleExhibitor = () => {
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
          <Image src="/logo-light.svg" width={240} height={74} alt="Novosadski noćni bazar" priority />
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
