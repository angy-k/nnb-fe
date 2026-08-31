/**
 * Deljenje teksta iz admin panela na pasuse.
 *
 * Zašto postoji
 * -------------
 * Tekstovi se unose u `Textarea` u admin panelu, a pregledači u polja tog tipa
 * upisuju prelome reda kao `\r\n`, ne kao `\n` — tako nalaže HTML specifikacija
 * za slanje formi. Kod je delio po `'\n\n'`, što se sa `\r\n\r\n` ne poklapa,
 * pa je ceo unos ostajao jedan pasus.
 *
 * Nije se odmah videlo jer `white-space: pre-line` prazan red svejedno iscrta,
 * pa je razmak između pasusa postojao — ali kao goli prelom, bez razmaka od
 * 1em koji nose zasebni `<p>` elementi.
 *
 * Zato se prelomi prvo svode na `\n`, pa se tek onda deli.
 */

/** `\r\n` i usamljeni `\r` → `\n` */
export function normalizujPrelome(tekst) {
  return String(tekst ?? '').replace(/\r\n?/g, '\n')
}

/**
 * Tekst → niz pasusa. Pasus je sve između praznih redova; obični prelomi ostaju
 * unutar pasusa i prikazuju se preko `white-space: pre-line`.
 *
 * Prazan unos daje prazan niz, pa pozivalac ne mora da proverava.
 *
 * @returns {string[]}
 */
export function uPasuse(tekst) {
  const ocisceno = normalizujPrelome(tekst).trim()
  if (ocisceno === '') return []

  return ocisceno
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}
