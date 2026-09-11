import { isWithinInterval } from "date-fns";
import Image from 'next/image';
// Bedž u ćeliji je sama sova, bez pilule i natpisa „nnb" — kako stoji u dizajnu.
import OwlNnb from '@/icons/owl-nnb.svg';
import OwlStartup from '@/icons/owl-startup.svg';
import OwlDrugoMesto from '@/icons/owl-drugo-mesto.svg';

import { Event } from "../types";

/**
 * Koliko sova staje u ćeliju dana.
 *
 * Bedževi se slažu vertikalno u donjem desnom uglu, a ćelija je niska — tri
 * su je prepunjavala. Ostatak preuzima pilula „+N", koja otvara prikaz dana sa
 * svim događajima, pa se ništa ne gubi.
 */
const MAX_EVENTS_TO_DISPLAY = 2;

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

  /*
   * `weekEventsShown` i `restEvents` su ostaci iz osnovne komponente kalendara:
   * ništa ih ne prosleđuje, pa su uvek 0 i prazan niz. Grane koje su na njima
   * počivale nikad se nisu izvršavale, a računicu su činile nejasnom.
   *
   * Pravilo je jednostavno: prikaži najviše `MAX_EVENTS_TO_DISPLAY`, ostatak u
   * pilulu „+N".
   */
  const allEvents = [...events, ...filteredRestEvents];
  const eventsToDisplay = allEvents.slice(0, MAX_EVENTS_TO_DISPLAY);
  const moreEventsNumber = allEvents.length - eventsToDisplay.length;

  /*
   * Pilula stoji **pored** sova, ne ispod njih.
   *
   * Sa dve sove (53px svaka) i pilulom u istoj koloni ispadalo je 138px, a
   * ćeliji ostaje oko 139 kad se oduzmu odmaci i broj dana — dakle bez ijednog
   * piksela rezerve. Ovako je kolona 110px, a pilula ne troši visinu.
   */
  return (
    <div className="flex items-end justify-end gap-1.5 overflow-hidden">
    <ul className="flex flex-col items-end gap-1">
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
    </ul>

      {moreEventsNumber > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick?.(day);
          }}
          className="inline-flex items-center justify-center px-2 h-6 rounded-full bg-[#1B1B1B] text-white text-[11px] font-semibold shrink-0 sm:px-1.5 sm:h-[17px] sm:text-[10px]"
          aria-label={`Prikaži sve događaje (${moreEventsNumber} više)`}
        >
          +{moreEventsNumber}
        </button>
      )}
    </div>
  );
};
