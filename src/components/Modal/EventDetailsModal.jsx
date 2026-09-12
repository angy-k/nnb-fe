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
  // Kod višednevnog događaja naslov nosi i redni broj dana ("… — 2. dan"),
  // a datum i vreme se odnose na taj dan, ne na ceo događaj.
  const day = event?._day || null
  const title = event?._dayLabel || event?.name || event?.title || ''

  // `_day` postavlja samo kalendar, jer se tamo klikće na bedž konkretnog dana.
  // Sa liste kartica stiže ceo događaj, pa se datum i vreme čitaju iz `days[]`.
  // Bez ovoga bi se pao na `dateTime` — staru kolonu koja nema vreme završetka.
  const days = Array.isArray(event?.days) ? event.days : []

  const whenLine = (() => {
    if (day) {
      return [day.date, day.timeRange].filter(Boolean).join(' · ')
    }

    if (days.length === 1) {
      return [days[0]?.date, days[0]?.timeRange].filter(Boolean).join(' · ')
    }

    if (days.length > 1) {
      // Više dana bez izabranog: raspon datuma, pa vreme ako je svih dana isto.
      const prvi = days[0]
      const poslednji = days[days.length - 1]
      const raspon = [prvi?.date, poslednji?.date].filter(Boolean).join(' – ')
      const istoVreme = days.every((d) => d?.timeRange && d.timeRange === prvi?.timeRange)

      return [raspon, istoVreme ? prvi.timeRange : null].filter(Boolean).join(' · ')
    }

    return event?.dateTime
  })()

  // Nema description polja u API-ju — komponujemo ga iz dostupnih podataka
  const descriptionParts = [whenLine, event?.eventAddress].filter(Boolean)
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
        // Modal zauzima celu kolonu sadržaja: u dizajnu ide od x 240 do 1680,
        // dakle 1440 širine, a visina 853 (vizual 717 sa po 68px odozgo i
        // odozdo). Ranije je ovde stajalo 955 — mera svedena sa pogrešno
        // očitanih 1273 na činilac 0,75.
        // `bg-white` bez uzvičnika ne prolazi — NextUI svojoj `bg-content1`
        // postavlja #F0F0F0, a leva strana je u dizajnu čisto bela.
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[var(--nnb-kolona)] !bg-white',
        body: 'p-0',
      }}
    >
      <ModalContent className="rounded-[30px] overflow-hidden">
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div className="flex flex-row sm:flex-col">

              {/* Leva strana — kvadratni vizual događaja na beloj podlozi.

                  Mereno sa izvoza Figme (okvir 1920): modal je 1440 × 853, a
                  vizual kvadrat 717 × 717 uvučen 61px sa leve strane i 68px
                  odozgo — dakle 54% širine za levu stranu, 4,24% uvlačenja sa
                  strane i 4,72% odozgo. Procenti u padding-u se računaju od
                  širine reditelja, a to je ovde ceo modal, pa jedna vrednost
                  drži i uvlačenje i veličinu.

                  Ranije je ovde stajala tamnoljubičasta ploha preko cele visine
                  sa slikom u `object-cover` — dakle druga zamisao, a vizual nije
                  bio kvadratan. */}
              <div
                className="w-[54%] sm:w-full flex-shrink-0 flex items-center justify-center pl-[4.24%] pt-[4.72%] pb-[4.72%] pr-0 sm:p-5"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="w-full aspect-square rounded-[30px] overflow-hidden bg-[#261A54] flex items-center justify-center">
                  {event?.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={ExhibitorIcon}
                      width={220}
                      height={251}
                      alt="Izlagač"
                      className="w-[42%] h-auto"
                    />
                  )}
                </div>
              </div>

              {/* Desna strana — sadržaj */}
              {/* Desna strana — sadržaj.

                  U dizajnu naslov, opis i dugme stoje kao jedna grupa po sredini
                  visine, a ne razmaknuti na vrh i dno. Naslov počinje na x 854,
                  a leva strana se završava na 778 — dakle 76px odmaka, što je
                  5,28% širine modala. */}
              <div
                className="w-[46%] sm:w-full relative flex flex-col justify-center gap-[87px] px-[5.28%] py-8 sm:gap-4 sm:p-5"
                style={{ backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(86, 196, 207, 0.3) 0%, rgba(86, 196, 207, 0) 70%)' }}
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
                {/* Razmaci su iz dizajna, sada doslovno: naslov stoji na y 261 i
                    visok je 49, opis počinje na 356 — dakle 46px između; opis se
                    završava na 402, dugme počinje na 489 — 87px.

                    Procenti ovde ne rade: razmak u koloni se računa od visine
                    panela, a nju određuje susedna kolona, pa nema unapred poznatu
                    vrednost i pravilo tiho ispadne nula. */}
                <div className="flex flex-col gap-[46px] sm:gap-4 sm:pt-9">
                  <h2 className="text-[#261A54] font-bold" style={{ fontSize: '36px', lineHeight: '49px' }}>
                    {title}
                  </h2>

                  {description && (
                    <p className="text-[#555]" style={{ fontSize: '17px', lineHeight: '23px' }}>
                      {description}
                    </p>
                  )}
                </div>

                {/* Dugme */}
                {showReserveButton && (
                  <div className="sm:mt-4">
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
