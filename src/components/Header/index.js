import Logo from "../Logo";
import Link from 'next/link';
import Button from '../Button';
// import { headerItems } from "../../constants/headerItems";
import LogoDark from '../../../public/logo-dark.svg'



const Header = () => {
    function becomeExhibitor() {
        //TODO redirect on register
    }
    const headerItems = [
        {
            id: 1,
            name: "O nama",
            link: ""
        },
        {
            id: 2,
            name: "Događaji",
            link: ""
        },
        {
            id: 3,
            name: "Projekti",
            link: ""
        },
        {
            id: 4,
            name: "Blog",
            link: ""
        },
        {
            id: 5,
            name: "Galerija",
            link: ""
        },
        {
            id: 6,
            name: "Kalendar",
            link: ""
        },
        {
            id: 7,
            name: "Prijatelji",
            link: ""
        },
        {
            id: 8,
            name: "Kontakt",
            link: ""
        }
    ];

    return (
        <div className='header-container'>
            <div className='header-subcontainer'>
            <Logo 
                logoSrc={LogoDark}
                logoWidth={192}
                logoHeight={60.45}
                logoAlt={'Header logo.'}
            />
            <div className='header-items-list'>
                {/* {headerItems.forEach((item) => {
                    <Link href={item.link} key={`header-item-${item.id}`} className='header-item'>{item.name}</Link>
                })} */}
                <Link href="/" key={`header-item-1`} className="header-item">{`O nama`}</Link>
                <Link href="/" key={`header-item-2`} className="header-item">{`Događaji`}</Link>
                <Link href="/" key={`header-item-3`} className="header-item">{`Projekti`}</Link>
                <Link href="/" key={`header-item-4`} className="header-item">{`Blog`}</Link>
                <Link href="/" key={`header-item-5`} className="header-item">{`Galerija`}</Link>
                <Link href="/" key={`header-item-6`} className="header-item">{`Kalendar`}</Link>
                <Link href="/" key={`header-item-7`} className="header-item">{`Prijatelji`}</Link>
                <Link href="/" key={`header-item-8`} className="header-item">{`Kontakt`}</Link>
            </div>
                <Button
                    key={`header-button`}
                    type={'outlined-light'}
                    name={'Postani izlagač'}
                    onClick={becomeExhibitor()}
                    className='header-button'
                />
            </div>
        </div>
    )
}

export default Header;