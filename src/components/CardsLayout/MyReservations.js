import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import SectionImage from '@/components/SectionImage';

const statusConfig = {
  waiting:   { label: 'Rezervacija na čekanju', bg: '#FACE06' },
  approved:  { label: 'Uspešno rezervisano',    bg: '#56C4CF' },
  cancelled: { label: 'Rezervacija otkazana',   bg: '#EC4923' },
  rejected:  { label: 'Rezervacija odbijena',   bg: '#EC4923' },
}

/**
 * Mere kartice, sve sa izvoza dizajna (`Moje-rezervacije.png`, okvir 1920).
 *
 * Kartica je tamo 462 široka, a kod nas 435 — tri u koloni od 1352 sa razmakom
 * 24. Činilac je zato 0,94, i njime je prošlo sve ispod.
 *
 * Provera koja je uverila da su mere tačne: zbir svih razmaka i visina u beloj
 * zoni (34,5 + 36 + 11,5 + 16,5 + 41 + 22 + 43,5 + 59 + 20 + 59 + 50) daje 393,
 * tačno koliko ta zona i jeste visoka na izvozu.
 *
 * Slova su ranije bila osetno sitnija od dizajna — naslov 18 umesto 34, datumi
 * 14 umesto 21.
 */
const MERE = {
  vrh: 32,               // 34,5
  bok: 30,               // 32
  dno: 47,               // 50
  naslov: 34,            // 36
  tekst: 21,             // 22
  // Razmaci su na izvozu mereni između samih slova, a margine u pregledaču
  // kreću od reda teksta, koji je viši od slova. Zato su ovde niži nego mera sa
  // slike — inače je kartica ispadala 36px viša. Uz to su redovi teksta zbijeni
  // (`lineHeight` ispod), da razlika bude predvidiva.
  naslovDoDatuma: 4,     // ink razmak 11,5
  datumDoPoslate: 33,    // ink razmak 41
  poslataDoPilule: 41,   // 43,5
  visinaPilule: 55,      // 59
  tekstPilule: 17,       // 18
  piluleRazmak: 19,      // 20
  // 318 od 462 je 68,8% *kartice*; unutar nje ostaje 398 posle bočnog razmaka,
  // pa je udeo u odnosu na taj prostor 80%.
  sirinaPilule: '80%',
  visinaRedaNaslova: 1.2,
  visinaRedaTeksta: 1,
}

const MyReservations = ({ events = [], onCancelClick = null }) => {
  return (
    <div className="w-full pt-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const status = statusConfig[event.applicationStatus] || statusConfig.waiting
          const canCancel = event.applicationStatus === 'waiting' || event.applicationStatus === 'approved'

          return (
            <div
              key={`reservation-${index}`}
              className="flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm"
            >
              {/* Cover image — links to event */}
              <Link
                prefetch={false}
                href={`/dogadjaj/${formatTitleForUri(event.title)}`}
                className="block flex-shrink-0"
              >
                {/* Plakat je u dizajnu kvadratan — mereno 462 × 465 u kartici
                    širine 462. Ranije je stajala čvrsta visina od 280, pa je
                    ispadao znatno niži i sekao plakat. */}
                <SectionImage
                  imageSrc={event.coverImage || '/event-cover.svg'}
                  width={465}
                  height={465}
                  square
                  radius="0"
                  altText="cover"
                />
              </Link>

              {/* Content — mere sa izvoza dizajna, srazmerno umanjene */}
              <div className="flex flex-col flex-1" style={{ padding: `${MERE.vrh}px ${MERE.bok}px ${MERE.dno}px` }}>
                {event.title && (
                  <span className="font-bold text-[#261A54]" style={{ fontSize: `${MERE.naslov}px`, lineHeight: MERE.visinaRedaNaslova }}>
                    {event.title}
                  </span>
                )}
                {event.date && (
                  <span className="text-[#261A54]" style={{ fontSize: `${MERE.tekst}px`, lineHeight: MERE.visinaRedaTeksta, marginTop: `${MERE.naslovDoDatuma}px` }}>
                    {event.date}
                  </span>
                )}
                {event.applicationDate && (
                  <span className="text-[#261A54]/50" style={{ fontSize: `${MERE.tekst}px`, lineHeight: MERE.visinaRedaTeksta, marginTop: `${MERE.datumDoPoslate}px` }}>
                    {`Rezervacija poslata ${event.applicationDate}`}
                  </span>
                )}

                {/* Pilula i dugme nisu preko cele širine — u dizajnu su uži od
                    teksta iznad i usredišćeni. Zato udeo, a ne piksli: širina
                    prati karticu i na užim ekranima. */}
                <div
                  className="flex flex-col items-center"
                  style={{ marginTop: `${MERE.poslataDoPilule}px`, gap: `${MERE.piluleRazmak}px` }}
                >
                  <div
                    style={{ background: status.bg, cursor: 'default', width: MERE.sirinaPilule, height: `${MERE.visinaPilule}px`, fontSize: `${MERE.tekstPilule}px` }}
                    className="rounded-full text-white font-semibold flex items-center justify-center text-center px-3"
                  >
                    {status.label}
                  </div>

                  {/* Cancel button — waiting & approved */}
                  {canCancel && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); onCancelClick?.(event) }}
                      style={{ width: MERE.sirinaPilule, height: `${MERE.visinaPilule}px`, fontSize: `${MERE.tekstPilule}px` }}
                      className="rounded-full border border-[#261A54] text-[#261A54] font-semibold bg-transparent hover:bg-[#261A54]/5 transition"
                    >
                      Otkaži rezervaciju
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyReservations;
