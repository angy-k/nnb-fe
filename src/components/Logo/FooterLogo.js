import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../../icons/facebook-icon-light.svg'
import InstagramIcon from '../../icons/instagram-icon-light.svg'
import YouTubeIcon from '../../icons/youtube-icon-light.svg'
import LogoDark from '@/../public/logo-dark.svg'

const FooterLogo = () => {
  return (
    <div className="footer-socials">
      <div className='flex flex-row gap-5 sm:py-5' style={{justifyContent: 'flex-end'}}>
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
      <Link
        href={'/'}
        key={`logo-home-navigation`}
      >{' '}
      <Image
        src={LogoDark}
        width={302}
        height={95}
        alt={'Footer logo.'}
      />
      </Link>
    </div>
  )
}

export default FooterLogo