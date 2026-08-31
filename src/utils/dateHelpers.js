/**
 * Shared date parsing and formatting utilities.
 * Handles both the current API format (dd.MM.yyyy, dd.MM.yyyy HH:mm)
 * and legacy formats (d MMM yyyy HH:mm) for backward compatibility.
 */
import { parse, isValid, format } from 'date-fns'
import { srLatn } from 'date-fns/locale'

const PARSE_FORMATS = [
  // ISO 8601 (API date_of_birth: yyyy-MM-dd)
  'yyyy-MM-dd',
  // Current API format (PHP d.m.Y H:i)
  'dd.MM.yyyy HH:mm',
  'd.MM.yyyy HH:mm',
  'dd.MM.yyyy',
  'd.MM.yyyy',
  // Legacy formats (old API)
  'd MMM yyyy HH:mm',
  'd M yyyy HH:mm',
  'dd MMM yyyy HH:mm',
  'dd M yyyy HH:mm',
  'd MMM yyyy',
  'd M yyyy',
  'dd MMM yyyy',
  'dd M yyyy',
]

/** Parse a date string using known API formats, fallback to native Date. */
export function parseDate(dateStr) {
  if (!dateStr) return null
  // Pozivaoci ponekad već imaju `Date` (kalendar radi sa objektima, ne stringovima).
  if (dateStr instanceof Date) return isValid(dateStr) ? dateStr : null
  const s = String(dateStr).trim()
  if (!s) return null
  for (const fmt of PARSE_FORMATS) {
    try {
      const d = parse(s, fmt, new Date())
      if (isValid(d)) return d
    } catch {}
  }
  // Fallback: native Date (handles ISO 8601 strings)
  const d = new Date(s)
  return isValid(d) ? d : null
}

/** Format any API date string as dd.MM.yyyy */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return String(dateStr)
  return format(d, 'dd.MM.yyyy')
}

/** Format any API date string as dd.MM.yyyy (za prikaz datuma rođenja) */
export function formatBirthDate(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return String(dateStr)
  return format(d, 'dd.MM.yyyy')
}

/** Konvertuje dd/mm/yyyy (korisnički unos) → yyyy-MM-dd (API format) */
export function dmyToIso(dmy) {
  if (!dmy) return ''
  const parts = dmy.split('/')
  if (parts.length !== 3) return dmy
  const [d, m, y] = parts
  if (!d || !m || !y || y.length !== 4) return dmy
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

/** Konvertuje yyyy-MM-dd (API) → dd/mm/yyyy (korisnički prikaz u inputu) */
export function isoToDmy(iso) {
  if (!iso) return ''
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

/** Format any API date string as dd.MM.yyyy HH:mm */
export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return String(dateStr)
  return format(d, 'dd.MM.yyyy HH:mm')
}

/* ────────────────────────────────────────────────────────────────────────────
 * Nazivi meseca i dana
 *
 * Ovo su jedina mesta gde sme da se izvede naziv meseca ili dana u nedelji.
 * `toLocaleDateString` se namerno nigde ne koristi:
 *
 *   - `sr-RS` daje ćirilicu („4. септембар 2026."), a sajt je latinični;
 *   - i `sr-RS` i `sr-Latn` dodaju završnu tačku uz godinu („04.09.2026."),
 *     pa se isti datum negde prikazivao sa tačkom a negde bez;
 *   - tačan ishod zavisi od verzije pregledača i ugrađenih podataka o jeziku.
 *
 * `date-fns` sa `srLatn` daje isti rezultat svuda — i na serveru i u pregledaču,
 * bez obzira na uređaj i podešavanja korisnika.
 * ────────────────────────────────────────────────────────────────────────── */

/** Sat i minut: `17:00` */
export function formatTime(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'HH:mm') : ''
}

/** `4. septembar 2026` */
export function formatDanMesecGodina(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'd. MMMM yyyy', { locale: srLatn }) : ''
}

/** `septembar 2026` */
export function formatMesecGodina(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'MMMM yyyy', { locale: srLatn }) : ''
}

/** `sep` — skraćen naziv meseca, za zaglavlje nedeljnog prikaza */
export function formatMesecKratko(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'MMM', { locale: srLatn }) : ''
}

/** `2026` */
export function formatGodina(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'yyyy') : ''
}

/** `petak`, odnosno `pet` kad je `kratko` */
export function formatDanUNedelji(value, kratko = false) {
  const d = value instanceof Date ? value : parseDate(value)
  if (!d) return ''
  return format(d, kratko ? 'EEEEEE' : 'EEEE', { locale: srLatn })
}

/** `petak, 4. septembar 2026` */
export function formatPunDatum(value) {
  const d = value instanceof Date ? value : parseDate(value)
  return d ? format(d, 'EEEE, d. MMMM yyyy', { locale: srLatn }) : ''
}
