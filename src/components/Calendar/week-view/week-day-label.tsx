import { isToday, format } from "date-fns";

import { cn } from "../../../utils";

export type WeekDayLabelProps = {
  day: Date;
};

export const WeekDayLabel: React.FC<WeekDayLabelProps> = ({ day }) => {
  const isDayToday = isToday(day);

  return (
    <div className="flex-1 min-w-36 flex flex-col items-center">
      <span aria-hidden className="text-md text-[#1B1B1B] capitalize">
      {day.toLocaleDateString('sr-Latn', {
                  weekday: 'long'
              })}
      </span>
      <div
        aria-label={day.toDateString()}
        className={cn(
          "w-11 h-11  rounded-full flex items-center justify-center text-2xl font-medium text-gray-400",
          isDayToday && "text-white bg-blue-400"
        )}
      >
        <p className={cn("leading-[44px] text-[#1B1B1B]", isDayToday && "text-white")}>{format(day, "d")}</p>
      </div>
    </div>
  );
};