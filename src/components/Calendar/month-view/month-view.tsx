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

type MonthViewProps = {
  date: Date;
  events?: Event[];
  onEventClick?: (eventId: string) => void;
};

export const MonthView: React.FC<MonthViewProps> = ({ date, events = [], onEventClick }) => {
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

  return (
    <section id="calendar-month-view" className="flex-1 flex flex-col min-h-[800px] max-h-[888px]">
      <div className="w-full flex">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 flex justify-center"
          >
            <span className="mt-2 text-sm font-normal text-[#1B1B1B] capitalize">
              {day.toLocaleDateString('sr-Latn', {
                  weekday: 'long'
              })}
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

          return <MonthWeekView {...props} key={weekKey} onEventClick={onEventClick} />;
        })}
      </div>
    </section>
  );
};