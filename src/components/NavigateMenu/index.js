import Link from 'next/link'
import Image from 'next/image';
import Button from '@/components/Button';
import FacebookIcon from '../../icons/facebook-icon-light.svg'
import InstagramIcon from '../../icons/instagram-icon-light.svg'
import YouTubeIcon from '../../icons/youtube-icon-light.svg'

const NavigateMenu = ({
  className,
  onClick
}) => {

  function becomeExhibitor() {
    //TODO redirect on register
  }

  return (
    <div className={`absolute top-16 left-0 sm:pl-10 lg:pl-16 pt-19 bg-[#261A54] w-full px-7 h-screen xl:relative xl:top-0 xl:h-auto xl:flex xl:hidden`}>
      <div className='header-menu-items-list'>
        {JSON.parse(JSON.stringify(process.env.headerItems).toString()).map((item) => (
          <ul key={`header-item-${item.id}`}>
            <Link href={item.link} className='header-item'>{item.name}</Link>
          </ul>
        ))}
      </div>
      <Button
        key={`header-button`}
        type={'outlined-light'}
        name={'Postani izlagač'}
        onClick={becomeExhibitor()}
        className='header-button'
      />
      <div className='pt-10 xl:hidden'>
        {/* info social icons */}
        <div className='flex flex-row gap-5' style={{justifyContent: 'flex-end'}}>
          <Image
            src={FacebookIcon}
            width={30}
            height={30}
            alt={'Footer facebook icon.'}
          />
          <Image
            src={InstagramIcon}
            width={30}
            height={30}
            alt={'Footer instagram icon.'}
          />
          <Image
            src={YouTubeIcon}
            width={30}
            height={30}
            alt={'Footer youtube icon.'}
          />
        </div>
      </div>
    </div>
  )
}

export default NavigateMenu;
