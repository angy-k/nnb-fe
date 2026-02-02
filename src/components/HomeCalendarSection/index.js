'use client'

import { useEffect, useState } from 'react'
import { add, parse, startOfToday } from 'date-fns'
import { Divider } from '@nextui-org/divider'

import { Calendar } from '@/components/Calendar'
import UpcommingEvents from '@/components/UpcommingEvents'
import eventService from '@/services/eventService'

const HomeCalendarSection = () => {
  const [events, setEvents] = useState([])

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
            if (startDate < today) return null

            const id = (item?.id ?? '').toString()
            if (!id) return null

            return {
              id,
              title: (item?.title ?? item?.name ?? '').toString(),
              start_date: startDate,
              end_date: add(startDate, { hours: 1 }),
            }
          })
          .filter(Boolean)

        setEvents(mapped)
      } catch (e) {
        setEvents([])
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="w-full bg-[#f0f0f0]">
      <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto">
        <div
          className="w-full pt-24"
          style={{ width: '100%', height: '100%', maxWidth: '1400px' }}
        >
          <span className="our-team-title">Kalendar događaja</span>
          <Divider className="section-divider" />
        </div>

        <div className="hidden md:block lg:block" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'month'} events={events} />
        </div>
        <div className="block md:hidden lg:hidden" style={{ width: '100%', height: '100%', maxWidth: '1400px' }}>
          <Calendar view={'day'} events={events} />
        </div>

        <UpcommingEvents />
      </div>
    </div>
  )
}

export default HomeCalendarSection
