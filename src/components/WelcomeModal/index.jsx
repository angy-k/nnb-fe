'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const STORAGE_KEY = 'nnb:welcome-shown'

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setIsOpen(true)
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — show once per session
      setIsOpen(true)
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
    setIsOpen(false)
  }

  const handleVisitor = () => {
    dismiss()
  }

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
        {/* Close button */}
        <button
          type="button"
          className="wm-close"
          onClick={dismiss}
          aria-label="Zatvori"
        >
          ×
        </button>

        {/* Logo */}
        <div className="wm-logo">
          <Image src="/logo-dark.svg" width={180} height={56} alt="Novosadski noćni bazar" priority />
        </div>

        {/* Two choice cards */}
        <div className="wm-choices">
          <button type="button" className="wm-choice" onClick={handleVisitor}>
            <div className="wm-choice-owl">
              <Image src="/hero-owl.svg" width={80} height={80} alt="" />
            </div>
            <span className="wm-choice-title">Ja sam posetilac</span>
          </button>

          <button type="button" className="wm-choice" onClick={handleExhibitor}>
            <div className="wm-choice-owl">
              <Image src="/hero-owl.svg" width={80} height={80} alt="" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <span className="wm-choice-title">Ja sam izlagač</span>
          </button>
        </div>

        {/* Collaboration banner */}
        <button type="button" className="wm-collab" onClick={handleCollaborate}>
          <Image src="/owls.svg" width={100} height={60} alt="" className="wm-collab-owls" />
          <span className="wm-collab-text">Želite da sarađujete sa nama?</span>
        </button>

        {/* Bottom hint */}
        <p className="wm-hint">Izaberite da li ste posetilac ili izlagač.</p>
      </div>
    </div>
  )
}

export default WelcomeModal
