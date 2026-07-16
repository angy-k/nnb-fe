import Link from 'next/link';
import { formatTitleForUri } from '@/utils/transform-helper';
import SectionImage from '@/components/SectionImage';

const statusConfig = {
  waiting:   { label: 'Rezervacija na čekanju', bg: '#FACE06' },
  approved:  { label: 'Uspešno rezervisano',    bg: '#56C4CF' },
  cancelled: { label: 'Rezervacija otkazana',   bg: '#EC4923' },
  rejected:  { label: 'Rezervacija odbijena',   bg: '#EC4923' },
}

const MyReservations = ({ events = [], onCancelClick = null }) => {
  return (
    <div className="w-full pt-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const status = statusConfig[event.applicationStatus] || statusConfig.waiting
          const canCancel = event.applicationStatus === 'waiting' || event.applicationStatus === 'approved'

          return (
            <div
              key={`reservation-${index}`}
              className="flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm"
            >
              {/* Cover image — links to event */}
              <Link
                prefetch={false}
                href={`/dogadjaj/${formatTitleForUri(event.title)}`}
                className="block flex-shrink-0"
              >
                <SectionImage
                  imageSrc={event.coverImage || '/event-cover.svg'}
                  width={465}
                  height={280}
                  radius="0"
                  altText="cover"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-3">
                {event.title && (
                  <span className="text-[18px] font-bold text-[#261A54] leading-snug">
                    {event.title}
                  </span>
                )}
                {event.date && (
                  <span className="text-[14px] text-[#261A54]">{event.date}</span>
                )}
                {event.applicationDate && (
                  <span className="text-[14px] text-[#261A54]/50">
                    {`Rezervacija poslata ${event.applicationDate}`}
                  </span>
                )}

                <div className="flex flex-col gap-3 mt-2">
                  {/* Status badge */}
                  <div
                    style={{ background: status.bg, cursor: 'default' }}
                    className="w-full h-[50px] rounded-full text-white font-semibold text-[15px] flex items-center justify-center"
                  >
                    {status.label}
                  </div>

                  {/* Cancel button — waiting & approved */}
                  {canCancel && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); onCancelClick?.(event) }}
                      className="w-full h-[50px] rounded-full border border-[#261A54] text-[#261A54] font-semibold text-[15px] bg-transparent hover:bg-[#261A54]/5 transition"
                    >
                      Otkaži rezervaciju
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyReservations;
