'use client'
import Image from 'next/image'
import PageHeroSection from "@/components/Hero/pageOwl";
import ContactForm from '@/components/ContactForm';
import { useEffect, useState } from 'react';
import partnerService from '@/services/partnerService';

// ── Partner card ────────────────────────────────────────────────────────────────
const PartnerCard = ({ partner, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onClick(partner)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(partner) }}
    style={{
      position: 'relative',
      background: '#ffffff',
      borderRadius: '20px',
      padding: '48px 40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s',
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}
    onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
  >
    {/* + button — top-right */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1.5px solid #c0c0c0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '18px',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      +
    </div>

    {/* Partner logo */}
    {partner.image ? (
      <img
        src={partner.image}
        alt={partner.name || 'Partner'}
        style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }}
      />
    ) : (
      <span style={{ color: '#261A54', fontWeight: '700', fontSize: '20px' }}>
        {partner.name || 'Partner'}
      </span>
    )}
  </div>
)

// ── Partner modal ───────────────────────────────────────────────────────────────
const PartnerModal = ({ partner, onClose }) => {
  if (!partner) return null

  const description = partner.aboutPartner || partner.description || partner.content || partner.about || ''

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(38, 26, 84, 0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #ffffff 60%, #dff4f5 100%)',
          borderRadius: '20px',
          padding: '48px 56px 56px',
          maxWidth: '760px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '24px',
            background: 'none', border: 'none',
            fontSize: '22px', lineHeight: 1,
            cursor: 'pointer', color: '#555',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
          aria-label="Zatvori"
        >
          ✕
        </button>

        {/* Logo */}
        {partner.image && (
          <img
            src={partner.image}
            alt={partner.name || ''}
            style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain', marginBottom: '12px', display: 'block' }}
          />
        )}

        {/* Name */}
        {partner.name && (
          <h2 style={{
            fontFamily: 'Open Sans', fontWeight: '700',
            fontSize: '28px', color: '#1B1B1B',
            marginBottom: '28px',
          }}>
            {partner.name}
          </h2>
        )}

        {/* Description — rendered as HTML */}
        {description && (
          <div
            className="single-blog-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────────
const Partners = ({ partners: propPartners }) => {
  const [partners, setPartners] = useState(propPartners || [])
  const [loading, setLoading] = useState(!propPartners)
  const [error, setError] = useState(null)
  const [selectedPartner, setSelectedPartner] = useState(null)

  useEffect(() => {
    if (!propPartners) fetchPartners()
  }, [propPartners])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await partnerService.getPartners()
      if (!response.ok) throw new Error('Failed to fetch partners')

      const data = await response.json()
      if (!data.success) throw new Error(data.message || 'Failed to fetch partners')

      setPartners(
        Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : []
      )
    } catch (err) {
      console.error('Error fetching partners:', err)
      setError(err.message)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  const handlePartnerClick = (partner) => {
    const websiteUrl = partner.url || partner.websiteUrl || partner.website_url || partner.website || partner.link
    const description = partner.aboutPartner || partner.description || partner.content || ''

    if (websiteUrl) {
      // Ima link → otvori u novom tabu
      window.open(websiteUrl, '_blank', 'noopener,noreferrer')
    } else if (description) {
      // Ima description → prikaži modal
      setSelectedPartner(partner)
    }
  }

  return (
    <>
      <PageHeroSection title={`Prijatelji`} />

      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {loading && (
          <div className="text-center text-[#261A54]">Učitavanje prijatelja...</div>
        )}
        {!loading && error && (
          <div className="text-[#EC4923] text-center mb-4">Greška prilikom učitavanja prijatelja.</div>
        )}
        {!loading && !error && partners.length === 0 && (
          <p className="text-[#261A54] our-team-title">Prijatelji uskoro stižu.</p>
        )}

        <div className="blog-container grid sm:grid-template-1 md:grid-template-2">
          {partners.map((partner, index) => (
            <PartnerCard
              key={`partner-card-${index}`}
              partner={partner}
              onClick={handlePartnerClick}
            />
          ))}
        </div>

        {/* Kontakt sekcija */}
        <ContactForm
          sectionTitle={`Želite da sarađujete sa nama?`}
          predefinedTitle={`Želim da sarađujem sa vama`}
          withImage={false}
        />
      </div>

      {/* Partner modal */}
      {selectedPartner && (
        <PartnerModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </>
  )
}

export default Partners
