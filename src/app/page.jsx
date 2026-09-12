import '@/styles/global.css'
import { parseDate, formatDate } from '@/utils/dateHelpers'
import { homepage } from '@/constants/schemas'
import Newsletter from '@/components/Newsletter'
import Faq from '@/components/FaQ'
import ContactForm from '@/components/ContactForm'
import Impressions from '@/components/CardsLayout/Impressions'
import InstagramPosts from '@/components/InstagramFeed'
import HomeCalendarSection from '@/components/HomeCalendarSection'
import HomeBlogSection from '@/components/HomeBlogSection'
import HomeHero from '@/components/HomeHero'

export const metadata = {
  title: `Novosadski noćni bazar`,
  description: ``,
  alternates: {
    canonical: `/`,
  },
}

async function getEventsData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const now = new Date()

    const activeRes = await fetch(`${apiUrl}/api/v1/events?active=1`, {
      credentials: 'omit',
      cache: 'no-store',
    })
    const activeData = activeRes.ok ? await activeRes.json() : null
    const activeItems = Array.isArray(activeData?.data)
      ? activeData.data
      : Array.isArray(activeData?.data?.data)
        ? activeData.data.data
        : []

    const upcoming = activeItems
      .filter(e => e.dateTime && (parseDate(e.dateTime) ?? new Date(0)) >= now)
      .sort((a, b) => (parseDate(a.dateTime) ?? 0) - (parseDate(b.dateTime) ?? 0))

    const tickerEvents = upcoming.map(e => ({
      name: e?.title ?? e?.name ?? '',
      date: formatDate(e.dateTime),
    }))

    return {
      nextEvent: upcoming[0] ?? activeItems[0] ?? null,
      tickerEvents,
    }
  } catch {
    return { nextEvent: null, tickerEvents: [] }
  }
}

export default async function Home() {
  const { nextEvent, tickerEvents } = await getEventsData()

  const nextEventName = nextEvent?.title ?? nextEvent?.name ?? null
  const nextEventDate = nextEvent?.dateTime ? formatDate(nextEvent.dateTime) : null

  return (
    <div className='min-h-screen'>
      {/** Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(homepage)}}
      />

      {/* Hero sekcija */}
      <HomeHero
        nextEventName={nextEventName}
        nextEventDate={nextEventDate}
        tickerEvents={tickerEvents}
      />

      {/* Svetla sekcija. Zakrivljen joj je samo vrh — donji prelaz crta tamna
          zona ispod, svojim lukom naviše. Mereno na izvozu: luk se od ivice
          ekrana do sredine diže 135px (gore 2280 → 2145, dole 5418 → 5283).
          Zatečeno je bilo 70, i to na sve četiri ivice, pa je dole tamno
          izlazilo uz ivice umesto po sredini — obrnuto od dizajna. */}
      <section className="pocetna-svetla-zona" style={{
        background: '#F0F0F0',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        paddingBottom: '110px',
      }}>
        {/* Mrlje u svetloj sekciji.
         *
         * U izvozu su to dva kruga od 2312 (120,4% širine okvira) sa istim
         * prelivom, samo u drugoj boji, i oba blede ka `rgba(240,240,240,0.4)`
         * — ne ka providnom. Tirkizni je usredišten na desnoj ivici, na 32,6%
         * visine svetle sekcije; narandžasti na levoj, na 63,3%.
         *
         * Ranije su ovde stajale dve ručno pogođene elipse (`at 55% 80%` i
         * `at 88% 18%`), manje i tvrđe, pa se prelaz video kao rub. */}
        <div style={{
          position: 'absolute',
          width: 'min(120.4166vw, 2312px)',
          aspectRatio: '1',
          right: 'min(-60.2083vw, -1156px)',
          top: 'calc(32.6% - min(60.2083vw, 1156px))',
          background: 'radial-gradient(44.51% 44.51% at 50% 50%, rgba(86,196,207,0.4) 0%, rgba(240,240,240,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          width: 'min(120.4166vw, 2312px)',
          aspectRatio: '1',
          left: 'min(-60.2083vw, -1156px)',
          top: 'calc(63.3% - min(60.2083vw, 1156px))',
          background: 'radial-gradient(44.51% 44.51% at 50% 50%, rgba(241,128,32,0.4) 0%, rgba(240,240,240,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HomeCalendarSection />
          <HomeBlogSection />
        </div>
      </section>

      {/* Instagram — zakrivljeni vrh i stilizacija je unutar komponente */}
      <InstagramPosts />

      {/* Donji, tamni deo stranice — utisci, newsletter, Viber, pitanja i
          kontakt. U dizajnu je to jedan pravougaonik (1920 × 4082 od y 5735) sa
          jednom elipsom sjaja u sebi. Ranije je svaka sekcija crtala svoju
          podlogu i svoj sjaj, pa su se na spojevima videle vodoravne linije. */}
      <div className="pocetna-tamni-deo">
        {/* Impressions Section */}
        <section className='pb-24'>
          <div className='w-full'>
            <Impressions />
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />

        {/* FAQ */}
        <section>
          <div className="grid place-items-center w-full pb-24 pt-24">
            <div className="w-full" style={{ maxWidth: 'var(--nnb-kolona)', padding: '0 24px' }}>
              <span className="contact-section-title" style={{ color: '#ffffff' }}>Najčešće postavljana pitanja</span>
            </div>
            <Faq isHome={true} />
          </div>
        </section>

        {/* Contact form */}
        <div className='pb-24'>
          <ContactForm
            withImage={true}
            sectionLead="Ukoliko imate bilo kakvo pitanje, sugestiju, kritiku, ili samo želite da se dodatno informišete o našim dešavanjima, osećajte se slobodni da nam pišete u svako doba dana, odgovorićemo Vam u najbržem roku."
            sectionTitleColor="#ffffff"
            hideDivider={true}
            predefinedTitle="Kontaktirajte nas"
          />
        </div>
      </div>
    </div>
  )
}
