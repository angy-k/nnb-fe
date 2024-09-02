import LogoLight from "../../../public/logo-light.svg"
import office from "../../../office-config/config.json"
import FacebookIcon from "../../icons/facebook-icon-dark.svg"
import InstagramIcon from "../../icons/instagram-icon-dark.svg"
import YouTubeIcon from "../../icons/youtube-icon-dark.svg"
import Image from 'next/image';

const ContactFormLogo = () => {
    return(
        <div className="office-data">
            <Image
                src={LogoLight}
                width={260}
                height={81.8}
                alt={'Contact form office logo.'}
            />
            <div>
                <span className="office-contact-section-title">{'Telefon'}</span>
                {office.officeData.phones.forEach((phone) => {
                    <span className="office-contact-section-content">{phone}</span>
                })}
                <span className="office-contact-section-title">{'E-mail'}</span>
                {office.officeData.emails.forEach((email) => {
                    <span className="office-contact-section-content">{email}</span>
                })}
            </div>
            <div>
                <Image
                    src={FacebookIcon}
                    width={30}
                    height={30}
                    alt={'Contact form facebook icon.'}
                />
                <Image
                    src={InstagramIcon}
                    width={30}
                    height={30}
                    alt={'Contact form instagram icon.'}
                />
                <Image
                    src={YouTubeIcon}
                    width={30}
                    height={30}
                    alt={'Contact form youtube icon.'}
                />
            </div>
        </div>
    )
}

export default ContactFormLogo