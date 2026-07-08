'use client';
import { Avatar } from "@nextui-org/avatar";
import MyReservations from '@/components/CardsLayout/MyReservations';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'

// ── Sad face SVG ──────────────────────────────────────────────────────────────
const SadFaceIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="37" stroke="#56C4CF" strokeWidth="3" fill="none"/>
    <circle cx="28" cy="33" r="4" fill="#56C4CF"/>
    <circle cx="52" cy="33" r="4" fill="#56C4CF"/>
    <path d="M26 54c3.5-6 18.5-6 28 0" stroke="#56C4CF" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
)

// ── Input style helper ────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', height: '52px', borderRadius: '30px',
  background: '#f0f0f0', border: 'none', outline: 'none',
  padding: '0 20px', fontSize: '15px', color: '#333',
  fontFamily: 'inherit',
}

const MyReservationsComponent = () => {

  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState({ open: false, applicationId: null })
  const [cancelStep, setCancelStep] = useState('form') // 'form' | 'success'
  const [cancelForm, setCancelForm] = useState({ brandName: '', firstName: '', lastName: '', email: '', reason: '' })
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      const d = String(date.getDate()).padStart(2, '0')
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const y = date.getFullYear()
      return `${d}.${m}.${y}.`
    } catch {
      return dateStr
    }
  }

  const loadEvents = async (signal) => {
    try {
      setLoading(true)
      setError(null)

      const res = await applicationService.getMyApplications({ active: true })
      if (signal?.aborted) return
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (!res.ok || !data?.success) {
        if (!signal?.aborted) setError(data?.message || 'Greška prilikom učitavanja rezervacija.')
        if (!signal?.aborted) setEvents([])
        return
      }

      const items = Array.isArray(data.data) ? data.data : []
      const mapped = items
        .map((item) => {
          const ev = item?.event || {}
          const status = (item?.status ?? '').toString()

          const applicationStatus =
            ['declined', 'declined_no_payment', 'withdrawn', 'cancelled', 'expired', 'unpaid', 'no_show'].includes(status)
              ? 'rejected'
              : status === 'approved'
                ? 'approved'
                : 'waiting'

          return {
            id: item?.id,
            title: (ev?.title || ev?.name || '').toString(),
            date: formatDate(ev?.dateTime || ''),
            applicationDate: (item?.appliedAt || '').toString(),
            coverImage: ev?.coverImage || null,
            applicationStatus,
          }
        })
        .filter((x) => x?.title)

      if (!signal?.aborted) setEvents(mapped)
    } catch (e) {
      if (!signal?.aborted) setError('Greška prilikom učitavanja rezervacija.')
      if (!signal?.aborted) setEvents([])
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadEvents(controller.signal)
    return () => controller.abort()
  }, [])

  const handleCancelClick = (event) => {
    setCancelError(null)
    setCancelStep('form')
    setCancelForm({
      brandName: user?.brand_name || user?.company_name || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      reason: '',
    })
    setCancelModal({ open: true, applicationId: event.id })
  }

  const handleCancelSubmit = async () => {
    if (!cancelModal.applicationId) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await applicationService.cancelApplication(cancelModal.applicationId, {
        brand_name: cancelForm.brandName,
        first_name: cancelForm.firstName,
        last_name: cancelForm.lastName,
        email: cancelForm.email,
        reason: cancelForm.reason,
      })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null
      if (!res.ok || !data?.success) {
        setCancelError(data?.message || 'Greška prilikom otkazivanja rezervacije.')
        return
      }
      setCancelStep('success')
      await loadEvents()
    } catch (e) {
      setCancelError('Greška prilikom otkazivanja rezervacije.')
    } finally {
      setCancelling(false)
    }
  }

  const handleCancelDismiss = () => {
    if (cancelling) return
    setCancelModal({ open: false, applicationId: null })
    setCancelError(null)
    setCancelStep('form')
  }

  const avatarSrc = user?.profile_photo_url || null

  return (
    <>
      {/* Dark header */}
      <div className="w-full bg-[#261A54]" style={{ paddingTop: '260px', paddingBottom: '50px' }}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="relative z-10 flex-shrink-0" style={{ marginBottom: '-56px' }}>
              <Avatar
                isBordered
                src={avatarSrc || undefined}
                name={!avatarSrc ? (user?.name || 'U') : undefined}
                radius="full"
                className="w-[150px] h-[150px] text-2xl bg-[#3d2f7a] border-4 border-white"
              />
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <span className="text-3xl font-bold leading-tight" style={{ color: '#ffffff' }}>Moje rezervacije</span>
            </div>
          </div>
          <div className="flex items-end gap-3 pb-2">
            <Link href="/profil">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '44px', padding: '10px 24px', color: '#ffffff', display: 'inline-block', cursor: 'pointer' }}>
                Vrati se na profil
              </span>
            </Link>
            <Link href="/prethodne-rezervacije">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '44px', padding: '10px 24px', color: '#ffffff', display: 'inline-block', cursor: 'pointer' }}>
                Prethodne rezervacije
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sivi sadržaj */}
      <div className="w-full bg-[#f5f5f5]" style={{ paddingTop: '70px', paddingBottom: '96px' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <span className="font-normal text-[18px] text-[#261A54]">
            *Rezervaciju je moguće otkazati kontaktiranjem Noćnog Bazara.
          </span>
          {loading && (
            <div className="pt-6 text-[#261A54]">Učitavanje...</div>
          )}
          {!loading && error && (
            <div className="pt-6 text-[#EC4923]">{error}</div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="pt-6 text-[#261A54]">Nemate aktivnih rezervacija.</div>
          )}
          {!loading && !error && events.length > 0 && <MyReservations events={events} onCancelClick={handleCancelClick} />}
        </div>
      </div>

      {/* Cancel modal */}
      {cancelModal.open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(38,26,84,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={handleCancelDismiss}
        >
          <div
            style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '920px', position: 'relative', boxShadow: '0 8px 40px rgba(38,26,84,0.18)', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* X close button */}
            <button
              onClick={handleCancelDismiss}
              style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#555', lineHeight: 1, zIndex: 1 }}
              aria-label="Zatvori"
            >
              ✕
            </button>

            {cancelStep === 'form' ? (
              /* ── STEP 1: Form ─────────────────────────────────────────── */
              <div style={{ padding: '56px 64px 56px' }}>
                {/* Title */}
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: '40px' }}>
                  Otkazivanje rezervacije
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                  {/* Left — inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input
                      style={inputStyle}
                      placeholder="Naziv brenda"
                      value={cancelForm.brandName}
                      onChange={(e) => setCancelForm(f => ({ ...f, brandName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Ime"
                      value={cancelForm.firstName}
                      onChange={(e) => setCancelForm(f => ({ ...f, firstName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Prezime"
                      value={cancelForm.lastName}
                      onChange={(e) => setCancelForm(f => ({ ...f, lastName: e.target.value }))}
                    />
                    <input
                      style={inputStyle}
                      placeholder="Email"
                      type="email"
                      value={cancelForm.email}
                      onChange={(e) => setCancelForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>

                  {/* Right — textarea + button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <textarea
                      style={{
                        width: '100%', height: '218px', borderRadius: '20px',
                        background: '#f0f0f0', border: 'none', outline: 'none',
                        padding: '18px 20px', fontSize: '15px', color: '#333',
                        fontFamily: 'inherit', resize: 'none',
                      }}
                      placeholder="Navedite razlog otkazivanja rezervacije"
                      value={cancelForm.reason}
                      onChange={(e) => setCancelForm(f => ({ ...f, reason: e.target.value }))}
                    />

                    {cancelError && (
                      <p style={{ color: '#EC4923', fontSize: '14px', margin: 0 }}>{cancelError}</p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleCancelSubmit}
                        disabled={cancelling}
                        style={{
                          height: '52px', paddingInline: '40px', borderRadius: '30px',
                          background: '#EC4923', color: '#ffffff', fontWeight: '600',
                          fontSize: '16px', border: 'none',
                          cursor: cancelling ? 'not-allowed' : 'pointer',
                          opacity: cancelling ? 0.7 : 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cancelling ? 'Slanje...' : 'Otkažite rezervaciju'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── STEP 2: Success ──────────────────────────────────────── */
              <div style={{ padding: '80px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <SadFaceIcon />
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222', textAlign: 'center', lineHeight: '1.3', margin: 0 }}>
                  Žao nam je što<br />otkazujete rezervaciju.
                </h2>
                <p style={{ fontSize: '16px', color: '#56C4CF', textAlign: 'center', margin: 0 }}>
                  Uskoro ćete biti kontaktirani.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyReservationsComponent;

