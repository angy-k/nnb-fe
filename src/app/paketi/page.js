'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import packageService from '@/services/packageService'
import HeroOwlWithEyes from '@/components/Hero/HeroOwlWithEyes'

// ─── Color config — diktirano dizajnom, ne backendom ─────────────────────────
// neparan paket (index 0, 2, …) → teal, paran (index 1, 3, …) → orange
const PALETTE = [
  { bg: '#56C4CF', title: '#261A54', text: '#1B1B1B', iconBg: '#ffffff', iconColor: '#261A54' }, // teal
  { bg: '#F18020', title: '#261A54', text: '#1B1B1B', iconBg: '#ffffff', iconColor: '#261A54' }, // orange
]
const getColors = (index) => PALETTE[index % 2]

// ─── Feature item ────────────────────────────────────────────────────────────
const FeatureItem = ({ section, colors }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* Icon circle */}
    <div style={{
      width: '80px', height: '80px',
      borderRadius: '50%',
      background: colors.iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {section.icon_url ? (
        <img
          src={section.icon_url}
          alt={section.title || ''}
          style={{ width: '44px', height: '44px', objectFit: 'contain' }}
        />
      ) : (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={colors.iconColor} strokeWidth="1.5" />
          <path d="M8 12h8M12 8v8" stroke={colors.iconColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
    {/* Text */}
    <p style={{
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '15px',
      lineHeight: 1.65,
      color: colors.text,
      margin: 0,
    }}>
      <strong>{section.title}</strong>
      {section.description && ` ${section.description}`}
    </p>
  </div>
)

// ─── Animated owl column ─────────────────────────────────────────────────────
// HeroOwlWithEyes renders hero-owl.svg at 660×914px.
// We scale it down to fit the package section column (~300px wide).
const OWL_NATURAL_W = 660
const OWL_NATURAL_H = 914
const OWL_TARGET_W  = 300
const OWL_SCALE     = OWL_TARGET_W / OWL_NATURAL_W          // ≈ 0.4545
const OWL_TARGET_H  = Math.round(OWL_NATURAL_H * OWL_SCALE) // ≈ 415px

const OwlColumn = () => (
  <div style={{
    flexShrink: 0,
    alignSelf: 'flex-end',
    width:  `${OWL_TARGET_W}px`,
    height: `${OWL_TARGET_H}px`,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/*
      Absolute positioning + transform scale collapses the 660px element into the
      300px container. getBoundingClientRect() on the inner wrapperRef reflects the
      visual (transformed) size, so the eye-tracking maths remain correct.
    */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: `translateX(-50%) scale(${OWL_SCALE})`,
      transformOrigin: 'bottom center',
    }}>
      <HeroOwlWithEyes />
    </div>
  </div>
)

// ─── Package section ─────────────────────────────────────────────────────────
const PackageSection = ({ pkg, index }) => {
  const colors = getColors(index)
  const owlOnRight = index % 2 === 0   // even index → owl right
  const owlOnLeft  = index % 2 === 1   // odd  index → owl left

  const sections = Array.isArray(pkg.sections) ? pkg.sections : []

  return (
    <div style={{
      width: '100%',
      background: colors.bg,
      padding: '64px 40px 80px',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Package title */}
        <h2 className="blog-title" style={{ color: colors.title, marginBottom: '48px' }}>
          {pkg.name}
        </h2>

        {/* Content row: [owl?] [features grid] [owl?] */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '48px',
        }}>
          {owlOnLeft && <OwlColumn />}

          {/* Features — 3-column grid that wraps naturally */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px 40px',
            alignItems: 'start',
          }}>
            {sections.map((section, i) => (
              <FeatureItem key={i} section={section} colors={colors} />
            ))}
          </div>

          {owlOnRight && <OwlColumn />}
        </div>
      </div>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
const PaketiHero = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    minHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 80px',
    textAlign: 'center',
    overflow: 'hidden',
  }}>
    <Image
      src="/about-us-hero-image.png"
      fill
      style={{ objectFit: 'cover', objectPosition: 'center top' }}
      alt="Paketi pozadina"
      priority
    />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(38, 26, 84, 0.68)',
    }} />

    <div style={{
      position: 'relative', zIndex: 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    }}>
      <Image src="/logo-light.svg" width={220} height={70} alt="NNB logo" priority />

      <h1 className="page-hero-section-title" style={{ color: '#ffffff', marginTop: '4px' }}>
        Paketi
      </h1>

      <p style={{
        color: '#ffffff',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '16px',
        maxWidth: '620px',
        lineHeight: 1.75,
        opacity: 0.88,
        marginTop: '8px',
      }}>
        Izaberite paket koji odgovara Vašim potrebama i postanite deo Novosadskog noćnog bazara.
      </p>

      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginTop: '20px', opacity: 0.75 }}>
        <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
)

// ─── Page ────────────────────────────────────────────────────────────────────
const PaketiPage = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageService.getPackages()
        if (!res.ok) throw new Error()
        const json = await res.json()
        if (json.success) setPackages(Array.isArray(json.data) ? json.data : [])
      } catch (e) {
        console.error('Error fetching packages:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  return (
    <>
      <PaketiHero />

      {loading ? (
        <div style={{
          padding: '80px 24px', textAlign: 'center',
          color: '#261A54', fontFamily: 'Open Sans, sans-serif', fontSize: '16px',
        }}>
          Učitavanje paketa...
        </div>
      ) : packages.length === 0 ? (
        <div style={{
          padding: '80px 24px', textAlign: 'center',
          color: '#261A54', fontFamily: 'Open Sans, sans-serif', fontSize: '16px',
        }}>
          Paketi uskoro stižu.
        </div>
      ) : (
        packages.map((pkg, index) => (
          <PackageSection key={pkg.id} pkg={pkg} index={index} />
        ))
      )}
    </>
  )
}

export default PaketiPage
