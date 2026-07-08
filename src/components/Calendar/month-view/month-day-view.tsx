import { isWithinInterval } from "date-fns";
import Image from 'next/image';
import EventDark from '@/icons/event-dark.svg';
import EventLight from '@/icons/event-light.svg';

import { Event } from "../types";

const MAX_EVENTS_TO_DISPLAY = 6;

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
    <ul className="pl-4 pr-6 flex-1 flex flex-wrap gap-1 overflow-hidden">
      {eventsToDisplay.map((event) => {
        const isStartup = event.variant === 'startup';
        return (
          <li className="flex items-center" key={event.id}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!event.isPast) onEventClick?.(event.id);
              }}
              className="inline-flex items-center justify-center rounded-full transition-opacity"
              style={event.isPast ? { opacity: 0.35, cursor: 'default', filter: 'grayscale(0.5) blur(1px)' } : { cursor: 'pointer' }}
              aria-label={isStartup ? 'NNB Startup event' : 'NNB event'}
            >
              <Image
                src={isStartup ? EventLight : EventDark}
                width={63}
                height={26}
                alt={isStartup ? 'NNB Startup' : 'NNB'}
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
            className="inline-flex items-center justify-center px-2 h-6 rounded-full bg-[#1B1B1B] text-white text-[11px] font-semibold"
          >
            +{moreEventsNumber}
          </button>
        </li>
      )}
    </ul>
  );
};
