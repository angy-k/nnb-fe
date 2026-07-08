'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Image from 'next/image'
import ExhibitorIcon from '@/icons/exhibitor-icon.svg'

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  showReserveButton = true,
  reserveLabel = 'Rezerviši mesto',
  onReserve,
}) => {
  // Nema description polja u API-ju — komponujemo ga iz dostupnih podataka
  const descriptionParts = [event?.dateTime, event?.eventAddress].filter(Boolean)
  const description = event?.description
    || event?.shortDescription
    || (descriptionParts.length ? descriptionParts.join(' · ') : null)

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
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[860px]',
        body: 'p-0',
      }}
    >
      <ModalContent className="rounded-2xl overflow-hidden">
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div className="flex flex-row min-h-[420px]">

              {/* Leva strana — cover slika */}
              <div className="w-1/2 relative overflow-hidden bg-[#261A54] flex-shrink-0">
                {event?.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event?.name || event?.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#261A54] flex items-end justify-center pb-0">
                    <Image
                      src={ExhibitorIcon}
                      width={220}
                      height={251}
                      alt="Izlagač"
                    />
                  </div>
                )}
              </div>

              {/* Desna strana — sadržaj */}
              <div
                className="w-1/2 relative flex flex-col justify-between p-8"
                style={{ background: 'linear-gradient(to bottom, #ffffff 60%, #dff4f5 100%)' }}
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

                {/* Tekst */}
                <div className="flex flex-col gap-4 pr-8">
                  <h2 className="text-[#261A54] font-bold leading-snug" style={{ fontSize: '24px' }}>
                    {event?.name || event?.title}
                  </h2>

                  {description && (
                    <p className="text-[#555] leading-relaxed" style={{ fontSize: '15px' }}>
                      {description}
                    </p>
                  )}
                </div>

                {/* Dugme */}
                {showReserveButton && (
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => onReserve?.()}
                      style={{
                        backgroundColor: '#EC4923',
                        borderRadius: '30px',
                        padding: '10px 28px',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '15px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {reserveLabel}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EventDetailsModal
