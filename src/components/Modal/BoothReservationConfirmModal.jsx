'use client'

import { Modal, ModalContent, ModalBody } from '@nextui-org/modal'
import OKVIR from './shellStyle'
import Link from 'next/link'

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
      color, fontWeight: '600', fontSize: '14px', marginBottom: '20px',
    }}>
      <span>⏱</span>
      <span>Sesija ističe za {formatted}</span>
    </div>
  )
}

// ── Teal checkmark SVG ───────────────────────────────────────────────────────
const CheckmarkIcon = () => (
  // Mereno na izvozu: 92 na okviru od 1920, dakle 89 ovde. Bilo je 72.
  <svg width="89" height="89" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="36" fill="#56C4CF" />
    <path d="M20 37L30 48L52 26" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const fmt = (n) => Number.isFinite(n) && n >= 0 ? `${n.toLocaleString('sr-RS')} RSD` : null

const CostRow = ({ label, value }) => {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee', fontSize: '15px', color: '#261A54' }}>
      <span>{label}</span>
      <span style={{ fontWeight: '600' }}>{value}</span>
    </div>
  )
}

/**
 * @param covered  šta pokriva gratis nastup iz paketa, npr. ['kotizacija']
 *
 * Bez ovoga bi pokrivena stavka pisala „0 RSD", pa izlagač ne bi znao da li je
 * cena nula zato što je paket pokriva ili zato što je sistem nije izračunao —
 * a ta druga mogućnost je već jednom bila stvarna.
 */
const CostSummary = ({ costs, covered = [] }) => {
  if (!costs) return null
  const { cotization, zoneCost, electricity, marketing } = costs
  const total = (Number(cotization) || 0) + (Number(zoneCost) || 0) + (Number(electricity) || 0) + (Number(marketing) || 0)
  const paket = 'Pokriveno paketom'
  return (
    <div style={{ width: '100%', maxWidth: '420px', background: '#f8f9fb', borderRadius: '12px', padding: '16px 20px', marginBottom: '8px' }}>
      <CostRow label="Kotizacija" value={covered.includes('kotizacija') ? paket : fmt(cotization)} />
      <CostRow label="Dodatak za zonu" value={fmt(zoneCost)} />
      <CostRow label="Strujni priključak" value={fmt(electricity)} />
      <CostRow label="Reklamiranje" value={covered.includes('oglasavanje') ? paket : fmt(marketing)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '16px', fontWeight: '700', color: '#261A54' }}>
        <span>Ukupno</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  )
}

