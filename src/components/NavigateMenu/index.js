'use client'
import Link from 'next/link'
import Image from 'next/image';
import Button from '@/components/Button';
import useUser from '@/data/use-user'
import authService from '@/services/authService'
import { useRouter } from 'next/navigation'
import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import FacebookIcon from '../../icons/facebook-icon-light.svg'
import InstagramIcon from '../../icons/instagram-icon-light.svg'
import YouTubeIcon from '../../icons/youtube-icon-light.svg'

const NavigateMenu = ({
  className,
  onClick,
  onBecomeExhibitor
}) => {
  const router = useRouter()
  const { user, mutate } = useUser()

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

  const avatarSrc = user?.profile_photo_url || 'static/images/login.svg'
  const firstName = user?.first_name || ''
  const lastName = user?.last_name || ''
  const exhibitorFullName = `${firstName} ${lastName}`.trim() || user?.name || '-'
  const brandName = user?.name || '-'

  const wrapperClassName = className
    ? `${className} bg-[#261A54] flex flex-col overflow-hidden`
    : `absolute left-0 sm:pl-10 lg:pl-16 pt-19 bg-[#261A54] w-full px-7 xl:relative xl:top-0 xl:h-auto xl:flex xl:hidden flex flex-col overflow-hidden`

  const defaultWrapperStyle = className
    ? undefined
    : { top: '120px', height: 'calc(100vh - 120px)' }

  return (
    <div className={wrapperClassName} style={defaultWrapperStyle}>
      <div className="flex-1 overflow-y-auto pb-8">
        <div className='header-menu-items-list'>
          {headerItems.map((item) => (
            <ul key={`header-item-${item.id}`}>
              <Link href={item.link} className='header-item' onClick={onClick}>{item.name}</Link>
            </ul>
          ))}
        </div>

        <div className="mt-6">
          <Button
            keyValue="mobile-reserve"
            type={'outlined-orange'}
            name={'Rezervišite tezgu'}
            onClick={() => {
              router.push('/dogadjaji')
              if (typeof onClick === 'function') onClick()
            }}
          />
        </div>

        {user ? (
          <div className="mt-6 flex flex-col gap-4">
            <Dropdown placement="bottom-start">
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
                    if (typeof onClick === 'function') onClick()
                    return
                  }

                  if (key === 'logout') {
                    await authService.logout()
                    await mutate()
                    router.push('/')
                    if (typeof onClick === 'function') onClick()
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
          </div>
        ) : (
          <div className="mt-6">
            <Button
              key={`header-button`}
              type={'outlined-light'}
              name={'Postani izlagač'}
              onClick={() => {
                if (typeof onBecomeExhibitor === 'function') onBecomeExhibitor()
                if (typeof onClick === 'function') onClick()
              }}
              className='header-button'
            />
          </div>
        )}
      </div>

      <div className='shrink-0 pt-10 xl:hidden'>
        <div className='flex flex-row gap-5' style={{justifyContent: 'flex-end'}}>
          <Image
            src={FacebookIcon}
            width={30}
            height={30}
            alt={'Footer facebook icon.'}
          />
          <Image
            src={InstagramIcon}
            width={30}
            height={30}
            alt={'Footer instagram icon.'}
          />
          <Image
            src={YouTubeIcon}
            width={30}
            height={30}
            alt={'Footer youtube icon.'}
          />
        </div>
      </div>
    </div>
  )
}

export default NavigateMenu;
