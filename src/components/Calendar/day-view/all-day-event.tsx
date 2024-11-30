import type { Event } from "../types";
import { cn } from '@/utils';

type AllDayEventProps = {
  event: Event;
};

export const AllDayEvent: React.FC<AllDayEventProps> = ({ event }) => {
  return (
    <div className={cn("w-full py-1 px-2 cursor-pointer bg-blue-400 rounded", Number(event.id)%2 ? 'bg-[#56C4CF]' : 'bg-[#261A54]')}>
      <h1 className="text-xs text-white">{event.title}</h1>
    </div>
  );
};