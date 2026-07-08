import { startOfDay, differenceInMinutes, format } from "date-fns";
import { cn } from '@/utils'
import { Event } from "../types";
import Image from 'next/image';
import SingleEventLight from '@/icons/event-light.svg';
import SingleEventDark from '@/icons/event-dark.svg';

const MINUTES_IN_DAY = 24 * 60;

type DayEventProps = {
  day: Date;
  event: Event;
  index: number;
  grouplength: number;
  containerHeight: number;
  onEventClick?: (eventId: string) => void;
};

export const DayEvent: React.FC<DayEventProps> = ({
  day,
  event,
  index,
  grouplength,
  containerHeight,
  onEventClick,
}) => {
  const today = startOfDay(day);

  const eventDuration = differenceInMinutes(event.end_date, event.start_date);

  const generateBoxStyle = () => {
    const minutesPassed = differenceInMinutes(event.start_date, today);

    const percentage = minutesPassed / MINUTES_IN_DAY;

    const top = percentage * containerHeight;
    const height = (eventDuration / MINUTES_IN_DAY) * containerHeight;

    const isLast = index === grouplength - 1;
    let widthPercentage = grouplength === 1 ? 1 : (1 / grouplength) * 1.7;

    if (isLast) {
      widthPercentage = 1 / grouplength;
    }

    const styles = {
      top,
      height,
      padding: "2px 8px",
      zIndex: 10 + index,
      width: `calc((100% - 96px) * ${widthPercentage})`,
    };

    if (isLast) {
      return { ...styles, right: 0 };
    }

    return {
      ...styles,
      left: `calc(100px + 100% * ${(1 / grouplength) * index})`,
    };
  };

  let definedStyle = generateBoxStyle();
  const showLargeIcon = definedStyle.height > 55;
  
  return (
    <div
      style={{ ...definedStyle, ...(event.isPast ? { opacity: 0.35, filter: 'grayscale(0.5) blur(1px)' } : {}) }}
      className={cn(
        "border border-white rounded absolute flex gap-2",
        event.isPast ? 'cursor-default' : 'cursor-pointer',
        event.variant === 'startup' ? 'bg-[#56C4CF]' : 'bg-[#261A54]',
        showLargeIcon ? 'flex-col' : 'items-center'
      )}
      onClick={() => { if (!event.isPast) onEventClick?.(event.id) }}
    >
      {showLargeIcon ? (
        <Image
          src={event.variant === 'startup' ? SingleEventLight : SingleEventDark}
          width={126}
          height={52}
          alt='single-event'
        />
      ) : (
        <Image
          src={event.variant === 'startup' ? SingleEventLight : SingleEventDark}
          width={20}
          height={20}
          alt='single-event'
        />
      )}
      <h1 className={cn("text-white text-xs", definedStyle.height > 55 ? 'self-center' : '')}>
        {`${event.title}, 
        ${format(event.start_date, "HH:mm")} - 
        ${format(event.end_date, "HH:mm")}`}
      </h1>
    </div>
  );
};