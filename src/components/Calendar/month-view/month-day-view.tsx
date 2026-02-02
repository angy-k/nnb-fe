import { isWithinInterval } from "date-fns";

import { Event } from "../types";
import Image from 'next/image';
import SingleEventLight from '@/icons/event-light.svg';
import SingleEventDark from '@/icons/event-dark.svg';

const MAX_EVENTS_TO_DISPLAY = 6;

type MonthDayViewProps = {
  day?: Date;
  events?: Event[];
  restEvents?: Event[];
  weekEventsShown?: number;
  onEventClick?: (eventId: string) => void;
};

export const MonthDayView: React.FC<MonthDayViewProps> = ({
  events = [],
  restEvents = [],
  day = new Date(),
  weekEventsShown = 0,
  onEventClick,
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
      {eventsToDisplay.map((event) => (
        <li className="flex items-center" key={event.id}>
          <button
            type="button"
            onClick={() => onEventClick?.(event.id)}
            className={`inline-flex items-center justify-center px-2 h-8 rounded-full ${
              !Number.isNaN(Number(event.id)) && Number(event.id) % 2
                ? 'bg-[#56C4CF]'
                : 'bg-[#261A54]'
            }`}
          >
            <Image
              className="w-25 h-25"
              src={!Number.isNaN(Number(event.id)) && Number(event.id) % 2 ? SingleEventLight : SingleEventDark}
              width={75}
              height={60}
              alt="event"
            />
          </button>
        </li>
      ))}
      {moreEventsNumber > 0 && (
        <li className="flex items-center">
          <span className="inline-flex items-center justify-center px-2 h-8 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold">
            +{moreEventsNumber}
          </span>
        </li>
      )}
    </ul>
  );
};