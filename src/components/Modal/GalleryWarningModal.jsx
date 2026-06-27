'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Link from 'next/link'

const GalleryWarningModal = ({ isOpen, onClose }) => {
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
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[560px]',
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
                className="absolute top-4 right-4 z-20 text-[#261A54] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Zatvori"
              >
                ×
              </button>

              <div className="p-10 pb-12">
                <h2 className="text-[#261A54] text-xl font-bold mb-4 pr-8">
                  Ukoliko želite reklamu morate imati dodate fotografije
                </h2>

                <p className="text-[#261A54]/80 text-sm leading-relaxed">
                  To možete uraditi u odeljku{' '}
                  <Link
                    href="/profil#galerija"
                    className="text-[#56C4CF] font-semibold underline underline-offset-2 hover:opacity-80 transition"
                    onClick={modalOnClose}
                  >
                    galerija
                  </Link>{' '}
                  na svom profilu.
                </p>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default GalleryWarningModal
