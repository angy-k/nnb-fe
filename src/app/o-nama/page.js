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
import { uPasuse } from '@/utils/tekst';

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
          introText={s.mission_vision}
        />
        <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto z-1 bg-darkBlue">
          <Divider className="section-divider-light"/>

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
              <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', gap: '1em' }}>
                {uPasuse(s.intro_quote || `Trg je oduvek mesto skupljanja, ovaj put skupljamo VAS – preduzetnike, umetnike i male proizvođače, a glavnu ulogu imaće vaši proizvodi i kupci.`).map((para, i) => (
                  <p key={`iq-${i}`} style={{ color: '#ffffff', fontWeight: '700', fontSize: '28px', lineHeight: '1.55', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Ćelija 2 — fotografija sa sovom preko nje (red 1, kolona 2)

                Mereno sa izvoza Figme (okvir 1920, kolona sadržaja 1440, ćelija 720):
                krug je prečnika 335 na (1155, 1600), a sova 200 široka nalegne
                preko njegove leve ivice, sa vrhom na 45% visine kruga.
                Ranije su stajale jedna ispod druge i nisu se doticale. */}
            <div style={{ position: 'relative', padding: '40px 60px 60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
              {/* Yellow star — twinkles (slow) */}
              <div className="about-us-star-decor--slow" style={{ position: 'absolute', top: '24px', left: '20px' }}>
                <Image src={YellowStarIcon} width={50} height={78} alt="" aria-hidden="true" />
              </div>
              <div className="about-us-krug about-us-krug--gore">
                {/* Shopping photo — zoom on hover */}
                <a className="about-us-photo-wrap" style={{ display: 'block' }}>
                  <Image
                    src={AboutUsShoppingImage}
                    width={460}
                    height={460}
                    alt="Kupovina na bazaru"
                  />
                </a>
                <Image
                  className="about-us-sova about-us-sova--gore"
                  src={OwlShoppingRight}
                  width={220}
                  height={243}
                  alt="Sova sa torbama"
                />
              </div>
            </div>

            {/* Cell 3 — People photo + OwlShoppingLeft (row 2, col 1) */}
            <div style={{ position: 'relative', padding: '60px 40px 60px 60px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* White star — twinkles */}
              <div className="about-us-star-decor" style={{ position: 'absolute', top: '24px', right: '40px' }}>
                <Image src={WhiteStarIcon} width={22} height={22} alt="" aria-hidden="true" />
              </div>
              {/* Krug je u dizajnu prečnika 485 na (240, 2205), a sova široka 220
                  stoji preko njegove desne polovine, cela unutar visine kruga. */}
              <div className="about-us-krug about-us-krug--dole">
                {/* People photo — zoom on hover */}
                <div className="about-us-photo-wrap" style={{ display: 'block' }}>
                  <Image
                    src={AboutUsPeopleImage}
                    width={460}
                    height={460}
                    alt="Posetioci na bazaru"
                  />
                </div>
                <Image
                  className="about-us-sova about-us-sova--dole"
                  src={OwlShoppingLeft}
                  width={190}
                  height={264}
                  alt="Sova sa torbama"
                />
                {/* Yellow star — twinkles (slow) */}
                <div className="about-us-star-decor--slow" style={{ position: 'absolute', bottom: '4%', right: '-8%' }}>
                  <Image src={YellowStarIcon} width={44} height={68} alt="" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Ćelija 4 — tekst (red 2, kolona 2)

                Desno ravnanje je iz dizajna, nije previd. Prvi blok teksta stoji
                levo od svoje slike i ravna se levo, ovaj stoji desno od svoje i
                ravna se desno — tekst se u oba slučaja „naslanja" na spoljnu
                ivicu, a razuđena strana gleda ka fotografiji.

                Mereno na izvozu: u ovom bloku sve linije završavaju na x=669,
                dok im levi kraj varira od 430 do 568. U prvom bloku je obrnuto —
                sve počinju na 96. */}
            <div className="about-us-telo-desno" style={{ padding: '60px 60px 60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              {uPasuse(s.body_text_1 || `Da proces kupovine i prodaje bude još bolji, pripremili smo i prateći program gde će naši savremeni dobošari prenositi znanja o važnosti brendiranja, socijalnog preduzetništva, razvoja preduzetništva mladih i ženskog preduzetništva.`).map((para, i) => (
                <p key={`b1-${i}`} style={{ color: '#ffffff', fontSize: '18px', lineHeight: '1.75', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {para}
                </p>
              ))}
              {uPasuse(s.body_text_2 || `Sve ovo biće praćeno i dobrom hranom, zabavom i muzikom.`).map((para, i) => (
                <p key={`b2-${i}`} style={{ color: '#ffffff', fontSize: '18px', lineHeight: '1.75', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {para}
                </p>
              ))}
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
