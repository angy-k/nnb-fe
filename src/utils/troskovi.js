import { electricityPriceFor } from '@/utils/electricity'
import applicationService from '@/services/applicationService'

/**
 * Broj dana koji će prijava pokriti.
 *
 * Prijavu po danu dopušta samo događaj kojem je to uključeno; kod ostalih
 * prijava uvek pokriva sve dane, pa i kad je u modalu kliknut jedan. Backend
 * (`EventApplicationController::quote`) računa isto, pa se prikaz i naplata ne
 * razilaze.
 */
export function brojDanaPrijave(event, selectedDayIds = []) {
  const sviDani = Array.isArray(event?.days) ? event.days : []
  const ukupno = Math.max(1, sviDani.length)

  if (!event?.allowPerDayApplications) return ukupno
  if (!Array.isArray(selectedDayIds) || selectedDayIds.length === 0) return ukupno

  const validni = selectedDayIds.filter((id) => sviDani.some((d) => d.id === id))
  return Math.max(1, validni.length)
}

/**
 * Domaća procena troškova — ista računica kao na serveru, ali bez zona.
 *
 * Kotizacija se množi brojem dana: `resolveCotization` na serveru za prijavu
 * bez štanda vraća `down_payment * daysCount`, pa je prikaz bez množenja bio
 * manji od naplate čim izlagač izabere više od jednog dana.
 *
 * Služi samo dok predračun sa servera ne stigne (ili ako ne stigne), da sažetak
 * ne bi bio prazan.
 */
export function lokalniTroskovi(event, electricityOpt, marketingOpt, brojDana = 1) {
  const dana = Math.max(1, Number(brojDana) || 1)
  const cotization = (Number(event?.downPayment) || 0) * dana

  // Cena zavisi od izabrane jačine priključka; „none" znači da struja nije tražena.
  // Struja i reklama se naplaćuju po prijavi, ne po danu — kao i na serveru.
  const electricity = electricityPriceFor(event, electricityOpt)

  const broj = (v) => (v != null && v !== '' ? Number(v) : null)
  const fb = broj(event?.fbMarketingCoasts)
  const ig = broj(event?.ingMarketingCoasts)
  // Cena paketa za obe mreže je zasebna i niža od zbira pojedinačnih;
  // sabiranje ostaje samo za događaje kojima ta cena nije uneta.
  const both = broj(event?.fbIngMarketingCoasts)

  let marketing = null
  if (marketingOpt === 'facebook') marketing = fb
  else if (marketingOpt === 'instagram') marketing = ig
  else if (marketingOpt === 'instagram_facebook') marketing = both ?? ((fb ?? 0) + (ig ?? 0))

  return { cotization, electricity, marketing }
}

/**
 * Merodavan iznos dolazi sa servera — `/applications/quote` vraća iste stavke
 * koje će se i upisati (zone, cenovnik po broju dana, gratis nastup iz paketa).
 *
 * Vraća `null` ako predračun nije dostupan (neulogovan izlagač, greška mreže),
 * pa pozivalac ostaje na domaćoj proceni.
 */
export async function predracunSaServera({
  eventId,
  electricityOption = 'none',
  marketingOption = 'none',
  eventDayIds = null,
}) {
  if (!eventId) return null

  try {
    const res = await applicationService.quoteApplication({
      eventId,
      electricityOption,
      marketingOption,
      eventDayIds,
    })
    const data = await res.json().catch(() => null)
    if (!data?.success || !data?.data) return null

    const pokriva = Array.isArray(data.data.gratis_pokriva) ? data.data.gratis_pokriva : []

    return {
      costs: {
        cotization: data.data.cotization,
        zoneCost: null,
        electricity: data.data.electricity || null,
        marketing: data.data.marketing || null,
      },
      /*
       * Paket pokriva oglašavanje samo ako ga je izlagač i zatražio — inače bi
       * u sažetku pisalo „pokriveno paketom" za uslugu koju nije ni izabrao.
       */
      covered: pokriva.filter((k) =>
        k !== 'oglasavanje' || (marketingOption && marketingOption !== 'none')
      ),
      blockers: Array.isArray(data.data.blockers) ? data.data.blockers : [],
      daysCount: Number(data.data.days_count) || null,
    }
  } catch {
    return null
  }
}
