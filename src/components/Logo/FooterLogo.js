import Image from 'next/image';

const FooterLogo = () => {
    return (
        <div className="footer-socials">
            <div>
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
            <Image
                src={LogoLight}
                width={302}
                height={95}
                alt={'Footer logo.'}
            />
        </div>
    )
}

export default FooterLogo