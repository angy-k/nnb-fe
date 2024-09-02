import { Divider } from "@nextui-org/divider";
import {footerItems} from "../../constants/footerItems"
import FooterLogo from "../Logo/FooterLogo";
import Link from 'next/link';

const Footer = () => {
    return (
        <div>
            <div>
                <div>
                    <div className="footer-list-container">
                        {footerItems.map((item) => {
                            <Link  href={item.link} key={`footer-item-${item.id}`} className="footer-list-item">{item.name}</Link>
                        })}
                    </div>
                    <div>
                        {office.officeData.emails.forEach((email) => {
                            <span className="office-contact-section-content">{email}</span>
                        })}
                        {office.officeData.phones.forEach((phone) => {
                            <span className="office-contact-section-content">{phone}</span>
                        })}
                        <Link href="/uslovi-koriscenja">{'Uslovi korišćenja i politika privatnosti'}</Link>
                    </div>
                    <span>{'© 2022 NOVOSADSKI NOĆNI BAZAR. Sva prava zadržava.'}</span>
                </div>
                <FooterLogo />
            </div>
            <Divider  className="section-divider"/>
            <span>{`Design and developed: ...`}</span>
        </div>
    )
}

export default Footer;