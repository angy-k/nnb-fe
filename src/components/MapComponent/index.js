'use client';
import PageHeroSection from '@/components/Hero/pageOwl';
import { Avatar } from "@nextui-org/avatar";
import exhibitorIcon from '@/icons/exhibitor-icon.svg';
import { useRouter } from 'next/navigation'
import locationIcon from '@/icons/location-icon.svg'
import Image from 'next/image';
import Map from './Map';

const MapComponent = ({
  account = mockedUser
}) => {
  return (
    <>
      <PageHeroSection 
        illustration={false}
      />
      <div 
        className="grid place-items-center w-full w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-[48px] md-2xl:pb-[35px]" 
        // style={{ background: 'linear-gradient(to bottom, #261A54 70%, #f0f0f0 70%)'}}
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
              <span className='font-bold font-[48px] text-[#ffffff]'>{`Mapa Noćnog Bazara u Novom Sadu`}</span>
          </div>
        </div>
        <div className='w-full grid place-items-center bg-[#f0f0f0]'>
          <div style={{width: '100%', maxWidth: '1400px'}}>
            <div className="pl-64" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifySelf: 'self-start'}}>
              <Image
                src={locationIcon}
                width={39}
                height={39}
                alt='location-icon'
              />
              <span className='font-normal font-[18px] text-[#261A54]'>
                {`Trg republike 18`}
              </span>
            </div>
          </div>
        </div>
        <div className='w-full bg-[#f0f0f0]'>
          <div className="pl-48" style={{maxWidth: '1400px'}}>
            <div className='bg-[#ffffff] p-[30px] w-[228px]'>
              <span className='font-normal font-[36px] text-[#261A54] pb-[30px]'>{`Legenda`}</span>
              <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                <div className='bg-[#F26E21] w-[46px] h-[24px]'>{``}</div><span className='font-normal font-[36px] text-[#261A54]'>Rezervisano</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                <div className='bg-[#ffffff] w-[46px] h-[24px]'>{``}</div><span className='font-normal font-[36px] text-[#261A54]'>Slobodno</span>
              </div>
            </div>
          </div>
          <div className='w-full place-items-center'>
            <Map />
          </div>
          
        </div>
      </div>
    </>
  )
}

export default MapComponent;

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

