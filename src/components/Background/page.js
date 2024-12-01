import Image from 'next/image'

const Background = () => {
  return (
    <div className='w-full place-items-center'>
      <Image 
          src={'/owls.svg'}
          fill={true}
      />
    </div>
  )
}
export default Background;