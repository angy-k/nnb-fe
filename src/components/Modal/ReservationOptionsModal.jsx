'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'

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
}) => {
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
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[1066px] max-h-[923px]',
        body: 'bg-white p-0 overflow-y-auto max-h-[923px]',
      }}
    >
      <ModalContent className="bg-white rounded-2xl overflow-hidden max-h-[923px]">
        {(modalOnClose) => (
          <>
            <ModalBody className="bg-white p-0 overflow-y-auto max-h-[923px]">
              <div className="p-10">
                <h2 className="text-center text-[#261A54] text-xl font-semibold mb-6 max-w-[760px] mx-auto">
                  Da li Vam je osim osvetljenja potreban
                  <br />
                  strujni priključak za određeni uređaj
                  <br />
                  neophodan za izlaganje?
                </h2>

                <div className="space-y-3 mb-8">
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="electricity"
                      value="kw_xx"
                      checked={electricityOption === 'kw_xx'}
                      onChange={() => setElectricityOption('kw_xx')}
                    />
                    <span className="text-sm">Da, potreban nam je strujni priključak od XX kW</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="electricity"
                      value="kw_yy"
                      checked={electricityOption === 'kw_yy'}
                      onChange={() => setElectricityOption('kw_yy')}
                    />
                    <span className="text-sm">Da, potreban nam je strujni priključak od YY kW</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="electricity"
                      value="kw_zz"
                      checked={electricityOption === 'kw_zz'}
                      onChange={() => setElectricityOption('kw_zz')}
                    />
                    <span className="text-sm">Da, potreban nam je strujni priključak od ZZ kW</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="electricity"
                      value="none"
                      checked={electricityOption === 'none'}
                      onChange={() => setElectricityOption('none')}
                    />
                    <span className="text-sm">Ne, strujni priključak nam nije potreban</span>
                  </label>
                </div>

                <h3 className="text-[#261A54] text-lg font-semibold mb-4">Da li vam je potrebna reklama?</h3>

                <div className="space-y-3 mb-8">
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="marketing"
                      value="instagram"
                      checked={marketingOption === 'instagram'}
                      onChange={() => setMarketingOption('instagram')}
                    />
                    <span className="text-sm">Da, potrebna nam je na instagramu</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="marketing"
                      value="facebook"
                      checked={marketingOption === 'facebook'}
                      onChange={() => setMarketingOption('facebook')}
                    />
                    <span className="text-sm">Da, potrebna nam je na fejsbuku</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="marketing"
                      value="instagram_facebook"
                      checked={marketingOption === 'instagram_facebook'}
                      onChange={() => setMarketingOption('instagram_facebook')}
                    />
                    <span className="text-sm">Da, potrebna nam je na instagramu i fejsbuku</span>
                  </label>
                  <label className="flex items-center gap-3 text-[#261A54]">
                    <input
                      type="radio"
                      name="marketing"
                      value="none"
                      checked={marketingOption === 'none'}
                      onChange={() => setMarketingOption('none')}
                    />
                    <span className="text-sm">Ne, nije nam potrebna reklama</span>
                  </label>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => onSubmit?.()}
                    className="bg-[#56C4CF] hover:opacity-90 text-white px-8 py-3 rounded-full font-semibold transition"
                    type="button"
                  >
                    {submitLabel}
                  </button>

                  {showCancel && (
                    <button
                      onClick={modalOnClose}
                      className="ml-4 text-[#261A54] px-8 py-3 rounded-full font-semibold border border-[#261A54]"
                      type="button"
                    >
                      {cancelLabel}
                    </button>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ReservationOptionsModal
