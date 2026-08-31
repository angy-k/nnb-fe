'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import LegalDocsModal from '@/components/Modal/LegalDocsModal'
import { CONSENT_PARTICIPATION } from '@/utils/consentTexts'

/**
 * Mere sa izvoza dizajna (`Opcije-rezervacije.png`, okvir 1920; modal 1066 × 923
 * → 1036 × 897 ovde, činilac 0,972).
 */
const M = {
  radijus: 47,        // ~48
  bok: 185,           // 190
  vrh: 115,           // ink prvog reda pitanja na 118,5
  pitanje: 33,        // ~34
  redPitanja: 1.37,   // korak reda 49 na slovima od 35
  pitanjeDoOpcija: 27,
  opcija: 22,         // ~23
  korakOpcija: 47,    // 48
  krug: 29,           // 30
  tacka: 15,          // 16
  krugDoTeksta: 19,   // 20
  opcijeDoPitanja: 44,
  opcijeDoDugmeta: 34,
  dugmeSirina: 202,   // 207,5
  dugmeVisina: 57,    // 59
  dno: 105,           // 108
}

// U dizajnu je kružica uvek puna i bleda, a izabranu označava tirkizna tačka u
// sredini. Ranije je bilo obrnuto — obrisna kružica koja se pri izboru cela
// oboji tirkizno, sa belom tačkom.
const RadioOption = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer" style={{ gap: `${M.krugDoTeksta}px` }} onClick={() => onChange(value)}>
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: `${M.krug}px`, height: `${M.krug}px`, background: '#D9D9D9' }}
    >
      {checked && (
        <div className="rounded-full" style={{ width: `${M.tacka}px`, height: `${M.tacka}px`, background: '#56C4CF' }} />
      )}
    </div>
    {/* Zbijen red: podrazumevani je viši od kružice, pa bi korak između opcija
        ispao 51 umesto izmerenih 47. */}
    <span className="text-[#261A54]" style={{ fontSize: `${M.opcija}px`, lineHeight: 1 }}>{label}</span>
  </label>
)

const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const TimerChip = ({ timeRemaining }) => {
  if (timeRemaining === null || timeRemaining === undefined) return null
  const formatted = formatTime(timeRemaining)
  // Tirkizna se čitala kao obična oznaka, pa korisnik nije shvatao da vreme
  // ističe. Sada je narandžasta od početka, a crvena u poslednjih pola minuta.
  const color = timeRemaining <= 30 ? '#EC4923' : '#F27D14'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 14px', borderRadius: '20px', border: `1.5px solid ${color}`,
      color, fontWeight: '600', fontSize: '14px', marginBottom: '16px',
    }}>
      <span>⏱</span>
      <span>Sesija ističe za {formatted}</span>
    </div>
  )
}

// Isti oblik iznosa kao u modalu potvrde rezervacije
const formatRsd = (n) => {
  const broj = Number(n)
  return Number.isFinite(broj) && broj > 0 ? `${broj.toLocaleString('sr-RS')} RSD` : null
}

