import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../../icons/facebook-icon-light.svg'
import InstagramIcon from '../../icons/instagram-icon-light.svg'
import YouTubeIcon from '../../icons/youtube-icon-light.svg'
import LogoDark from '@/../public/logo-dark.svg'

const FooterLogo = () => {
  const socialLinks = (() => {
    const raw = process.env.socialLinks
    if (!raw) return {}
    if (typeof raw === 'object') return raw
    try { return JSON.parse(raw) } catch { return {} }
  })()

  return (
    <div className="footer-socials">
      <div className='flex flex-row gap-5 sm:py-5' style={{justifyContent: 'flex-end'}}>
        <a href={socialLinks.fb || '#'} target="_blank" rel="noopener noreferrer">
          <Image
            src={FacebookIcon}
            width={30}
            height={30}
            alt={'Footer facebook icon.'}
          />
        </a>
        <a href={socialLinks.instagram || '#'} target="_blank" rel="noopener noreferrer">
          <Image
            src={InstagramIcon}
            width={30}
            height={30}
            alt={'Footer instagram icon.'}
          />
        </a>
        <a href={socialLinks.youtube || '#'} target="_blank" rel="noopener noreferrer">
          <Image
            src={YouTubeIcon}
            width={30}
            height={30}
            alt={'Footer youtube icon.'}
          />
        </a>
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