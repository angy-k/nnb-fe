'use client'
import { useEffect, useState } from "react";
import useUser from '@/data/use-user'
import Logo from "../Logo";
import Link from 'next/link';
import CustomButton from '../Button';
import LogoDark from '@/../public/logo-dark.svg'
import NavigateMenu from '@/components/NavigateMenu'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@nextui-org/react";

const Header = ({bgColor = '#261A54'}) => {
  const router = useRouter()
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const {user, loading} = useUser()
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [modalOpen] = useState(false)
  const [sentMail, setSentMail] = useState(true)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('static/images/login.svg')
  const pathname = usePathname()
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    setDisplay(pathname !== '/not-found')
  }, [pathname])

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <div  className="flex justify-between items-center w-full fixed left-0 flex justify-center bg-[#261A54] z-[55]" style={{display: display ? 'flex' : 'none', left: '0', paddingTop: '116px', paddingBottom: '60px',}}>
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
        <div className="main-header-items items-center">
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
          <CustomButton
            key={`header-button`}
            type={'outlined-light'}
            name={'Postani izlagač'}
            onClick={onOpen}
            className='header-button'
          />
      </div>
    </div>

    <Modal
      backdrop="blur"
      placement="center"
      isOpen={modalOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      classNames="w-[200px] h-[200px] bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
    >
      <ModalContent style={{ zIndex: 1051 }}>
        {(onClose) => (
          <>
            <ModalHeader classNames="flex flex-col gap-1">{'title'}</ModalHeader>
            <ModalBody>
              <p>{`ovde sam`}</p>
            </ModalBody>
            <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Action
            </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </div>
  )
}

export default Header;
