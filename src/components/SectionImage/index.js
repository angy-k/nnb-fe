import Image from 'next/image'
import People from './assets/people.png'
 
const SectionImage = ({
  imageSrc = People,
  width = 540,
  height = 540,
  radius = '5px',
  altText = 'Section image alt text',
  isGrey = false,
  // Kvadratni okvir, bez obzira na širinu kolone. Fiksna visina uz `width: 100%`
  // daje kvadrat samo na jednoj širini ekrana, pa se koristi odnos stranica.
  square = false
}) => {
  const sharedStyle = {
    borderRadius: `${radius}`,
    overflow: 'hidden',
    filter: isGrey ? 'grayscale(100%)' : '',
    opacity: isGrey ? '0.6' : '1',
    width: '100%',
    ...(square
      ? { aspectRatio: '1 / 1', height: 'auto' }
      : { height: `${height}px` }),
    // Slika se seče umesto da se izobliči kad odnos ne odgovara okviru
    objectFit: 'cover',
    display: 'block',
  }

  if (typeof imageSrc === 'string') {
    return (
      <img
        src={imageSrc}
        loading="lazy"
        alt={altText}
        onError={(e) => {
          if (e.currentTarget?.src?.includes('/partner-cover.svg')) return
          e.currentTarget.src = '/partner-cover.svg'
        }}
        style={sharedStyle}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      loading='lazy'
      width={width}
      height={height}
      alt={altText}
      style={sharedStyle}
    />
  )
}

export default SectionImage
