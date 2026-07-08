import '@/styles/global.css'
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
      .filter(e => e.dateTime && new Date(e.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))

    const tickerEvents = upcoming.map(e => ({
      name: e?.title ?? e?.name ?? '',
      date: new Date(e.dateTime).toLocaleDateString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      }),
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
  const nextEventDate = nextEvent?.dateTime
    ? new Date(nextEvent.dateTime).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

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

      {/* Svetla sekcija — zakrivljeni vrh I dno (pill forma kao u dizajnu) */}
      <section style={{
        background: '#F0F0F0',
        borderRadius: '50% 50% 50% 50% / 70px 70px 70px 70px',
        marginTop: '-70px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        paddingBottom: '110px',
      }}>
        {/* Narandžasti gradient blob */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 55% 80%, rgba(241,128,32,0.55) 0%, transparent 55%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        {/* Plavi gradient blob */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 88% 18%, rgba(86,196,207,0.45) 0%, transparent 38%)',
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

      {/* Impressions Section */}
      <section className=''>
        <div className='w-full'>
          <Impressions />
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* FAQ - dark navy section */}
      <section style={{ background: '#261A54' }}>
        <div className="grid place-items-center w-full pb-24 pt-24">
          <div className="w-full" style={{ maxWidth: '1440px', padding: '0 24px' }}>
            <span className="contact-section-title" style={{ color: '#ffffff' }}>Najčešće postavljana pitanja</span>
          </div>
          <Faq isHome={true} />
        </div>
      </section>

      {/* Contact form */}
      <div className='pb-24'>
        <ContactForm
          withImage={true}
          predefinedTitle="Kontaktirajte nas"
        />
      </div>
    </div>
  )
}
