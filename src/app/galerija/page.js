import { redirect } from 'next/navigation'

/**
 * Iz menija se dolazi na fotografije.
 *
 * Ranije je ova adresa iscrtavala samo hero sa dva kružna dugmeta i ništa ispod
 * njega, pa je „Galerija" iz menija vodila na praznu stranicu sa koje je trebalo
 * još jednom kliknuti. U dizajnu se na istoj strani, ispod hero-a, odmah vidi
 * foto galerija.
 *
 * Preusmerenje je ovde jednostavnije nego da se sadržaj iscrtava na dva mesta:
 * `/galerija/fotografije` već ima i hero sa oba dugmeta i samu galeriju, pa se
 * ne udvaja ni dohvatanje podataka ni raspored.
 */
const GalleryPage = () => {
  redirect('/galerija/fotografije')
}

export default GalleryPage
