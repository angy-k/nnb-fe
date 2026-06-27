'use client';
import { Avatar } from "@nextui-org/avatar";
import MyReservations from '@/components/CardsLayout/MyReservations';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'

const MyReservationsComponent = () => {

  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancelModal, setCancelModal] = useState({ open: false, applicationId: null, eventTitle: '' })
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
    setCancelModal({ open: true, applicationId: event.id, eventTitle: event.title })
  }

  const handleCancelConfirm = async () => {
    if (!cancelModal.applicationId) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await applicationService.cancelApplication(cancelModal.applicationId)
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null
      if (!res.ok || !data?.success) {
        setCancelError(data?.message || 'Greška prilikom otkazivanja rezervacije.')
        return
      }
      setCancelModal({ open: false, applicationId: null, eventTitle: '' })
      await loadEvents()
    } catch (e) {
      setCancelError('Greška prilikom otkazivanja rezervacije.')
    } finally {
      setCancelling(false)
    }
  }

  const handleCancelDismiss = () => {
    if (cancelling) return
    setCancelModal({ open: false, applicationId: null, eventTitle: '' })
    setCancelError(null)
  }

  const avatarSrc = user?.profile_photo_url || null

  return (
    <>
      {/* Dark header */}
      <div className="w-full bg-[#261A54]" style={{ paddingTop: '260px', paddingBottom: '50px' }}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="relative z-10 flex-shrink-0" style={{ marginBottom: '-36px' }}>
              <Avatar
                isBordered
                src={avatarSrc || undefined}
                name={!avatarSrc ? (user?.name || 'U') : undefined}
                radius="full"
                className="w-[100px] h-[100px] text-xl bg-[#3d2f7a] border-2 border-violet-300/50"
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
      <div className="w-full bg-[#f0f0f0]" style={{ paddingTop: '70px', paddingBottom: '96px' }}>
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
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(38,26,84,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={handleCancelDismiss}
        >
          <div
            style={{ background: '#ffffff', borderRadius: '30px', padding: '48px 40px 40px', maxWidth: '520px', width: '90%', position: 'relative', boxShadow: '0 8px 40px rgba(38,26,84,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* X close button */}
            <button
              onClick={handleCancelDismiss}
              style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#261A54', lineHeight: 1 }}
              aria-label="Zatvori"
            >
              ✕
            </button>

            <p style={{ fontSize: '22px', fontWeight: '700', color: '#261A54', marginBottom: '32px', lineHeight: '1.35' }}>
              {`Da li želite da otkažete rezervaciju za "${cancelModal.eventTitle}"?`}
            </p>

            {cancelError && (
              <p style={{ color: '#EC4923', fontSize: '15px', marginBottom: '16px' }}>{cancelError}</p>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelling}
                style={{ flex: 1, height: '56px', borderRadius: '30px', background: '#56C4CF', color: '#ffffff', fontWeight: '700', fontSize: '18px', border: 'none', cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.7 : 1 }}
              >
                {cancelling ? 'Otkazujem...' : 'Da, otkažem'}
              </button>
              <button
                onClick={handleCancelDismiss}
                disabled={cancelling}
                style={{ flex: 1, height: '56px', borderRadius: '30px', background: '#EC4923', color: '#ffffff', fontWeight: '700', fontSize: '18px', border: 'none', cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.7 : 1 }}
              >
                Ne, odustani
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyReservationsComponent;

