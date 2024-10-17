import Image from 'next/image'
import People from './assets/people.png'
 
const SectionImage = ({
  imageSrc = People,
  width = 540,
  height = 540,
  radius = '5px',
  altText = 'Section image alt text'
}) => {
  return (
    <div style={{borderRadius: `${radius}`, overflow: 'hidden'}}>
    <Image
      src={imageSrc}
      loading = 'lazy'
      width={width}
      height={height}
      alt={altText}
    //   className='rounded-full aspect-square object-cover'
    />
    </div>
  )
}

export default SectionImage
