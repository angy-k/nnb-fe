'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Button from '@/components/Button'

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
      classNames={{
        backdrop: 'nnb-modal-backdrop',
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[860px] max-h-[560px]',
        body: 'bg-white p-0 overflow-y-auto max-h-[560px]',
      }}
    >
      <ModalContent className="bg-white rounded-2xl overflow-hidden max-h-[560px]">
        {(modalOnClose) => (
          <>
            <ModalBody className="bg-white p-0 overflow-y-auto max-h-[560px]">
              <div className="p-10">
                <div className="text-center text-[#261A54] text-2xl font-bold mb-4">{title}</div>

                <div className="text-center text-[#1B1B1B] max-w-[720px] mx-auto">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Strujni priključak:</span> {electricityLabel}
                    </div>

                    <div>
                      <span className="font-semibold">Reklama:</span> {marketingLabel}
                    </div>

                    <div>
                      <span className="font-semibold">Troškovi kotizacije:</span> {formatRsd(cotization)}
                    </div>

                    {electricity !== null && (
                      <div>
                        <span className="font-semibold">Troškovi struje:</span> {formatRsd(electricity)}
                      </div>
                    )}

                    {marketing !== null && (
                      <div>
                        <span className="font-semibold">Troškovi reklame:</span> {formatRsd(marketing)}
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="font-semibold">Ukupan iznos za naplatu:</span> {formatRsd(total)}
                    </div>
                  </div>
                </div>

                {(successMessage || errorMessage) && (
                  <div className="mt-6 max-w-[720px] mx-auto">
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
                            Zatvori
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="booth-confirm-actions mt-10 flex flex-row items-stretch justify-center gap-4">
                  <div className="flex items-stretch justify-center">
                    <Button
                      type="light"
                      name={confirmLabel}
                      disabled={isLoading}
                      onClick={() => {
                        onConfirm?.()
                      }}
                    />
                  </div>

                  <div className="flex items-stretch justify-center">
                    <Button
                      type="outlined-orange"
                      name={cancelLabel}
                      disabled={isLoading}
                      onClick={() => {
                        onCancel?.()
                        modalOnClose()
                      }}
                    />
                  </div>
                </div>

                {isLoading && (
                  <div className="mt-4 text-center text-sm text-[#261A54] opacity-80">Slanje...</div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default BoothReservationConfirmModal
