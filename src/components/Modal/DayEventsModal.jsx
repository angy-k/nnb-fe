'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import { isSameDay, endOfDay, isWithinInterval, parse } from 'date-fns'
import { startOfToday } from 'date-fns'
import Image from 'next/image'
import EventDark from '@/icons/event-dark.svg'
import EventLight from '@/icons/event-light.svg'

const DayEventsModal = ({
  isOpen,
  onClose,
  date,
  events = [],
  eventDetailsById = {},
  user,
  isPackageUser,
  onEventClick,
  onReserve,
}) => {
  if (!date) return null

  // Format: "Subota, 8. jun 2025."
  const formattedDate = date.toLocaleDateString('sr-Latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const dayEvents = events.filter((ev) => isSameDay(ev.start_date, date))

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

  const getEventState = (eventId) => {
    const details = eventDetailsById[eventId]
    if (!details) return { canApply: false, applicationStart: null }

    const rawStart = isPackageUser
      ? details?.preApplicationStartDate
      : details?.applicationStartDate
    const applicationStart = parseDateOnly(rawStart)
    const applicationEnd = parseDateOnly(details?.applicationEndDate)

    const canApply =
      !!user &&
      !!applicationStart &&
      !!applicationEnd &&
      isWithinInterval(today, { start: applicationStart, end: endOfDay(applicationEnd) })

    return { canApply, applicationStart }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
      placement="center"
      hideCloseButton
      classNames={{
        backdrop: 'nnb-modal-backdrop',
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[480px]',
        body: 'p-0',
      }}
    >
      <ModalContent
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #ffffff 65%, #dff4f5 100%)' }}
      >
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div className="relative px-8 pt-8 pb-10">
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute top-4 right-4 z-20 text-[#261A54] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Zatvori"
              >
                ×
              </button>

              {/* Date header */}
              <h2 className="text-[#261A54] text-xl font-bold capitalize mb-6 pr-10">
                {formattedDate}
              </h2>

              {dayEvents.length === 0 ? (
                <p className="text-[#1B1B1B] text-sm">Nema događaja za ovaj dan.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {dayEvents.map((ev) => {
                    const details = eventDetailsById[ev.id]
                    const { canApply, applicationStart } = getEventState(ev.id)
                    const isStartup = ev.variant === 'startup'

                    const timeStr = ev.start_date.toLocaleTimeString('sr-Latn', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    const dateStr = ev.start_date.toLocaleDateString('sr-Latn', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })

                    return (
                      <li
                        key={ev.id}
                        className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onEventClick?.(ev.id)}
                      >
                        {/* Pill badge */}
                        <Image
                          src={isStartup ? EventLight : EventDark}
                          width={80}
                          height={33}
                          alt={isStartup ? 'NNB Startup' : 'NNB'}
                          className="self-start"
                        />

                        <div className="font-semibold text-[#261A54] text-base leading-snug">
                          {details?.name || details?.title || ev.title}
                        </div>

                        <div className="text-sm text-[#555]">
                          {dateStr} u {timeStr}
                          {details?.eventAddress && (
                            <span className="block text-[#555]">{details.eventAddress}</span>
                          )}
                        </div>

                        {user && canApply ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onReserve?.(ev.id)
                            }}
                            className="self-start mt-1 inline-flex items-center px-5 py-2 rounded-full bg-[#56C4CF] text-white text-sm font-semibold hover:opacity-90 transition"
                          >
                            Rezerviši mesto
                          </button>
                        ) : user && applicationStart ? (
                          <span className="self-start mt-1 text-sm text-[#777]">
                            Prijava počinje{' '}
                            {applicationStart.toLocaleDateString('sr-Latn', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric',
                            })}
                            .
                          </span>
                        ) : !user ? (
                          <span className="self-start mt-1 text-sm text-[#56C4CF] font-medium">
                            Prijavite se za rezervaciju
                          </span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DayEventsModal
