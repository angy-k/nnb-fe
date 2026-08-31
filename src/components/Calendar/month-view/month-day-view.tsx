import { isWithinInterval } from "date-fns";
import Image from 'next/image';
// Bedž u ćeliji je sama sova, bez pilule i natpisa „nnb" — kako stoji u dizajnu.
import OwlNnb from '@/icons/owl-nnb.svg';
import OwlStartup from '@/icons/owl-startup.svg';
import OwlDrugoMesto from '@/icons/owl-drugo-mesto.svg';

import { Event } from "../types";

// Bedževi se slažu vertikalno pored datuma — manji limit nego kod horizontalnog reda
const MAX_EVENTS_TO_DISPLAY = 3;

type MonthDayViewProps = {
  day?: Date;
  events?: Event[];
  restEvents?: Event[];
  weekEventsShown?: number;
  onEventClick?: (eventId: string) => void;
  onDayClick?: (date: Date) => void;
};

export const MonthDayView: React.FC<MonthDayViewProps> = ({
  events = [],
  restEvents = [],
  day = new Date(),
  weekEventsShown = 0,
  onEventClick,
  onDayClick,
}) => {
  const filteredRestEvents = restEvents.filter((event) =>
    isWithinInterval(day, {
      end: event.end_date,
      start: event.start_date,
    })
  );

  const canDisplayEvents = MAX_EVENTS_TO_DISPLAY - weekEventsShown;
  const allEvents = [...events, ...filteredRestEvents];
  const allEventsNumber = allEvents.length;

  let eventsToDisplay: Event[] = [];
  let moreEventsNumber = 0;

  if (canDisplayEvents > 1) {
    eventsToDisplay = allEvents.slice(0, canDisplayEvents);
    moreEventsNumber = allEventsNumber - eventsToDisplay.length;
  }

  if (canDisplayEvents === 1 && allEventsNumber === 1) {
    eventsToDisplay = allEvents.slice(0, 1);
    moreEventsNumber = 0;
  }

  if (canDisplayEvents === 1 && allEventsNumber > 1) {
    moreEventsNumber = allEventsNumber;
  }

  return (
    <ul className="flex flex-col items-end gap-1 overflow-hidden">
      {eventsToDisplay.map((event) => {
        const isStartup = event.variant === 'startup';
        const isAway = event.variant === 'away';
        const badgeSrc = isStartup ? OwlStartup : isAway ? OwlDrugoMesto : OwlNnb;
        const badgeAlt = isStartup ? 'NNB Startup' : isAway ? 'NNB u drugom mestu' : 'NNB';
        return (
          <li className="flex items-center" key={event.id}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event.id);
              }}
              className="inline-flex items-center justify-center rounded-full transition-opacity"
              // Prošli događaji su prigušeni, ali ostaju klikabilni radi pregleda detalja
              style={event.isPast ? { opacity: 0.45, cursor: 'pointer', filter: 'grayscale(0.5)' } : { cursor: 'pointer' }}
              aria-label={badgeAlt}
            >
              <Image
                src={badgeSrc}
                width={73}
                height={53}
                alt={badgeAlt}
                className="w-[73px] h-[53px] sm:w-[48px] sm:h-[35px]"
              />
            </button>
          </li>
        );
      })}
      {moreEventsNumber > 0 && (
        <li className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDayClick?.(day);
            }}
            className="inline-flex items-center justify-center px-2 h-6 rounded-full bg-[#1B1B1B] text-white text-[11px] font-semibold sm:px-1.5 sm:h-[17px] sm:text-[10px]"
          >
            +{moreEventsNumber}
          </button>
        </li>
      )}
    </ul>
  );
};
