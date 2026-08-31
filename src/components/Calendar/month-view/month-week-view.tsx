import { MonthDayView } from "./month-day-view";

import { cn } from "../../../utils";
import { cva } from "class-variance-authority";
import {
  format,
  isToday,
  endOfDay,
  startOfDay,
  isSameMonth,
  isWithinInterval,
} from "date-fns";

import { Event } from "../types";
import { WeekEvent } from "./group-events";

type MonthWeekViewProps = {
  week: Date[];
  week_events: WeekEvent[];
  week_day_events: Record<string, Event[]>;
  /** Mesec koji je trenutno prikazan — dani van njega se sivo boje */
  monthDate?: Date;
  onEventClick?: (eventId: string) => void;
  onDayClick?: (date: Date) => void;
};

const dayLabelVariants = cva(
  "shrink-0 flex justify-center items-center text-sm font-normal",
  {
    variants: {
      variant: {
        default: "bg-transparent text-[#1B1B1B]",
        outside: "bg-transparent text-[#B0B0B0]",
        today: "bg-blue-400 text-white",
      },
      size: {
        default: "w-6 h-6 rounded-full sm:w-5 sm:h-5 sm:text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const MonthWeekView: React.FC<MonthWeekViewProps> = ({
  week,
  week_events = [],
  week_day_events = {},
  monthDate,
  onEventClick,
  onDayClick,
}) => {
  return (
    <div className="w-full h-full relative sm:h-auto">
      <div className="w-full h-full flex sm:h-auto">
        {week.map((day) => {
          const dayKey = day.toISOString();

          const isOutsideMonth = monthDate ? !isSameMonth(day, monthDate) : false;
          const variant = isToday(day)
            ? "today"
            : isOutsideMonth
              ? "outside"
              : "default";

          // Jednodnevni događaji za taj dan + višednevni koji ga preklapaju
          const dayEvents: Event[] = [
            ...(week_day_events[dayKey] ?? []),
            ...week_events.filter((event) =>
              isWithinInterval(day, {
                start: startOfDay(event.start_date),
                end: endOfDay(event.end_date),
              })
            ),
          ];

          const hasEvents = dayEvents.length > 0;

          // Visina ćelije je merena sa izvoza stranice Kalendar iz Figme, 1:1 na
          // okviru od 1920: mreža ide od x 240 do 1675 sa uspravnim linijama na
          // svakih 205px, a vodoravne su na 961, 1080, 1199, 1319, 1438, 1557 i
          // 1677 — dakle red je visok 119px pri praznom mesecu.
          //
          // Kalendar na sajtu je širok 1400px, što je 0,976 od dizajnovih 1435,
          // pa red ispada 116px.
          //
          // Ovo je donja granica, ne gornja: dan sa bedževima i dalje razvlači
          // ceo red, kao i u dizajnu, gde red sa sovama naraste na oko 150px.
          //
          // Ranije je ovde stajalo 168px, pa 144px — ta druga vrednost je bila
          // očitana sa druge table u Figmi, koja prikazuje mesec sa bedževima,
          // pa je merila već razvučen red umesto praznog.
          return (
            <div
              key={"day-label-" + dayKey}
              className="flex-1 min-w-0 flex flex-col overflow-hidden [&:not(:last-child)]:border-r border-b text-[#B0B0B0] cursor-pointer hover:bg-black/5 transition-colors min-h-[116px] sm:min-h-[64px]"
              onClick={() => onDayClick?.(day)}
            >
              {/* Po dizajnu: datum u gornjem levom uglu, bedževi pri donjoj desnoj
                  ivici ćelije. Ranije su stajali desno od broja, u istom redu, pa
                  su se kod dva događaja gurali u stranu. */}
              <div className="flex flex-col h-full gap-1 p-1.5 pb-[18px] sm:p-1 sm:pb-2">
                <h2 className={cn(dayLabelVariants({ variant }), "self-start")}>
                  {format(day, "d")}
                </h2>

                {hasEvents && (
                  <div className="min-w-0 flex-1 flex items-end justify-end">
                    <MonthDayView
                      day={day}
                      events={dayEvents}
                      onEventClick={onEventClick}
                      onDayClick={onDayClick}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
