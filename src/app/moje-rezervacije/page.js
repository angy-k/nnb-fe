import MyReservationsComponent from "../../components/Reservations";

export const metadata = {
  robots: { index: false, follow: false },
}

const MyReservations = () => {
    return (
        <div className="w-full">
            <MyReservationsComponent />
        </div>
    )
}

export default MyReservations;