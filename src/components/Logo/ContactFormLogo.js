import LogoLight from "@/../public/logo-light.svg"
import FacebookIcon from "@/icons/facebook-icon-dark.svg"
import InstagramIcon from "@/icons/instagram-icon-dark.svg"
import YouTubeIcon from "@/icons/youtube-icon-dark.svg"
import Image from 'next/image';

const ContactFormLogo = () => {
  const officeData = (() => {
    const raw = process.env.officeData
    if (!raw) return {}
    if (typeof raw === 'object') return raw
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  })()

  const phones = Array.isArray(officeData.phones) ? officeData.phones : []
  const emails = Array.isArray(officeData.emails) ? officeData.emails : []

  return(
    <div className="office-contact">
      <Image
        src={LogoLight}
        width={260}
        height={81.8}
        alt={'Contact form office logo.'}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: '25px', paddingTop: '57px', paddingBottom: '42px'}}>
        <span className="office-contact-section-title text-black font-bold pt-10">{'Telefon'}</span>
        {phones.map((phone, index) => (
            <span className="office-contact-section-content text-black" key={`contact-section-phone-contact-${index}`}>{phone}</span>
        ))}
        <span className="office-contact-section-title text-black font-bold pt-10">{'E-mail'}</span>
        {emails.map((email, index) => (
            <span className="office-contact-section-content text-black" key={`contact-section-email-contact-${index}`}>{email}</span>
        ))}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', gap: '15px', paddingTop: '25px'}}>
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

export default ContactFormLogo;