const ReservationOptionsModal = ({
  isOpen,
  onClose,
  electricityOption,
  setElectricityOption,
  // Varijante strujnog priključka sa događaja: [{ id, powerKw, price, label }].
  // Prazna lista znači da događaj struju uopšte ne nudi.
  electricityOptions = [],
  // Da li izabrano mesto uopšte dozvoljava priključak. Po mapi organizatora
  // struja postoji samo na označenim pozicijama, ne u celom redu.
  electricityAllowed = true,
  marketingOption,
  setMarketingOption,
  onSubmit,
  submitLabel = 'Prijavite se',
  showCancel = false,
  cancelLabel = 'Otkaži',
  timeRemaining = null,
  termsPdfUrl = null,
  // Dani događaja i izbor za koje se izlagač prijavljuje. Na mapi ovaj izbor
  // već postoji; u toku sa kalendara ga nije bilo, pa se prijava mogla poslati
  // samo za jedan dan — onaj koji je kliknut u kalendaru.
  eventDays = [],
  selectedDayIds = [],
  setSelectedDayIds = null,
}) => {
  const jeViseDnevni = Array.isArray(eventDays) && eventDays.length > 1
  const sviDani = eventDays.map((d) => d.id)
  const izabraniSvi = jeViseDnevni && sviDani.length > 0 && sviDani.every((id) => selectedDayIds.includes(id))
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLegalOpen, setIsLegalOpen] = useState(false)

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
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[1036px]',
        body: 'p-0',
      }}
    >
      <ModalContent className="overflow-hidden" style={{ borderRadius: `${M.radijus}px` }}>
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div
              className="relative flex flex-col"
              // Preliv izveden iz piksela na izvozu: plavičasto dole levo (#D1EAEE),
              // ka skoro beloj desno (#F5F6F8).
              style={{ background: 'linear-gradient(to top right, #d1eaee 0%, #e4ebf0 35%, #f5f6f8 75%)' }}
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

              {/* Skrol je bio uključen samo na telefonu. Kod višednevnog
                  događaja sadržaja ima znatno više — izbor dana, struja,
                  reklama i saglasnost — pa je modal na računaru izlazio van
                  ekrana i donje opcije se nisu mogle videti ni dohvatiti. */}
              <div
                className="sm:p-6 sm:pt-16 sm:pb-8"
                style={{ padding: `${M.vrh}px ${M.bok}px ${M.dno}px`, maxHeight: '85dvh', overflowY: 'auto' }}
              >
                <TimerChip timeRemaining={timeRemaining} />

                {/* Broj dana — samo kod višednevnih događaja. Bez ovoga se
                    prijava sa kalendara slala uvek za jedan dan, pa je izlagač
                    morao da ponavlja postupak za svaki dan posebno. */}
                {jeViseDnevni && setSelectedDayIds && (
                  <>
                    <h2 className="text-[#261A54] font-bold sm:text-lg" style={{ fontSize: `${M.pitanje}px`, lineHeight: M.redPitanja, marginBottom: `${M.pitanjeDoOpcija}px` }}>
                      Za koliko dana se prijavljujete?
                    </h2>
                    <div className="flex flex-col sm:mb-6" style={{ gap: `${M.korakOpcija - M.krug}px`, marginBottom: `${M.opcijeDoPitanja}px` }}>
                      <RadioOption
                        name="dani"
                        value="jedan"
                        checked={!izabraniSvi}
                        onChange={() => setSelectedDayIds(selectedDayIds.slice(0, 1).length ? selectedDayIds.slice(0, 1) : sviDani.slice(0, 1))}
                        label="Prijavljujem se za 1 dan"
                      />
                      <RadioOption
                        name="dani"
                        value="svi"
                        checked={izabraniSvi}
                        onChange={() => setSelectedDayIds(sviDani)}
                        label={`Prijavljujem se za sve dane (${sviDani.length})`}
                      />
                    </div>
                  </>
                )}

                <h2 className="text-[#261A54] font-bold sm:mb-5 sm:text-lg" style={{ fontSize: `${M.pitanje}px`, lineHeight: M.redPitanja, marginBottom: `${M.pitanjeDoOpcija}px` }}>
                  Da li Vam je osim osvetljenja potreban strujni priključak za
                  određeni uređaj neophodan za izlaganje?
                </h2>

                <div className="flex flex-col sm:mb-6" style={{ gap: `${M.korakOpcija - M.krug}px`, marginBottom: `${M.opcijeDoPitanja}px` }}>
                  {!electricityAllowed || electricityOptions.length === 0 ? (
                    <p className="text-[#555] text-sm">
                      {electricityOptions.length === 0
                        ? 'Strujni priključak nije predviđen na ovom događaju.'
                        : 'Na izabranom mestu strujni priključak nije moguć. Ako Vam je potreban, izaberite neko od označenih mesta na mapi.'}
                    </p>
                  ) : (
                    electricityOptions.map((opcija) => (
                      <RadioOption
                        key={opcija.id}
                        name="electricity"
                        value={String(opcija.id)}
                        checked={electricityOption === String(opcija.id)}
                        onChange={setElectricityOption}
                        label={`Da, potreban nam je strujni priključak ${opcija.label}`
                          + (opcija.price ? ` — ${formatRsd(opcija.price)}` : '')}
                      />
                    ))
                  )}
                  <RadioOption
                    name="electricity"
                    value="none"
                    checked={electricityOption === 'none'}
                    onChange={setElectricityOption}
                    label="Ne, strujni priključak nam nije potreban"
                  />
                </div>

                <h3 className="text-[#261A54] font-bold sm:text-lg" style={{ fontSize: `${M.pitanje}px`, lineHeight: M.redPitanja, marginBottom: `${M.pitanjeDoOpcija}px` }}>
                  Da li vam je potrebna reklama?
                </h3>

                <div className="flex flex-col sm:mb-6" style={{ gap: `${M.korakOpcija - M.krug}px`, marginBottom: `${M.opcijeDoDugmeta}px` }}>
                  <RadioOption
                    name="marketing"
                    value="instagram"
                    checked={marketingOption === 'instagram'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na instagramu"
                  />
                  <RadioOption
                    name="marketing"
                    value="facebook"
                    checked={marketingOption === 'facebook'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na fejsbuku"
                  />
                  <RadioOption
                    name="marketing"
                    value="instagram_facebook"
                    checked={marketingOption === 'instagram_facebook'}
                    onChange={setMarketingOption}
                    label="Da, potrebna nam je na instagramu i fejsbuku"
                  />
                  <RadioOption
                    name="marketing"
                    value="none"
                    checked={marketingOption === 'none'}
                    onChange={setMarketingOption}
                    label="Ne, nije nam potrebna reklama"
                  />
                </div>

                {/* T&C checkbox */}
                <label
                  className="flex items-start gap-3 cursor-pointer mb-6"
                  onClick={() => setTermsAccepted(v => !v)}
                >
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={{
                      borderColor: termsAccepted ? '#56C4CF' : '#d1d5db',
                      backgroundColor: termsAccepted ? '#56C4CF' : 'transparent',
                    }}
                  >
                    {termsAccepted && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-[#261A54] leading-snug select-none">
                    Prihvatam{' '}
                    {termsPdfUrl ? (
                      <a
                        href={termsPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#56C4CF]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        opšte uslove izlaganja
                      </a>
                    ) : (
                      <span>opšte uslove izlaganja</span>
                    )}
                    {'. '}
                    {/* Propisana saglasnost za obradu podataka o ličnosti */}
                    {CONSENT_PARTICIPATION.before}
                    <button
                      type="button"
                      className="underline text-[#56C4CF]"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setIsLegalOpen(true)
                      }}
                    >
                      {CONSENT_PARTICIPATION.linkLabel}
                    </button>
                    {CONSENT_PARTICIPATION.after}
                  </span>
                </label>

                {/* Uz opšta pravila ide i dokument sa cenama i satnicom ovog događaja */}
                <LegalDocsModal
                  isOpen={isLegalOpen}
                  onOpenChange={setIsLegalOpen}
                  termsPdfUrl={termsPdfUrl}
                  acceptLabel="Prihvatam"
                  onAccept={() => setTermsAccepted(true)}
                />

                <div className="flex items-center gap-4 sm:flex-col sm:w-full">
                  <button
                    onClick={() => onSubmit?.()}
                    disabled={!termsAccepted}
                    className="bg-[#56C4CF] hover:opacity-90 text-white rounded-full font-semibold transition sm:w-full"
                    style={{
                      width: `${M.dugmeSirina}px`, height: `${M.dugmeVisina}px`, fontSize: '18px',
                      opacity: termsAccepted ? 1 : 0.45,
                      cursor: termsAccepted ? 'pointer' : 'not-allowed',
                    }}
                    type="button"
                  >
                    {submitLabel}
                  </button>

                  {showCancel && (
                    <button
                      onClick={modalOnClose}
                      className="text-[#261A54] px-8 py-3 rounded-full font-semibold border border-[#261A54] hover:opacity-80 transition text-sm sm:w-full"
                      type="button"
                    >
                      {cancelLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ReservationOptionsModal
