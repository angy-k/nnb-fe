'use client';
import PageHeroSection from '@/components/Hero/pageOwl';
import { Avatar } from "@nextui-org/avatar";
import exhibitorIcon from '@/icons/exhibitor-icon.svg';
import MyPreviousReservations from '@/components/CardsLayout/MyPreviousReservations';
import { useRouter } from 'next/navigation'

const MyPreviousReservationsComponent = ({
  account = mockedUser
}) => {

  const router = useRouter()

  function viewActiveReservations() {
    router.push('/prethodne-rezervacije')  
  }
  function goBackToProfile() {
    router.back()
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
            onClick={viewActiveReservations}
            className='text-[#ffffff]'
            style={{border: '1px solid #ffffff', borderRadius: '30px', whiteSpace: 'nowrap', height: '60px', width: '300px'}}
          >
            {'Aktuelne rezervacije'}
          </button>
        </div>
        <div className='w-full grid place-items-center bg-[#f0f0f0]'>
          <div style={{maxWidth: '1400px'}}>
            <MyPreviousReservations />
          </div>
        </div>
      </div>
    </>
    )
}

export default MyPreviousReservationsComponent;

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
