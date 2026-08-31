import SectionImage from '@/components/SectionImage';

const statusLabel = {
  waiting:   'Rezervacija na čekanju',
  approved:  'Uspešno rezervisano!',
  cancelled: 'Rezervacija otkazana',
  rejected:  'Rezervacija odbijena',
}

// Prethodne rezervacije koriste istu sivu boju za sve statuse
const STATUS_BG = '#C5C4C2'

/**
 * Mere sa izvoza dizajna (`Prethodne-rezervacije.png`, okvir 1920).
 *
 * Kartica je tamo široka koliko cela kolona sadržaja (1440), a kod nas 1352 —
 * kolona od 1400 umanjena za bočni razmak. Činilac je 0,94.
 *
 * Sve je ranije bilo osetno sitnije: kartica 120 umesto 208, slika 240 umesto
 * 462, naslov 16 umesto 34, pilula 44 umesto 55.
 */
const MERE = {
  visinaKartice: 208,   // 222
  radijus: 20,
  razmakKartica: 38,    // 41
  sirinaSlike: 462,     // 492
  tekstOdSlike: 51,     // 54
  vrhTeksta: 50,        // ink naslova na 57,5 od vrha kartice
  naslov: 34,           // 36
  naslovDoDatuma: 4,
  tekst: 21,            // 22
  datumDoPoslate: 32,
  pilulaSirina: 263,    // 280
  pilulaVisina: 55,     // 59
  pilulaVrh: 44,        // 47
  pilulaDesno: 46,      // 49,5
  pilulaTekst: 17,      // 18
  razmakStranica: 47,   // 50
}

// ── Pagination ─────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    // Always show: 1, 2, 3, ..., last
    const around = [page - 1, page, page + 1].filter(p => p > 3 && p < totalPages - 1)
    const core = Array.from(new Set([1, 2, 3, ...around, totalPages - 1, totalPages])).sort((a, b) => a - b)
    const result = []
    let prev = null
    for (const p of core) {
      if (prev && p - prev > 1) result.push('...')
      result.push(p)
      prev = p
    }
    return result
  }

  const btnBase = {
    minWidth: '36px', height: '36px', borderRadius: '50%', border: 'none',
    fontSize: '19px', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.15s',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
  }

  // U dizajnu je paginacija uz desnu ivicu kolone, a ne po sredini, i nijedan
  // broj nema ispunjen krug — sve je običan tekst. Tekuća strana se ovde ipak
  // razlikuje debljinom, jer bi inače korisnik ostao bez ijednog znaka gde je.
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: `${MERE.razmakStranica - 36}px`, paddingTop: '48px' }}>
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnBase, background: 'transparent', color: page === 1 ? '#ccc' : '#261A54' }}
        aria-label="Prethodna"
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#261A54' }}>...</span>
          : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                color: '#261A54',
                fontWeight: p === page ? '700' : '400',
              }}
            >
              {p}
            </button>
          )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnBase, background: 'transparent', color: page === totalPages ? '#ccc' : '#261A54' }}
        aria-label="Sledeća"
      >
        ›
      </button>
    </div>
  )
}

// ── MyPreviousReservations ─────────────────────────────────────────────────────
const MyPreviousReservations = ({ events = [], page = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="w-full pt-6 pb-4">
      <div className="flex flex-col" style={{ gap: `${MERE.razmakKartica}px` }}>
        {events.map((event, index) => (
          <div
            key={`prev-res-${index}`}
            className="flex flex-row bg-white overflow-hidden shadow-sm prev-reservation-card"
            style={{ height: `${MERE.visinaKartice}px`, borderRadius: `${MERE.radijus}px` }}
          >
            {/* Slika levo — u dizajnu ide preko cele visine kartice */}
            <div className="flex-shrink-0 prev-reservation-card-image" style={{ width: `${MERE.sirinaSlike}px`, height: '100%' }}>
              <SectionImage
                imageSrc={event.coverImage || '/card-component-default-image.png'}
                isGrey={true}
                width={MERE.sirinaSlike}
                height={MERE.visinaKartice}
                radius="0"
                altText="cover"
              />
            </div>

            {/* Content center */}
            <div
              className="flex flex-col flex-1"
              style={{ paddingLeft: `${MERE.tekstOdSlike}px`, paddingTop: `${MERE.vrhTeksta}px` }}
            >
              {event.title && (
                <span className="font-semibold text-[#C5C4C2]" style={{ fontSize: `${MERE.naslov}px`, lineHeight: 1.2 }}>
                  {event.title}
                </span>
              )}
              {event.date && (
                <span className="text-[#C5C4C2]" style={{ fontSize: `${MERE.tekst}px`, lineHeight: 1, marginTop: `${MERE.naslovDoDatuma}px` }}>
                  {event.date}
                </span>
              )}
              {event.applicationDate && (
                // Boja izvedena sa izvoza: (146,140,169) je #261A54 na oko 50%
                // providnosti preko belog. Ranije je stajalo 40%.
                <span className="text-[#261A54]/50" style={{ fontSize: `${MERE.tekst}px`, lineHeight: 1, marginTop: `${MERE.datumDoPoslate}px` }}>
                  {`Rezervacija poslata ${event.applicationDate}`}
                </span>
              )}
            </div>

            {/* Status pilula desno — u dizajnu je poravnata uz vrh, ne po sredini */}
            <div className="flex-shrink-0 prev-reservation-card-status" style={{ paddingTop: `${MERE.pilulaVrh}px`, paddingRight: `${MERE.pilulaDesno}px` }}>
              <div
                style={{
                  background: STATUS_BG, cursor: 'default',
                  width: `${MERE.pilulaSirina}px`, height: `${MERE.pilulaVisina}px`,
                  fontSize: `${MERE.pilulaTekst}px`,
                }}
                className="rounded-full text-white font-semibold whitespace-nowrap flex items-center justify-center"
              >
                {statusLabel[event.applicationStatus] || statusLabel.approved}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}

export default MyPreviousReservations;
