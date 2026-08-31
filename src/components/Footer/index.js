'use client'
import { Divider } from "@nextui-org/divider";
import FooterLogo from "../Logo/FooterLogo";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import useUser from '@/data/use-user';

// Linkovi dostupni samo ulogovanim korisnicima (izlagačima)
const AUTH_ONLY_LINKS = ['/paketi']

/**
 * Broj za `tel:` mora biti bez razmaka i crtica — „+381 66 80 03 969" telefon
 * ne bi pozvao kako treba. Prikazani tekst ostaje formatiran radi čitljivosti.
 */
const toTelHref = (phone) => String(phone ?? '').replace(/[^\d+]/g, '')

const Footer = () => {
  const { user } = useUser()

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

  // Posetilac (neulogovan) ne vidi linkove namenjene izlagačima.
  // Dok useUser učitava, user je undefined → link je sakriven do potvrde prijave.
  const visibleFooterItems = user
    ? footerItems
    : footerItems.filter((item) => !AUTH_ONLY_LINKS.includes(item.link))

  const splitIndex = Math.ceil(visibleFooterItems.length / 2)

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
              {visibleFooterItems.slice(0, splitIndex).map((item) => (
                  <Link href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
              ))}
            </div>
            <div className="footer-list-section sm:text-center">
              {visibleFooterItems.slice(splitIndex).map((item) => (
                  <Link  href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-list-container grid grid-cols-1 sm:grid-cols-1 sm:text-center" style={{display: 'flex', flexDirection: 'column'}}>
            {emails.map((email, index) => (
                <a
                  href={`mailto:${email}`}
                  className="office-contact-section-content"
                  key={`footer-email-contact-${index}`}
                >
                  {email}
                </a>
            ))}
            <p className="p-4"></p>
            {phones.map((phone, index) => (
                <a
                  href={`tel:${toTelHref(phone)}`}
                  className="office-contact-section-content"
                  key={`footer-phone-contact-${index}`}
                >
                  {phone}
                </a>
            ))}
            <p className="p-4"></p>
            <Link href="/uslovi-koriscenja">{'Opšti uslovi izlaganja'}</Link>
            <Link href="/politika-privatnosti">{'Politika privatnosti'}</Link>
          </div>
          {/* Godina je zakucana na 2024, kako stoji u dizajnu. */}
        <span className="footer-copyright pt-10 sm:text-center">{'© 2024 NOVOSADSKI NOĆNI BAZAR. Sva prava zadržana.'}</span>
        </div>
        {/* `sm:grid-cols-2` je delilo blok na dve kolone iako u njemu stoji samo
            jedno dete — logo i ikonice su zato živeli u levoj polovini ekrana i
            logo je ispadao preko leve ivice. */}
        <div className="footer-logo grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <FooterLogo />
        </div>
      </div>
      <Divider  className="footer-divider"/>
      {/* `sm:px-5` — kontejner futera na mobilnom nema bočni odmak, pa je ovaj
          red dodirivao ivicu ekrana. */}
      <span className="w-full text-start sm:px-5" style={{maxWidth: '1400px'}}>{`Design and developed: ...`}</span>
    </div>}
    </>
  )
}

export default Footer;