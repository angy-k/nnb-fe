'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import SaglasnostIzlaganja from '@/components/Reservations/SaglasnostIzlaganja'

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
  <label className="flex items-center cursor-pointer" style={{ gap: 'var(--om-krug-tekst)' }} onClick={() => onChange(value)}>
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: 'var(--om-krug)', height: 'var(--om-krug)', background: '#D9D9D9' }}
    >
      {checked && (
        <div className="rounded-full" style={{ width: 'var(--om-tacka)', height: 'var(--om-tacka)', background: '#56C4CF' }} />
      )}
    </div>
    {/* Zbijen red: podrazumevani je viši od kružice, pa bi korak između opcija
        ispao 51 umesto izmerenih 47. */}
    <span className="text-[#261A54]" style={{ fontSize: 'var(--om-opcija)', lineHeight: 1.25 }}>{label}</span>
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
  // Saglasnost može da drži stranica, kad ista kvačica stoji i u modalu
  // potvrde (mapa tezgi). Tokovi sa kalendara i sa kartice događaja šalju
  // prijavu odavde, nemaju drugi korak, pa im modal drži svoje stanje.
  termsAccepted = false,
  setTermsAccepted = null,
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

  const [sopstvenaSaglasnost, setSopstvenaSaglasnost] = useState(false)
  const saglasan = setTermsAccepted ? termsAccepted : sopstvenaSaglasnost
  const promeniSaglasnost = setTermsAccepted || setSopstvenaSaglasnost

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
              className="relative flex flex-col opcije-modal"
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
                className=""
                style={{ padding: 'var(--om-vrh) var(--om-bok) var(--om-dno)', maxHeight: '85dvh', overflowY: 'auto' }}
              >
                <TimerChip timeRemaining={timeRemaining} />

                {/* Broj dana — samo kod višednevnih događaja. Bez ovoga se
                    prijava sa kalendara slala uvek za jedan dan, pa je izlagač
                    morao da ponavlja postupak za svaki dan posebno. */}
                {jeViseDnevni && setSelectedDayIds && (
                  <>
                    <h2 className="text-[#261A54] font-bold" style={{ fontSize: 'var(--om-pitanje)', lineHeight: M.redPitanja, marginBottom: 'var(--om-pitanje-opcije)' }}>
                      Za koliko dana se prijavljujete?
                    </h2>
                    <div className="flex flex-col" style={{ gap: 'var(--om-razmak-opcija)', marginBottom: 'var(--om-opcije-pitanje)' }}>
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

                <h2 className="text-[#261A54] font-bold" style={{ fontSize: 'var(--om-pitanje)', lineHeight: M.redPitanja, marginBottom: 'var(--om-pitanje-opcije)' }}>
                  Da li Vam je osim osvetljenja potreban strujni priključak za
                  određeni uređaj neophodan za izlaganje?
                </h2>

                <div className="flex flex-col" style={{ gap: 'var(--om-razmak-opcija)', marginBottom: 'var(--om-opcije-pitanje)' }}>
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

                <h3 className="text-[#261A54] font-bold" style={{ fontSize: 'var(--om-pitanje)', lineHeight: M.redPitanja, marginBottom: 'var(--om-pitanje-opcije)' }}>
                  Da li vam je potrebna reklama?
                </h3>

                <div className="flex flex-col" style={{ gap: 'var(--om-razmak-opcija)', marginBottom: 'var(--om-opcije-dugme)' }}>
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

                <SaglasnostIzlaganja
                  prihvaceno={saglasan}
                  naPromenu={promeniSaglasnost}
                  termsPdfUrl={termsPdfUrl}
                  className="mb-6"
                />

                <div className="flex items-center gap-4 sm:flex-col sm:w-full">
                  <button
                    onClick={() => onSubmit?.()}
                    disabled={!saglasan}
                    className="bg-[#56C4CF] hover:opacity-90 text-white rounded-full font-semibold transition sm:w-full"
                    style={{
                      width: 'var(--om-dugme-s)', height: 'var(--om-dugme-v)', fontSize: '18px',
                      opacity: saglasan ? 1 : 0.45,
                      cursor: saglasan ? 'pointer' : 'not-allowed',
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
