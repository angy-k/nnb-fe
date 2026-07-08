'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Link from 'next/link'

const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const TimerChip = ({ timeRemaining }) => {
  if (timeRemaining === null || timeRemaining === undefined) return null
  const formatted = formatTime(timeRemaining)
  const color = timeRemaining <= 15 ? '#EC4923' : timeRemaining <= 30 ? '#FACE06' : '#56C4CF'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 14px', borderRadius: '20px', border: `1.5px solid ${color}`,
      color, fontWeight: '600', fontSize: '14px', marginBottom: '20px',
    }}>
      <span>⏱</span>
      <span>Sesija ističe za {formatted}</span>
    </div>
  )
}

// ── Teal checkmark SVG ───────────────────────────────────────────────────────
const CheckmarkIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="#56C4CF" />
    <path d="M20 37L30 48L52 26" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BoothReservationConfirmModal = ({
  isOpen,
  onClose,
  title = 'Da li želite da rezervišete tezgu?',
  eventName = '',
  onConfirm,
  onCancel,
  isLoading = false,
  successMessage = null,
  errorMessage = null,
  onDismissMessage,
  confirmLabel = 'Rezerviši tezgu',
  cancelLabel = 'Poništi rezervaciju',
  timeRemaining = null,
}) => {
  const isSuccess = !!successMessage

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      placement="center"
      hideCloseButton
      classNames={{
        backdrop: 'nnb-modal-backdrop',
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[860px]',
        body: 'p-0',
      }}
    >
      <ModalContent className="rounded-2xl overflow-hidden">
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div
              className="relative flex flex-col"
              style={{ background: 'linear-gradient(to bottom, #ffffff 55%, #dff4f5 100%)' }}
            >
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute top-5 right-6 z-20 text-[#555] text-xl font-light w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Zatvori"
              >
                ✕
              </button>

              {isSuccess ? (
                /* ── Success screen ─────────────────────────────────────────── */
                <div className="flex flex-col items-center text-center px-12 py-16 gap-6">
                  <CheckmarkIcon />

                  <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#261A54', lineHeight: '1.35', margin: 0 }}>
                    {eventName
                      ? `Vaša rezervacija na ${eventName} je uspešno poslata!`
                      : 'Vaša rezervacija je uspešno poslata!'}
                  </h2>

                  <p style={{ fontSize: '16px', color: '#555', margin: 0, maxWidth: '480px' }}>
                    Sve neophodne instrukcije za plaćanje će Vam stići putem emaila.
                  </p>

                  <p style={{ fontSize: '16px', color: '#555', margin: 0, maxWidth: '480px' }}>
                    Status Vaše rezervacije možete pratiti na stranici{' '}
                    <Link
                      href="/moje-rezervacije"
                      style={{ color: '#56C4CF', fontWeight: '600', textDecoration: 'underline' }}
                    >
                      Moje rezervacije
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                /* ── Confirm screen ─────────────────────────────────────────── */
                <div className="flex flex-col items-center text-center px-12 py-16 gap-8">
                  <TimerChip timeRemaining={timeRemaining} />

                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#261A54', margin: 0 }}>
                    {title}
                  </h2>

                  {errorMessage && (
                    <div className="w-full max-w-[500px]">
                      <div className="rounded-xl px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200 flex items-start justify-between gap-3">
                        <div className="text-left">{errorMessage}</div>
                        {onDismissMessage && (
                          <button
                            type="button"
                            className="shrink-0 text-xs font-semibold opacity-70 hover:opacity-100"
                            onClick={() => onDismissMessage?.()}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onConfirm?.()}
                      style={{
                        background: '#56C4CF', color: '#ffffff',
                        borderRadius: '30px', padding: '12px 32px',
                        fontWeight: '600', fontSize: '16px', border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {isLoading ? 'Slanje...' : confirmLabel}
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        onCancel?.()
                        modalOnClose()
                      }}
                      style={{
                        background: '#EC4923', color: '#ffffff',
                        borderRadius: '30px', padding: '12px 32px',
                        fontWeight: '600', fontSize: '16px', border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {cancelLabel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default BoothReservationConfirmModal
