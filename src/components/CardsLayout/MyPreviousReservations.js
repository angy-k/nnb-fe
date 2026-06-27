import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import SectionImage from '@/components/SectionImage';

const MyPreviousReservations = ({
    events = []
}) => {
  function getReservationStatus(status) {
      switch(status) {
        case 'waiting':
          return 'Rezervacija na čekanju';
        case 'approved':
          return 'Uspešno rezervisano';
        case 'rejected':
          return 'Rezervacija odbijena';
      }
    }
  
    function getButtonStyle(status) {
      switch(status) {
        case 'waiting':
          return { height: '59px', backgroundColor: '#C5C4C2', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px', whiteSpace: 'nowrap', padding: '0 30px' };
        case 'approved':
          return { height: '59px', backgroundColor: '#C5C4C2', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px', whiteSpace: 'nowrap', padding: '0 30px' }
        case 'rejected':
          return { height: '59px', backgroundColor: '#C5C4C2', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px', whiteSpace: 'nowrap', padding: '0 30px'};
      }
    }
        
    return (
      <>
        <div className="w-full blogs-container pt-24 grid place-items-center pb-48">
          <div className="w-full grid previous-reservations-container">
            {events.map((event, index) => (
              <div key={`event-card-${index}`}>
                <div 
                  className={"previous-reservations-item"} 
                  key={`my-reservation-${index}`}
                >
                  <SectionImage
                    imageSrc={event.coverImage || '/card-component-default-image.png'}
                    isGrey={true}
                    width={490}
                    height={223}
                    radius={'30px 0 0 30px'}
                    altText={'my-reservations-cover-images'}
                  />
                  <div className="previous-reservations-component">
                    <div className="text-start" style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '30px', paddingRight: '0px'}}>
                      {event.title && <span className={"font-bold font-[36px] text-[#C5C4C2] leading-[49.02px]"}>{event.title}</span>}
                      {event.date && <span className="font-normal font-[22px] text-[#C5C4C2] leading-[29px]">{event.date}</span>}
                      {event.applicationDate && <span className="text-start font-normal font-[22px] text-[#261A54] opacity-[0.5] pt-[30px] leading-[ leading-[29.96px]">{`Rezervacija poslata ${event.applicationDate}`}</span>}
                    </div>
                    <div className="gid place-tems-center gap-[17px] p-[30px]" style={{display: 'flex', flexDirection: 'column'}}>
                      <button
                        key={`card-component-button-my-reservation`}
                        onClick={() => {}}
                        style={getButtonStyle(event.applicationStatus)}
                      >
                        {getReservationStatus(event.applicationStatus)}
                      </button>
                    </div>
                  </div>
                </div>
                <div 
                  className={"card-component md:hidden lg:hidden xl:hidden 2xl:hidden"} 
                  key={`my-reservation-${index}`}
                  style={{backgroundColor: '#ffffff', borderRadius: '30px', minHeight: '859px'}}
                >
                  <SectionImage
                    imageSrc={event.coverImage || '/card-component-default-image.png'}
                    isGrey={true}
                    width={465}
                    height={465}
                    radius={'30px 30px 0 0'}
                    altText={'my-reservations-cover-images'}
                  />
                  <div className="text-start" style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '30px', paddingRight: '0px'}}>
                    {event.title && <span className={"font-bold font-[36px] text-[#C5C4C2] leading-[49.02px]"}>{event.title}</span>}
                    {event.date && <span className="font-normal font-[22px] text-[#C5C4C2] leading-[29px]">{event.date}</span>}
                    {event.applicationDate && <span className="text-start font-normal font-[22px] text-[#261A54] opacity-[0.5] pt-[30px] leading-[ leading-[29.96px]">{`Rezervacija poslata ${event.applicationDate}`}</span>}
                  </div>
                  <div className="gid place-tems-center gap-[17px] p-[30px]" style={{display: 'flex', flexDirection: 'column'}}>
                    <button
                      key={`card-component-button-my-reservation`}
                      onClick={() => {}}
                      style={getButtonStyle(event.applicationStatus)}
                    >
                      {getReservationStatus(event.applicationStatus)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
}

export default MyPreviousReservations;