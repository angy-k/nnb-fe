'use client'
import CardComponent from "@/components/CardComponent";
import { Divider } from "@nextui-org/divider";
import Button from "../Button";
import { formatTitleForUri } from '@/utils/transform-helper';
import { useRouter } from 'next/navigation'
import PageHeroSection from '@/components/Hero/pageOwl';
import { useState, useEffect } from 'react';
import eventService from '@/services/eventService';
import useUser from '@/data/use-user'
import applicationService from '@/services/applicationService'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmCosts, setConfirmCosts] = useState({ cotization: 0, electricity: null, marketing: null })
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)

  useEffect(() => {
    // Only fetch from API if no events were passed as props
    if (!propEvents) {
      fetchEvents()
    }
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
    setIsModalOpen(false)
    setSelectedEvent(null)
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
    setIsReserveModalOpen(true)
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

  function submitReservationOptions() {
    const eventId = selectedEvent?.id

    if (loggedOut || !user) {
      setConfirmCosts(computeConfirmCosts(selectedEvent, electricityOption, marketingOption))
      closeReserveModal()
      setIsConfirmModalOpen(true)
      return
    }

    setConfirmCosts(computeConfirmCosts(selectedEvent, electricityOption, marketingOption))
    closeReserveModal()
    setIsConfirmModalOpen(true)
  }

  const confirmReservation = async () => {
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
        setTimeout(() => {
          closeAllModals()
        }, 1200)
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

  let limitedEvents = numberForDisplay ? events.slice(0,numberForDisplay) : events
  
  if (loading) {
    return (
      <>
        {showHero && <PageHeroSection 
          title={`Događaji`}
        />}
        <div className="w-full events-container pt-24 grid place-items-center pb-48 z-1 bg-[#F0F0F0]">
          <div className="text-center">Loading events...</div>
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
            <Divider className="section-divider w-1440" style={{marginBottom: '35px'}}/>
            <div className="flex justify-start">
              <span className="event-title text-start">Pogledaj još događaja</span>
            </div>
          </>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading events: {error}
          </div>
        )}
        {title && <span className="event-title">{title}</span>}
        {title && <Button
            key={`section-component-title-button-${sectionType}`}
            type={'outlined-dark'}
            name={'Pogledaj sve događaje'}
            onClick={() => previewAllEvents()}
        />}
        {title && <Divider className="section-divider"/>}
        <div className="blog-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {limitedEvents.map((event, index) => (
            <div className="event-card" key={`event-card-${index}`}>
              <CardComponent
                key={`events-card-${index}`}
                {...(event.coverImage && { imageSrc: event.coverImage })}
                imageWidth={438}
                imageHeight={344}
                imageRadius={"30px"}
                imageAltText={`Događaj - ${event.name || event.title}`}
                sectionType={'event'}
                title={event.name || event.title}
                creationDate={event.dateTime || event.createdAt}
                buttonAction={() => goToSingleEvent(event)}
                buttonText="Detaljnije"
              />
            </div>
          ))}
        </div>
        {/* pagination */}
        {(pagination && events.length > 12) && <Divider className="section-divider w-1440" style={{marginTop: '35px'}}/>}
        {/* {(pagination || events.length > 12) && <PaginationComponent />} */}
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
        showReserveButton={true}
        reserveLabel="Rezerviši mesto"
        onReserve={() => {
          ;(async () => {
            if (!user) {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
              }
              hideModal()
              return
            }

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
        isOpen={isReserveModalOpen}
        onClose={cancelReserveModal}
        electricityOption={electricityOption}
        setElectricityOption={setElectricityOption}
        marketingOption={marketingOption}
        setMarketingOption={setMarketingOption}
        onSubmit={submitReservationOptions}
        submitLabel="Prijavite se"
      />

      <BoothReservationConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={cancelReservation}
        costs={confirmCosts}
        selections={{ electricityOption, marketingOption }}
        onConfirm={confirmReservation}
        onCancel={cancelReservation}
        isLoading={isSubmittingReservation}
        successMessage={reservationSuccess}
        errorMessage={reservationError}
        onDismissMessage={() => {
          setReservationError(null)
          setReservationSuccess(null)
        }}
      />
    </>
  )
}

export default Events;