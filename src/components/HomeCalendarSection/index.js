'use client'

import { useEffect, useState } from 'react'
import { add, parse, startOfToday, isSameDay } from 'date-fns'
import { Divider } from '@nextui-org/divider'

import { Calendar } from '@/components/Calendar'
import UpcommingEvents from '@/components/UpcommingEvents'
import EventDetailsModal from '@/components/Modal/EventDetailsModal'
import DayEventsModal from '@/components/Modal/DayEventsModal'
import eventService from '@/services/eventService'
import useUser from '@/data/use-user'

const HomeCalendarSection = () => {
  const { user } = useUser()
  const [events, setEvents] = useState([])
  const [eventDetailsById, setEventDetailsById] = useState({})

  const [selectedEventId, setSelectedEventId] = useState(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)

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

            const isActiveFromApi = typeof item?.isActive === 'boolean' ? item.isActive : null
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
              end_date: add(startDate, { hours: 1 }),
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

  const handleReserve = () => {
    closeEventModal()
    if (!user) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nnb:open-auth-modal'))
      }
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/kalendar-dogadjaja'
      }
    }
  }

  return (
    <div className="w-full">
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
        <div
          className="w-full pt-32"
          style={{ width: '100%', height: '100%', maxWidth: '1400px' }}
        >
          <span className="our-team-title">Kalendar događaja</span>
          <Divider className="section-divider" />
        </div>

        <div className="hidden md:block lg:block" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'month'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>
        <div className="block md:hidden lg:hidden" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'day'} events={events} onEventClick={onEventClick} onDayClick={onDayClick} />
        </div>

        <UpcommingEvents />
      </div>

      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        event={selectedEvent}
        showReserveButton={true}
        reserveLabel={user ? 'Rezerviši mesto' : 'Postani izlagač'}
        onReserve={handleReserve}
      />

      <DayEventsModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        date={selectedDay}
        events={events}
        eventDetailsById={eventDetailsById}
        user={user}
        isPackageUser={!!user?.active_package}
        onEventClick={(eventId) => {
          setIsDayModalOpen(false)
          onEventClick(eventId)
        }}
        onReserve={(eventId) => {
          setIsDayModalOpen(false)
          setSelectedEventId(String(eventId))
          setIsEventModalOpen(true)
        }}
      />
    </div>
  )
}

export default HomeCalendarSection
