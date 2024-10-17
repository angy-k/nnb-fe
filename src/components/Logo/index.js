import Image from 'next/image';
import LogoDark from '@/../public/logo-dark.svg';
import Link from 'next/link';

const Logo = ({
  logoSrc = LogoDark,
  logoWidth = 192,
  logoHeight = 60.45,
  logoAlt = 'Header logo.'
}) => {
  return(
    <div className="relative xs:w-full">
      <Link
        href={'/'}
        key={`logo-home-navigation`}
      >{' '}
      <Image
        src={logoSrc}
        width={logoWidth}
        height={logoHeight}
        alt={logoAlt}
      />
      </Link>
    </div>
  )
}

export default Logo
