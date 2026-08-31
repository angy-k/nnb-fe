'use client'

import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/modal'

/**
 * Instrukcije za registraciju.
 *
 * Ranije je ovaj modal živeo unutar `AuthModal`, koji se montira tek kad se
 * otvori — pa se instrukcije nisu mogle otvoriti sa Kalendara ni sa početne,
 * gde link do njih takođe stoji. Zato je izdvojen ovde.
 *
 * NAPOMENA: sam tekst instrukcija još nije dostavljen; dole stoji privremeni
 * sadržaj koji je i ranije bio u `AuthModal`.
 */
const RegistrationInstructionsModal = ({ isOpen, onOpenChange, onClose }) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onClose={onClose}
    backdrop="blur"
    scrollBehavior="inside"
    hideCloseButton
    classNames={{
      wrapper: 'nnb-modal-wrapper items-center justify-center',
      backdrop: 'nnb-modal-backdrop',
      base: 'nnb-modal-base max-h-[85vh]',
    }}
  >
    <ModalContent>
      {(modalOnClose) => (
        <>
          <ModalHeader className="p-0 h-0 min-h-0" />
          <ModalBody className="px-10 py-10 pt-12">
            <h2 className="text-[#261A54] text-2xl font-bold mb-4">
              Instrukcije za registraciju
            </h2>
            <p className="text-[#1B1B1B] text-sm leading-relaxed mb-6">
              Instrukcije za registraciju će biti dodate ovde.
            </p>
            <button
              type="button"
              onClick={modalOnClose}
              className="px-8 py-3 rounded-full bg-[#56C4CF] text-white font-semibold text-sm hover:bg-[#3db8c4] transition-colors"
            >
              Zatvori
            </button>
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
)

export default RegistrationInstructionsModal
