'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Link from 'next/link'
import OKVIR from './shellStyle'

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
        base: `shadow-2xl w-[calc(100vw-2rem)] max-w-[${OKVIR.sirina}px]`,
        body: 'p-0',
      }}
    >
      <ModalContent className="overflow-hidden" style={{ borderRadius: `${OKVIR.radijus}px` }}>
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div
              className="relative flex flex-col"
              style={{ background: OKVIR.preliv }}
            >
              {/* X close */}
              <button
                type="button"
                onClick={modalOnClose}
                className="absolute z-20 text-[#261A54] opacity-75 hover:opacity-100 transition"
                style={{ top: `${OKVIR.iks.vrh}px`, right: `${OKVIR.iks.desno}px`, lineHeight: 0 }}
                aria-label="Zatvori"
              >
                <svg width={OKVIR.iks.velicina} height={OKVIR.iks.velicina} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>

              {/* Naslov je u dizajnu uz levu ivicu, ne po sredini; kreće 122 od ivice
                  modala (119 ovde), ink na 157, a podnaslov na 221. */}
              <div style={{ padding: `${152}px ${119}px ${146}px` }}>
                <h2 className="text-[#261A54] font-bold" style={{ fontSize: `${OKVIR.naslov}px`, lineHeight: 1.2, marginBottom: `${28}px` }}>
                  Ukoliko želite reklamu morate imati dodate fotografije
                </h2>

                <p className="text-[#261A54]" style={{ fontSize: '21px', lineHeight: 1.2 }}>
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
