'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useUser from '@/data/use-user'

const DISMISSED_KEY = 'nnb:profile-completion-dismissed'

// Profile is "incomplete" if any of the required fields are missing
const isProfileIncomplete = (user) => {
  if (!user) return false
  const missing =
    !user.first_name?.trim() ||
    !user.phone_number?.trim() ||
    !user.name?.trim()     // brand_name is stored as `name`
  return missing
}

// Pages where the modal should NOT appear
const EXCLUDED_PATHS = ['/profil']

const ProfileCompletionModal = () => {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading) return

    // Don't show on profile-related pages
    const onExcluded = EXCLUDED_PATHS.some(p => pathname === p || pathname?.startsWith(p + '/'))
    if (onExcluded) {
      setVisible(false)
      return
    }

    // Don't show if already dismissed in this browser session
    if (typeof window !== 'undefined' && sessionStorage.getItem(DISMISSED_KEY)) return

    if (user && isProfileIncomplete(user)) {
      setVisible(true)
    }
  }, [user, loading, pathname])

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    }
    setVisible(false)
  }

  const goToProfile = () => {
    dismiss()
    router.push('/profil/izmeni')
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(38,26,84,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={dismiss}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '480px',
          padding: '48px 40px 40px',
          position: 'relative',
          boxShadow: '0 12px 48px rgba(38,26,84,0.22)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute',
            top: '18px',
            right: '22px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '22px',
            color: '#aaa',
            lineHeight: 1,
          }}
          aria-label="Zatvori"
        >
          ×
        </button>

        {/* Icon */}
        <div style={{ marginBottom: '20px' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="28" fill="#EEF5FB"/>
            <circle cx="28" cy="22" r="8" stroke="#261A54" strokeWidth="2" fill="none"/>
            <path d="M12 44c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#261A54" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="40" cy="16" r="8" fill="#56C4CF"/>
            <path d="M37 16l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#261A54', marginBottom: '12px', lineHeight: 1.3 }}>
          Dopunite vaš profil
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
          Prijavili ste se putem Google naloga. Da biste mogli da se prijavite na događaje, molimo vas da dopunite osnovne podatke o profilu.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={goToProfile}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '30px',
              background: '#261A54',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Dopunite profil
          </button>
          <button
            onClick={dismiss}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '30px',
              background: 'transparent',
              color: '#261A54',
              fontWeight: '500',
              fontSize: '15px',
              border: '1.5px solid #e0e0e0',
              cursor: 'pointer',
            }}
          >
            Sačuvaj za kasnije
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompletionModal
