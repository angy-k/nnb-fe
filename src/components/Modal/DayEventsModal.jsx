'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import { isSameDay, endOfDay, isWithinInterval, parse } from 'date-fns'
import { startOfToday } from 'date-fns'

// ── Styled event title: "68. noćni bazar u Novom Sadu" ────────────────────────
const StyledEventTitle = ({ title = '' }) => {
  const match = title.match(/^(\d+\.\s*)(noćni)(\s+bazar)(.*)$/i)
  if (match) {
    const [, num, nocni, bazar, rest] = match
    return (
      <span style={{ fontSize: '20px', lineHeight: '1.2' }}>
        <span style={{ color: '#ffffff', fontWeight: '700' }}>{num}</span>
        <span style={{ color: '#56C4CF', fontWeight: '700' }}>{nocni}</span>
        <span style={{ color: '#EC4923', fontWeight: '700' }}>{bazar}</span>
        <span style={{ color: '#ffffff', fontFamily: "'MADE GoodTime Script', cursive", fontWeight: '400', fontSize: '22px' }}>
          {rest}
        </span>
      </span>
    )
  }
  return <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '20px' }}>{title}</span>
}

// ── DayEventsModal ─────────────────────────────────────────────────────────────
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
      size="xl"
      backdrop="blur"
      placement="center"
      hideCloseButton
      classNames={{
        backdrop: 'nnb-modal-backdrop',
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[700px]',
        body: 'p-0',
      }}
    >
      <ModalContent
        className="rounded-2xl overflow-hidden"
        style={{ background: '#ffffff' }}
      >
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div className="relative px-10 pt-10 pb-12">
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute top-5 right-6 z-20 text-[#555] text-xl font-light w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Zatvori"
              >
                ✕
              </button>

              {/* Date header */}
              <h2 className="text-[#1B1B1B] text-[22px] font-bold capitalize mb-8 pr-10">
                {formattedDate}
              </h2>

              {dayEvents.length === 0 ? (
                <p className="text-[#555] text-sm">Nema događaja za ovaj dan.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {dayEvents.map((ev) => {
                    const details = eventDetailsById[ev.id]
                    const { canApply, applicationStart } = getEventState(ev.id)
                    const titleStr = details?.name || details?.title || ev.title || ''

                    return (
                      <li key={ev.id}>
                        {/* Navy pill row */}
                        <div
                          style={{
                            background: '#261A54',
                            borderRadius: '60px',
                            padding: '0 12px 0 28px',
                            minHeight: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                          }}
                        >
                          {/* Title — clickable to open event detail */}
                          <button
                            type="button"
                            onClick={() => onEventClick?.(ev.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1, padding: '14px 0' }}
                          >
                            <StyledEventTitle title={titleStr} />
                          </button>

                          {/* Right side: button or info text */}
                          <div className="flex-shrink-0">
                            {user && canApply ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onReserve?.(ev.id)
                                }}
                                style={{
                                  background: '#56C4CF',
                                  borderRadius: '30px',
                                  padding: '10px 22px',
                                  color: '#ffffff',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Rezerviši mesto
                              </button>
                            ) : user && applicationStart && !canApply ? (
                              <span style={{ color: '#aaaaaa', fontSize: '14px', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                                Prijava počinje{' '}
                                {applicationStart.toLocaleDateString('sr-Latn', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                                .
                              </span>
                            ) : null
                            /* If not logged in: no button, no text — user just sees the event */
                            }
                          </div>
                        </div>
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
