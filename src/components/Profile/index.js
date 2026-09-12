'use client';
import { useRouter } from 'next/navigation'
import { Avatar } from "@nextui-org/avatar";
import Reservations from '@/components/Reservations/Reservations';
import AccountData from './accountData';
import ProfileGallery from './gallery';
import useUser from '@/data/use-user'
import { formatBirthDate } from '@/utils/dateHelpers'
import ZaglavljeIzlagaca from '@/components/Profile/ZaglavljeIzlagaca'

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
      brandName: user.brand_name || '-',
      type: user.activity?.name || user.activity_group?.name || '',
      image: user.profile_photo_url || null,
      owner: {
        fullName,
        email: user.email || '-',
        phone: user.phone_number || '-',
        address: user.address || '-',
        dateOfBirth: user.date_of_birth ? formatBirthDate(user.date_of_birth) : '-',
        facebook: user.facebook || null,
        instagram: user.instagram || null,
      },
      company: {
        entityType: user.legal_entity?.entity_type || null,
        name: user.legal_entity?.company_name || '-',
        address: user.legal_entity?.company_address || '-',
        mb: user.legal_entity?.mb || null,
        pib: user.legal_entity?.pib || null,
        farmNumber: user.legal_entity?.farm_number || null,
        isSefUser: user.legal_entity?.is_sef_user ?? false,
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
      <ZaglavljeIzlagaca
        avatarSrc={avatarSrc}
        avatarIme={mappedAccount.brandName || 'U'}
        naslov={mappedAccount.brandName}
        podnaslov={mappedAccount.type}
      >
        <button
          onClick={() => router.push('/profil/izmeni')}
          /* Po dizajnu: 250 × 60, zaobljenje 30.5, natpis 18/600. */
          className="font-semibold flex-shrink-0 hover:opacity-90 transition"
          style={{ color: '#ffffff', backgroundColor: '#56C4CF', width: '250px', height: '60px', borderRadius: '30.5px', fontSize: '18px', lineHeight: '25px' }}
        >
          Izmenite profil
        </button>
      </ZaglavljeIzlagaca>

      {/* Content area — paddingTop za prostor avatara koji visi */}
      <div className="w-full bg-[#f5f5f5] pb-24 overflow-hidden profile-page-content" style={{ paddingTop: '56px' }}>
        <Reservations />
        <div className="max-w-[var(--nnb-kolona)] mx-auto px-6">
          <AccountData account={mappedAccount} />
          <div id="profil-galerija">
            {/* Ovo je stranica za pregled profila; izmena živi na
                `/profil/izmeni`, do koje vodi dugme „Izmenite profil" iznad.

                Ranije je ovde stajalo `editable={!!user && !account}`, pa je
                sopstveni profil bio izmenljiv i u pregledu: pored sličica su
                stajale pločice „Dodajte još fotografija" i „Dodajte još video
                snimaka", i dugmad za brisanje fotografija. U dizajnu pregled ima
                samo sličice i vezu „Vidi više...".

                Sama `ProfileGallery` već razlikuje ta dva stanja — u pregledu i
                naslov glasi „Galerija fotografija", a u izmeni samo „Galerija". */}
            <ProfileGallery account={mappedAccount} editable={false} />
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
