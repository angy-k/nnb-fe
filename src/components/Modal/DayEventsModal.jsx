'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import { isSameDay, endOfDay, isWithinInterval, parse } from 'date-fns'
import { startOfToday } from 'date-fns'
import { formatPunDatum, formatDate } from '@/utils/dateHelpers'

// ── Styled event title: "68. noćni bazar u Novom Sadu" ────────────────────────
const StyledEventTitle = ({ title = '' }) => {
  const match = title.match(/^(\d+\.\s*)(noćni)(\s+bazar)(.*)$/i)
  if (match) {
    const [, num, nocni, bazar, rest] = match
    return (
      <span style={{ fontSize: '35px', lineHeight: '1.2' }}>
        <span style={{ color: '#ffffff', fontWeight: '700' }}>{num}</span>
        <span style={{ color: '#56C4CF', fontWeight: '700' }}>{nocni}</span>
        <span style={{ color: '#EC4923', fontWeight: '700' }}>{bazar}</span>
        <span style={{ color: '#ffffff', fontFamily: "'MADE GoodTime Script', cursive", fontWeight: '400', fontSize: '39px' }}>
          {rest}
        </span>
      </span>
    )
  }
  return <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '35px' }}>{title}</span>
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

  const formattedDate = formatPunDatum(date)

  const dayEvents = events.filter((ev) => isSameDay(ev.start_date, date))
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

  const getEventState = (eventId) => {
    const details = eventDetailsById[eventId]
    if (!details) return { canApply: false, applicationStart: null }

    // Pred-prijava je opciona — ako nije postavljena, paket korisnik koristi redovan datum
    const rawStart = isPackageUser
      ? (details?.preApplicationStartDate || details?.applicationStartDate)
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
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[1400px]',
        body: 'p-0',
      }}
    >
      <ModalContent
        className="rounded-2xl overflow-hidden"
        style={{ background: '#ffffff' }}
      >
        {(modalOnClose) => (
          <ModalBody className="p-0">
            {/* Razmaci sa izvoza dizajna: redovi su 1288 široki u modalu od 1440,
                  dakle 76 sa svake strane (74 ovde), naslov kreće 67 od vrha, a
                  ispod poslednjeg reda ostaje 148 praznine. */}
              <div className="relative px-[74px] pt-[57px] pb-[144px] sm:px-5 sm:pt-7 sm:pb-8">
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute top-[44px] right-[50px] z-20 text-[#261A54] opacity-75 flex items-center justify-center transition hover:opacity-100"
                aria-label="Zatvori"
              >
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>

              {/* Date header */}
              <h2 className="text-[#1B1B1B] text-[33px] sm:text-[20px] font-bold capitalize mb-8 sm:mb-5 pr-10">
                {formattedDate}
              </h2>

              {dayEvents.length === 0 ? (
                <p className="text-[#555] text-sm">Nema događaja za ovaj dan.</p>
              ) : (
                <ul className="flex flex-col" style={{ gap: '29px' }}>
                  {dayEvents.map((ev) => {
                    const details = eventDetailsById[ev.id]
                    const { canApply, applicationStart } = getEventState(ev.id)
                    // Kod višednevnog događaja naslov nosi i redni broj dana
                    const titleStr = details?._dayLabel || details?.name || details?.title || ev.title || ''

                    return (
                      <li key={ev.id}>
                        {/* Navy pill row */}
                        <div
                          className="day-event-pill"
                          style={{
                            background: '#261A54',
                            borderRadius: '29px',
                            padding: '0 36px 0 42px',
                            minHeight: '97px',
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
                                  borderRadius: '29px',
                                  width: '243px',
                                  height: '58px',
                                  color: '#ffffff',
                                  fontWeight: '600',
                                  fontSize: '17px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Rezerviši mesto
                              </button>
                            ) : user && applicationStart && !canApply ? (
                              <span style={{ color: '#ffffff', fontSize: '18px', whiteSpace: 'nowrap', paddingRight: '21px' }}>
                                Prijava počinje{' '}
                                {formatDate(applicationStart)}
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
