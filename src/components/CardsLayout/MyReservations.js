import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import SectionImage from '@/components/SectionImage';

const MyReservations = ({
  events = [],
  onCancelClick = null,
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
        return { height: '59px', backgroundColor: '#FACE06', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px' };
      case 'approved':
        return { height: '59px', backgroundColor: '#56C4CF', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px' }
      case 'rejected':
        return { height: '59px', backgroundColor: '#EC4923', borderRadius: '30px', color: '#ffffff', fontWeight: '600', fontSize: '18px', lineHeight: '24.51px' };
    }
  }

  return (
    <>
      <div className="w-full blogs-container pt-24 grid place-items-center pb-48">
        <div className="blog-container grid sm:grid-template-1 md:grid-template-2">
          {events.map((event, index) => (
            <div className="event-card" key={`event-card-${index}`}>
              <Link
                prefetch={false}
                legacyBehavior
                href={`/dogadjaj/${formatTitleForUri(event.title)}`}
              >
                <div 
                  className={"card-component"} 
                  key={`my-reservation-${index}`}
                  style={{backgroundColor: '#ffffff', borderRadius: '30px', minHeight: '859px'}}
                  >
                  <SectionImage
                    imageSrc={event.coverImage || '/event-cover.svg'}
                    width={465}
                    height={465}
                    radius={'30px 30px 0 0'}
                    altText={'my-reservations-cover-images'}
                  />
                    <div className="text-start" style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '30px', paddingBottom: '0px'}}>
                      {event.title && <span className={"font-bold font-[36px] text-[#261A54] leading-[49.02px]"}>{event.title}</span>}
                      {event.date && <span className="font-normal font-[22px] text-[#261A54] leading-[29px]">{event.date}</span>}
                      {event.applicationDate && <span className="text-start font-normal font-[22px] text-[#261A54] opacity-[0.5] pt-[30px] leading-[ leading-[29.96px]">{`Rezervacija poslata ${event.applicationDate}`}</span>}
                      <div className="gid place-tems-center gap-[17px] p-[30px]" style={{display: 'flex', flexDirection: 'column'}}>
                        <button
                          key={`card-component-button-my-reservation`}
                          onClick={() => {}}
                          style={getButtonStyle(event.applicationStatus)}
                        >
                          {getReservationStatus(event.applicationStatus)}
                        </button>
                        {event.applicationStatus === 'waiting' && <button
                          key={`card-component-button-my-reservation`}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancelClick && onCancelClick(event); }}
                          style={{ height: '59px', backgroundColor: 'transparent', borderRadius: '30px', color: '#261A54', fontWeight: '600', fontSize: '18px', border: '1px solid #261A54', lineHeight: '24.51px' }}
                        >
                          {`Otkaži rezervaciju`}
                        </button>}
                      </div>
                    </div>
                  </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyReservations;