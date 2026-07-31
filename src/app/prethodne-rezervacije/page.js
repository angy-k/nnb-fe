import MyPreviousReservationsComponent from '@/components/PreviousReservations';

export const metadata = {
  robots: { index: false, follow: false },
}

const MyPreviousReservations = () => {
    return (
      <div className="w-full">
        <MyPreviousReservationsComponent />
      </div>
    )
}

export default MyPreviousReservations;
