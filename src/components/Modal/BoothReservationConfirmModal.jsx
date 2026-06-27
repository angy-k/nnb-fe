'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Button from '@/components/Button'

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
      color, fontWeight: '600', fontSize: '14px', marginBottom: '16px',
    }}>
      <span>⏱</span>
      <span>Sesija ističe za {formatted}</span>
    </div>
  )
}

const BoothReservationConfirmModal = ({
  isOpen,
  onClose,
  title = 'Da li želite da rezervišete tezgu?',
  costs = {},
  selections = {},
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
  const toNumber = (value) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }

  const formatRsd = (value) => {
    const n = toNumber(value)
    return `${n} RSD`
  }

  const cotization = toNumber(costs?.cotization)
  const electricity = costs?.electricity != null ? toNumber(costs.electricity) : null
  const marketing = costs?.marketing != null ? toNumber(costs.marketing) : null

  const total = cotization + (electricity ?? 0) + (marketing ?? 0)

  const electricityLabel = (() => {
    const v = (selections?.electricityOption ?? '').toString()
    if (!v || v === 'none') return 'Ne'
    if (v === 'kw_xx') return 'Da, XX kW'
    if (v === 'kw_yy') return 'Da, YY kW'
    if (v === 'kw_zz') return 'Da, ZZ kW'
    return 'Da'
  })()

  const marketingLabel = (() => {
    const v = (selections?.marketingOption ?? '').toString()
    if (!v || v === 'none') return 'Ne'
    if (v === 'instagram') return 'Da, Instagram'
    if (v === 'facebook') return 'Da, Facebook'
    if (v === 'instagram_facebook') return 'Da, Instagram i Facebook'
    return 'Da'
  })()

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
              style={{ background: 'linear-gradient(to bottom, #ffffff 60%, #dff4f5 100%)' }}
            >
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute top-4 right-4 z-20 text-[#261A54] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Zatvori"
              >
                ×
              </button>

              <div className="p-10 pb-12">
                <TimerChip timeRemaining={timeRemaining} />
                <div className="text-center text-[#261A54] text-2xl font-bold mb-8">{title}</div>

                <div className="text-[#261A54] max-w-[600px] mx-auto space-y-3">
                  <div className="flex justify-between border-b border-[#e5e7eb] pb-2">
                    <span className="font-medium">Strujni priključak</span>
                    <span>{electricityLabel}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e5e7eb] pb-2">
                    <span className="font-medium">Reklama</span>
                    <span>{marketingLabel}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e5e7eb] pb-2">
                    <span className="font-medium">Troškovi kotizacije</span>
                    <span>{formatRsd(cotization)}</span>
                  </div>
                  {electricity !== null && (
                    <div className="flex justify-between border-b border-[#e5e7eb] pb-2">
                      <span className="font-medium">Troškovi struje</span>
                      <span>{formatRsd(electricity)}</span>
                    </div>
                  )}
                  {marketing !== null && (
                    <div className="flex justify-between border-b border-[#e5e7eb] pb-2">
                      <span className="font-medium">Troškovi reklame</span>
                      <span>{formatRsd(marketing)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="font-semibold text-lg">Ukupan iznos za naplatu</span>
                    <span className="font-semibold text-lg">{formatRsd(total)}</span>
                  </div>
                </div>

                {(successMessage || errorMessage) && (
                  <div className="mt-6 max-w-[600px] mx-auto">
                    <div
                      className={`rounded-xl px-4 py-3 text-sm ${
                        successMessage
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-left">{successMessage || errorMessage}</div>
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
                  </div>
                )}

                <div className="mt-10 flex flex-row items-center justify-start gap-4">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onConfirm?.()}
                    className="bg-[#56C4CF] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded-full font-semibold transition text-sm"
                  >
                    {confirmLabel}
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      onCancel?.()
                      modalOnClose()
                    }}
                    className="bg-[#EC4923] hover:opacity-90 disabled:opacity-50 text-white px-8 py-3 rounded-full font-semibold transition text-sm"
                  >
                    {cancelLabel}
                  </button>
                </div>

                {isLoading && (
                  <div className="mt-4 text-sm text-[#261A54] opacity-70">Slanje...</div>
                )}
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default BoothReservationConfirmModal
