'use client'; 
import { Calendar } from "@/components/Calendar"
import PageHeroSection from '@/components/Hero/pageOwl';
import Button from '@/components/Button';
import UpcommingEvents from '@/components/UpcommingEvents';
import useUser from '@/data/use-user'
import { useEffect, useState, useRef, useCallback } from 'react'
import { parse, isWithinInterval, isSameDay } from 'date-fns'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import { checkProfileReady } from '@/utils/profileValidation'
import { buildCalendarItems } from '@/utils/eventDays'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import DayEventsModal from '@/components/Modal/DayEventsModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// Legenda ispod kalendara — iste sove kao bedževi u ćelijama
import OwlNnb from '@/icons/owl-nnb.svg'
import OwlStartup from '@/icons/owl-startup.svg'
import OwlDrugoMesto from '@/icons/owl-drugo-mesto.svg'
import ExhibitorIcon from '@/icons/exhibitor-icon.svg'
import { electricityOptionsOf, electricityPriceFor } from '@/utils/electricity'
import RegistrationInstructionsModal from '@/components/Modal/RegistrationInstructionsModal'
import { procitajUlogu, IZLAGAC } from '@/utils/izborUloge'

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
  // Dani za koje se šalje prijava. Polazi od dana kliknutog u kalendaru, a
  // izlagač u modalu može da izabere sve dane višednevnog događaja.
  const [selectedDayIds, setSelectedDayIds] = useState([])
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

  /**
   * Izlagačem se smatra i onaj ko je na uvodnom prozoru izabrao „Ja sam
   * izlagač", a još se nije prijavio. Do sada se granalo samo po `user`, pa je
   * takav posetilac video sadržaj namenjen posetiocima — instrukcije za
   * registraciju, sekciju očekivanih događaja i poziv da postane izlagač
   * (Excel, list KALENDAR, 8.0 i 9.0).
   *
   * Čita se posle montiranja, jer kolačić na serveru ne postoji i inače bi se
   * prvi render razlikovao od onog u pretraživaču.
   */
  const [jeIzlagac, setJeIzlagac] = useState(false)
  useEffect(() => {
    setJeIzlagac(!!user || procitajUlogu() === IZLAGAC)
  }, [user])
  const sessionIntervalRef = useRef(null)
  const sessionActiveRef = useRef(false)

  const fetchEvents = useCallback(async () => {
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
    // 60 sekundi nije bilo dovoljno da se pročitaju opcije i uslovi; usklađeno
    // sa mapom, gde sesija traje 120.
    setSessionSeconds(120)
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
    // Polazni izbor je dan sa kojeg je izlagač došao; ako ga nema, prvi dan.
    const dani = Array.isArray(selectedEvent?.days) ? selectedEvent.days : []
    const pocetni = selectedEvent?._day?.id || dani[0]?.id
    setSelectedDayIds(pocetni ? [pocetni] : [])
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

      // Izabrani dan se prosleđuje mapi da bi zauzetost i cena bile za taj dan
      const dayId = event?._day?.id
      router.push(`/rezervacija-mesta/${eventId}${dayId ? `?day=${dayId}` : ''}`)
      return true
    } catch {
      return false
    }
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

    // selectedEventId je složeni ključ "eventId:dayId" — pravi id događaja
    // uzimamo iz detalja, a izabrani dan šaljemo zasebno.
    const eventId = selectedEvent?.id
    if (!eventId) {
      setReservationError('Nedostaje događaj.')
      return
    }

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
        eventDayIds: selectedDayIds.length ? selectedDayIds : (selectedEvent?._day?.id ? [selectedEvent._day.id] : undefined),
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

  const parseAppDateTime = (value) => {
    const v = (value ?? '').toString().trim()
    if (!v) return null
    const dateTimeFormats = ['d.MM.yyyy HH:mm', 'dd.MM.yyyy HH:mm', 'd.M.yyyy H:mm', 'dd.M.yyyy H:mm']
    const dateOnlyFormats = ['dd.MM.yyyy', 'd.MM.yyyy', 'd MMM yyyy', 'd M yyyy', 'dd MMM yyyy', 'dd M yyyy']
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

  const canApply =
    !!user &&
    !!applicationStart &&
    !!applicationEnd &&
    isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd })

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
      <div className={`w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]${!user ? ' pt-24' : ''}`} style={{ position: 'relative', zIndex: 2 }}>
        {/* Tabelarni prikaz ide ispred kalendara. Prikazuje se samo posetiocu —
            izlagač ima svoj pregled prijava. */}
        {!jeIzlagac && <UpcommingEvents />}

        {/* Ranije su stajale dve identične instance kalendara, jedna za desktop
            a druga za mobilni, sa istim svojstvima — pa je jedna uvek bila
            sakrivena, a obe su se renderovale i dohvatale podatke. Kalendar je
            sam po sebi responzivan, pa je dovoljna jedna. */}
        <div style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>

        {/* Legenda — samo za ulogovane korisnike.

            U dizajnu je bela zaobljena kartica, usredišćena ispod kalendara:
            mereno 1005 × 98 na okviru od 1920, dakle 977 × 95 ovde, radijus 30.
            Sovice su 79 × 59 (77 × 57 ovde), a ne 44 × 33 kao dosad — u samim
            ćelijama kalendara su i do sada bile pune veličine, pa je legenda
            odudarala od onoga što objašnjava. */}
        {user && (
          <div className="flex justify-center w-full mt-10 mb-2 px-4" style={{ maxWidth: '1400px' }}>
            <div
              // Boja se zadaje izričito: klasa `bg-white` u ovom projektu nije
              // bela — u `tailwind.config.ts` je `white` predefinisana na
              // #F0F0F0, pa bi kartica bila iste boje kao pozadina i ne bi se
              // videla.
              className="flex items-center sm:flex-col sm:items-start sm:gap-4"
              style={{ background: '#ffffff', minHeight: '95px', borderRadius: '30px', padding: '0 37px', gap: '82px' }}
            >
              <div className="flex items-center" style={{ gap: '25px' }}>
                <Image src={OwlNnb} width={77} height={57} alt="Novosadski noćni bazar" />
                <span style={{ fontSize: '18px', color: '#1B1B1B', whiteSpace: 'nowrap' }}>Novosadski noćni bazar</span>
              </div>
              <div className="flex items-center" style={{ gap: '25px' }}>
                <Image src={OwlStartup} width={77} height={57} alt="Novosadski noćni bazar — startup" />
                <span style={{ fontSize: '18px', color: '#1B1B1B', whiteSpace: 'nowrap' }}>Novosadski noćni bazar - startup</span>
              </div>
              <div className="flex items-center" style={{ gap: '25px' }}>
                <Image src={OwlDrugoMesto} width={77} height={57} alt="Noćni bazar u drugom mestu" />
                <span style={{ fontSize: '18px', color: '#1B1B1B', whiteSpace: 'nowrap' }}>Noćni bazar u drugom mestu</span>
              </div>
            </div>
          </div>
        )}
        {!jeIzlagac && (
          <div className="pt-12 sm:pt-6 nnb-gutter flex flex-row sm:flex-col justify-between items-center sm:items-start gap-4" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
            {/* Naglašeno, po zahtevu sa kartice „Kalendar". Ranije je ovo bio
                  običan `span` koji se nije mogao kliknuti, a boja se nije ni
                  primenjivala: `text-[darkBlue]` u uglastim zagradama znači
                  doslovnu CSS vrednost, a `darkBlue` to nije — ispravno je
                  `text-darkBlue`, jer je definisan u Tailwind konfiguraciji. */}
            <button
              type="button"
              onClick={() => setIsInstructionsOpen(true)}
              className="text-darkBlue underline underline-offset-4 decoration-2 font-bold text-[22px] hover:opacity-80 transition-opacity text-left"
            >
              Pogledajte instrukcije za registraciju
            </button>
            <Button 
              type={'outlined-orange'}
              name={'Postani izlagač'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
              }}
            />
          </div>
        )}
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
          // Tri slučaja, ne dva: prijavljeni izlagač rezerviše odmah; onaj ko
          // je izabrao „Ja sam izlagač" a nije se prijavio treba da se prijavi,
          // ne da postaje izlagač; posetiocu ostaje poziv da to postane.
          reserveLabel={
            user
              ? 'Rezerviši mesto'
              : jeIzlagac
                ? 'Prijavite se'
                : 'Postani izlagač i rezerviši mesto'
          }
          onReserve={() => {
            ;(async () => {
              if (!user) {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
                }
                hideEventModal()
                return
              }

              const { ok: profileOk } = checkProfileReady(user)
              if (!profileOk) {
                window.dispatchEvent(new CustomEvent('nnb:open-profile-modal'))
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
          eventDays={Array.isArray(selectedEvent?.days) ? selectedEvent.days : []}
          selectedDayIds={selectedDayIds}
          setSelectedDayIds={setSelectedDayIds}
        />

        <BoothReservationConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={cancelReservation}
          title="Da li želite da pošaljete prijavu?"
          eventName={(selectedEvent?.title || selectedEvent?.name || '').toString()}
          onConfirm={confirmReservation}
          onCancel={cancelReservation}
          costs={confirmCosts}
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
          if (!user) {
            window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
            setIsDayModalOpen(false)
            return
          }

          const { ok: profileOk } = checkProfileReady(user)
          if (!profileOk) {
            window.dispatchEvent(new CustomEvent('nnb:open-profile-modal'))
            setIsDayModalOpen(false)
            return
          }

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
