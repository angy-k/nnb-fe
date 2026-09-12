/**
 * Zajednički okvir modala u ovom dizajnu.
 *
 * Mereno na izvozima (`Tezga-potvrda`, `Tezga-rezervisana`, `Prijava-poslata`,
 * `Upozorenje-galerija`, `Otkazivanje-*`): svi su široki tačno koliko i kolona
 * sadržaja — 1440 na okviru od 1920, koliko je i ovde. Menja im se samo visina,
 * prema sadržaju.
 *
 * Stoji na jednom mestu jer su se iste mere ranije prepisivale po komponentama
 * i razilazile: zatečeno je 560, 700, 860, 920 i 1066.
 */
const OKVIR = {
  sirina: 1440,
  radijus: 50,   // Frame 5 u izvozu: 1440 × …, zaobljenje 50
  // Preliv izveden iz piksela: plavičasto dole levo, ka beloj gore desno.
  preliv: 'linear-gradient(to top right, #d5e8ed 0%, #e9eef2 38%, #ffffff 72%)',
  // Iks je u sva četiri izvoza na istom mestu: 40,31 × 40,31 na (1349, 50)
  // unutar okvira od 1440 — dakle 51 od desne ivice.
  iks: { velicina: 40, vrh: 50, desno: 51 },
  naslov: 36,   // „Da li želite da rezervišete tezgu XYZ?" je u izvozu 36/700
}

export default OKVIR
