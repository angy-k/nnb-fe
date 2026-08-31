/**
 * Izbor sa uvodnog prozora — „Ja sam posetilac" ili „Ja sam izlagač".
 *
 * Do sada se nigde nije pamtio: `handleVisitor` je samo zatvarao prozor, a
 * `handleExhibitor` otvarao prijavu. Zbog toga je kalendar granao po tome da li
 * je korisnik ulogovan, pa je izlagač koji se još nije prijavio prolazio kao
 * posetilac — video je „Pogledajte instrukcije za registraciju", sekciju
 * očekivanih događaja i dugme „Postani izlagač", iako je već rekao da jeste
 * izlagač (Excel, list KALENDAR, stavke 8.0 i 9.0).
 *
 * Čuva se u kolačiću sesije, isto kao i sam prozor — izbor važi dok je
 * pretraživač otvoren, a novim dolaskom se opet pita.
 */
const KOLACIC = 'nnb_uloga'

export const POSETILAC = 'posetilac'
export const IZLAGAC = 'izlagac'

export const procitajUlogu = () => {
  if (typeof document === 'undefined') return null
  const nadjeno = document.cookie.match(new RegExp('(?:^|; )' + KOLACIC + '=([^;]*)'))
  const vrednost = nadjeno ? decodeURIComponent(nadjeno[1]) : null
  return vrednost === POSETILAC || vrednost === IZLAGAC ? vrednost : null
}

export const zapamtiUlogu = (uloga) => {
  if (typeof document === 'undefined') return
  document.cookie = `${KOLACIC}=${encodeURIComponent(uloga)}; path=/; SameSite=Lax`
}
