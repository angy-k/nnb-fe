'use client';
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@nextui-org/avatar";
import aboutUsIcon from '@/icons/about-us-event-icon.svg';
import photoGaleryIcon from '@/icons/photo-galery-icon.svg';
import videoGaleryIcon from '@/icons/video-galery-icon.svg';
import { cn } from '@/utils';

const PageHiroSection = ({
  title,
  type = 'title',
  styledTitle = false,
  description,
  icons,
  illustration = true,
  image = false,
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
  const titleHero = () => {
    return (
      <div className="w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto page-hero-section"
      >
        <HeroLeft
          title={title} 
          description={description}
          icons={icons} 
        />
        <HeroRight 
          description={description}
        />
      </div>
    )
  }

  const getHeroSection = () => {
    switch(type) {
      case 'image':
        return (
          <div className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto page-hero-section">
            <HeroWithImage 
              title={title}
              formatTitle={formatTitle}
              image={image}
              illustration={illustration}
            />
          </div>
        )
      case 'title' || 'icons' || 'description':
        return (
          <div 
            className={cn("w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto page-hero-section",title ? '' : 'pt-60')}
            // style={{gridTemplateColumns: '1fr 1fr'}}
          >
            <HeroLeft
              title={title} 
              description={description}
              icons={icons} 
            />
            <HeroRight 
              illustration={illustration}
              description={description}
            />
          </div>
        )
      default: 
        return (
          <div>
            {titleHero()}
          </div>
        )
    }
    
    
  }

  return (
    <div 
      className={cn("w-full h-auto bg-[#261A54] page-hero-section", (description || icons) ? 'md:h-[572px] lg:h-[572px] xl:h-[572px] 2xl:h-[572px]' : (image ? 'md:h-[1374px] lg:h-[1374px] xl:h-[1374px] 2xl:h-[1374px]' : 'md:h-[372px] lg:h-[372px] xl:h-[372px] 2xl:h-[372px]'))}
    >
      {getHeroSection()}
    </div>
  )
}

export default PageHiroSection

const HeroLeft = ({ title, description, icons }) => {
  return (
    <div 
      className="flex-1 w-full md:w-6/12 lg:w-6/12 xl:w-6/12 2xl:w-6/12 pt-0 md:pt-[40px]" 
      style={{alignSelf: 'flex-start'}}
    >
      {title && <div 
        className="page-hero-section-title pt-[25px]"
        >
          {title}
        </div>}
      {(icons || description) && <div>
        {icons && <div 
            className="page-hero-section-icons pt-[88px]" 
            style={{display: 'flex', flexDirection: 'row', gap: '36px'}}
          >
            <Link
              prefetch={false}
              href={"/galerija/fotografije"}
              className="items-center" 
              style={{display: 'flex', flexDirection: 'column', gap: '20px'}}
              >
              <Avatar
                src={photoGaleryIcon.src}
                icon
                radius="full"
                className="w-[140px] h-[140px] text-tiny bg-[#56C4CF] p-[36px]"
              />
              <span>{`Fotografije`}</span>
            </Link>
            <Link
              prefetch={false}
              href={"/galerija/video"}
              className="items-center" 
              style={{display: 'flex', flexDirection: 'column', gap: '20px'}}
            >
              <Avatar
                src={videoGaleryIcon.src}
                icon
                radius="full"
                className="w-[140px] h-[140px] text-[65px] bg-[#F18020] p-[36px]"
              />
              <span>{`Video zapisi`}</span>
            </Link>
        </div>}
        {description && <span 
          className="page-hero-section-description mt-20 w-full md:w-6/12 lg:w-6/12 2xl:x-2/12"
        >
          {description}
        </span>}
      </div>}
    </div>
  )
}

const HeroRight = ({ description, illustration }) => (
  <div 
    className={
      cn("flex-1 w-full md:w-6/12 lg:w-6/12 xl:w-6/12 2xl:w-6/12", description ? 'pt-[40px]' : 'pt-[40px]')
    }
  >
    {illustration && <Image 
      maxwidth={'660px'}
      width={660}
      maxheight={'914px'}
      height={914}
      src='/hero-owl.svg'
      alt="hero-owl"
    />}
  </div>
)


const HeroWithImage = ({ title, formatTitle, image, illustration }) => {
  return (
    <div 
      className="w-full items-center pt-80" 
      style={{display: 'flex', flexDirection: 'column', gap: '50px'}}
    >
      {title && <div className="page-hero-section-title">
        {formatTitle('Novosadski \n noćni bazar?', 'aboutUs')}
      </div>}
      {image && <Image 
        src={'/about-us-hero-image.png'}
        className="about-us-hero-image"
        width={1440}
        height={486}
        alt='about-us-hero-image'
      />}
      {!illustration && <div 
        className="flex flex-row grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
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
          className="w-full content-center font-[18px] text-[#ffffff]" 
          style={{ whiteSpace: 'nowrap', textAlign: 'justify'}}
        >
          <span 
            className="flex content-center font-bold" 
            style={{display:'inline', whiteSpace: 'nowrap'}}
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
