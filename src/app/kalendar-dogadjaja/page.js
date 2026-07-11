'use client'; 
import { Calendar } from "@/components/Calendar"
import PageHeroSection from '@/components/Hero/pageOwl';
import Button from '@/components/Button';
import UpcommingEvents from '@/components/UpcommingEvents';
import useUser from '@/data/use-user'
import { useEffect, useState, useRef, useCallback } from 'react'
import { add, parse, startOfToday, endOfDay, isWithinInterval, isSameDay } from 'date-fns'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import DayEventsModal from '@/components/Modal/DayEventsModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EventDark from '@/icons/event-dark.svg'
import EventLight from '@/icons/event-light.svg'
import ExhibitorIcon from '@/icons/exhibitor-icon.svg'

const CalendarPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [eventDetailsById, setEventDetailsById] = useState({})

  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

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
        if (!response.ok) {
          setEvents([])
          return
        }

        const data = await response.json()
        if (!data?.success) {
          setEvents([])
          return
        }

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
              'dd.MM.yyyy HH:mm',
              'd.MM.yyyy HH:mm',
              'd MMM yyyy HH:mm',
              'd M yyyy HH:mm',
              'dd MMM yyyy HH:mm',
              'dd M yyyy HH:mm',
            ])
            if (!startDate) return null

            const endDate = add(startDate, { hours: 1 })

            const rawApplicationEnd = (item?.applicationEndDate ?? '').toString().trim()
            const applicationEndDate = rawApplicationEnd
              ? parseWithFallbacks(rawApplicationEnd, [
                  'dd.MM.yyyy',
                  'd.MM.yyyy',
                  'd MMM yyyy',
                  'd M yyyy',
                  'dd MMM yyyy',
                  'dd M yyyy',
                ])
              : null

            const isActiveFromApi = typeof item?.isActive === 'boolean' ? item.isActive : null

            // Ako je admin eksplicitno deaktivirao događaj — ne prikazuj ga
            if (isActiveFromApi === false) return null

            const id = (item?.id ?? '').toString()
            if (!id) return null

            detailsMap[id] = item

            const title = (item?.title ?? item?.name ?? '').toString()
            const isPast = startDate < today

            return {
              id,
              title,
              start_date: startDate,
              end_date: endDate,
              variant: /startup/i.test(title) ? 'startup' : 'regular',
              isPast,
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

  const hideEventModal = () => {
    setIsEventModalOpen(false)
  }

  const closeEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEventId(null)
  }

  const onEventClick = (eventId) => {
    if (!eventId) return
    setSelectedEventId(String(eventId))
    setIsEventModalOpen(true)
  }

  const onDayClick = (date) => {
    const dayEvs = events.filter((ev) => isSameDay(ev.start_date, date))
    if (dayEvs.length === 1) {
      // Jedan događaj — otvori direktno event detail modal
      onEventClick(dayEvs[0].id)
    } else {
      // Više događaja — otvori day events modal
      setSelectedDay(date)
      setIsDayModalOpen(true)
    }
  }

  const closeReserveModal = () => {
    setIsReserveModalOpen(false)
  }

  const resetReservationState = () => {
    setElectricityOption('none')
    setMarketingOption('none')
    setConfirmCosts({ cotization: 0, electricity: null, marketing: null })
    setReservationError(null)
    setReservationSuccess(null)
    setIsSubmittingReservation(false)
  }

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
    if (sessionSeconds === 0) {
      closeAllModals()
    }
  }, [sessionSeconds])

  const closeAllModals = () => {
    setIsConfirmModalOpen(false)
    setIsReserveModalOpen(false)
    setIsEventModalOpen(false)
    setSelectedEventId(null)
    stopSessionTimer()
    resetReservationState()
  }

  const cancelReserveModal = () => {
    setIsReserveModalOpen(false)
    resetReservationState()
  }

  const openReserveModal = () => {
    setIsReserveModalOpen(true)
    startSessionTimer()
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
    } catch {
      return false
    }
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

  const submitReservationOptions = () => {
    if (!user) return

    // Ako je odabrana reklama, a korisnik nema fotografija — prikaži upozorenje
    if (marketingOption !== 'none') {
      const hasGallery =
        (Array.isArray(user?.gallery_images) && user.gallery_images.length > 0) ||
        (Array.isArray(user?.gallery_videos) && user.gallery_videos.length > 0)
      if (!hasGallery) {
        setIsGalleryWarningOpen(true)
        return
      }
    }

    setConfirmCosts(computeConfirmCosts(selectedEvent, electricityOption, marketingOption))
    closeReserveModal()
    setIsConfirmModalOpen(true)
  }

  const confirmReservation = async () => {
    if (!user) return

    const eventId = selectedEventId
    if (!eventId) {
      setReservationError('Nedostaje događaj.')
      return
    }

    try {
      setReservationError(null)
      setReservationSuccess(null)
      setIsSubmittingReservation(true)

      const res = await applicationService.submitApplication({
        eventId,
        electricityOption,
        marketingOption,
      })

      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        setReservationSuccess('Prijava je uspešno poslata.')
        return
      }

      if (res.status === 409) {
        setReservationError(data?.message || 'Već ste poslali prijavu za ovaj događaj.')
        return
      }

      setReservationError(data?.message || 'Greška prilikom slanja prijave.')
    } catch (e) {
      setReservationError('Greška prilikom slanja prijave.')
    } finally {
      setIsSubmittingReservation(false)
    }
  }

  const cancelReservation = () => {
    setIsConfirmModalOpen(false)
    resetReservationState()
  }

  const isPackageUser = !!user?.active_package
  const today = startOfToday()
  const parseDateOnly = (value) => {
    const v = (value ?? '').toString().trim()
    if (!v) return null

    const formats = ['dd.MM.yyyy', 'd.MM.yyyy', 'd MMM yyyy', 'd M yyyy', 'dd MMM yyyy', 'dd M yyyy']
    for (const fmt of formats) {
      const d = parse(v, fmt, new Date())
      if (!Number.isNaN(d?.getTime?.())) return d
    }
    return null
  }

  const applicationStartRaw = selectedEvent
    ? (isPackageUser ? selectedEvent?.preApplicationStartDate : selectedEvent?.applicationStartDate)
    : null
  const applicationStart = applicationStartRaw ? parseDateOnly(applicationStartRaw) : null
  const applicationEnd = selectedEvent?.applicationEndDate ? parseDateOnly(selectedEvent.applicationEndDate) : null

  const canApply =
    !!user &&
    !!applicationStart &&
    !!applicationEnd &&
    isWithinInterval(today, { start: applicationStart, end: endOfDay(applicationEnd) })

  const brandName = user?.name || ''
  const avatarSrc = user?.profile_photo_url || null

  return (
    <div className="mt-60 grid place-items-center w-full">
      {!user ? (
        <PageHeroSection title={`Kalendar`} />
      ) : (
        /* Logged-in hero — brand logo + "Kalendar događaja" */
        <div
          className="w-full bg-[#261A54]"
          style={{ minHeight: '200px', display: 'flex', alignItems: 'center', padding: '24px 60px' }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}
          >
            {/* Brand avatar */}
            <div style={{
              flexShrink: 0, width: '130px', height: '130px',
              borderRadius: '50%', overflow: 'hidden',
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={brandName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Image src={ExhibitorIcon} width={80} height={90} alt={brandName || 'Izlagač'} />
              )}
            </div>
            {/* Title */}
            <h1 style={{
              color: '#ffffff', fontFamily: 'Open Sans', fontWeight: '700',
              fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.2',
            }}>
              Kalendar događaja
            </h1>
          </div>
        </div>
      )}
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
        <div className="hidden md:block lg:block" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>
        <div className="block md:hidden lg:hidden" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'day'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>

        {/* Legenda — samo za ulogovane korisnike */}
        {user && (
          <div className="flex items-center gap-6 mt-6 mb-2 px-4" style={{width: '100%', maxWidth: '1400px'}}>
            <div className="flex items-center gap-2">
              <Image src={EventDark} width={100} height={41} alt="Novosadski noćni bazar" />
              <span style={{ fontSize: '14px', color: '#1B1B1B' }}>Novosadski noćni bazar</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src={EventLight} width={100} height={41} alt="Novosadski noćni bazar — startup" />
              <span style={{ fontSize: '14px', color: '#1B1B1B' }}>Novosadski noćni bazar - startup</span>
            </div>
          </div>
        )}
        {!user && (
          <div className="pt-12 flex flex-row justify-between items-center" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
            <span className="text-[darkBlue] underline text-[22px]">{`Pogledajte instrukcije za registraciju`}</span>
            <Button 
              type={'outlined-orange'}
              name={'Postani izlagač'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
              }}
            />
          </div>
        )}
        {/* "Očekivani događaji" — samo za goste */}
        {!user && <UpcommingEvents />}

        <EventDetailsModal
          isOpen={isEventModalOpen}
          onClose={closeEventModal}
          event={selectedEvent}
          showReserveButton={!!user && canApply}
          reserveLabel="Rezerviši mesto"
          onReserve={() => {
            ;(async () => {
              if (!user) {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
                }
                hideEventModal()
                return
              }

              const navigated = await goToReservationMap(selectedEvent)
              if (navigated) {
                hideEventModal()
                return
              }

              hideEventModal()
              openReserveModal()
            })()
          }}
        />

        <ReservationOptionsModal
          isOpen={isReserveModalOpen}
          onClose={cancelReserveModal}
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
          onClose={cancelReservation}
          title="Da li želite da pošaljete prijavu?"
          eventName={(selectedEvent?.title || selectedEvent?.name || '').toString()}
          onConfirm={confirmReservation}
          onCancel={cancelReservation}
          isLoading={isSubmittingReservation}
          successMessage={reservationSuccess}
          errorMessage={reservationError}
          onDismissMessage={() => {
            setReservationError(null)
            setReservationSuccess(null)
          }}
          timeRemaining={sessionSeconds}
        />
      </div>

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
          startSessionTimer()
          setSelectedEventId(String(eventId))
          const eventDetails = eventDetailsById[String(eventId)]
          const navigated = await goToReservationMap(eventDetails)
          if (!navigated) {
            openReserveModal()
          }
        }}
      />

      <GalleryWarningModal
        isOpen={isGalleryWarningOpen}
        onClose={() => setIsGalleryWarningOpen(false)}
      />
    </div>
  )
}

export default CalendarPage;
