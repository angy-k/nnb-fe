'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import Image from 'next/image'
import ExhibitorIcon from '@/icons/exhibitor-icon.svg'
import { teamMemberName } from '@/utils/team'

/**
 * Ceo opis člana tima — isti okvir kao modal događaja.
 *
 * Mere su preuzete odatle i namerno se ne razlikuju: modal je 955 širok, leva
 * kolona 61% sa kvadratnim vizualom uvučenim 4,8% odnosno 5,3%, desna 39% sa
 * odmakom 6,1%. Visinu ne zadajemo — određuje je kvadrat sa leve strane, pa je
 * ista bez obzira na dužinu teksta.
 *
 * Zato opis mora da se pomera po vertikali: on je jedini deo koji ume da bude
 * duži od okvira. Da bi `overflow` uopšte proradio unutar flex kolone, svakom
 * pretku do njega treba `min-h-0` — bez toga se flex stavka ne skuplja ispod
 * visine sadržaja i traka se nikad ne pojavi.
 *
 * Dugme „Zatvori" ranije je stajalo u dnu; sada zatvara iks u uglu, kao i na
 * modalu događaja. Iks zove `onClose` koji stiže spolja, a ne onaj iz
 * `ModalContent` — to drugo je provereno ostajalo bez dejstva.
 */
const TeamMemberModal = ({ member, isOpen, onOpenChange, onClose }) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onClose={onClose}
    size="2xl"
    backdrop="blur"
    placement="center"
    hideCloseButton
    classNames={{
      backdrop: 'nnb-modal-backdrop',
      wrapper: 'nnb-modal-wrapper items-center justify-center',
      // `bg-white` bez uzvičnika ne prolazi — NextUI svojoj `bg-content1`
      // postavlja #F0F0F0, a leva strana je u dizajnu čisto bela.
      base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[955px] !bg-white',
      body: 'p-0',
    }}
  >
    <ModalContent className="rounded-2xl overflow-hidden">
      <ModalBody className="p-0">
        {/* Odnos stranica drži visinu modala.
            Na modalu događaja visinu je davao kvadrat sa leve strane, ali on
            određuje samo najmanju visinu reda — duži tekst sa desne strane
            svejedno razvlači ceo modal (mereno: 2894px umesto 638). Zato je
            odnos ovde zapisan: 955 × 638 je tačno ono što kvadrat i njegova
            uvlačenja daju (0,61 − 0,048 + 2 × 0,053 od širine), pa se ništa ne
            pomera, a desna kolona dobija gornju među unutar koje može da klizi.
            `min-h-0` mora uz to — bez njega se flex stavka ne skuplja ispod
            visine sadržaja i odnos tiho ostaje bez dejstva. */}
        <div className="flex flex-row sm:flex-col aspect-[955/638] sm:aspect-auto min-h-0">

          {/* Leva strana — fotografija u kvadratu na beloj podlozi.
              `object-top` jer su fotografije portretne: kvadrat ih seče odozdo,
              a ne kroz lice. */}
          <div
            className="w-[61%] sm:w-full flex-shrink-0 flex items-center justify-center pl-[4.8%] pt-[5.3%] pb-[5.3%] pr-0 sm:p-5"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Na telefonu se kolone slažu jedna ispod druge, pa kvadrat pune
                širine progura modal preko ekrana (mereno: 916px na prozoru od
                643). Zato je tamo vezan za visinu ekrana, a ne za širinu. */}
            <div className="w-full sm:w-auto sm:h-[38vh] aspect-square rounded-[30px] overflow-hidden bg-[#261A54] flex items-center justify-center">
              {member?.photo ? (
                <img
                  src={member.photo}
                  alt={teamMemberName(member)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <Image
                  src={ExhibitorIcon}
                  width={220}
                  height={251}
                  alt=""
                  aria-hidden="true"
                  className="w-[42%] h-auto"
                />
              )}
            </div>
          </div>

          {/* Desna strana — ime, uloga i opis */}
          <div
            className="w-[39%] sm:w-full relative flex flex-col justify-center min-h-0 overflow-hidden px-[6.1%] py-8 sm:p-5"
            style={{ background: 'linear-gradient(to bottom, #ffffff 40%, #dbf2f5 100%)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-6 z-20 text-[#555] text-xl font-light w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition"
              aria-label="Zatvori"
            >
              ✕
            </button>

            <div className="flex flex-col gap-[47px] sm:gap-4 sm:pt-9 min-h-0">
              <div className="flex-shrink-0">
                <h2 className="text-[#261A54] font-bold leading-snug" style={{ fontSize: '20px' }}>
                  {teamMemberName(member)}
                </h2>
                {member?.position && (
                  <p className="text-[#616161] mt-1" style={{ fontSize: '14px' }}>
                    {member.position}
                  </p>
                )}
              </div>

              {/* Prored se čuva preko `pre-wrap`, jer se opis u administraciji
                  unosi kao slobodan tekst i ume da ima prazne redove.

                  Bez `flex-1`: kratak opis tako ostaje sa naslovom po sredini
                  visine, kao na modalu događaja. Skupljanje i dalje radi jer
                  `overflow-y: auto` čini da `min-height: auto` padne na nulu. */}
              {member?.about && (
                <div className="min-h-0 overflow-y-auto nnb-tekst-scroll pr-3 sm:max-h-[28vh]">
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}
                  >
                    {member.about}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default TeamMemberModal
