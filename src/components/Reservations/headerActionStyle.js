/**
 * Obrisno dugme u tamnom zaglavlju rezervacija.
 *
 * Mereno na izvozu dizajna (`Moje-rezervacije.png`): oba dugmeta su iste
 * širine, 280 × 59 na okviru od 1920, sa razmakom 20 — dakle širina im ne prati
 * dužinu natpisa. Kolona sajta je sada 1440, pa se mera prepisuje doslovno.
 *
 * Stoji na jednom mestu jer se isto zaglavlje javlja i na aktuelnim i na
 * prethodnim rezervacijama. Ranije je bilo prepisano u obe komponente, pa su se
 * mere razišle — aktuelne su ispravljene, a prethodne su ostale na starim 44px.
 */
const MERE_DUGMETA = {
  width: '280px',
  height: '59px',
  color: '#ffffff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

export default MERE_DUGMETA
