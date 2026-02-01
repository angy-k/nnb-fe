import Image from 'next/image'

const Background = () => {
  return (
    <div className='w-full place-items-center relative'>
      <Image 
          src={'/owls.svg'}
          fill={true}
          alt="Background owls decoration"
          style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
export default Background;