const BoothReservationConfirmModal = ({
  isOpen,
  onClose,
  title = 'Da li želite da rezervišete tezgu?',
  eventName = '',
  costs = null,
  // Šta na ovoj prijavi pokriva gratis nastup iz paketa
  coveredByPackage = [],
  onConfirm,
  onCancel,
  isLoading = false,
  successMessage = null,
  errorMessage = null,
  onDismissMessage,
  confirmLabel = 'Rezerviši tezgu',
  cancelLabel = 'Poništi rezervaciju',
  timeRemaining = null,
  selectedStand = null,
  // Kad je rezervacija prošla na mapi, dizajn traži poseban ekran koji
  // potvrđuje baš tezgu za koju je zahtev poslat, umesto opšte poruke.
  onStandSuccess = null,
  standSuccessLabel = 'Vratite se na mapu',
}) => {
  const isSuccess = !!successMessage
  const jeUspehTezge = isSuccess && !!onStandSuccess && !!selectedStand

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
        base: `shadow-2xl w-[calc(100vw-2rem)] max-w-[${OKVIR.sirina}px]`,
        body: 'p-0',
      }}
    >
      <ModalContent className="overflow-hidden" style={{ borderRadius: `${OKVIR.radijus}px` }}>
        {(modalOnClose) => (
          <ModalBody className="p-0">
            <div
              className="relative flex flex-col"
              style={{ background: OKVIR.preliv }}
            >
              {/* X close — na ekranu uspešne rezervacije tezge vodi tamo gde i
                  dugme. Inače bi zatvaranje ostavilo izlagača na mapi, a tezga
                  je već uzeta, pa mu tu više nema šta. */}
              <button
                type="button"
                onClick={jeUspehTezge ? () => onStandSuccess() : modalOnClose}
                className="absolute z-20 text-[#261A54] opacity-75 hover:opacity-100 transition"
                style={{ top: `${OKVIR.iks.vrh}px`, right: `${OKVIR.iks.desno}px`, lineHeight: 0 }}
                aria-label="Zatvori"
              >
                <svg width={OKVIR.iks.velicina} height={OKVIR.iks.velicina} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>

              {jeUspehTezge ? (
                /* ── Tezga je rezervisana ─────────────────────────────────────
                   Mere sa izvoza `Tezga-rezervisana`: modal 1440 × 489, naslov
                   na 181 od vrha, dugme 277 × 59 na 257, ispod njega 173. */
                <div className="flex flex-col items-center text-center sm:px-6 sm:py-10" style={{ padding: `${177}px ${119}px ${169}px` }}>
                  <h2 style={{ fontSize: `${OKVIR.naslov}px`, fontWeight: '700', color: '#261A54', margin: 0, lineHeight: 1.2 }}>
                    {`Tezga broj ${selectedStand} je rezervisana`}
                  </h2>
                  <button
                    type="button"
                    onClick={() => onStandSuccess()}
                    style={{
                      background: '#56C4CF', color: '#ffffff', border: 'none',
                      borderRadius: '29px', width: '269px', height: '57px',
                      fontWeight: '600', fontSize: '18px', cursor: 'pointer',
                      marginTop: '32px',
                    }}
                  >
                    {standSuccessLabel}
                  </button>
                </div>
              ) : isSuccess ? (
                /* ── Success screen ───────────────────────────────────────────
                   Mere sa izvoza `Prijava-poslata`: ikona 92 na 147 od vrha,
                   naslov 33px sa korakom reda 43, pasusi 21px, ispod 141. */
                <div className="flex flex-col items-center text-center sm:px-6 sm:py-10" style={{ padding: `${143}px ${119}px ${138}px`, gap: 0 }}>
                  <CheckmarkIcon />

                  <h2 style={{ fontSize: `${OKVIR.naslov}px`, fontWeight: '700', color: '#261A54', lineHeight: 1.27, margin: '46px 0 0' }}>
                    {eventName
                      ? `Vaša rezervacija na ${eventName} je uspešno poslata!`
                      : 'Vaša rezervacija je uspešno poslata!'}
                  </h2>

                  <p style={{ fontSize: '21px', color: '#261A54', margin: '39px 0 0', maxWidth: '760px' }}>
                    Sve neophodne instrukcije za plaćanje će Vam stići putem emaila.
                  </p>

                  <p style={{ fontSize: '21px', color: '#261A54', margin: '27px 0 0', maxWidth: '760px' }}>
                    Status Vaše rezervacije možete pratiti na stranici{' '}
                    <Link
                      href="/moje-rezervacije"
                      style={{ color: '#56C4CF', fontWeight: '600', textDecoration: 'underline' }}
                    >
                      Moje rezervacije
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                /* ── Confirm screen ───────────────────────────────────────────
                   Mere sa izvoza `Tezga-potvrda`: naslov na 166 od vrha, dugmad
                   59 visoka na 242, razmak 40, ispod njih 188. */
                <div className="flex flex-col items-center text-center sm:px-6 sm:py-10 gap-8 sm:gap-5" style={{ padding: `${157}px ${119}px ${183}px` }}>
                  <TimerChip timeRemaining={timeRemaining} />

                  {selectedStand && (
                    <div style={{
                      background: '#f0fbfc',
                      border: '2px solid #56C4CF',
                      borderRadius: '16px',
                      padding: '14px 28px',
                      marginBottom: '-16px',
                    }}>
                      <div style={{ fontSize: '13px', color: '#56C4CF', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Izabrano mesto
                      </div>
                      <div style={{ fontSize: '36px', fontWeight: '800', color: '#261A54', lineHeight: 1 }}>
                        {selectedStand}
                      </div>
                    </div>
                  )}

                  <h2 style={{ fontSize: `${OKVIR.naslov}px`, fontWeight: '700', color: '#261A54', margin: 0, lineHeight: 1.2 }}>
                    {title}
                  </h2>

                  {errorMessage && (
                    <div className="w-full max-w-[500px]">
                      <div className="rounded-xl px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200 flex items-start justify-between gap-3">
                        <div className="text-left">{errorMessage}</div>
                        {onDismissMessage && (
                          <button
                            type="button"
                            className="shrink-0 text-xs font-semibold opacity-70 hover:opacity-100"
                            onClick={() => onDismissMessage?.()}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <CostSummary costs={costs} covered={coveredByPackage} />

                  <div className="flex items-center gap-4 sm:flex-col sm:w-full">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => onConfirm?.()}
                      className="sm:w-full"
                      style={{
                        background: '#56C4CF', color: '#ffffff',
                        borderRadius: '29px', minWidth: '235px', height: '57px', padding: '0 32px',
                        fontWeight: '600', fontSize: '18px', border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {isLoading ? 'Slanje...' : confirmLabel}
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        onCancel?.()
                        modalOnClose()
                      }}
                      className="sm:w-full"
                      style={{
                        background: '#EC4923', color: '#ffffff',
                        borderRadius: '29px', minWidth: '235px', height: '57px', padding: '0 32px',
                        fontWeight: '600', fontSize: '18px', border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      {cancelLabel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default BoothReservationConfirmModal
