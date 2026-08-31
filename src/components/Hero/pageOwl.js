'use client';
import Image from "next/image";
import Link from "next/link";
import aboutUsIcon from '@/icons/about-us-event-icon.svg';
import photoGaleryIcon from '@/icons/photo-galery-icon.svg';
import videoGaleryIcon from '@/icons/video-galery-icon.svg';
import { cn } from '@/utils';
import HeroOwlWithEyes from '@/components/Hero/HeroOwlWithEyes';
import { uPasuse } from '@/utils/tekst'

const PageHiroSection = ({
  title,
  type = 'title',
  styledTitle = false,
  description,
  icons,
  illustration = true,
  image = false,
  tall = false,
  // Uvodni tekst ispod naslova (misija i vizija na stranici „O nama").
  // Prazan prop znači da se sekcija ne prikazuje, pa ostale stranice ostaju netaknute.
  introText,
}) => {

  const formatTitle = (styledWords, classStyle) => {
    const words = title.split(' ')
    let styledDiv = []
    let remainingDiv = []
    words.map((word, index) => {
      if (styledWords.includes(word)) {
        styledDiv.push(
          word === '\n'
            ? <br key={`br-${index}`} />
            : <span key={`styled-${index}`}>{` ${word} `}</span>,
        )
      } else {
        remainingDiv.push(<span key={`word-${index}`}>{`${word} `}</span>)
      }
    })
    return (
      <div className="about-us-title-container" 
      style={{
        display: 'inline',
        gap: '5px',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        textAlign: 'center',
      }}
      >
        <span 
          className="page-hero-section-title title-row" 
          style={{ display: 'inline', whiteSpace: 'nowrap' }}
        >
          {remainingDiv}
          </span><span 
          className={
            classStyle === 'aboutUs'
              ? 'page-hero-section-about_us title-row'
              : 'page-hero-section-title'
          }
          style={{ display: 'inline', whiteSpace: 'nowrap' }}
        >
          {styledDiv}
        </span>
      </div>
    )
  }
  // Hero height accounts for the fixed transparent header (paddingTop 116px + logo ~61px + paddingBottom 60px = ~237px).
  // Content in HeroLeft uses pt-[240px] to start just below the header.
  const visokHero = !!(tall || icons || description)

  /*
   * Tri visine trake, mereno na pet izvoza dizajna (okvir 1920):
   *
   *   572  (29,79vw)  Blog, Kalendar, Događaji, Projekti, Prijatelji
   *   891  (46,41vw)  Galerija — ima ikonice ispod naslova
   *   1040 (54,17vw)  Kontakt — ima opis ispod naslova
   *
   * Galerija je do sada dobijala Kontaktovu visinu, jer je kod razlikovao samo
   * „visok" i „nizak".
   */
  const heroHeight = icons
    ? 'page-hero-section--ikonice'
    : visokHero
    ? 'page-hero-section--visok'
    : image
    ? 'page-hero-section--slika'
    : 'page-hero-section--nizak'

  return (
    <div
      className={cn("w-full h-auto bg-[#261A54] page-hero-section relative", heroHeight)}
      /* Sova se preliva preko donje ivice trake i svetla sekcija je prekriva —
         tako i treba, presek je deo dizajna.

         Hero namerno nema svoj `z-index`: time bi napravio zaseban sloj i
         zatvorio sve unutra, pa vrh kljuna ne bi mogao da izađe iznad svetle
         sekcije. Bez njega sova i dalje ostaje ispod (sekcija je na `z-1`, sova
         bez sloja), a kljun sa svojim `z-index: 3` izlazi iznad. */
      style={type !== 'image' ? { overflow: 'visible' } : undefined}
    >
      {type === 'image' ? (
        <div className="w-full grid place-items-center mx-auto max-w-[1400px]" style={{ marginLeft: 'auto', marginRight: 'auto', overflow: 'hidden' }}>
          <HeroWithImage
            title={title}
            formatTitle={formatTitle}
            image={image}
            illustration={illustration}
            introText={introText}
          />
        </div>
      ) : (
        <div className="w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 place-items-center" style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
          <HeroLeft
            title={title}
            description={description}
            icons={icons}
            visokHero={visokHero}
          />
          <HeroRight
            illustration={illustration}
            description={description}
            visokHero={visokHero}
          />
        </div>
      )}

      {/* Scroll indicator — shown only when gallery navigation icons are present */}
      {icons && (
        <div
          className="absolute bottom-6 left-1/2 hidden md:block lg:block"
          style={{ transform: 'translateX(-50%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default PageHiroSection

/**
 * Naslov stranice, sa opisom ili ikonicama ispod.
 *
 * Odmak od vrha trake se razlikuje po vrsti hero-a i zadat je u CSS-u — vidi
 * `.page-hero-left`. Ranije je bio fiksnih 240px za sve, pa je naslov stajao
 * 99px previsoko na niskoj traci i 167px na visokoj.
 */
const HeroLeft = ({ title, description, icons, visokHero }) => {
  return (
    <div
      // `sm:px-4` — naslov stranice je na mobilnom stajao zalepljen uz levu
      // ivicu ekrana. Važi za sve stranice sa ovim hero-om (Kalendar, Događaji,
      // Blog, Galerija, Projekti, Prijatelji).
      className={cn(
        'flex-1 w-full sm:pt-[100px] nnb-gutter page-hero-left',
        visokHero && 'page-hero-left--visok',
      )}
      style={{alignSelf: 'flex-start'}}
    >
      {title && <div 
        className="page-hero-section-title pt-[25px]"
        >
          {title}
        </div>}
      {(icons || description) && <div>
        {/* Mere krugova sa ikonicama su u CSS-u, kao udeo okvira od 1920 —
            vidi `.page-hero-section-icons`. Bile su fiksnih 140/88/36/20px, pa
            se ceo blok od 270px nije smanjivao sa širinom i ispod ~1440 je
            izlazio iz tamne trake, koju svetla sekcija onda seče. */}
        {icons && <div className="page-hero-section-icons">
            <Link
              prefetch={false}
              href={"/galerija/fotografije"}
              className="items-center page-hero-ikona-link"
            >
              <div className="page-hero-ikona-krug" style={{ background: '#56C4CF' }}>
                <img src={photoGaleryIcon.src} alt="Fotografije" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span>{`Fotografije`}</span>
            </Link>
            <Link
              prefetch={false}
              href={"/galerija/video"}
              className="items-center page-hero-ikona-link"
            >
              <div className="page-hero-ikona-krug" style={{ background: '#F18020' }}>
                <img src={videoGaleryIcon.src} alt="Video snimci" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span>{`Video snimci`}</span>
            </Link>
        </div>}
        {description && <span
          className="page-hero-section-description mt-20 w-full"
        >
          {description}
        </span>}
      </div>}
    </div>
  )
}

/**
 * Sova uz naslov stranice.
 *
 * Hero ima dve visine — 750px kad ima opis ili ikonice (Kontakt, Kalendar,
 * Galerija) i 450px kad ima samo naslov (Blog, Događaji, Projekti, Prijatelji).
 * Sova je uvek počinjala 237px od vrha, pa je na niskom hero-u svetla sekcija
 * sekla kroz oči i ostavljala vrh kljuna kao usamljen narandžast trougao.
 *
 * Na niskom hero-u zato ide više, tako da presek padne ispod kljuna — na donjoj
 * ivici tirkizne glave. Visok hero ostaje netaknut; tamo sova staje cela.
 */
const HeroRight = ({ description, illustration, visokHero }) => (
  <div
    className="flex-1 w-full page-hero-right"
    // Okvir sove se preliva preko donje ivice hero sekcije, pa bi hvatao klikove
    // namenjene sadržaju ispod. `pointer-events: none` ih propušta.
    // Širina je u CSS-u, kao udeo širine okvira — vidi `.page-hero-right`.
    style={{ alignSelf: 'flex-start', pointerEvents: 'none' }}
  >
    {illustration && <HeroOwlWithEyes kljunPrekoIvice={!visokHero} />}
  </div>
)


const HeroWithImage = ({ title, formatTitle, image, illustration, introText }) => {
  return (
    <div
      // Zaglavlje je na mobilnom visoko 84px; sa 88px odmaka naslov mu je bio
      // zalepljen uz donju ivicu.
      className="w-full items-center pt-80 sm:pt-[116px] about-us-hero-kolona"
      style={{display: 'flex', flexDirection: 'column', gap: '50px'}}
    >
      {/* Uvodni tekst stoji IZNAD naslova.

          Prazan red razdvaja pasuse, a `white-space: pre-line` čuva i obične
          prelome reda — ranije su se gubili, pa je unos iz admina ispadao kao
          jedan zbijen blok bez obzira kako je otkucan. */}
      {introText && (
        <div className="about-us-intro-text">
          {uPasuse(introText).map((pasus, i) => (
            <p key={`intro-${i}`}>{pasus}</p>
          ))}
        </div>
      )}
      {title && <div className="page-hero-section-title">
        {formatTitle('Novosadski \n noćni bazar?', 'aboutUs')}
      </div>}
      {/* Fotografija sa dugmetom „Pogledaj galeriju" u donjem levom uglu.

          Mereno sa izvoza Figme: fotografija je 1439 × 485 na (240, 655), a
          dugme počinje 60px od njene leve ivice i stoji 40px iznad donje —
          otuda udeli ispod, da prate fotografiju na svakoj širini. */}
      {image && (
        <div className="about-us-hero-image-wrap">
          <Image
            src={'/about-us-hero-image.png'}
            className="about-us-hero-image"
            width={1440}
            height={486}
            alt='about-us-hero-image'
          />
          <Link href="/galerija" className="about-us-gallery-btn">
            Pogledaj galeriju
          </Link>
        </div>
      )}
      {!illustration && <div
        className="flex flex-row grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 about-us-hero-content"
        style={{width: '100%', height: '100%', maxWidth: '1400px'}}
        >
        <div 
          className="flex flex-row w-full align-center items-center gap-[20px]"
        >
          <Image 
            src={aboutUsIcon}
            width={140}
            height={140}
            alt="about-us-icon"
          />
          <span className="about-us-hero-title max-w-[400px]">{`Prvi Novosadski noćni bazar`}</span>
        </div>
        <span
          className="about-us-hero-text w-full content-center font-[18px] text-[#ffffff]"
          style={{ whiteSpace: 'normal' }}
        >
          <span
            className="flex content-center font-bold"
            style={{display:'inline', whiteSpace: 'normal'}}
          >
            {`Prvi Novosadski noćni bazar`}
          </span>
          <span 
            className="flex content-center align-baseline font-normal" 
            style={{display:'inline', whiteSpace: 'break-spaces'}}
          >
            {` održan je 1. septembra 2017. godine na Ribljoj pijaci. Zajedničkom pozitivnom energijom izlagača i posetilaca, učinili smo da ovaj događaj svi zapamte i podstaknu nas da razvijamo ovu priču i da noćni bazari postanu tradicija. Na Prvom novosadskom noćnom bazaru bilo je preko 160 izlagača i preko 4000 posetilaca, a za najmlađe su bile organizovane edukativne radionice.`}</span>
          </span>
      </div>}
    </div>
  )
}
const heroWithoutImage = ({ title, description }) => {
  return (
    <div>

    </div>
  )
}
