'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import packageService from '@/services/packageService'

// ─── Color config ─────────────────────────────────────────────────────────────
const PALETTE = {
  teal:   { bg: '#56C4CF', title: '#261A54', text: '#1B1B1B', iconBg: '#ffffff', iconColor: '#261A54' },
  orange: { bg: '#F18020', title: '#261A54', text: '#1B1B1B', iconBg: '#ffffff', iconColor: '#261A54' },
  yellow: { bg: '#F4C430', title: '#261A54', text: '#1B1B1B', iconBg: '#ffffff', iconColor: '#261A54' },
  navy:   { bg: '#261A54', title: '#ffffff', text: '#ffffff', iconBg: '#ffffff', iconColor: '#261A54' },
}
const FALLBACK = ['teal', 'orange', 'yellow', 'navy']
const getColors = (pkg, index) =>
  PALETTE[pkg.color] ?? PALETTE[FALLBACK[index % FALLBACK.length]]

// ─── Util: icon URL iz relativne putanje ili apsolutnog URL-a ─────────────────
const resolveIconUrl = (iconUrl) => {
  if (!iconUrl) return null
  if (iconUrl.startsWith('http')) return iconUrl
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${iconUrl}`
}

// ─── Feature item ────────────────────────────────────────────────────────────
const FeatureItem = ({ section, colors }) => {
  const iconUrl = resolveIconUrl(section.icon_url)
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* Icon circle */}
    <div style={{
      width: '80px', height: '80px',
      borderRadius: '50%',
      background: colors.iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {iconUrl ? (
        <img
          src={iconUrl}
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
}

// ─── Owl column ───────────────────────────────────────────────────────────────
// SVG prirodna veličina: 681×897. Skaliramo na 280px širine.
const OwlColumn = () => (
  <div style={{
    flexShrink: 0,
    alignSelf: 'flex-end',
    width: '280px',
  }}>
    <img
      src="/owl-paketi.svg"
      alt=""
      width={280}
      height={Math.round(280 * 897 / 681)}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  </div>
)

// ─── Package section ─────────────────────────────────────────────────────────
const PackageSection = ({ pkg, index, hasNext }) => {
  const colors = getColors(pkg, index)
  // Sova se prikazuje samo ako postoji sledeći paket
  const showOwl    = hasNext
  const owlOnRight = showOwl && index % 2 === 0
  const owlOnLeft  = showOwl && index % 2 === 1

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
          <PackageSection
            key={pkg.id}
            pkg={pkg}
            index={index}
            hasNext={index < packages.length - 1}
          />
        ))
      )}
    </>
  )
}

export default PaketiPage
