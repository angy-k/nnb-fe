'use client';
import exhibitorIcon from '@/icons/exhibitor-icon.svg'
import { Avatar } from "@nextui-org/avatar";
import PageHeroSection from '@/components/Hero/pageOwl';
import Reservations from '@/components/Reservations/Reservations';
import AccountData from './accountData';
import ProfileGallery from './gallery';
import useUser from '@/data/use-user'

const ProfileComponent = ({
    account,
}) => {
  const { user, loading, loggedOut } = useUser()

  if (loading && !account) {
    return (
      <>
        <PageHeroSection illustration={false} />
        <div className="grid place-items-center w-full pb-48 bg-[#f0f0f0]">
          <div className="mt-24">Učitavanje...</div>
        </div>
      </>
    )
  }

  if (loggedOut && !account) {
    return (
      <>
        <PageHeroSection illustration={false} />
        <div className="grid place-items-center w-full pb-48 bg-[#f0f0f0]">
          <div className="mt-24">Morate biti ulogovani da biste videli profil.</div>
          <button
            type="button"
            className="mt-6 px-6 py-3 rounded-md bg-[#261A54] text-white"
            onClick={() => {
              window.dispatchEvent(new Event('nnb:open-auth-modal'))
            }}
          >
            Prijavite se
          </button>
        </div>
      </>
    )
  }

  const mappedAccount = (() => {
    if (account) return account
    if (!user) return mockedUser

    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim() || user.name || '-'

    return {
      brandName: user.name || '-',
      type: '',
      image: user.profile_photo_url || exhibitorIcon,
      owner: {
        fullName,
        email: user.email || '-',
        phone: '-',
        address: '-',
        dateOfBirth: user.date_of_birth || '-',
      },
      company: {
        name: '-',
        address: '-',
        mb: '-',
        pib: '-',
      },
      images: [],
      videos: [],
      reservations: [],
    }
  })()

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
              src={(() => {
                const img = mappedAccount?.image
                if (!img) return exhibitorIcon.src
                if (typeof img === 'string') return img
                if (img?.src) return img.src
                return exhibitorIcon.src
              })()}
              radius="full"
              color='default'
              className="w-[223px] h-[223px] text-tiny bg-[#261A54] p-[36px] border border-solid border-violet-300"
            />
            <span style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <span className='font-bold font-[48px] text-[#ffffff]'>{mappedAccount.brandName}</span>
              <span className='font-normal font-[22px] text-[#ffffff]'>{mappedAccount.type}</span>
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
        <AccountData account={mappedAccount} />
        <ProfileGallery account={mappedAccount} />
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
