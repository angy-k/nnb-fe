'use client'
import CardComponent from "@/components/CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import { checkProfileReady } from '@/utils/profileValidation'
import { useRouter } from 'next/navigation'
import PageHeroSection from '@/components/Hero/pageOwl';
import { useState, useEffect, useRef, useCallback } from 'react';
import { parse, isWithinInterval, startOfDay } from 'date-fns';
import eventService from '@/services/eventService';
import useUser from '@/data/use-user'
import applicationService from '@/services/applicationService'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import GalleryWarningModal from '@/components/Modal/GalleryWarningModal'
import { electricityOptionsOf } from '@/utils/electricity'
import { brojDanaPrijave, lokalniTroskovi, predracunSaServera } from '@/utils/troskovi'

const Events = ({
  title,
  numberForDisplay,
  events: propEvents,
  pagination = false, 
  sectionType = 'event',
  showHero = true
}) => {
  const router = useRouter()
  const { user, loggedOut } = useUser()
  const [events, setEvents] = useState(propEvents || [])
  const [loading, setLoading] = useState(!propEvents)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)

  /* Izabrani dani kod višednevnog događaja.
   *
   * Sa kalendara je ovo već stizalo u modal, a odavde nije — pa je izlagač koji
   * krene sa spiska događaja dobijao modal bez izbora dana, i prijava je odlazila
   * bez `eventDayIds`. */
  const [selectedDayIds, setSelectedDayIds] = useState([])
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  /* Saglasnost sa opštim uslovima živi ovde, a ne u modalima.
   *
   * Modal opcija i modal potvrde su dva odvojena prozora; dok je svaki držao
   * svoju kvačicu, ona data u opcijama nije stizala do potvrde — a potvrda bez
   * `setTermsAccepted` nije mogla ni da je primi (dugme je ostajalo zaključano
   * zauvek). Isto rešenje već stoji na stranici mape. */
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [confirmCosts, setConfirmCosts] = useState({ cotization: 0, electricity: null, marketing: null })
  // Šta na ovoj prijavi pokriva gratis nastup iz paketa — stiže uz predračun
  const [coveredByPackage, setCoveredByPackage] = useState([])
  /* Razlozi zbog kojih upis ne bi prošao — stižu uz predračun. Bez njih je
     sažetak umeo da pokaže „0 RSD" za događaj kojem cena nije određena, pa je
     izlagač slao prijavu misleći da je besplatna. */
  const [quoteBlockers, setQuoteBlockers] = useState([])
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)
  const [isGalleryWarningOpen, setIsGalleryWarningOpen] = useState(false)
  const [sessionSeconds, setSessionSeconds] = useState(null)
  const sessionIntervalRef = useRef(null)
  const sessionActiveRef = useRef(false)

  useEffect(() => {
    // Only fetch from API if no events were passed as props
    if (!propEvents) {
      fetchEvents()
    }
  }, [propEvents])

  useEffect(() => {
    if (propEvents) return // events managed by parent
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchEvents()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [propEvents])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await eventService.getEvents()
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const items = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.data?.data)
              ? data.data.data
              : []
          setEvents(items)
        } else {
          throw new Error(data.message || 'Failed to fetch events')
        }
      } else {
        throw new Error('Failed to fetch events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  function goToSingleEvent(event) {
    console.log('preview single event: ', event.name)
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  function hideModal() {
    setIsModalOpen(false)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const parseAppDateTime = (value) => {
    const v = (value ?? '').toString().trim()
    if (!v) return null
    const dateTimeFormats = ['d.MM.yyyy HH:mm', 'dd.MM.yyyy HH:mm', 'd.M.yyyy H:mm', 'dd.M.yyyy H:mm']
    const dateOnlyFormats = ['dd.MM.yyyy', 'd.MM.yyyy', 'd MMM yyyy', 'd M yyyy']
    for (const fmt of [...dateTimeFormats, ...dateOnlyFormats]) {
      const d = parse(v, fmt, new Date())
      if (!Number.isNaN(d?.getTime?.())) return d
    }
    return null
  }

  const canApply = (event) => {
    if (!user) return false
    const isPackageUser = !!user?.active_package
    // Pred-prijava je opciona — ako nije postavljena, paket korisnik koristi redovan datum
    const rawStart = isPackageUser
      ? (event?.preApplicationStartDate || event?.applicationStartDate)
      : event?.applicationStartDate
    const applicationStart = parseAppDateTime(rawStart)
    const applicationEnd = parseAppDateTime(event?.applicationEndDate)
    if (!applicationStart || !applicationEnd) return false
    return isWithinInterval(new Date(), { start: applicationStart, end: applicationEnd })
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

  const resetReservationState = () => {
    setElectricityOption('none')
    setMarketingOption('none')
    setConfirmCosts({ cotization: 0, electricity: null, marketing: null })
    setCoveredByPackage([])
    setQuoteBlockers([])
    setReservationError(null)
    setReservationSuccess(null)
    setIsSubmittingReservation(false)
    setTermsAccepted(false)
    setSelectedDayIds([])
  }

  const closeAllModals = () => {
    setIsConfirmModalOpen(false)
    setIsReserveModalOpen(false)
    setIsModalOpen(false)
    setSelectedEvent(null)
    stopSessionTimer()
    resetReservationState()
  }

  function closeReserveModal() {
    setIsReserveModalOpen(false)
  }

  function cancelReserveModal() {
    setIsReserveModalOpen(false)
    resetReservationState()
  }

  function openReserveModal() {
    // Polazno je prvi dan; izlagač dalje sam bira kvačicom „više dana".
    const dani = Array.isArray(selectedEvent?.days) ? selectedEvent.days : []
    setSelectedDayIds(dani[0]?.id ? [dani[0].id] : [])
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

  async function submitReservationOptions() {
    // Ako je odabrana reklama, a korisnik nema fotografija u galeriji — prikaži upozorenje
    if (marketingOption !== 'none' && user) {
      const hasGallery =
        (Array.isArray(user?.gallery_images) && user.gallery_images.length > 0) ||
        (Array.isArray(user?.gallery_videos) && user.gallery_videos.length > 0)
      if (!hasGallery) {
        setIsGalleryWarningOpen(true)
        return
      }
    }

    /*
     * Sažetak je ranije računat samo ovde, sa `downPayment` bez množenja danima
     * i bez zona — pa je znao da pokaže 0 RSD za prijavu koja se naplaćuje.
     * Merodavan iznos traži se sa servera, isto kao na mapi tezgi; domaća
     * procena ostaje samo ako predračun ne stigne.
     */
    const dana = brojDanaPrijave(selectedEvent, selectedDayIds)
    setConfirmCosts(lokalniTroskovi(selectedEvent, electricityOption, marketingOption, dana))
    setCoveredByPackage([])
    setQuoteBlockers([])
    closeReserveModal()
    setIsConfirmModalOpen(true)

    const predracun = await predracunSaServera({
      eventId: selectedEvent?.id,
      electricityOption,
      marketingOption,
      eventDayIds: selectedDayIds,
    })
    if (predracun) {
      setConfirmCosts(predracun.costs)
      setCoveredByPackage(predracun.covered)
      setQuoteBlockers(predracun.blockers)
    }
  }

  const confirmReservation = async () => {

    /* Druga brava: dugme je već zaključano bez kvačice, ali prijava ne sme da
       ode ni ako se do slanja dođe nekim putem koji dugme zaobilazi. */
    if (!termsAccepted) {
      setReservationError('Morate prihvatiti opšte uslove izlaganja pre slanja prijave.')
      return
    }

    const eventId = selectedEvent?.id

    if (loggedOut || !user) {
      const query = new URLSearchParams({
        ...(eventId ? { event_id: String(eventId) } : {}),
        electricity: electricityOption,
        marketing: marketingOption,
      }).toString()

      setIsConfirmModalOpen(false)
      router.push(`/prijava?${query}`)
      return
    }

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
        // Bez ovoga je prijava sa spiska događaja odlazila bez izabranih dana.
        eventDayIds: selectedDayIds.length ? selectedDayIds : undefined,
      })

      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        setReservationSuccess('Prijava je uspešno poslata!')
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

  function previewAllEvents() {
    console.log('preview all events')
  }

  // Poslednji dan događaja. Višednevni bazar je aktuelan sve dok mu i poslednji
  // dan nije prošao, pa se gleda kraj, ne početak. `dateTime` je rezerva za
  // događaje kojima dani nisu uneti.
  const eventLastDate = (event) => {
    const days = Array.isArray(event?.days) ? event.days : []
    const raw = days.length ? days[days.length - 1]?.date : event?.dateTime
    return parseAppDateTime(raw)
  }

  // Poređenje ide po danu, a ne po satu — bazar koji traje večeras ostaje među
  // aktuelnim do kraja dana. Događaj bez upotrebljivog datuma se ne sklanja
  // među prošle; radije ostaje vidljiv nego da nestane zbog prazne kolone.
  const today = startOfDay(new Date())
  const isPastEvent = (event) => {
    const d = eventLastDate(event)
    return d ? startOfDay(d) < today : false
  }

  const byDate = (a, b) => (eventLastDate(a)?.getTime() ?? 0) - (eventLastDate(b)?.getTime() ?? 0)

  // Aktuelni idu od najbližeg ka daljem, prošli obrnuto — od skoro održanog
  // unazad, jer je to ono što posetioca zanima prvo.
  const upcomingEvents = events.filter((e) => !isPastEvent(e)).sort(byDate)
  const pastEventsAll = events.filter(isPastEvent).sort((a, b) => byDate(b, a))

  // Ograničenje broja se primenjuje samo na prošle; aktuelni se prikazuju svi.
  const pastEvents = numberForDisplay ? pastEventsAll.slice(0, numberForDisplay) : pastEventsAll

  const limitedEvents = [...upcomingEvents, ...pastEvents]

  /* Prošli događaji se više ne prigušuju: crno-bela slika sa providnošću ostaje
     samo na „Prethodnim rezervacijama". Ovde su sve kartice iste, kao u
     dizajnu — redosled po datumu ih već razdvaja. */
  const renderCards = (list, keyPrefix) => (
    <div className="blog-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {list.map((event, index) => (
        <div className="event-card" key={`${keyPrefix}-${event.id ?? index}`}>
          <CardComponent
            key={`${keyPrefix}-card-${event.id ?? index}`}
            {...(event.coverImage && { imageSrc: event.coverImage })}
            imageWidth={438}
            imageHeight={438}
            imageSquare
            imageRadius={"30px"}
            imageAltText={`Događaj - ${event.name || event.title}`}
            sectionType={'event'}
            title={event.name || event.title}
            buttonAction={() => goToSingleEvent(event)}
            buttonText="Detaljnije"
          />
        </div>
      ))}
    </div>
  )


  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection
          title={`Događaji`}
        />}
        <div className="w-full events-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center text-[#261A54]">Učitavanje događaja...</div>
        </div>
      </>
    )
  }
  
  return (
    <>
      {showHero && <PageHeroSection 
        title={`Događaji`}
      />}
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
        {!showHero && (
          <>
            <Divider className="section-divider" style={{marginBottom: '35px'}}/>
            <div className="flex justify-start">
              <span className="event-title text-start">Pogledaj još događaja</span>
            </div>
          </>
        )}
        {error && (
          <div className="text-[#EC4923] text-center mb-4">Greška prilikom učitavanja događaja.</div>
        )}
        {!loading && !error && limitedEvents.length === 0 && (
          <p className="text-[#261A54] our-team-title">Događaji uskoro stižu.</p>
        )}
        {title && <span className="event-title">{title}</span>}
        {title && <Button
            key={`section-component-title-button-${sectionType}`}
            type={'outlined-dark'}
            name={'Pogledaj sve događaje'}
            onClick={() => previewAllEvents()}
        />}
        {title && <Divider className="section-divider"/>}
        {/* Dizajn nema podnaslove grupa: sve kartice idu u jednoj mreži,
            poređane po datumu — prvo aktuelni od najskorijeg ka daljem, pa
            prošli od skoro održanog unazad. */}
        {limitedEvents.length > 0 && renderCards(limitedEvents, 'event')}
        {/* pagination */}
        {(pagination && events.length > 12) && <Divider className="section-divider" style={{marginTop: '35px'}}/>}
        {/* {(pagination || events.length > 12) && <PaginationComponent />} */}
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
                // Posetilac takođe vidi dugme, samo sa drugim tekstom — po zahtevu sa
        // kartice „Događaji". Ranije se dugme uopšte nije prikazivalo dok se
        // korisnik ne prijavi, pa posetilac nije imao odakle da krene.
        // Sama radnja je već znala da razlikuje slučajeve: posetiocu otvara
        // prozor za registraciju, izlagaču vodi na rezervaciju.
        showReserveButton={!user || canApply(selectedEvent)}
        reserveLabel={user ? 'Rezerviši mesto' : 'Postani izlagač i rezerviši mesto'}
        onReserve={() => {
          ;(async () => {
            if (!user) {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
              }
              hideModal()
              return
            }

            const { ok: profileOk } = checkProfileReady(user)
            if (!profileOk) {
              window.dispatchEvent(new CustomEvent('nnb:open-profile-modal'))
              hideModal()
              return
            }

            if (!canApply(selectedEvent)) return

            const navigated = await goToReservationMap(selectedEvent)
            if (navigated) {
              hideModal()
              return
            }

            hideModal()
            openReserveModal()
          })()
        }}
      />

      {/* Reservation Options Modal */}
      <ReservationOptionsModal
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
        isOpen={isReserveModalOpen}
        onClose={cancelReserveModal}
        electricityOption={electricityOption}
          electricityOptions={electricityOptionsOf(selectedEvent)}
        setElectricityOption={setElectricityOption}
        marketingOption={marketingOption}
        setMarketingOption={setMarketingOption}
        eventDays={Array.isArray(selectedEvent?.days) ? selectedEvent.days : []}
        selectedDayIds={selectedDayIds}
        setSelectedDayIds={setSelectedDayIds}
        allowPerDay={!!selectedEvent?.allowPerDayApplications}
        onSubmit={submitReservationOptions}
        submitLabel="Prijavite se"
        showCancel={true}
        cancelLabel="Otkaži"
        timeRemaining={sessionSeconds}
        termsPdfUrl={selectedEvent?.termsPdfUrl || selectedEvent?.generatedTermsUrl || null}
      />

      <BoothReservationConfirmModal
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          termsPdfUrl={selectedEvent?.termsPdfUrl || selectedEvent?.generatedTermsUrl || null}
        isOpen={isConfirmModalOpen}
        onClose={cancelReservation}
        title="Da li želite da pošaljete prijavu?"
        eventName={(selectedEvent?.title || selectedEvent?.name || '').toString()}
        onConfirm={confirmReservation}
        onCancel={cancelReservation}
        costs={confirmCosts}
        coveredByPackage={coveredByPackage}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError || quoteBlockers[0] || null}
        onDismissMessage={() => {
          setReservationError(null)
          setReservationSuccess(null)
        }}
        timeRemaining={sessionSeconds}
      />

      <GalleryWarningModal
        isOpen={isGalleryWarningOpen}
        onClose={() => setIsGalleryWarningOpen(false)}
      />
    </>
  )
}

export default Events;