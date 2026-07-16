'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'

const RadioOption = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(value)}>
    <div
      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
      style={{
        borderColor: checked ? '#56C4CF' : '#d1d5db',
        backgroundColor: checked ? '#56C4CF' : 'transparent',
      }}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
    <span className="text-base text-[#261A54]">{label}</span>
  </label>
)

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

const ReservationOptionsModal = ({
  isOpen,
  onClose,
  electricityOption,
  setElectricityOption,
  marketingOption,
  setMarketingOption,
  onSubmit,
  submitLabel = 'Prijavite se',
  showCancel = false,
  cancelLabel = 'Otkaži',
  timeRemaining = null,
  termsPdfUrl = null,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false)

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
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[1066px]',
        body: 'p-0',
      }}
    >
      <ModalContent className="rounded-2xl overflow-hidden">
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div
              className="relative flex flex-col"
              style={{ background: 'linear-gradient(to bottom, #ffffff 65%, #dff4f5 100%)' }}
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
                <h2 className="text-[#261A54] text-xl font-bold mb-8">
                  Da li Vam je osim osvetljenja potreban strujni priključak za
                  određeni uređaj neophodan za izlaganje?
                </h2>

                <div className="space-y-4 mb-10">
                  <RadioOption
                    name="electricity"
                    value="kw_xx"
                    checked={electricityOption === 'kw_xx'}
                    onChange={setElectricityOption}
                    label="Da, potreban nam je strujni priključak (do 2 kW)"
                  />
                  <RadioOption
                    name="electricity"
                    value="none"
                    checked={electricityOption === 'none'}
                    onChange={setElectricityOption}
                    label="Ne, strujni priključak nam nije potreban"
                  />
                </div>

                <h3 className="text-[#261A54] text-xl font-bold mb-5">
                  Da li vam je potrebna reklama?
                </h3>

                <div className="space-y-4 mb-10">
                  <RadioOption
                    name="marketing"
                    value="instagram"
                    checked={marketingOption === 'instagram'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na instagramu"
                  />
                  <RadioOption
                    name="marketing"
                    value="facebook"
                    checked={marketingOption === 'facebook'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na fejsbuku"
                  />
                  <RadioOption
                    name="marketing"
                    value="instagram_facebook"
                    checked={marketingOption === 'instagram_facebook'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na instagramu i fejsbuku"
                  />
                  <RadioOption
                    name="marketing"
                    value="none"
                    checked={marketingOption === 'none'}
                    onChange={setMarketingOption}
                    label="Ne, nije nam potrebna reklama"
                  />
                </div>

                {/* T&C checkbox */}
                <label
                  className="flex items-start gap-3 cursor-pointer mb-6"
                  onClick={() => setTermsAccepted(v => !v)}
                >
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={{
                      borderColor: termsAccepted ? '#56C4CF' : '#d1d5db',
                      backgroundColor: termsAccepted ? '#56C4CF' : 'transparent',
                    }}
                  >
                    {termsAccepted && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#261A54] leading-snug select-none">
                    Prihvatam{' '}
                    {termsPdfUrl ? (
                      <a
                        href={termsPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#56C4CF]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        opšte uslove i pravila
                      </a>
                    ) : (
                      <span>opšte uslove i pravila</span>
                    )}{' '}
                    učešća na događaju.
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onSubmit?.()}
                    disabled={!termsAccepted}
                    className="bg-[#56C4CF] hover:opacity-90 text-white px-10 py-3 rounded-full font-semibold transition text-sm"
                    style={{ opacity: termsAccepted ? 1 : 0.45, cursor: termsAccepted ? 'pointer' : 'not-allowed' }}
                    type="button"
                  >
                    {submitLabel}
                  </button>

                  {showCancel && (
                    <button
                      onClick={modalOnClose}
                      className="text-[#261A54] px-8 py-3 rounded-full font-semibold border border-[#261A54] hover:opacity-80 transition text-sm"
                      type="button"
                    >
                      {cancelLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ReservationOptionsModal
