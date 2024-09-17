import { Divider } from "@nextui-org/divider";
// import {footerItems} from "../../constants/footerItems"
import FooterLogo from "../Logo/FooterLogo";
import Link from 'next/link';
import office from "../../../office-config/config.json"

const Footer = () => {
    const footerItems = [
        {
            id: 1,
            name: "O nama",
            link: "/o-nama"
        },
        {
            id: 2,
            name: "Događaji",
            link: "/dogadjaji"
        },
        {
            id: 3,
            name: "Projekti",
            link: "/projekti"
        },
        {
            id: 4,
            name: "Paketi",
            link: "/paketi"
        },
        {
            id: 5,
            name: "Blog",
            link: "/blog"
        },
        {
            id: 6,
            name: "Galerija",
            link: "/galerija"
        },
        {
            id: 7,
            name: "Prijatelji",
            link: "/prijatelji"
        },
        {
            id: 8,
            name: "Kontakt",
            link: "/kontakt"
        }
    ];

    return (
        <div className="flex justify-between items-center w-full fixed left-0 justify-center footer-shadow" style={{display: 'flex', flexDirection: 'column', left: '0', bottom: '0', padding: '75px 0'}}>
            <div></div>
                <div className="flex flex-row" style={{ justifyContent: 'space-between', width: '100%', maxWidth: '1400px', justifySelf: 'center'}}>
                    <div className="justify-space-between" style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                        <div className="footer-list-container">
                            {/* {footerItems.map((item) => {
                                <Link  href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
                            })} */}
                            <div  className="footer-list-section">
                                <Link  href={'/o-nama'} key={`footer-item-1`} className="footer-list-item">{'O nama'}</Link>
                                <Link  href={'/dogadjaji'} key={`footer-item-2`} className="footer-list-item">{'Dogadjaji'}</Link>
                                <Link  href={'/projekti'} key={`footer-item-3`} className="footer-list-item">{'Projekti'}</Link>
                                <Link  href={'/paketi'} key={`footer-item-4`} className="footer-list-item">{'Paketi'}</Link>
                            </div>
                            <div  className="footer-list-section">
                                <Link  href={'/blog'} key={`footer-item-5`} className="footer-list-item">{'Blog'}</Link>
                                <Link  href={'/galerija'} key={`footer-item-6`} className="footer-list-item">{'Galerija'}</Link>
                                <Link  href={'/prijatelji'} key={`footer-item-7`} className="footer-list-item">{'Prijatelji'}</Link>
                                <Link  href={'/kontakt'} key={`footer-item-8`} className="footer-list-item">{'Kontakt'}</Link>
                            </div>
                        </div>
                        <div className="footer-list-container" style={{display: 'flex', flexDirection: 'column'}}>
                            {/* {office.officeData.emails.forEach((email) => {
                                <span className="office-contact-section-content">{email}</span>
                            })} */}
                            <span className="office-contact-section-content">{'office@nocnibazar.rs'}</span>
                            <span className="office-contact-section-content">{'rezervacije@nocnibazar.rs'}</span>
                            <p className="p-4"></p>
                            {/* {office.officeData.phones.forEach((phone) => {
                                <span className="office-contact-section-content">{phone}</span>
                            })} */}
                            <span className="office-contact-section-content">{'+381 60 66 44 857'}</span>
                            <p className="p-4"></p>
                            <Link href="/uslovi-koriscenja">{'Uslovi korišćenja i politika privatnosti'}</Link>
                        </div>
                        <span className="pt-10">{'© 2022 NOVOSADSKI NOĆNI BAZAR. Sva prava zadržava.'}</span>
                    </div>
                    <FooterLogo />
                </div>
                <Divider  className="footer-divider"/>
                <span className="w-full text-start" style={{maxWidth: '1400px'}}>{`Design and developed: ...`}</span>
        </div>
    )
}

export default Footer;