import Image from 'next/image';
import exhibitorIcon from '@/icons/exhibitor-icon.svg'

const ProfileGallery = ({
  account
}) => {
  return (
    <div className='w-full pt-24 grid gap-24' style={{maxWidth: '1400px'}}>
      {account.images && <div>
        <span className='edit-profile-subtitle'>{`Galerija fotografija`}</span>
        <div 
          className='w-full blogs-container pt-12 grid place-items-center pb-12'
          style={account.images?.length === 0 ? {display: 'flex', justifyContent: 'flex-start'} : {}}
        >
          {account.images.map((image, index) => (
            <Image
              key={`profile-gallery-image-${index}`}
              src={image.path}
              width={337}
              height={325}
              alt={`profile-gallery-image-${index}`}
            />
          ))}
          {account.images?.length === 0 && <div
            className='rounded-[30px] opacity-[0.6]'
            style={{border: '1px solid #261A64'}}
          >
            <Image 
              src={exhibitorIcon}
              width={337}
              height={325}
              alt={`default-image-placeholder`}
              className='p-24'
            />
          </div>}
        </div>
        {account.images?.length > 4 && <span 
          className='edit-profile-about' 
          style={{display: 'flex', justifyContent: 'flex-end'}}
        >
          {`Vidi više...`}
        </span>}
      </div>}
      {account.videos && <div>
        <span className='edit-profile-subtitle'>{`Video galerija`}</span>
        <div 
          className='w-full blogs-container pt-12 grid place-items-center pb-12'
          style={account.videos?.length === 0 ? {display: 'flex', justifyContent: 'flex-start'} : {}}
        >
          {account.videos.map((video, index) => (
            <video
              key={`profile-gallery-video-${index}`}
              autoPlay={false}
              autoFocus={false}
              muted={true}
              src={video}
              alt={`profile-gallery-video-${index}`}
              className='w-[337px] h-[325px]'
            />
          ))}
          {account.videos?.length === 0 && <div
            className='rounded-[30px] opacity-[0.6]'
            style={{border: '1px solid #261A64'}}
          >
            <Image 
              src={exhibitorIcon}
              width={337}
              height={325}
              alt="default-video-placeholder"
              className='p-24'
            />
          </div>}
        </div>
        {account.videos?.length > 4 && <span 
          className='edit-profile-about'
          style={{display: 'flex', justifyContent: 'flex-end'}}
        >
          {`Vidi više...`}
        </span>}
      </div>}
    </div>
  )
}

export default ProfileGallery;