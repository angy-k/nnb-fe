/**
 * Propisani tekstovi saglasnosti za obradu podataka o ličnosti.
 *
 * Formulacije su dostavljene od strane organizatora i ne smeju se menjati bez
 * njihove saglasnosti — zato stoje na jednom mestu, a ne raštrkane po formama.
 *
 * Napomena: u mejlu je rečenica bila napisana sa „te se u druge svrhe se ne
 * mogu koristiti" (dvaput „se"). Organizator je potvrdio da je reč o omašci u
 * kucanju, pa ovde stoji ispravna varijanta — kao i u obrascu Opštih uslova.
 */

/** Svuda gde se prikupljaju podaci radi učešća na manifestaciji (registracija, prijava na događaj) */
export const CONSENT_PARTICIPATION = {
  before: 'Pročitao/la sam ',
  linkLabel: 'Politiku privatnosti',
  after:
    ' i saglasan/saglasna sam da se moji podaci mogu koristiti u svrhu učešća na manifestaciji ' +
    'i za kontaktiranje i obaveštavanje u vezi sa daljim aktivnostima organizatora, ' +
    'te se u druge svrhe ne mogu koristiti.',
}

/** Kontakt forma — bez dela o učešću na manifestaciji */
export const CONSENT_CONTACT = {
  before: 'Pročitao/la sam ',
  linkLabel: 'Politiku privatnosti',
  after:
    ' i slanjem ovog mejla saglasan/saglasna sam da se moji podaci mogu koristiti ' +
    'radi kontaktiranja i obaveštavanja u vezi sa aktivnostima organizatora, ' +
    'te se u druge svrhe ne mogu koristiti.',
}

/**
 * Newsletter — ista svrha kao kontakt, ali „slanjem ovog mejla" tamo nije tačno
 * jer se korisnik prijavljuje, ne šalje poruku. Zamenjeno sa „prijavom na newsletter".
 */
export const CONSENT_NEWSLETTER = {
  before: 'Pročitao/la sam ',
  linkLabel: 'Politiku privatnosti',
  after:
    ' i prijavom na newsletter saglasan/saglasna sam da se moji podaci mogu koristiti ' +
    'radi kontaktiranja i obaveštavanja u vezi sa aktivnostima organizatora, ' +
    'te se u druge svrhe ne mogu koristiti.',
}
