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

async function getAboutUsData() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/index/about-us`,
            { next: { revalidate: 3600, tags: ['about-us'] } }
        );
        if (!res.ok) return { team: [], settings: {} };
        const data = await res.json();
        return {
            team:     data?.data?.team     ?? [],
            settings: data?.data?.settings ?? {},
        };
    } catch {
        return { team: [], settings: {} };
    }
}

const AboutUsPage = async () => {
    const { team, settings: s } = await getAboutUsData();

    return (
        <div className="grid place-items-center w-full">
        <PageHeroSection
          title={s.hero_title || `Šta je Novosadski \n noćni bazar?`}
          type="image"
          styledTitle={true}
          illustration={false}
          image={true}
        />
        <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto z-1 bg-darkBlue">
          <Divider className="section-divider-light w-1440"/>

          {/* Dark section — 2-col grid matching Figma */}
          <div className="about-us-container">

            {/* Cell 1 — Moon + bold text (row 1, col 1) */}
            <div style={{ position: 'relative', padding: '80px 40px 60px 60px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Moon — floats up/down */}
              <div className="about-us-moon-decor" style={{ position: 'absolute', top: '-10px', left: '30px', zIndex: 1 }}>
                <Image src={MoonIcon} width={150} height={150} alt="" aria-hidden="true" />
              </div>
              {/* White star — twinkles */}
              <div className="about-us-star-decor" style={{ position: 'absolute', bottom: '120px', right: '30px' }}>
                <Image src={WhiteStarIcon} width={22} height={22} alt="" aria-hidden="true" />
              </div>
              <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '28px', lineHeight: '1.55', marginTop: '120px' }}>
                {s.intro_quote || `Trg je oduvek mesto skupljanja, ovaj put skupljamo VAS – preduzetnike, umetnike i male proizvođače, a glavnu ulogu imaće vaši proizvodi i kupci.`}
              </p>
            </div>

            {/* Cell 2 — Owl + shopping photo (row 1, col 2) */}
            <div style={{ position: 'relative', padding: '40px 60px 60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
              {/* Yellow star — twinkles (slow) */}
              <div className="about-us-star-decor--slow" style={{ position: 'absolute', top: '24px', left: '20px' }}>
                <Image src={YellowStarIcon} width={50} height={78} alt="" aria-hidden="true" />
              </div>
              <Image
                src={OwlShoppingRight}
                width={220}
                height={243}
                alt="Sova sa torbama"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {/* Shopping photo — zoom on hover */}
              <a className="about-us-photo-wrap" style={{ maxWidth: '100%' }}>
                <Image
                  src={AboutUsShoppingImage}
                  width={460}
                  height={307}
                  alt="Kupovina na bazaru"
                />
              </a>
            </div>

            {/* Cell 3 — People photo + OwlShoppingLeft (row 2, col 1) */}
            <div style={{ position: 'relative', padding: '60px 40px 60px 60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* White star — twinkles */}
              <div className="about-us-star-decor" style={{ position: 'absolute', top: '24px', right: '40px' }}>
                <Image src={WhiteStarIcon} width={22} height={22} alt="" aria-hidden="true" />
              </div>
              {/* People photo — zoom on hover */}
              <div className="about-us-photo-wrap">
                <Image
                  src={AboutUsPeopleImage}
                  width={460}
                  height={307}
                  alt="Posetioci na bazaru"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                <Image
                  src={OwlShoppingLeft}
                  width={190}
                  height={264}
                  alt="Sova sa torbama"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                {/* Yellow star — twinkles (slow) */}
                <div className="about-us-star-decor--slow" style={{ position: 'absolute', bottom: '-10px', right: '-30px' }}>
                  <Image src={YellowStarIcon} width={44} height={68} alt="" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Cell 4 — Body text (row 2, col 2) */}
            <div style={{ padding: '60px 60px 60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              <p style={{ color: '#ffffff', fontSize: '18px', lineHeight: '1.75' }}>
                {s.body_text_1 || `Da proces kupovine i prodaje bude još bolji, pripremili smo i prateći program gde će naši savremeni dobošari prenositi znanja o važnosti brendiranja, socijalnog preduzetništva, razvoja preduzetništva mladih i ženskog preduzetništva.`}
              </p>
              <p style={{ color: '#ffffff', fontSize: '18px', lineHeight: '1.75' }}>
                {s.body_text_2 || `Sve ovo biće praćeno i dobrom hranom, zabavom i muzikom.`}
              </p>
            </div>

          </div>

          <OrganizerWord
            className="w-full h-full"
            name={s.organizer_name || undefined}
            role={s.organizer_role || undefined}
            photoUrl={s.organizer_photo_url || undefined}
            quote={s.organizer_quote || undefined}
            quoteSub={s.organizer_quote_sub || undefined}
            bio={s.organizer_bio || null}
          />
          <OurTeam members={team} />
        </div>
      </div>
    );
}

export default AboutUsPage;
