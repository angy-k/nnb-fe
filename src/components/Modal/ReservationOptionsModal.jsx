'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import SaglasnostIzlaganja from '@/components/Reservations/SaglasnostIzlaganja'

/**
 * Mere sa izvoza dizajna (`Opcije-rezervacije.png`, okvir 1920; modal 1066 × 923
 * → ranije 1036 × 897 ovde, činilac 0,972. Otkako je kolona 1440, mere se
 * prepisuju doslovno: 1066 × 923.
 */
const M = {
  radijus: 50,        // po dizajnu
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
  // Prijavu po danu dopušta samo događaj kojem je to uključeno. Kod ostalih
  // prijava pokriva sve dane i naplaćuje se za sve — pa izbor dana ne sme ni
  // da se ponudi: server bi ga ignorisao, a iznos bi izlagača iznenadio.
  allowPerDay = false,
}) => {
  const jeViseDnevni = Array.isArray(eventDays) && eventDays.length > 1 && allowPerDay
  const sviDaniBezIzbora = Array.isArray(eventDays) && eventDays.length > 1 && !allowPerDay
  const sviDani = eventDays.map((d) => d.id)
  const izabraniSvi = jeViseDnevni && sviDani.length > 0 && sviDani.every((id) => selectedDayIds.includes(id))
  /* Kvačica „više dana" mora da bude zasebno stanje, ne samo posledica izbora:
     da je izvedena iz `selectedDayIds.length > 1`, ne bi se mogla ni uključiti —
     dok je isključena, klik na dan postavlja tačno taj jedan dan, pa se drugi
     nikad ne bi ni dodao. Uključuje se i sama, ako je već izabrano više dana
     (na primer kad se modal otvori sa kalendara). */
  const [rucnoViseDana, setRucnoViseDana] = useState(false)
  const viseDana = rucnoViseDana || selectedDayIds.length > 1

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
        base: 'shadow-2xl w-[calc(100vw-2rem)] max-w-[1066px]',
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

                {/* Izbor dana kod višednevnih događaja.
                 *
                 * Isti blok kao na stranici mape: istaknuta kartica sa kvačicom
                 * „Prijavljujem se za više dana" i dugmadima po danu, sa datumom
                 * i vremenom. Ranije su ovde stajala samo dva radio dugmeta —
                 * „1 dan" i „svi dani" — pa izlagač na događaju u drugom mestu
                 * nije imao načina da izabere *koji* dan mu treba. */}
                {jeViseDnevni && setSelectedDayIds && (
                  <div
                    className="rounded-2xl"
                    style={{ background: '#ffffff', border: '2px solid #EC4923', padding: '20px', marginBottom: 'var(--om-opcije-pitanje)' }}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={viseDana}
                        onChange={(e) => {
                          setRucnoViseDana(e.target.checked)
                          if (e.target.checked) return
                          // Gašenjem se vraća na jedan dan — onaj koji je već izabran
                          const prvi = selectedDayIds[0] ?? sviDani[0]
                          setSelectedDayIds(prvi ? [prvi] : [])
                        }}
                        className="w-6 h-6 accent-[#EC4923] cursor-pointer flex-shrink-0"
                      />
                      <span className="text-[#261A54] font-bold" style={{ fontSize: '26px', lineHeight: 1.15 }}>
                        Prijavljujem se za više dana
                      </span>
                    </label>

                    <p className="text-[#555] mt-3" style={{ fontSize: '17px' }}>
                      {viseDana
                        ? 'Izaberite dane. Prijava važi za sve izabrane dane.'
                        : 'Događaj traje više dana. Prijava za više dana je povoljnija od zbira pojedinačnih.'}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                      {eventDays.map((day) => {
                        const izabran = selectedDayIds.includes(day.id)
                        const jedini = selectedDayIds.length === 1 && izabran
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              if (!viseDana) {
                                setSelectedDayIds([day.id])
                              } else if (izabran) {
                                if (jedini) return
                                setSelectedDayIds(selectedDayIds.filter((id) => id !== day.id))
                              } else {
                                setSelectedDayIds([...selectedDayIds, day.id])
                              }
                            }}
                            className="rounded-xl border-2 px-4 py-3 text-left transition"
                            style={{
                              borderColor: izabran ? '#56C4CF' : '#e0e0e0',
                              background: izabran ? '#eafafb' : '#ffffff',
                              cursor: jedini && viseDana ? 'default' : 'pointer',
                            }}
                          >
                            <div className="text-[#261A54] font-bold" style={{ fontSize: '21px', lineHeight: 1.2 }}>
                              {day.dayNumber}. dan
                            </div>
                            <div className="text-[#555]" style={{ fontSize: '17px' }}>{day.date}</div>
                            {day.timeRange && (
                              <div className="text-[#888] text-sm mt-0.5">{day.timeRange}</div>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    <p className="text-[#555] mt-3" style={{ fontSize: '15px' }}>
                      Klikom na dan birate rezervaciju za izabrani dan.
                    </p>
                  </div>
                )}

                {/* Višednevni događaj bez prijave po danu: izbora nema, ali
                    izlagač mora da zna da se prijavljuje (i plaća) za sve dane. */}
                {sviDaniBezIzbora && (
                  <div
                    className="rounded-2xl"
                    style={{ background: '#ffffff', border: '2px solid #EC4923', padding: '20px', marginBottom: 'var(--om-opcije-pitanje)' }}
                  >
                    <p className="text-[#261A54] font-bold" style={{ fontSize: '21px', lineHeight: 1.2 }}>
                      Prijava važi za sve dane događaja
                    </p>
                    <p className="text-[#555] mt-2" style={{ fontSize: '17px' }}>
                      {eventDays.map((d) => d.date).filter(Boolean).join(' · ')}
                    </p>
                  </div>
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
