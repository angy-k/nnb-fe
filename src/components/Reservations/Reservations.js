import { useRouter } from 'next/navigation'
import ViberCommunity from '@/components/Communities/ViberCommunity'

const ReservationsContainer = ({
  type = 'dark'
}) => {
  const router = useRouter()

  function viewAllReservations() {
    router.push('/moje-rezervacije')  
  }

  return(
    <div className="w-full grid place-items-center mt-24">
      <ViberCommunity
        type={type}
        title={'Moje rezervacije'}
        ctaLabel={'Pogledaj sve'}
        onCtaClick={viewAllReservations}
        showMiddleIcon={false}
        buttonType={'custom'}
        buttonCustomStyle={'viber-button-turquoise'}
        wrapperStyle={{ maxWidth: '1400px', borderRadius: '30px' }}
      />
    </div>
  )
}

export default ReservationsContainer;
