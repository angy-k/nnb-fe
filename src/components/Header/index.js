'use client'
import { useEffect, useState } from "react";
import useUser from '@/data/use-user'
import Logo from "../Logo";
import Link from 'next/link';
import CustomButton from '../Button';
import LogoDark from '@/../public/logo-dark.svg'
import NavigateMenu from '@/components/NavigateMenu'
import AuthModal from '@/components/Auths/AuthModal'
import authService from '@/services/authService'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
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
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('static/images/login.svg')
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
    const handleOpenAuthModal = () => {
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
           onBecomeExhibitor={onOpen}
          />
        )}
        <div className="hidden md:flex lg:flex items-center gap-4 md:ml-auto lg:ml-auto">
          <CustomButton
            key={`header-reserve-button`}
            type={'outlined-orange'}
            name={'Rezervišite tezgu'}
            onClick={() => {
              router.push('/dogadjaji')
            }}
          />
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button type="button" aria-label="Profil" className="header-profile-trigger">
                  <span className="header-profile-name">{brandName}</span>
                  <Avatar
                    src={avatarSrc}
                    radius="full"
                    isBordered
                    className="w-10 h-10"
                  />
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
                <DropdownItem key="user" isDisabled textValue="Korisnik">
                  <div className="flex flex-col">
                    <span className="font-semibold">{brandName}</span>
                    <span className="text-sm opacity-80">{exhibitorFullName}</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="profile" className="header-profile-dropdown-item">Profil</DropdownItem>
                <DropdownItem key="logout" className="header-profile-dropdown-item header-profile-dropdown-item-logout text-danger" color="danger">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <CustomButton
              key={`header-button`}
              type={'outlined-light'}
              name={'Postani izlagač'}
              onClick={onOpen}
              className='header-button'
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
        wrapper: 'z-[1000]',
        backdrop: 'z-[999]',
        base: 'w-[min(1440px,calc(100vw-2rem))] h-[min(1092px,calc(100vh-2rem))] mx-4 bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 rounded-[16px]',
      }}
    >
      <ModalContent style={{ zIndex: 1051 }} className="relative rounded-[16px] overflow-hidden h-full flex flex-col">
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
            <ModalBody className="p-0 flex-1 min-h-0 flex !overflow-hidden">
              <AuthModal
                onClose={onClose}
                onSuccess={() => {
                  router.push('/profil')
                }}
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
