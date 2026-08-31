/**
 * Obrisno dugme u tamnom zaglavlju rezervacija.
 *
 * Mereno na izvozu dizajna (`Moje-rezervacije.png`): oba dugmeta su iste
 * širine, 280 × 59 na okviru od 1920, sa razmakom 20 — dakle širina im ne prati
 * dužinu natpisa. Srazmerno koloni sajta od 1400 to je 272 × 57.
 *
 * Stoji na jednom mestu jer se isto zaglavlje javlja i na aktuelnim i na
 * prethodnim rezervacijama. Ranije je bilo prepisano u obe komponente, pa su se
 * mere razišle — aktuelne su ispravljene, a prethodne su ostale na starim 44px.
 */
const MERE_DUGMETA = {
  width: '272px',
  height: '57px',
  color: '#ffffff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

export default MERE_DUGMETA
