'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/modal'
import PrivacyPolicyContent, { PRIVACY_EXCERPT } from '@/components/Legal/PrivacyPolicyContent'
import ExhibitionTermsContent, { TERMS_EXCERPT } from '@/components/Legal/ExhibitionTermsContent'

/**
 * Uslovi korišćenja i Politika privatnosti.
 *
 * Po dizajnu: svaka sekcija prikazuje izvod, a „pročitaj više" proširuje pun
 * tekst u istom modalu — korisnik ne napušta formu koju popunjava. Ranije je
 * modal sručivao ceo pravni tekst odjednom, što se u praksi ne čita.
 *
 * `onAccept` je opcion — kad je prosleđen, „Slažem se" ga poziva (registracija
 * i prijava tako čekiraju svoju saglasnost).
 *
 * `termsPdfUrl` se prosleđuje iz prijave na događaj: uslovi tog događaja nose
 * konkretne cene i satnicu, pa uz opšti tekst stoji i link na taj dokument.
 */
const LegalDocsModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onAccept = null,
  termsPdfUrl = null,
  acceptLabel = 'Slažem se',
}) => {
  const [expanded, setExpanded] = useState({ terms: false, privacy: false })

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  const ReadMore = ({ section }) => (
    <button
      type="button"
      onClick={() => toggle(section)}
      className="underline font-semibold text-[#56C4CF] hover:opacity-80 transition-opacity"
    >
      {expanded[section] ? 'prikaži manje' : 'pročitaj više'}
    </button>
  )

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      placement="center"
      scrollBehavior="inside"
      hideCloseButton
      classNames={{
        // --nested podiže sloj iznad modala iz kojeg je otvoren
        wrapper: 'nnb-modal-wrapper nnb-modal-wrapper--nested items-center justify-center',
        backdrop: 'nnb-modal-backdrop nnb-modal-backdrop--nested',
        base: 'nnb-legal-modal-base',
      }}
    >
      <ModalContent>
        {(modalOnClose) => (
          <>
            <ModalHeader className="p-0 h-0 min-h-0" />

            <ModalBody className="px-12 py-12 sm:px-6 sm:py-8 relative">
              {/* X zatvaranje — gore desno, kao na dizajnu */}
              <button
                type="button"
                onClick={modalOnClose}
                aria-label="Zatvori"
                className="absolute top-6 right-8 sm:top-4 sm:right-5 z-10 text-[#555] hover:text-[#261A54] transition-colors"
              >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M3 3L23 23M23 3L3 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              {/* ── Uslovi korišćenja ─────────────────────────────────────── */}
              <h2 className="text-[#1B1B1B] text-3xl sm:text-2xl font-bold mb-5">
                Uslovi korišćenja
              </h2>

              {expanded.terms ? (
                <div className="mb-2">
                  <ExhibitionTermsContent compact />
                  <div className="mt-2"><ReadMore section="terms" /></div>
                </div>
              ) : (
                <p className="text-[#1B1B1B] text-base sm:text-sm leading-relaxed mb-2">
                  {TERMS_EXCERPT}{' '}
                  <ReadMore section="terms" />
                </p>
              )}

              {termsPdfUrl && (
                <p className="text-[#666] text-sm leading-relaxed mb-8">
                  Uslovi sa cenama kotizacija i satnicom za ovaj događaj:{' '}
                  <a
                    href={termsPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#56C4CF]"
                  >
                    otvorite dokument (PDF)
                  </a>
                  .
                </p>
              )}

              {!termsPdfUrl && <div className="mb-8" />}

              {/* ── Politika privatnosti ──────────────────────────────────── */}
              <h2 className="text-[#1B1B1B] text-3xl sm:text-2xl font-bold mb-5">
                Politika privatnosti
              </h2>

              {expanded.privacy ? (
                <div className="mb-8">
                  <PrivacyPolicyContent />
                  <div className="mt-2"><ReadMore section="privacy" /></div>
                </div>
              ) : (
                <p className="text-[#1B1B1B] text-base sm:text-sm leading-relaxed mb-8">
                  {PRIVACY_EXCERPT}{' '}
                  <ReadMore section="privacy" />
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  onAccept?.()
                  modalOnClose()
                }}
                className="w-full max-w-[390px] sm:max-w-none py-4 rounded-full bg-[#56C4CF] text-white font-semibold text-base hover:bg-[#3db8c4] transition-colors"
              >
                {acceptLabel}
              </button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LegalDocsModal
