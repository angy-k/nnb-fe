'use client'; 
import Events from '@/components/CardsLayout/Events';

const EventsPage = () => {
  return (
    <div className="mt-60 grid place-items-center w-full">
      <Events
        numberForDisplay={12}
        pagination={true}
      />
    </div>
    )
}

export default EventsPage;
