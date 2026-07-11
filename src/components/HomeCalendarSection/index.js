'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { add, parse, startOfToday, endOfDay, isWithinInterval, isSameDay } from 'date-fns'
import { Divider } from '@nextui-org/divider'
import { useRouter } from 'next/navigation'

import { Calendar } from '@/components/Calendar'
import UpcommingEvents from '@/components/UpcommingEvents'
import Button from '@/components/Button'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import DayEventsModal from '@/components/Modal/DayEventsModal'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'

const HomeCalendarSection = () => {
  const router = useRouter()
  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [eventDetailsById, setEventDetailsById] = useState({})

  // modal state
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)

  // reservation state
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmCosts, setConfirmCosts] = useState({ cotization: 0, electricity: null, marketing: null })
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)
  const [sessionSeconds, setSessionSeconds] = useState(null)
  const [isGalleryWarningOpen, setIsGalleryWarningOpen] = useState(false)
  const sessionIntervalRef = useRef(null)
  const sessionActiveRef = useRef(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = eventService.getActiveEvents
          ? await eventService.getActiveEvents()
          : await eventService.getEvents()

        if (!response.ok) { setEvents([]); return }
        const data = await response.json()
        if (!data?.success) { setEvents([]); return }

        const items = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : []

        const today = startOfToday()
        const parseWithFallbacks = (value, formats) => {
          for (const fmt of formats) {
            const d = parse(value, fmt, new Date())
            if (!Number.isNaN(d?.getTime?.())) return d
          }
          return null
        }

        const detailsMap = {}
        const mapped = items
          .map((item) => {
            const rawStart = (item?.dateTime ?? '').toString().trim()
            if (!rawStart) return null
            const startDate = parseWithFallbacks(rawStart, [
              'd MMM yyyy HH:mm', 'd M yyyy HH:mm',
              'dd MMM yyyy HH:mm', 'dd M yyyy HH:mm',
            ])
            if (!startDate) return null
            const isActiveFromApi = typeof item?.isActive === 'boolean' ? item.isActive : null
            if (isActiveFromApi === false) return null
            const id = (item?.id ?? '').toString()
            if (!id) return null
            detailsMap[id] = item
            const title = (item?.title ?? item?.name ?? '').toString()
            return {
              id,
              title,
              start_date: startDate,
              end_date: add(startDate, { hours: 1 }),
              variant: /startup/i.test(title) ? 'startup' : 'regular',
              isPast: startDate < today,
            }
          })
          .filter(Boolean)

        setEvents(mapped)
        setEventDetailsById(detailsMap)
      } catch (e) {
        setEvents([])
        setEventDetailsById({})
      }
    }
    fetchEvents()
  }, [])

  const selectedEvent = selectedEventId ? eventDetailsById?.[selectedEventId] : null
  const isPackageUser = !!user?.active_package

  // ── canApply ──────────────────────────────────────────────────────────────────
  const parseDateOnly = (value) => {
    const v = (value ?? '').toString().trim()
    if (!v) return null
    const formats = ['d MMM yyyy', 'd M yyyy', 'dd MMM yyyy', 'dd M yyyy']
    for (const fmt of formats) {
      const d = parse(v, fmt, new Date())
      if (!Number.isNaN(d?.getTime?.())) return d
    }
    return null
  }

  const today = startOfToday()
  const applicationStartRaw = selectedEvent
    ? (isPackageUser ? selectedEvent?.preApplicationStartDate : selectedEvent?.applicationStartDate)
    : null
  const applicationStart = applicationStartRaw ? parseDateOnly(applicationStartRaw) : null
  const applicationEnd = selectedEvent?.applicationEndDate ? parseDateOnly(selectedEvent.applicationEndDate) : null
  const canApply = !!user && !!applicationStart && !!applicationEnd &&
    isWithinInterval(today, { start: applicationStart, end: endOfDay(applicationEnd) })

  // ── session timer ─────────────────────────────────────────────────────────────
  const stopSessionTimer = useCallback(() => {
    if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current)
    sessionIntervalRef.current = null
    sessionActiveRef.current = false
    setSessionSeconds(null)
  }, [])

  const startSessionTimer = useCallback(() => {
    if (sessionActiveRef.current) return
    sessionActiveRef.current = true
    setSessionSeconds(60)
    sessionIntervalRef.current = setInterval(() => {
      setSessionSeconds((s) => {
        if (s === null || s <= 1) {
          clearInterval(sessionIntervalRef.current)
          sessionIntervalRef.current = null
          sessionActiveRef.current = false
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    if (sessionSeconds === 0) closeAllModals()
  }, [sessionSeconds])

  // ── helpers ───────────────────────────────────────────────────────────────────
  const resetReservationState = () => {
    setElectricityOption('none')
    setMarketingOption('none')
    setConfirmCosts({ cotization: 0, electricity: null, marketing: null })
    setReservationError(null)
    setReservationSuccess(null)
    setIsSubmittingReservation(false)
  }

  const closeAllModals = () => {
    setIsConfirmModalOpen(false)
    setIsReserveModalOpen(false)
    setIsEventModalOpen(false)
    setSelectedEventId(null)
    stopSessionTimer()
    resetReservationState()
  }

  const goToReservationMap = async (event) => {
    const eventId = event?.id
    if (!eventId) return false
    try {
      const res = await eventService.getEventMapConfig(eventId)
      if (!res.ok) return false
      const data = await res.json()
      const hasMap = !!data?.data?.map_url && Array.isArray(data?.data?.hotspots) && data.data.hotspots.length > 0
      if (!hasMap) return false
      router.push(`/rezervacija-mesta/${eventId}`)
      return true
    } catch { return false }
  }

  const computeConfirmCosts = (event, electricityOpt, marketingOpt) => {
    const cotization = Number(event?.downPayment) || 0
    const electricityCostBase = Number(event?.electricityExtensionCoasts) || 0
    const electricity = electricityOpt && electricityOpt !== 'none' ? electricityCostBase : null
    const fb = Number(event?.fbMarketingCoasts) || 0
    const ig = Number(event?.ingMarketingCoasts) || 0
    let marketing = null
    if (marketingOpt === 'facebook') marketing = fb
    else if (marketingOpt === 'instagram') marketing = ig
    else if (marketingOpt === 'instagram_facebook') marketing = fb + ig
    return { cotization, electricity, marketing }
  }

  // ── event/day click ───────────────────────────────────────────────────────────
  const onEventClick = (eventId) => {
    if (!eventId) return
    setSelectedEventId(String(eventId))
    setIsEventModalOpen(true)
  }

  const onDayClick = (date) => {
    const dayEvs = events.filter((ev) => isSameDay(ev.start_date, date))
    if (dayEvs.length === 1) {
      onEventClick(dayEvs[0].id)
    } else {
      setSelectedDay(date)
      setIsDayModalOpen(true)
    }
  }

  const closeEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEventId(null)
  }

  // ── reservation flow ──────────────────────────────────────────────────────────
  const handleReserve = () => {
    ;(async () => {
      if (!user) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
        }
        closeEventModal()
        return
      }

      if (!canApply) return

      const navigated = await goToReservationMap(selectedEvent)
      if (navigated) {
        setIsEventModalOpen(false)
        return
      }

      setIsEventModalOpen(false)
      setIsReserveModalOpen(true)
      startSessionTimer()
    })()
  }

  const submitReservationOptions = () => {
    if (marketingOption !== 'none' && user) {
      const hasGallery =
        (Array.isArray(user?.gallery_images) && user.gallery_images.length > 0) ||
        (Array.isArray(user?.gallery_videos) && user.gallery_videos.length > 0)
      if (!hasGallery) {
        setIsGalleryWarningOpen(true)
        return
      }
    }
    setConfirmCosts(computeConfirmCosts(selectedEvent, electricityOption, marketingOption))
    setIsReserveModalOpen(false)
    setIsConfirmModalOpen(true)
  }

  const confirmReservation = async () => {
    if (!user) return
    const eventId = selectedEventId
    if (!eventId) { setReservationError('Nedostaje događaj.'); return }
    try {
      setReservationError(null)
      setReservationSuccess(null)
      setIsSubmittingReservation(true)
      const res = await applicationService.submitApplication({ eventId, electricityOption, marketingOption })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null
      if (res.ok && data?.success) { setReservationSuccess('Prijava je uspešno poslata.'); return }
      if (res.status === 409) { setReservationError(data?.message || 'Već ste poslali prijavu za ovaj događaj.'); return }
      setReservationError(data?.message || 'Greška prilikom slanja prijave.')
    } catch (e) {
      setReservationError('Greška prilikom slanja prijave.')
    } finally {
      setIsSubmittingReservation(false)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
        <div className="w-full pt-32" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <span className="our-team-title">Kalendar događaja</span>
          <Divider className="section-divider" />
        </div>

        <div className="hidden md:block lg:block" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>
        <div className="block md:hidden lg:hidden" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'day'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>

        {!user && (
          <div className="pt-12 flex flex-row justify-between items-center" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
            <span className="text-[darkBlue] underline text-[22px]">Pogledajte instrukcije za registraciju</span>
            <Button
              type={'outlined-orange'}
              name={'Postani izlagač'}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
                }
              }}
            />
          </div>
        )}

        <UpcommingEvents />
      </div>

      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        event={selectedEvent}
        showReserveButton={!!user && canApply}
        reserveLabel="Rezerviši mesto"
        onReserve={handleReserve}
      />

      <DayEventsModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        date={selectedDay}
        events={events}
        eventDetailsById={eventDetailsById}
        user={user}
        isPackageUser={isPackageUser}
        onEventClick={(eventId) => {
          setIsDayModalOpen(false)
          onEventClick(eventId)
        }}
        onReserve={async (eventId) => {
          setIsDayModalOpen(false)
          setSelectedEventId(String(eventId))
          const eventDetails = eventDetailsById[String(eventId)]
          const navigated = await goToReservationMap(eventDetails)
          if (!navigated) {
            setIsReserveModalOpen(true)
            startSessionTimer()
          }
        }}
      />

      <ReservationOptionsModal
        isOpen={isReserveModalOpen}
        onClose={() => { setIsReserveModalOpen(false); resetReservationState() }}
        electricityOption={electricityOption}
        setElectricityOption={setElectricityOption}
        marketingOption={marketingOption}
        setMarketingOption={setMarketingOption}
        onSubmit={submitReservationOptions}
        submitLabel="Prijavite se"
        showCancel={true}
        cancelLabel="Otkaži"
        timeRemaining={sessionSeconds}
        termsPdfUrl={selectedEvent?.termsPdfUrl || null}
      />

      <BoothReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => { setIsConfirmModalOpen(false); resetReservationState() }}
        title="Da li želite da pošaljete prijavu?"
        eventName={(selectedEvent?.title || selectedEvent?.name || '').toString()}
        onConfirm={confirmReservation}
        onCancel={() => { setIsConfirmModalOpen(false); resetReservationState() }}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError}
        onDismissMessage={() => { setReservationError(null); setReservationSuccess(null) }}
        timeRemaining={sessionSeconds}
      />

      <GalleryWarningModal
        isOpen={isGalleryWarningOpen}
        onClose={() => setIsGalleryWarningOpen(false)}
      />
    </div>
  )
}

export default HomeCalendarSection
