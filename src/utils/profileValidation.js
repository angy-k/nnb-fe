/**
 * Provera da li profil ima sve što je potrebno za prijavu na događaj.
 *
 * Spisak prati ono što traži registracija preko mejla, da se dva puta do naloga
 * izjednače. Preko Google naloga se ranije stizalo do rezervacije sa znatno
 * manje podataka — bez datuma rođenja i bez podataka pravnog lica odnosno
 * poljoprivrednog gazdinstva, koje mejl registracija zahteva.
 *
 * Podaci o pravnom licu i gazdinstvu traže se **uslovno**: samo ako je korisnik
 * izabrao tip. Registracija dozvoljava i da se ne izabere nijedan — tada je
 * korisnik fizičko lice i ta polja ne postoje. Bez tog uslova bi provera
 * zaključala sve dosadašnje izlagače fizička lica.
 *
 * Mesto (`city`) se namerno ne traži: ni registracija ga ne zahteva, a i nema
 * ga u podacima koje server šalje o korisniku.
 *
 * @param {object|null} user - korisnik iz `useUser()`
 * @param {object} [opts]
 * @param {boolean} [opts.withMarketing] - tačno kad je izabrano oglašavanje
 * @returns {{ ok: boolean, missing: string[] }}
 */
export function checkProfileReady(user, { withMarketing = false } = {}) {
  if (!user) return { ok: false, missing: [] }

  const missing = []

  if (!user.first_name?.trim()) missing.push('ime')
  if (!user.last_name?.trim()) missing.push('prezime')
  if (!user.brand_name?.trim()) missing.push('naziv brenda')
  if (!user.email?.trim()) missing.push('email adresa')
  if (!user.phone_number?.trim()) missing.push('broj telefona')
  if (!user.address?.trim()) missing.push('adresa')
  if (!user.date_of_birth?.trim()) missing.push('datum rođenja')
  if (!user.activity_group?.id && !user.activity?.id) missing.push('kategorija delatnosti')

  const pravnoLice = user.legal_entity
  if (pravnoLice) {
    const tip = pravnoLice.entity_type || 'legal'

    if (!pravnoLice.company_name?.trim()) {
      missing.push(tip === 'agricultural' ? 'naziv gazdinstva' : 'naziv pravnog lica')
    }
    if (!pravnoLice.company_address?.trim()) {
      missing.push(tip === 'agricultural' ? 'adresa gazdinstva' : 'adresa pravnog lica')
    }

    if (tip === 'agricultural') {
      if (!pravnoLice.farm_number?.trim()) missing.push('broj poljoprivrednog gazdinstva')
    } else {
      if (!pravnoLice.pib?.trim()) missing.push('PIB')
      if (!pravnoLice.mb?.trim()) missing.push('matični broj')
    }
  }

  if (withMarketing) {
    if (!user.facebook?.trim()) missing.push('Facebook link')
    if (!user.instagram?.trim()) missing.push('Instagram link')
  }

  return { ok: missing.length === 0, missing }
}
