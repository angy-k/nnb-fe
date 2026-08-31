/**
 * Zajednički okvir modala u ovom dizajnu.
 *
 * Mereno na izvozima (`Tezga-potvrda`, `Tezga-rezervisana`, `Prijava-poslata`,
 * `Upozorenje-galerija`, `Otkazivanje-*`): svi su široki tačno koliko i kolona
 * sadržaja — 1440 na okviru od 1920, dakle 1400 ovde. Menja im se samo visina,
 * prema sadržaju.
 *
 * Stoji na jednom mestu jer su se iste mere ranije prepisivale po komponentama
 * i razilazile: zatečeno je 560, 700, 860, 920 i 1066.
 */
const OKVIR = {
  sirina: 1400,
  radijus: 41,
  // Preliv izveden iz piksela: plavičasto dole levo, ka beloj gore desno.
  preliv: 'linear-gradient(to top right, #d5e8ed 0%, #e9eef2 38%, #ffffff 72%)',
  iks: { velicina: 39, vrh: 49, desno: 50 },
  naslov: 33,
}

export default OKVIR
