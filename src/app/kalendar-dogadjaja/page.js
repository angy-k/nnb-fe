'use client'; 
import { Calendar } from "@/components/Calendar"
import PageHeroSection from '@/components/Hero/pageOwl';
import Button from '@/components/Button';
import UpcommingEvents from '@/components/UpcommingEvents';
import useUser from '@/data/use-user'
import { useEffect, useState } from 'react'
import { add, parse, startOfToday, endOfDay, isWithinInterval } from 'date-fns'
import eventService from '@/services/eventService'
import applicationService from '@/services/applicationService'
import ReservationOptionsModal from '@/components/Modal/ReservationOptionsModal'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import BoothReservationConfirmModal from '@/components/Modal/BoothReservationConfirmModal'
import { useRouter } from 'next/navigation'

const CalendarPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [eventDetailsById, setEventDetailsById] = useState({})

  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)

  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false)
  const [electricityOption, setElectricityOption] = useState('none')
  const [marketingOption, setMarketingOption] = useState('none')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmCosts, setConfirmCosts] = useState({ cotization: 0, electricity: null, marketing: null })
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false)
  const [reservationError, setReservationError] = useState(null)
  const [reservationSuccess, setReservationSuccess] = useState(null)

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
                  'd MMM yyyy',
                  'd M yyyy',
                  'dd MMM yyyy',
                  'dd M yyyy',
                ])
              : null

            const isActiveFromApi = typeof item?.isActive === 'boolean' ? item.isActive : null
            const isActive = isActiveFromApi !== null
              ? isActiveFromApi
              : applicationEndDate
                ? applicationEndDate >= today
                : startDate >= today

            if (!isActive) return null

            const id = (item?.id ?? '').toString()
            if (!id) return null

            detailsMap[id] = item

            return {
              id,
              title: (item?.title ?? item?.name ?? '').toString(),
              start_date: startDate,
              end_date: endDate,
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

  const closeAllModals = () => {
    setIsConfirmModalOpen(false)
    setIsReserveModalOpen(false)
    setIsEventModalOpen(false)
    setSelectedEventId(null)
    resetReservationState()
  }

  const cancelReserveModal = () => {
    setIsReserveModalOpen(false)
    resetReservationState()
  }

  const openReserveModal = () => {
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

  const submitReservationOptions = () => {
    if (!user) return

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

  const isPackageUser = !!user?.active_package
  const today = startOfToday()
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

  return (
    <div className="mt-60 grid place-items-center w-full">
      <PageHeroSection 
          title={`Kalendar`}
        />
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 bg-[#f0f0f0]">
        <div className="hidden md:block lg:block" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} />
        </div>
        <div className="block md:hidden lg:hidden" style={{width: '100%', height: '100%', maxWidth: '1400px'}}>
          <Calendar view={'day'} events={events} onEventClick={onEventClick} />
        </div>
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
        <UpcommingEvents />

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
      </div>
      
    </div>
  )
}

export default CalendarPage;
