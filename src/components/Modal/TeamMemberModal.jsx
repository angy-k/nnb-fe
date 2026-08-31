'use client'

import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/modal'
import { teamMemberName } from '@/utils/team'

/**
 * Ceo opis člana tima.
 *
 * Na kartici stoji samo prva tri reda; odavde se vidi ceo tekst. Prored se
 * čuva preko `pre-wrap`, jer se opis u administraciji unosi kao slobodan tekst
 * i ume da ima prazne redove između pasusa.
 *
 * Dugme „Zatvori" zove `onClose` koji stiže spolja, a ne `onClose` koji
 * `ModalContent` nudi kroz svoju funkciju. Ovo drugo je provereno ostajalo bez
 * dejstva — klik je stizao do dugmeta, ali se modal nije zatvarao. Ovako
 * zatvaranje drži ista ona promenljiva koja ga i otvara, pa nema gde da zapne.
 */
const TeamMemberModal = ({ member, isOpen, onOpenChange, onClose }) => (
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
      <ModalHeader className="p-0 h-0 min-h-0" />
      <ModalBody className="px-10 py-10 pt-12">
        <h2 className="text-[#261A54] text-2xl font-bold mb-1">
          {teamMemberName(member)}
        </h2>
        {member?.position && (
          <p className="text-[#616161] text-sm mb-4">{member.position}</p>
        )}
        <p
          className="text-[#1B1B1B] text-sm leading-relaxed mb-6"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {member?.about}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-3 rounded-full bg-[#56C4CF] text-white font-semibold text-sm hover:bg-[#3db8c4] transition-colors self-start"
        >
          Zatvori
        </button>
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default TeamMemberModal
