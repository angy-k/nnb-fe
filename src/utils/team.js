import { replaceCharacters } from '@/utils/transform-helper'

/**
 * Ime člana tima svedeno na oblik pogodan za poređenje i za sidro u URL-u:
 * mala slova, bez dijakritika, razmaci u crtice.
 *
 * Autor objave se u administraciji unosi kao slobodan tekst, pa se ne poklapa
 * uvek slovo u slovo sa imenom člana tima („Đorđević" / „Djordjevic",
 * dvostruki razmak, veliko slovo). Zato se obe strane provlače kroz isto.
 */
export const nameSlug = (name) =>
  replaceCharacters(String(name ?? '').trim().replace(/\s+/g, ' '), ' ', '-')

/** Sidro kartice člana tima na stranici „O nama". */
export const teamAnchorId = (name) => `tim-${nameSlug(name)}`

/** Pun naziv člana tima iz zapisa koji stiže sa API-ja. */
export const teamMemberName = (member) =>
  [member?.first_name, member?.last_name].filter(Boolean).join(' ')

/** Član tima koji odgovara imenu autora, ili `null` ako ga nema među njima. */
export const findTeamMemberByName = (members, name) => {
  const trazeni = nameSlug(name)
  if (!trazeni) return null

  return (Array.isArray(members) ? members : []).find(
    (m) => nameSlug(teamMemberName(m)) === trazeni
  ) ?? null
}
