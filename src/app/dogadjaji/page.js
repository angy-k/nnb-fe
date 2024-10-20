'use client'; 
import Events from '@/components/CardsLayout/Events';

const EventsPage = () => {
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Events
        numberForDisplay={6}
      />
    </div>
    )
}

export default EventsPage;
