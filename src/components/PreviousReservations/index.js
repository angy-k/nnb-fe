'use client';
import { Avatar } from "@nextui-org/avatar";
import MyPreviousReservations from '@/components/CardsLayout/MyPreviousReservations';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'
import { formatDate } from '@/utils/dateHelpers'

const MyPreviousReservationsComponent = () => {

  const { user } = useUser()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PER_PAGE = 5

  useEffect(() => {
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
  }, [page])

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
              <span className="text-3xl font-bold leading-tight" style={{ color: '#ffffff' }}>Prethodne rezervacije</span>
            </div>
          </div>
          <div className="flex items-end gap-3 pb-2">
            <Link href="/profil">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '44px', padding: '10px 24px', color: '#ffffff', display: 'inline-block', cursor: 'pointer' }}>
                Vrati se na profil
              </span>
            </Link>
            <Link href="/moje-rezervacije">
              <span style={{ border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '44px', padding: '10px 24px', color: '#ffffff', display: 'inline-block', cursor: 'pointer' }}>
                Aktuelne rezervacije
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sivi sadržaj */}
      <div className="w-full bg-[#f5f5f5]" style={{ paddingTop: '70px', paddingBottom: '96px' }}>
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
