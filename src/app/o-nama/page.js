'use client';
import PageHeroSection from "@/components/Hero/pageOwl";
import OurTeam from '@/components/CardsLayout/OurTeam';
import OrganizerWord from "@/components/Organizer";
import Image from 'next/image';
import MoonIcon from '@/icons/moon-icon.svg';
import YellowStarIcon from '@/icons/yellow-star.svg';
import WhiteStarIcon from '@/icons/white-star.svg';
import OwlShoppingRight from '@/icons/owl-shopping-right.svg';
import OwlShoppingLeft from '@/icons/owl-shopping-left.svg';
import AboutUsShoppingImage from '@/../public/about-us-shopping-image.png';
import AboutUsPeopleImage from '@/../public/about-us-people-image.png';
import { Divider } from "@nextui-org/divider";

const AboutUsPage = () => {
    return (
        <div className="grid place-items-center w-full">
        <PageHeroSection 
          title={`Šta je Novosadski \n noćni bazar?`}
          type="image"
          styledTitle={true}
          illustration={false}
          image={true}
        />
        <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto pb-48 z-1 bg-darkBlue">
          <Divider className="section-divider-light w-1440"/>
          <div 
            className="about-us-container" 
            style={{display: 'none'}} //TODO: add animations - image on hover grow and stars and moon changes
          >
            <div>
              <Image
                src={MoonIcon}
                width={236}
                height={246}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <p className="w-6/12 font-bold font-[36px] text-[#ffffff]">{`Trg je oduvek mesto okupljanja, ovaj put okupljamo VAS – preduzetnike, umetnike i male proizvođače, a glavnu ulogu imaće vaši proizvodi i kupci.`}</p>
            </div>
            <div>
              <Image
                src={YellowStarIcon}
                width={89}
                height={88}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={WhiteStarIcon}
                width={47}
                height={48}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={OwlShoppingRight}
                width={322}
                height={3445}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={OwlShoppingRight}
                width={322}
                height={345}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={AboutUsShoppingImage}
                width={830}
                height={553}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
            </div>
            <div>
              <Image
                src={WhiteStarIcon}
                width={47}
                height={48}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={AboutUsPeopleImage}
                width={830}
                height={553}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={OwlShoppingLeft}
                width={271}
                height={376}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
              <Image
                src={YellowStarIcon}
                width={89}
                height={88}
                alt={'moon icon on about us section'}
                // style={{marginLeft: '14px'}}
                className='w-10'
              />
            </div>
            <div>
              <p className="w-6/12 font-normal font-[36px] text-[#ffffff]">{`Da proces kupovine i prodaje bude još bolji, pripremili smo i prateći program gde će naši savremeni dobošari prenositi znanja o važnosti brendiranja, socijalnog preduzetništva, razvoja preduzetništva mladih i ženskog preduzetništva.
              Sve ovo biće praćeno i dobrom hranom, zabavom i muzikom.`}</p>
            </div>
          </div>
          <OrganizerWord className="w-full h-full" />
          <OurTeam />
        </div>
      </div>
    );
}

export default AboutUsPage;