'use client';
import { Avatar } from "@nextui-org/avatar";
import MyPreviousReservations from '@/components/CardsLayout/MyPreviousReservations';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'
import { formatDate } from '@/utils/dateHelpers'
import MERE_DUGMETA from '@/components/Reservations/headerActionStyle'

const MyPreviousReservationsComponent = () => {

  const { user, loading: userLoading, loggedOut } = useUser()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PER_PAGE = 5

  useEffect(() => {
    if (loggedOut) return
    let isActive = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await applicationService.getMyApplications({ past: true, active: false, page, perPage: PER_PAGE })
        const contentType = res.headers.get('content-type') || ''
        const data = contentType.includes('application/json') ? await res.json() : null

        if (!res.ok || !data?.success) {
          if (isActive) setError(data?.message || 'Greška prilikom učitavanja rezervacija.')
          if (isActive) setEvents([])
          return
        }

        const items = Array.isArray(data.data) ? data.data : []
        const mapped = items
          .map((item) => {
            const ev = item?.event || {}
            const status = (item?.status ?? '').toString()

            const applicationStatus =
              ['withdrawn', 'cancelled'].includes(status)
                ? 'cancelled'
                : ['declined', 'declined_no_payment', 'expired', 'unpaid', 'no_show'].includes(status)
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

        if (isActive) {
          setEvents(mapped)
          // Podrška za Laravel paginaciju (data.meta.last_page) ili custom total
          const lastPage = data?.meta?.last_page || data?.last_page || Math.ceil((data?.total || items.length) / PER_PAGE) || 1
          setTotalPages(Math.max(1, lastPage))
        }
      } catch (e) {
        if (isActive) setError('Greška prilikom učitavanja rezervacija.')
        if (isActive) setEvents([])
      } finally {
        if (isActive) setLoading(false)
      }
    }

    load()
    return () => { isActive = false }
  }, [page, loggedOut])

  if (userLoading) {
    return <div className="w-full min-h-screen bg-[#261A54]" />
  }

  if (loggedOut) {
    return (
      <>
        <div className="w-full bg-[#261A54] pt-60 pb-16" />
        <div className="grid place-items-center w-full pb-48 bg-[#f0f0f0]">
          <div className="mt-24 flex flex-col items-center gap-6">
            <p className="text-[#261A54]">Morate biti ulogovani da biste videli rezervacije.</p>
            <button
              type="button"
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#56C4CF' }}
              onClick={() => window.dispatchEvent(new Event('nnb:open-auth-modal'))}
            >
              Prijavite se
            </button>
          </div>
        </div>
      </>
    )
  }

  const avatarSrc = user?.profile_photo_url || null

  return (
    <>
      {/* Dark header */}
      <div className="w-full bg-[#261A54] profile-page-header" style={{ paddingTop: '260px', paddingBottom: '50px' }}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-end justify-between gap-6 profile-page-header-inner">
          <div className="flex items-end gap-6 profile-page-header-left">
            <div className="relative z-10 flex-shrink-0 profile-page-avatar-wrapper" style={{ marginBottom: '-56px' }}>
              <Avatar
                isBordered
                src={avatarSrc || undefined}
                name={!avatarSrc ? (user?.name || 'U') : undefined}
                radius="full"
                className="w-[150px] h-[150px] text-2xl bg-[#3d2f7a] border-4 border-white"
              />
            </div>
            <div className="flex flex-col gap-1 pb-2 profile-page-header-name">
              <span className="text-[39px] font-bold leading-tight" style={{ color: '#ffffff' }}>Prethodne rezervacije</span>
            </div>
          </div>
          {/* Mere su iste kao na „Mojim rezervacijama", odakle je ovo zaglavlje
              i prepisano: naslov 39, dugmad jednake širine 272 × 57, razmak 20.
              Ovde su bile zaostale stare vrednosti. */}
          <div className="flex items-end gap-5 pb-2 profile-page-header-actions">
            <Link href="/profil">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', ...MERE_DUGMETA }}>
                Vrati se na profil
              </span>
            </Link>
            <Link href="/moje-rezervacije">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', ...MERE_DUGMETA }}>
                Aktuelne rezervacije
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sivi sadržaj */}
      <div className="w-full bg-[#f5f5f5] profile-page-content" style={{ paddingTop: '70px', paddingBottom: '96px' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          {loading && (
            <div className="pt-6 text-[#261A54]">Učitavanje...</div>
          )}
          {!loading && error && (
            <div className="pt-6 text-[#EC4923]">{error}</div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="pt-6 text-[#261A54]">Nemate prethodnih rezervacija.</div>
          )}
          {!loading && !error && events.length > 0 && (
            <MyPreviousReservations
              events={events}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default MyPreviousReservationsComponent;
