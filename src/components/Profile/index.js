'use client';
import exhibitorIcon from '@/icons/exhibitor-icon.svg'
import { Avatar } from "@nextui-org/avatar";
import PageHeroSection from '@/components/Hero/pageOwl';
import Reservations from '@/components/Reservations/Reservations';
import AccountData from './accountData';
import ProfileGallery from './gallery';

const ProfileComponent = ({
    account = mockedUser,
}) => {
  return (
    <>
      <PageHeroSection 
          illustration={false}
      />
      <div className="grid place-items-center w-full w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-[48px] md-2xl:pb-[35px]" style={{ background: 'linear-gradient(to bottom, #261A54 70%, #f0f0f0 70%)'}}>
        <div className='edit-profile'>
          <div className='place-items-center' style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
            <Avatar
              src={(account && account?.image) ? account.image.src : exhibitorIcon.src}
              icon
              radius="full"
              isBordered
              color='default'
              className="w-[223px] h-[223px] text-tiny bg-[#261A54] p-[36px]"
            />
            <span style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <span className='font-bold font-[48px] text-[#ffffff]'>{account.brandName}</span>
              <span className='font-normal font-[22px] text-[#ffffff]'>{account.type}</span>
            </span>
          </div>
          <button
            key={`edit-profile-button`}
            onClick={() => {}}
            className='edit-profile-button text-[#ffffff]'
          >
            {'Izmenite profil'}
          </button>
        </div>
      </div>
      <div className='grid place-items-center w-full pb-48 bg-[#f0f0f0]'>
        <Reservations />
        <AccountData account={account} />
        <ProfileGallery account={account} />
      </div>
    </>
  )
}

export default ProfileComponent;


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
  