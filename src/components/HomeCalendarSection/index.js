'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { parse, isWithinInterval, isSameDay } from 'date-fns'
import { Divider } from '@nextui-org/divider'
import { useRouter } from 'next/navigation'

import { Calendar } from '@/components/Calendar'
import UpcommingEvents from '@/components/UpcommingEvents'
import Button from '@/components/Button'
import { checkProfileReady } from '@/utils/profileValidation'
import { buildCalendarItems } from '@/utils/eventDays'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import DayEventsModal from '@/components/Modal/DayEventsModal'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import Image from 'next/image'
// Legenda ispod kalendara — iste sove kao bedževi u ćelijama
import OwlNnb from '@/icons/owl-nnb.svg'
import OwlStartup from '@/icons/owl-startup.svg'
import OwlDrugoMesto from '@/icons/owl-drugo-mesto.svg'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import useUser from '@/data/use-user'
import { electricityOptionsOf, electricityPriceFor } from '@/utils/electricity'
import RegistrationInstructionsModal from '@/components/Modal/RegistrationInstructionsModal'

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
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
  const sessionIntervalRef = useRef(null)
  const sessionActiveRef = useRef(false)

  const fetchEvents = useCallback(async () => {
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

      // Višednevni događaj daje po jednu kalendarsku stavku za svaki dan
      const { items: mapped, detailsById } = buildCalendarItems(items)

      setEvents(mapped)
      setEventDetailsById(detailsById)
    } catch (e) {
      setEvents([])
      setEventDetailsById({})
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchEvents()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [fetchEvents])

  const selectedEvent = selectedEventId ? eventDetailsById?.[selectedEventId] : null
  const isPackageUser = !!user?.active_package

  // ── canApply ──────────────────────────────────────────────────────────────────
  const parseAppDateTime = (value) => {
    const v = (value ?? '').toString().trim()
    if (!v) return null
    // Try date+time first (new format: d.m.Y H:i), then date-only fallback
    const dateTimeFormats = ['d.MM.yyyy HH:mm', 'dd.MM.yyyy HH:mm', 'd.M.yyyy H:mm', 'dd.M.yyyy H:mm']
    const dateOnlyFormats = ['dd.MM.yyyy', 'd.MM.yyyy', 'd MMM yyyy', 'd M yyyy']
    for (const fmt of [...dateTimeFormats, ...dateOnlyFormats]) {
      const d = parse(v, fmt, new Date())
      if (!Number.isNaN(d?.getTime?.())) return d
    }
    return null
  }

  // Pred-prijava je opciona — ako nije postavljena, paket korisnik koristi redovan datum
  const applicationStartRaw = selectedEvent
    ? (isPackageUser
        ? (selectedEvent?.preApplicationStartDate || selectedEvent?.applicationStartDate)
        : selectedEvent?.applicationStartDate)
    : null
  const applicationStart = applicationStartRaw ? parseAppDateTime(applicationStartRaw) : null
  const applicationEnd = selectedEvent?.applicationEndDate ? parseAppDateTime(selectedEvent.applicationEndDate) : null
  const canApply = !!user && !!applicationStart && !!applicationEnd &&
    isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd })

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
      // Izabrani dan se prosleđuje mapi da bi zauzetost i cena bile za taj dan
      const dayId = event?._day?.id
      router.push(`/rezervacija-mesta/${eventId}${dayId ? `?day=${dayId}` : ''}`)
      return true
    } catch { return false }
  }

  const computeConfirmCosts = (event, electricityOpt, marketingOpt) => {
    const cotization = Number(event?.downPayment) || 0

    // Cena zavisi od izabrane jačine priključka; „none" znači da struja nije tražena
    const electricity = electricityPriceFor(event, electricityOpt)

    const rawFb = event?.fbMarketingCoasts
    const rawIg = event?.ingMarketingCoasts
    const fb = rawFb != null && rawFb !== '' ? Number(rawFb) : null
    const ig = rawIg != null && rawIg !== '' ? Number(rawIg) : null
    // Cena paketa za obe mreže je zasebna i niža od zbira pojedinačnih;
    // sabiranje ostaje samo za događaje kojima ta cena nije uneta.
    const rawBoth = event?.fbIngMarketingCoasts
    const both = rawBoth != null && rawBoth !== '' ? Number(rawBoth) : null

    let marketing = null
    if (marketingOpt === 'facebook') marketing = fb
    else if (marketingOpt === 'instagram') marketing = ig
    else if (marketingOpt === 'instagram_facebook') marketing = both ?? ((fb ?? 0) + (ig ?? 0))
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

      const { ok: profileOk } = checkProfileReady(user)
      if (!profileOk) {
        window.dispatchEvent(new CustomEvent('nnb:open-profile-modal'))
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
    // selectedEventId je složeni ključ "eventId:dayId" — pravi id je u detaljima
    const eventId = selectedEvent?.id
    if (!eventId) { setReservationError('Nedostaje događaj.'); return }

    const withMarketing = marketingOption && marketingOption !== 'none'
    const { ok: profileOk, missing } = checkProfileReady(user, { withMarketing })
    if (!profileOk) {
      setReservationError(`Pre prijave dopunite profil — nedostaje: ${missing.join(', ')}. Idite na Profil → Izmeni profil.`)
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
        eventDayIds: selectedEvent?._day?.id ? [selectedEvent._day.id] : undefined,
      })
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
        <div className="w-full pt-24 sm:pt-8" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <span className="our-team-title">Kalendar događaja</span>
          <Divider className="section-divider" />
        </div>

        {/* Tabelarni prikaz ide ispred kalendara — najavljeni događaji su ono što
            posetilac najčešće traži, pa mu ne treba prvo ceo mesec da preskoči. */}
        <UpcommingEvents />

        {/* Jedna instanca — ranije su stajale dve identične, za desktop i mobilni,
            pa se kalendar renderovao dvaput iako je jedna uvek bila sakrivena. */}
        <div style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>

        {/* `sm:px-4` je bočni odmak na mobilnom — bez njega link i dugme
            dodiruju ivicu ekrana, a zaobljena strana dugmeta ispada van
            vidljivog dela. */}
        {!user && (
          <div className="pt-12 sm:pt-6 nnb-gutter flex flex-row sm:flex-col justify-between items-center sm:items-start gap-4" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
            {/* Naglašeno, po zahtevu sa kartice „Kalendar". Ranije je ovo bio
                  običan `span` koji se nije mogao kliknuti, a boja se nije ni
                  primenjivala: `text-[darkBlue]` u uglastim zagradama znači
                  doslovnu CSS vrednost, a `darkBlue` to nije — ispravno je
                  `text-darkBlue`, jer je definisan u Tailwind konfiguraciji. */}
            <button
              type="button"
              onClick={() => setIsInstructionsOpen(true)}
              className="text-darkBlue underline underline-offset-4 decoration-2 font-bold text-[22px] sm:text-[18px] hover:opacity-80 transition-opacity text-left"
            >
              Pogledajte instrukcije za registraciju
            </button>
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

        {/* Legenda */}
        <div className="flex items-center gap-6 mt-2 mb-2 px-4 sm:flex-col sm:items-start sm:gap-3" style={{ width: '100%', maxWidth: '1400px' }}>
          <div className="flex items-center gap-2">
            <Image src={OwlNnb} width={44} height={33} alt="Novosadski noćni bazar" />
            <span style={{ fontSize: '14px', color: '#1B1B1B' }}>Novosadski noćni bazar</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={OwlStartup} width={44} height={33} alt="Novosadski noćni bazar — startup" />
            <span style={{ fontSize: '14px', color: '#1B1B1B' }}>Novosadski noćni bazar - startup</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={OwlDrugoMesto} width={44} height={33} alt="Noćni bazar u drugom mestu" />
            <span style={{ fontSize: '14px', color: '#1B1B1B' }}>Noćni bazar u drugom mestu</span>
          </div>
        </div>
      </div>

      <RegistrationInstructionsModal
        isOpen={isInstructionsOpen}
        onOpenChange={setIsInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        event={selectedEvent}
                // Posetilac takođe vidi dugme, samo sa drugim tekstom — po zahtevu sa
        // kartice „Događaji". Ranije se dugme uopšte nije prikazivalo dok se
        // korisnik ne prijavi, pa posetilac nije imao odakle da krene.
        // Sama radnja je već znala da razlikuje slučajeve: posetiocu otvara
        // prozor za registraciju, izlagaču vodi na rezervaciju.
        showReserveButton={!user || canApply}
        reserveLabel={user ? 'Rezerviši mesto' : 'Postani izlagač i rezerviši mesto'}
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
          electricityOptions={electricityOptionsOf(selectedEvent)}
        setElectricityOption={setElectricityOption}
        marketingOption={marketingOption}
        setMarketingOption={setMarketingOption}
        onSubmit={submitReservationOptions}
        submitLabel="Prijavite se"
        showCancel={true}
        cancelLabel="Otkaži"
        timeRemaining={sessionSeconds}
        termsPdfUrl={selectedEvent?.termsPdfUrl || selectedEvent?.generatedTermsUrl || null}
      />

      <BoothReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => { setIsConfirmModalOpen(false); resetReservationState() }}
        title="Da li želite da pošaljete prijavu?"
        eventName={(selectedEvent?.title || selectedEvent?.name || '').toString()}
        costs={confirmCosts}
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
