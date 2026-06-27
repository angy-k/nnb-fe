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

async function getNextEvent() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${apiUrl}/api/v1/events?active=1`, {
      credentials: 'omit',
      cache: 'no-store',
    })
    if (!response.ok) return null
    const data = await response.json()
    const items = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : []
    if (!items.length) return null
    // Sort by start date, pick first upcoming
    const now = new Date()
    const upcoming = items
      .filter(e => e.dateTime && new Date(e.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    return upcoming[0] ?? items[0]
  } catch {
    return null
  }
}

export default async function Home() {
  const nextEvent = await getNextEvent()

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
      />

      <section className=''>
        <div className='w-full pb-24'>
          <HomeCalendarSection />
          <HomeBlogSection />
          <InstagramPosts />
        </div>
      </section>

      {/* Impressions Section */}
      <section className=''>
        <div className='w-full'>
          <Impressions />
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Frequently asked questions */}
      <section className=''>
        <div className="grid place-items-center w-full pb-24 pt-[96px]">
          <div className="w-full" style={{ maxWidth: '1440px', padding: '0 24px' }}>
            <span className="contact-section-title">Najčešće postavljana pitanja</span>
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
