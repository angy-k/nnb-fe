"use client";
import React, { useState, useCallback } from "react";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import ArrowLeft from "../../icons/arrow-left.svg";
import ArrowRight from "../../icons/arrow-right.svg";
import Image from 'next/image';
import { eventsMock } from "./event-mocks";
import { Divider } from "@nextui-org/divider";
import { cn } from "../../utils";
import { add, sub, endOfWeek, startOfWeek, format } from "date-fns";

import type { Event } from "./types";

type View = "day" | "week" | "month";

export type CalendarProps = {
  view?: View;
  events?: Event[];
  date: string | number | Date;
};

export const Calendar: React.FC<CalendarProps> = ({
    date = new Date(),
    events = eventsMock,
    view = "month",
}) => {
    const [curView, setCurView] = useState<View>(view);
    const [curDate, setCurDate] = useState<Date>(new Date(date));

    const onPrev = useCallback(() => {
        if (curView === "day") {
            return setCurDate((prev) => sub(prev, { days: 1 }));
        }

        if (curView === "week") {
            return setCurDate((prev) => sub(prev, { weeks: 1 }));
        }

        return setCurDate((prev) => sub(prev, { months: 1 }));
    }, [curView]);

    const onNext = useCallback(() => {
        if (curView === "day") {
            return setCurDate((prev) => add(prev, { days: 1 }));
        }

        if (curView === "week") {
            return setCurDate((prev) => add(prev, { weeks: 1 }));
        }

        return setCurDate((prev) => add(prev, { months: 1 }));
    }, [curView]);

    const formatDateForView = useCallback((date: Date) => {
        if (curView === "day") {
        return format(date, "dd MMMM yyyy");
        }

        if (curView === "week") {
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);

        const startMonth = format(weekStart, "MMM");
        const endMonth = format(weekEnd, "MMM");
        const year = format(weekStart, "yyyy");

        if (startMonth !== endMonth) {
            return `${startMonth} – ${endMonth} ${year}`;
        } else {
            return `${startMonth} ${year}`;
        }
        }

        return format(date, "MMMM yyyy");
    }, [curView]);

return (
    <div key={"calendar-component"} className={"2xl:max-w-screen-2xl w-full h-full flex-1 flex flex-col overflow-hidden"}>
        <section id="calendar-header" className="mb-6 w-full flex justify-between">
            <div className="flex gap-2 items-center w-full justify-center">
                <span className="calendar-title">
                    {formatDateForView(curDate)}
                </span>
                {/* <button aria-label={"set date today"} onClick={() => setCurDate(new Date())} className={"py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300"}>
                    {`Today`}
                </button> */}
                
            </div>
            <div className="flex gap-2 calendar-buttons">
                <button onClick={onPrev} aria-label={`prev ${curView}`} className="w-[42px] aspect-square border-none button-one font-semibold flex justify-center items-center hover:bg-lightBlue hover:opacity-75 transition-colors duration-300">
                    <Image
                        src={ArrowLeft}
                        width={24}
                        height={15}
                        alt={'Calendar arrow left icon.'}
                    />
                </button>
                <Divider orientation="vertical" className="section-divider" />
                <button onClick={onNext} aria-label={`next ${curView}`} className="w-[42px] aspect-square border-none button-two font-semibold flex justify-center items-center hover:bg-lightBlue hover:opacity-75 transition-colors duration-300">
                    <Image
                        src={ArrowRight}
                        width={24}
                        height={15}
                        alt={'Calendar arrow right icon.'}
                    />
                </button>
                {/* <button aria-label="set month view"
                    onClick={() => setCurView("month")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "month" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Month
                </button>
                <button
                    aria-label="set month week"
                    onClick={() => setCurView("week")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "week" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Week
                </button>
                <button
                    aria-label="set month day"
                    onClick={() => setCurView("day")}
                    className={cn(
                        "py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300",
                        curView === "day" && "bg-blue-400 text-white hover:bg-blue-700"
                    )}
                >
                    Day
                </button> */}
            </div>
        </section>
        {curView === "day" && <DayView date={curDate} events={events} />}
        {curView === "week" && <WeekView date={curDate} events={events} />}
        {curView === "month" && <MonthView date={curDate} events={events} />}
    </div>
    );
};
