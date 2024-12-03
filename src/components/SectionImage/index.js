import Image from 'next/image'
import People from './assets/people.png'
 
const SectionImage = ({
  imageSrc = People,
  width = 540,
  height = 540,
  radius = '5px',
  altText = 'Section image alt text',
  isGrey = false
}) => {
  return (
    <Image
      src={imageSrc}
      loading = 'lazy'
      width={width}
      height={height}
      alt={altText}
      style={{borderRadius: `${radius}`, overflow: 'hidden', filter: isGrey ? 'grayscale(100%)' : '', opacity: isGrey ? '0.6' : '1'}}
    />
  )
}

export default SectionImage
