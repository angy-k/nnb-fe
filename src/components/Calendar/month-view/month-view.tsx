import { MonthWeekView } from "./month-week-view";

import {
  format,
  endOfDay,
  endOfWeek,
  endOfMonth,
  startOfDay,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { createMonthGroups } from "./group-events";

import { Event } from "../types";
import { formatDanUNedelji } from '@/utils/dateHelpers';

type MonthViewProps = {
  date: Date;
  events?: Event[];
  onEventClick?: (eventId: string) => void;
  onDayClick?: (date: Date) => void;
};

export const MonthView: React.FC<MonthViewProps> = ({ date, events = [], onEventClick, onDayClick }) => {
  const days = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  const weeks = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  }).reduce((acc, cur, idx) => {
    const groupIndex = Math.floor(idx / 7);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(cur);
    return acc;
  }, [] as Date[][]);

  const groups = createMonthGroups(events, weeks);

  // Visinu određuju same ćelije, koje moraju da prime datum i dva bedža od 53px.
  // Ranije je stajalo `min-h-[800px] max-h-[888px]` — gornja granica bi odsekla
  // drugi bedž u danima sa dva događaja.
  return (
    <section id="calendar-month-view" className="flex-1 flex flex-col sm:min-h-0">
      <div className="w-full flex">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 flex justify-center overflow-hidden"
          >
            <span className="mt-2 text-sm font-normal text-[#1B1B1B] capitalize sm:text-[11px] sm:mt-1">
              <span className="sm:hidden">
                {formatDanUNedelji(day)}
              </span>
              <span className="hidden sm:inline">
                {formatDanUNedelji(day, true)}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {weeks.map((week) => {
          const weekEndDate = endOfDay(week[week.length - 1]);
          const weekStartDate = startOfDay(week[0]);
          const weekKey =
            weekStartDate.toISOString() + "-" + weekEndDate.toISOString();
          const props = { week, ...groups[weekKey] };

          return <MonthWeekView {...props} key={weekKey} monthDate={date} onEventClick={onEventClick} onDayClick={onDayClick} />;
        })}
      </div>
    </section>
  );
};