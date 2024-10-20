'use client'
import { useEffect, useState } from "react";
import useUser from '@/data/use-user'
import Logo from "../Logo";
import Link from 'next/link';
import Button from '../Button';
import LogoDark from '@/../public/logo-dark.svg'
import NavigateMenu from '@/components/NavigateMenu'
import { usePathname } from 'next/navigation';

const Header = ({bgColor = '#261A54'}) => {
  function becomeExhibitor() {
    //TODO redirect on register
  }

  const {user, loading} = useUser()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [sentMail, setSentMail] = useState(true)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('static/images/login.svg')
  const pathname = usePathname()
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    setDisplay(pathname !== '/not-found')
  }, [pathname])

  return (
    <div  className="flex justify-between items-center w-full fixed left-0 flex justify-center bg-[#261A54] z-5" style={{display: display ? 'flex' : 'none', left: '0', paddingTop: '116px', paddingBottom: '60px',}}>
    <div className='w-full mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto header-container'>
      <div className='header-subcontainer'>
        <button
          onClick={()=>setOpenMenu(!openMenu)}
          aria-label="Hamburger button"
          className="inline-flex items-center justify-center pb-2 px-2 text-black-400 transition duration-150 ease-in-out lg:hidden xl:hidden"
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
        <div className="flex items-center">
          {/* loading needs to be !loading here */}
          {loading && (
            <>
            {!openMenu && (
              <div className="main-list lg:gap-7 header-items-list">
              {JSON.parse(JSON.stringify(process.env.headerItems).toString()).map((item) => (
                <ul key={`header-item-${item.id}`}>
                  <Link href={item.link} className='header-item'>{item.name}</Link>
                </ul>
              ))}
            </div>
            )}
            </>
          )}
        </div>
        {openMenu && (
          // responsive navigation menu
          <NavigateMenu 
           onClick={() => setOpenMenu(!openMenu)}
           className={`absolute top-16 left-0 sm:pl-10 lg:pl-16 pt-19 bg-${bgColor} w-full px-7 h-screen xl:relative xl:top-0 xl:h-auto xl:flex xl:hidden`}
          />
        )}
          <Button
            key={`header-button`}
            type={'outlined-light'}
            name={'Postani izlagač'}
            onClick={becomeExhibitor()}
            className='header-button'
          />
      </div>
    </div>
    </div>
  )
}

export default Header;
