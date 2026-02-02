'use client';
import PageHeroSection from '@/components/Hero/pageOwl';
import { Avatar } from "@nextui-org/avatar";
import exhibitorIcon from '@/icons/exhibitor-icon.svg';
import MyReservations from '@/components/CardsLayout/MyReservations';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import applicationService from '@/services/applicationService'

const MyReservationsComponent = ({
  account = mockedUser,
}) => {

  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await applicationService.getMyApplications({ active: true })
        const contentType = res.headers.get('content-type') || ''
        const data = contentType.includes('application/json') ? await res.json() : null

        if (!res.ok || !data?.success) {
          if (isActive) setError(data?.message || 'Greška prilikom učitavanja rezervacija.')
          if (isActive) setEvents([])
          return
        }

        const items = Array.isArray(data.data) ? data.data : []
        const mapped = items
          .map((item) => {
            const ev = item?.event || {}
            const status = (item?.status ?? '').toString()

            const applicationStatus = status === 'declined'
              ? 'rejected'
              : ['paid', 'approved'].includes(status)
                ? 'approved'
                : 'waiting'

            return {
              id: item?.id,
              title: (ev?.title || ev?.name || '').toString(),
              date: (ev?.dateTime || '').toString(),
              applicationDate: (item?.appliedAt || '').toString(),
              applicationStatus,
            }
          })
          .filter((x) => x?.title)

        if (isActive) setEvents(mapped)
      } catch (e) {
        if (isActive) setError('Greška prilikom učitavanja rezervacija.')
        if (isActive) setEvents([])
      } finally {
        if (isActive) setLoading(false)
      }
    }

    load()
    return () => {
      isActive = false
    }
  }, [])

  function viewPreviousReservations() {
    router.push('/prethodne-rezervacije')  
  }
  function goBackToProfile() {
    router.push('/profil')
  }

  return (
    <>
      <PageHeroSection 
          illustration={false}
      />
      <div 
        className="grid place-items-center w-full w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-[48px] md-2xl:pb-[35px]" 
        style={{ background: 'linear-gradient(to bottom, #261A54 70%, #f0f0f0 70%)'}}
      >
        <div className='edit-profile gap-4'>
          <div className='place-items-center' style={{display: 'flex', flexDirection: 'row', gap: '40px', width: '100%'}}>
            <Avatar
             isBordered
              src={(account && account?.image) ? account.image.src : exhibitorIcon.src}
              radius="full"
              color='default'
              className="w-[223px] h-[223px] text-tiny bg-[#261A54] p-[36px] border border-solid border-violet-300"
            />
            <span className='font-bold font-[48px] text-[#ffffff]'>{`Moje rezervacije`}</span>
          </div>
          <button
            key={`edit-profile-button`}
            onClick={goBackToProfile}
            className='text-[#ffffff]'
            style={{border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '60px', width: '300px'}}
          >
            {'Vrati se na profil'}
          </button>
          <button
            key={`edit-profile-button`}
            onClick={viewPreviousReservations}
            className='text-[#ffffff]'
            style={{border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '60px', width: '300px'}}
          >
            {'Prethodne rezervacije'}
          </button>
        </div>
        <div className='w-full grid place-items-center bg-[#f0f0f0]'>
          <div style={{maxWidth: '1400px'}}>
            <span className='font-normal font-[18px] text-[#261A54]'>
              {`*Rezervaciju je moguće otkazati kontaktiranjem Noćnog Bazara.`}
            </span>
            {loading && (
              <div className='pt-6 text-[#261A54]'>Učitavanje...</div>
            )}
            {!loading && error && (
              <div className='pt-6 text-[#EC4923]'>{error}</div>
            )}
            
            {!loading && !error && events.length === 0 && (
              <div className='pt-6 text-[#261A54]'>Nemate aktivnih rezervacija.</div>
            )}

            {!loading && !error && events.length > 0 && <MyReservations events={events} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyReservationsComponent;

const mockedUser = {
  brandName: 'Krafter',
  type: 'pivara',
  image: exhibitorIcon,
  owner: {
    fullName: 'Marija Marijanović',
    email: 'marijamarijanovic@gmail.com',
    phone: '+381 60 123 45 678',
    address: 'Vuka Karadžića 55, Novi Sad',
    dateOfBirth: '01.01.1990.'
  },
  company: {
    name: 'Pivara Krafter',
    address: 'Vuka Karadžića 55, Novi Sad',
    mb: '12345678',
    pib: '12345678987654'
  },
  images: [],
  videos: [],
  reservations: []
}

