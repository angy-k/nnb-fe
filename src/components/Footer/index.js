'use client'
import { Divider } from "@nextui-org/divider";
import FooterLogo from "../Logo/FooterLogo";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";

const Footer = () => {
  const footerItems = (() => {
    const raw = process.env.footerItems
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  })()

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

  const emails = Array.isArray(officeData.emails) ? officeData.emails : []
  const phones = Array.isArray(officeData.phones) ? officeData.phones : []

  const pathname = usePathname()
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    setDisplay(pathname !== '/not-found')
  }, [pathname])

  return (
    <>
    {display && <div className="footer-container flex justify-between items-center w-full left-0 justify-center footer-shadow p-5 mobileMin:w-full md:pl-9 lg:pl-14 lg:pb-11">
      <div className="w-full gap-x-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2" style={{ justifyContent: 'space-between', width: '100%', maxWidth: '1400px', justifySelf: 'space-between'}}>
        <div className="footer-subsection justify-space-between grid gap-y-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div className="footer-list-container grid grid-cols-1 sm:grid-cols-1 sm:justify-center">
            <div className="footer-list-section sm:text-center">
              {footerItems.slice(0, 4).map((item) => (
                  <Link href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
              ))}
            </div>
            <div className="footer-list-section sm:text-center">
              {footerItems.slice(4,8).map((item) => (
                  <Link  href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-list-container grid grid-cols-1 sm:grid-cols-1 sm:text-center" style={{display: 'flex', flexDirection: 'column'}}>
            {emails.map((email, index) => (
                <span className="office-contact-section-content" key={`footer-email-contact-${index}`}>{email}</span>
            ))}
            <p className="p-4"></p>
            {phones.map((phone, index) => (
                <span className="office-contact-section-content" key={`footer-phone-contact-${index}`}>{phone}</span>
            ))}
            <p className="p-4"></p>
            <Link href="/uslovi-koriscenja">{'Uslovi korišćenja i politika privatnosti'}</Link>
          </div>
          <span className="pt-10 sm:text-center">{'© 2022 NOVOSADSKI NOĆNI BAZAR. Sva prava zadržava.'}</span>
        </div>
        <div className="footer-logo grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
          <FooterLogo />
        </div>
      </div>
      <Divider  className="footer-divider"/>
      <span className="w-full text-start" style={{maxWidth: '1400px'}}>{`Design and developed: ...`}</span>
    </div>}
    </>
  )
}

export default Footer;