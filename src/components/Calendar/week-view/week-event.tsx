import { startOfWeek, differenceInMinutes } from "date-fns";
import { cn } from '@/utils'
import { WeekEvent as Event } from "./group-events";
import Image from 'next/image';
// Sove umesto ranijih pilula sa natpisom „nnb"
import OwlNnb from '@/icons/owl-nnb.svg';
import OwlStartup from '@/icons/owl-startup.svg';
import OwlDrugoMesto from '@/icons/owl-drugo-mesto.svg';

const MINUTES_IN_WEEK = 7 * 24 * 60;

type WeekEventProps = {
  date: Date;
  event: Event;
  containerWidth: number;
  onEventClick?: (eventId: string) => void;
};

export const WeekEvent: React.FC<WeekEventProps> = ({
  date,
  event,
  containerWidth,
  onEventClick,
}) => {
  const generateBoxStyle = () => {
    const week = startOfWeek(date, { weekStartsOn: 1 });
    const eventDuration = differenceInMinutes(
      event.display_end_date,
      event.display_start_date
    );
    const minutesPassed = differenceInMinutes(event.display_start_date, week);

    const left = (minutesPassed / MINUTES_IN_WEEK) * containerWidth;
    const width = (eventDuration / MINUTES_IN_WEEK) * containerWidth;

    return { left, width: `calc(${width}px - 1px)` };
  };

  let definedStyle = generateBoxStyle();

  return (
    <div
      style={{ ...definedStyle, ...(event.isPast ? { opacity: 0.35, filter: 'grayscale(0.5) blur(1px)' } : {}) }}
      className={cn("h-full px-2 absolute z-10 rounded cursor-pointer", event.variant === 'startup' ? 'bg-[#56C4CF]' : 'bg-[#261A54]')}
      onClick={() => onEventClick?.(String(event.id))}
    >
      <Image
        src={event.variant === 'startup' ? OwlStartup : event.variant === 'away' ? OwlDrugoMesto : OwlNnb}
        width={73}
        height={53}
        alt='single-event'
      />
      {/* <h1 className="text-white text-sm text-ellipsis overflow-hidden">
        {`${format(event.start_date, "HH:mm")}, ${event.title}`}
      </h1> */}
    </div>
  );
};