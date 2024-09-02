import Image from 'next/image';
import LogoDark from '../../../public/logo-dark.svg';

const Logo = ({
    logoSrc = LogoDark,
    logoWidth = 192,
    logoHeight = 60.45,
    logoAlt = 'Header logo.'
}) => {
    return(
        <Image
            src={logoSrc}
            width={logoWidth}
            height={logoHeight}
            alt={logoAlt}
        />
    )
}

export default Logo