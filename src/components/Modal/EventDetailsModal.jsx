'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Button from '@/components/Button'

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  showReserveButton = true,
  reserveLabel = 'Rezerviši mesto',
  onReserve,
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
        base: 'bg-white shadow-2xl w-[calc(100vw-2rem)] max-w-[1440px] max-h-[852px]',
        body: 'bg-white p-0 overflow-y-auto max-h-[852px]',
        header: 'bg-white border-b border-gray-200',
        footer: 'bg-white border-t border-gray-200',
      }}
    >
      <ModalContent className="bg-white rounded-2xl overflow-hidden max-h-[852px]">
        {(modalOnClose) => (
          <>
            <ModalBody className="bg-white p-0 overflow-y-auto max-h-[852px]">
              <div className="relative flex flex-col md:flex-row max-h-[852px]">
                <button
                  type="button"
                  onClick={modalOnClose}
                  className="absolute top-4 right-4 z-20 text-[#261A54] text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                  aria-label="Close"
                >
                  ×
                </button>

                <div className="md:w-1/2 relative overflow-hidden bg-[#F0F0F0] min-h-[280px]">
                  {event?.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event?.name || event?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700" />
                  )}
                </div>

                <div className="md:w-1/2 p-10 flex flex-col gap-8 max-h-[852px]">
                  <div className="min-w-0">
                    <div className="text-[#261A54] text-3xl font-bold break-words">
                      {event?.name || event?.title}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4 text-[#1B1B1B]">
                      <div>
                        <div className="font-semibold">Datum i vreme</div>
                        <div>{event?.dateTime || '-'}</div>
                      </div>

                      <div>
                        <div className="font-semibold">Lokacija</div>
                        <div>{event?.eventAddress || '-'}</div>
                      </div>

                      <div>
                        <div className="font-semibold">Dostupno mesta</div>
                        <div>{event?.maxNumOfSeats ?? '-'}{event?.maxNumOfSeats ? ' mesta' : ''}</div>
                      </div>

                      <div>
                        <div className="font-semibold">Troškovi kotizacije</div>
                        <div>{event?.downPayment ?? '-'}{event?.downPayment ? ' RSD' : ''}</div>
                      </div>

                      <div>
                        <div className="font-semibold">Kontakt</div>
                        <div>{event?.eventContactEmail || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {showReserveButton && (
                    <div className="flex justify-end">
                      <Button type="outlined-orange" name={reserveLabel} onClick={() => onReserve?.()} />
                    </div>
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

export default EventDetailsModal
