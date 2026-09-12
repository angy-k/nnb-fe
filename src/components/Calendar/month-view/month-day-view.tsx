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
   * Na telefonu staje samo jedna sova, pa ostatak preuzima pilula.
   *
   * Broj se ne računa u JavaScriptu preko `matchMedia`, nego se ispisuju obe
   * pilule a CSS bira koja se vidi — server ne zna širinu ekrana, pa bi se
   * prvi ispis razlikovao od onoga u pretraživaču.
   */
  const viseNaTelefonu = allEvents.length - 1;

  /*
   * Pilula stoji **pored** sova, ne ispod njih.
   *
   * Sa dve sove (53px svaka) i pilulom u istoj koloni ispadalo je 138px, a
   * ćeliji ostaje oko 139 kad se oduzmu odmaci i broj dana — dakle bez ijednog
   * piksela rezerve. Ovako je kolona 110px, a pilula ne troši visinu.
   *
   * Na telefonu važi obrnuto: ćelija je široka oko 45px, pa sova i pilula jedna
   * do druge ne staju ni u tu širinu — tamo se pilula vraća ispod sova.
   */
  return (
    /* Na telefonu pilula „+N" ide ispod sova, ne pored njih: ćelija je tamo
       široka oko 45px, a sova i pilula jedna do druge traže preko 60. */
    <div className="flex items-end justify-end gap-1.5 overflow-hidden sm:flex-col sm:gap-1">
    <ul className="flex flex-col items-end gap-1">
      {eventsToDisplay.map((event, redniBroj) => {
        const isStartup = event.variant === 'startup';
        const isAway = event.variant === 'away';
        const badgeSrc = isStartup ? OwlStartup : isAway ? OwlDrugoMesto : OwlNnb;
        const badgeAlt = isStartup ? 'NNB Startup' : isAway ? 'NNB u drugom mestu' : 'NNB';
        return (
          /* Druga sova se na telefonu ne prikazuje — nju pokriva pilula „+N". */
          <li className={`flex items-center${redniBroj > 0 ? ' sm:hidden' : ''}`} key={event.id}>
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
                /* Sedam kolona deli širinu ekrana: na 375px ćeliji ostane oko
                   53px, na 320px oko 45. Sa bedžom od 48px i odmakom ćelije
                   mreža je tražila 406px i vukla celu stranicu u vodoravni
                   skrol — a kad bi je nešto ipak steglo, bedž bi se sabio u
                   širini dok mu visina ostaje ista, pa bi sova bila izobličena.
                   36 × 26 čuva odnos 73 : 53 i staje i na najužem telefonu. */
                className="w-[73px] h-[53px] sm:w-[36px] sm:h-[26px]"
              />
            </button>
          </li>
        );
      })}
    </ul>

      {/* Pilula za šire ekrane — broji ono što ne stane pored dve sove. */}
      {moreEventsNumber > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick?.(day);
          }}
          className="inline-flex sm:hidden items-center justify-center px-2 h-6 rounded-full bg-[#1B1B1B] text-white text-[11px] font-semibold shrink-0"
          aria-label={`Prikaži sve događaje (${moreEventsNumber} više)`}
        >
          +{moreEventsNumber}
        </button>
      )}

      {/* Pilula za telefon — tamo je prikazana samo prva sova, pa broji sve
          ostale događaje tog dana. */}
      {viseNaTelefonu > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick?.(day);
          }}
          className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#1B1B1B] text-white font-semibold shrink-0 px-1.5 h-[17px] text-[10px]"
          aria-label={`Prikaži sve događaje (${viseNaTelefonu} više)`}
        >
          +{viseNaTelefonu}
        </button>
      )}
    </div>
  );
};
