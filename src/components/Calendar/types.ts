export type Event = {
    id: string;
    title: string;
    start_date: Date;
    end_date: Date;
    variant?: 'regular' | 'startup';
    isPast?: boolean;
  };