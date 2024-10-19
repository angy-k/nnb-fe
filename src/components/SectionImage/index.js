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
    <Image
      src={imageSrc}
      loading = 'lazy'
      width={width}
      height={height}
      alt={altText}
      style={{borderRadius: `${radius}`, overflow: 'hidden'}}
    />
  )
}

export default SectionImage
