'use client'
import { useEffect, useState } from "react";
import useUser from '@/data/use-user'
import Logo from "../Logo";
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '../Button';
import LogoDark from '@/../public/logo-dark.svg'
import NavigateMenu from '@/components/NavigateMenu'
import AuthModal from '@/components/Auths/AuthModal'
import authService from '@/services/authService'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import exhibitorIcon from '@/icons/exhibitor-icon.svg'
import avatarDefaultIcon from '@/icons/avatar-default.svg'
import calendarIcon from '@/icons/calendar-icon.svg'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";

const Header = ({bgColor = '#261A54'}) => {
  const router = useRouter()
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [initialAuthTab, setInitialAuthTab] = useState('login')

  const openAuthModal = (tab = 'login') => {
    setInitialAuthTab(tab)
    onOpen()
  }

  const headerItems = (() => {
    const raw = process.env.headerItems
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  })()

  const { user, loading, mutate } = useUser()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [sentMail, setSentMail] = useState(true)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(avatarDefaultIcon.src)
  const pathname = usePathname()
  const [display, setDisplay] = useState(true);

  const firstName = user?.first_name || ''
  const lastName = user?.last_name || ''
  const exhibitorFullName = `${firstName} ${lastName}`.trim() || user?.name || '-'
  const brandName = user?.name || '-'
  const avatarSrc = user?.profile_photo_url || profilePhotoUrl

  useEffect(() => {
    setDisplay(pathname !== '/not-found')
  }, [pathname])

  useEffect(() => {
    const handleOpenAuthModal = (e) => {
      const tab = e?.detail?.tab || 'login'
      setInitialAuthTab(tab)
      onOpen()
    }

    window.addEventListener('nnb:open-auth-modal', handleOpenAuthModal)
    return () => {
      window.removeEventListener('nnb:open-auth-modal', handleOpenAuthModal)
    }
  }, [onOpen])

  return (
    <div  className="flex justify-between items-center w-full fixed left-0 flex justify-center bg-[#261A54] z-[55]" style={{display: display ? 'flex' : 'none', left: '0', paddingTop: '116px', paddingBottom: '60px',}}>
    <div className='w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto header-container'>
      <div className='header-subcontainer relative sm:!justify-center md:!justify-start md:gap-6'>
        <button
          onClick={()=>setOpenMenu(!openMenu)}
          aria-label="Hamburger button"
          className="inline-flex items-center justify-center pb-2 px-2 text-black-400 transition duration-150 ease-in-out lg:hidden xl:hidden sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              className="inline-flex"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d={`${
                openMenu
                ? 'M6 18L18 6M6 6l12 12'
                : 'M1 7h19M1 13h19M1 19h19'
              }`}
            />
          </svg>
        </button>
        <Logo 
          logoSrc={LogoDark}
          logoWidth={192}
          logoHeight={60.45}
          logoAlt={'Header logo.'}
        />
        <div className="main-header-items items-center">
          {!openMenu && (
            <div className="main-list lg:gap-7 header-items-list">
              {headerItems.map((item) => (
                <ul key={`header-item-${item.id}`}>
                  <Link href={item.link} className='header-item'>{item.name}</Link>
                </ul>
              ))}
            </div>
          )}
        </div>
        {openMenu && (
          // responsive navigation menu
          <NavigateMenu
           onClick={() => setOpenMenu(false)}
           onBecomeExhibitor={() => openAuthModal('login')}
          />
        )}
        <div className="hidden md:flex lg:flex items-center gap-4 md:ml-auto lg:ml-auto">
          {user ? (
            <>
              <button
                className="button-outlined-orange flex items-center gap-2"
                onClick={() => router.push('/dogadjaji')}
                aria-label="Rezervišite tezgu"
              >
                <Image src={calendarIcon} width={20} height={20} alt="" />
                <span className="text">Rezervišite tezgu</span>
              </button>

              <Dropdown
                placement="bottom-end"
                classNames={{
                  base: 'min-w-[200px]',
                  content: 'bg-[#261A54] shadow-xl rounded-2xl p-1 border-none',
                }}
              >
                <DropdownTrigger>
                  <button type="button" aria-label="Profil" className="header-profile-trigger">
                    <span className="header-profile-name">{brandName}</span>
                    {user?.profile_photo_url ? (
                      <Avatar
                        src={user.profile_photo_url}
                        radius="full"
                        isBordered
                        className="w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white" style={{ backgroundColor: '#3ECFCF' }}>
                        <Image src={avatarDefaultIcon} width={22} height={21} alt="avatar" />
                      </div>
                    )}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="header-profile-caret"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profil meni"
                  onAction={async (key) => {
                    if (key === 'profile') {
                      router.push('/profil')
                      return
                    }
                    if (key === 'logout') {
                      await authService.logout()
                      await mutate()
                      router.push('/')
                    }
                  }}
                >
                  <DropdownItem key="user" isDisabled textValue="Korisnik" classNames={{ base: 'opacity-100 cursor-default' }}>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{brandName}</span>
                      <span className="text-sm text-[#56C4CF]">{exhibitorFullName}</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    classNames={{
                      base: 'data-[hover=true]:bg-transparent',
                      title: 'text-white/60 data-[hover=true]:text-white transition-colors',
                    }}
                  >Profil</DropdownItem>
                  <DropdownItem
                    key="logout"
                    classNames={{
                      base: 'data-[hover=true]:bg-transparent',
                      title: 'text-[#EC4923]/70 data-[hover=true]:text-[#EC4923] transition-colors',
                    }}
                  >Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <CustomButton
              type={'outlined-light'}
              name={'Postani izlagač'}
              onClick={() => openAuthModal('login')}
            />
          )}
        </div>
      </div>
    </div>

    <Modal
      backdrop="blur"
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      scrollBehavior="inside"
      hideCloseButton
      classNames={{
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        backdrop: 'nnb-modal-backdrop',
        base: 'nnb-modal-base',
      }}
    >
      <ModalContent style={{ zIndex: 1051, borderRadius: 'var(--nnb-modal-radius)' }} className="relative overflow-hidden h-full flex flex-col">
        {(onClose) => (
          <>
            <ModalHeader className="p-0 h-0 min-h-0">
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
              >
                ×
              </button>
            </ModalHeader>
            <ModalBody className="p-0 flex-1 min-h-0 flex overflow-y-auto">
              <AuthModal
                onClose={onClose}
                onSuccess={() => {
                  router.push('/profil')
                }}
                initialTab={initialAuthTab}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
    </div>
  )
}

export default Header;
