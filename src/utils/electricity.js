/**
 * Struja se naplaćuje po jačini priključka — do 2 kW, do 2,5 kW, do 3 kW —
 * i moguća je samo na pozicijama koje je organizator označio na mapi.
 *
 * Ove funkcije drže to pravilo na jednom mestu, jer se izbor struje pojavljuje
 * na četiri ekrana: mapa rezervacije, kalendar, početna i lista događaja.
 */

/**
 * Varijante koje događaj nudi. Prazan niz znači da se struja ne nudi uopšte.
 */
export function electricityOptionsOf(event) {
  return Array.isArray(event?.electricityOptions) ? event.electricityOptions : []
}

/**
 * Cena za izabranu varijantu.
 *
 * `izbor` je id varijante, ili „none" kad izlagač struju ne traži. Ako id ne
 * odgovara nijednoj varijanti, uzima se prva — tako stariji sačuvani izbor ne
 * ostane bez cene.
 *
 * @returns {number|null} iznos, ili null kad struja nije tražena ni dostupna
 */
export function electricityPriceFor(event, izbor) {
  if (!izbor || izbor === 'none') return null

  const opcije = electricityOptionsOf(event)
  if (opcije.length === 0) return null

  const izabrana = opcije.find((o) => String(o.id) === String(izbor)) ?? opcije[0]
  const cena = Number(izabrana?.price)

  return Number.isFinite(cena) ? cena : null
}

/**
 * Da li se na datom štandu uopšte može tražiti priključak.
 *
 * Zone nose spisak označenih pozicija (`electricityStands`). Štand van svake
 * zone nema ograničenja — takav slučaj postoji na mapama bez definisanih zona.
 */
export function standAllowsElectricity(zones, standNumber) {
  if (standNumber == null) return false

  const broj = Number(standNumber)
  if (!Number.isFinite(broj)) return false

  const lista = Array.isArray(zones) ? zones : []
  if (lista.length === 0) return true

  const zonaStanda = lista.find((z) => {
    const od = Number(z?.stand_number_from ?? z?.standNumberFrom)
    const doo = Number(z?.stand_number_to ?? z?.standNumberTo)
    if (!Number.isFinite(od) || !Number.isFinite(doo)) return false

    return broj >= Math.min(od, doo) && broj <= Math.max(od, doo)
  })

  if (!zonaStanda) return true

  const oznacene = zonaStanda.electricity_stands ?? zonaStanda.electricityStands ?? ''

  return String(oznacene)
    .split(/[,;\s]+/)
    .filter(Boolean)
    .some((n) => Number(n) === broj)
}
