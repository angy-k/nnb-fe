'use client';
import { useRouter } from 'next/navigation'
import { Avatar } from "@nextui-org/avatar";
import Reservations from '@/components/Reservations/Reservations';
import AccountData from './accountData';
import ProfileGallery from './gallery';
import useUser from '@/data/use-user'

const ProfileComponent = ({
  account,
}) => {
  const router = useRouter()
  const { user, loading, loggedOut } = useUser()

  if (loading && !account) {
    return (
      <div className="w-full min-h-screen bg-[#261A54]" />
    )
  }

  if (loggedOut && !account) {
    return (
      <>
        <div className="w-full bg-[#261A54] pt-60 pb-16" />
        <div className="grid place-items-center w-full pb-48 bg-[#f0f0f0]">
          <div className="mt-24 flex flex-col items-center gap-6">
            <p className="text-[#261A54]">Morate biti ulogovani da biste videli profil.</p>
            <button
              type="button"
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{ backgroundColor: '#56C4CF' }}
              onClick={() => {
                window.dispatchEvent(new Event('nnb:open-auth-modal'))
              }}
            >
              Prijavite se
            </button>
          </div>
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
      type: user.activity?.name || user.activity_group?.name || '',
      image: user.profile_photo_url || null,
      owner: {
        fullName,
        email: user.email || '-',
        phone: user.phone_number || '-',
        address: user.address || '-',
        dateOfBirth: user.date_of_birth || '-',
        facebook: user.facebook || null,
        instagram: user.instagram || null,
      },
      company: {
        name: user.legal_entity?.company_name || '-',
        address: user.legal_entity?.company_address || '-',
        mb: user.legal_entity?.mb || '-',
        pib: user.legal_entity?.pib || '-',
      },
      gallery_images: user.gallery_images || [],
      gallery_videos: user.gallery_videos || [],
      images: [],
      videos: [],
      reservations: [],
    }
  })()

  // Only use real URL strings as avatar src — not SVG import objects
  const avatarSrc = (() => {
    const img = mappedAccount?.image
    if (typeof img === 'string' && img.length > 0) return img
    return null
  })()

  return (
    <>
      {/* Profile header — paddingTop gura sadržaj ispod fixed nava */}
      <div className="w-full bg-[#261A54]" style={{ paddingTop: '260px', paddingBottom: '50px' }}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            {/* Avatar — z-10 da bude iznad gray sekcije, marginBottom negativan za prelaz */}
            <div className="relative z-10 flex-shrink-0" style={{ marginBottom: '-36px' }}>
              <Avatar
                isBordered
                src={avatarSrc || undefined}
                name={!avatarSrc ? (mappedAccount.brandName || 'U') : undefined}
                radius="full"
                className="w-[100px] h-[100px] text-xl bg-[#3d2f7a] border-2 border-violet-300/50"
              />
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <span className="text-3xl font-bold leading-tight" style={{ color: '#ffffff' }}>{mappedAccount.brandName}</span>
              <span className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>{mappedAccount.type}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/profil/izmeni')}
            className="px-6 py-2.5 rounded-full text-sm font-semibold flex-shrink-0 hover:opacity-90 transition mb-2"
            style={{ color: '#ffffff', backgroundColor: '#56C4CF' }}
          >
            Izmenite profil
          </button>
        </div>
      </div>

      {/* Content area — paddingTop za prostor avatara koji visi */}
      <div className="w-full bg-[#f0f0f0] pb-24 overflow-hidden" style={{ paddingTop: '36px' }}>
        <Reservations />
        <div className="max-w-[1400px] mx-auto px-6">
          <AccountData account={mappedAccount} />
          <div id="profil-galerija">
            <ProfileGallery account={mappedAccount} editable={!!user && !account} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileComponent;

const mockedUser = {
  brandName: 'Krafter',
  type: 'Pivara',
  image: null,
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
