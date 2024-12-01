import OwlsCommunity from "../../icons/owls-community.svg"
import office from "@/../office-config/config.json"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ReservationsContainer = ({
  type = 'dark'
}) => {
  const router = useRouter()

  function viewAllReservations() {
    router.push('/moje-rezervacije')  
  }

  return(
    <div 
    className={`${type === 'dark' ? "viber-community-dark" : "viber-community-light"} place-items-center justify-baseline grid md:flex lg:flex pb-3 mt-24 w-full lg:w-1400 md:mx-auto lg:mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto`}
      style={{maxWidth: '1400px'}}
    >
      <Image
        // className="hidden md:flex lg:flex sm:left-0"
        src={OwlsCommunity}
        width="0"
        height="0"
        className='w-135'
        alt={'Viber community owls icon.'}
        style={{marginLeft: '-45px'}}
      />
       
      <div className="w-full grid lg:flex place-items-center justify-space-between ">
        <div className="w-8/12 flex place-items-center">
            <span className={"viber-community-text text-center"}>{'Moje rezervacije'}</span>
          </div>
          <button
            key={`edit-profile-button`}
            onClick={viewAllReservations}
            className='edit-profile-button text-[#ffffff]'
          >
            {'Pogledaj sve'}
          </button>
      </div>
    </div>
  )
}

export default ReservationsContainer;
